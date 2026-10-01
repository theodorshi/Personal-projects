using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using PortfolioApi.Interfaces;
using PortfolioApi.Models;

namespace PortfolioApi.Repositories;

public class GitHubRepository : IGitHubRepository
{
    private const string CacheKey = "github-projects";

    private static readonly Dictionary<string, string> LanguageByExtension = new(StringComparer.OrdinalIgnoreCase)
    {
        [".java"] = "Java",
        [".kt"] = "Kotlin",
        [".c"] = "C",
        [".h"] = "C",
        [".cpp"] = "C++",
        [".cs"] = "C#",
        [".py"] = "Python",
        [".html"] = "HTML",
        [".css"] = "CSS",
        [".js"] = "JavaScript",
        [".jsx"] = "JavaScript",
        [".ts"] = "TypeScript",
        [".tsx"] = "TypeScript",
        [".sql"] = "SQL",
        [".swift"] = "Swift",
    };

    // Filnavn som ofte er "hovedfila" i et prosjekt, og derfor fine å vise
    private static readonly string[] PreferredFileNames = { "main", "program", "app", "index" };

    // Linjer i starten av en fil som ikke er interessante å vise
    private static readonly string[] BoringLinePrefixes = { "import ", "package ", "using ", "#include", "from ", "@file" };

    private readonly HttpClient _http;
    private readonly IMemoryCache _cache;
    private readonly GitHubOptions _options;
    private readonly ILogger<GitHubRepository> _logger;

    public GitHubRepository(HttpClient http, IMemoryCache cache, IOptions<GitHubOptions> options, ILogger<GitHubRepository> logger)
    {
        _http = http;
        _cache = cache;
        _options = options.Value;
        _logger = logger;
    }

    public async Task<List<Project>> GetProjectsAsync()
    {
        if (_cache.TryGetValue(CacheKey, out List<Project>? cached) && cached is not null)
        {
            return cached;
        }

        // Ett kall henter hele filtreet i repoet
        var treeUrl = $"repos/{_options.Owner}/{_options.Repo}/git/trees/{_options.Branch}?recursive=1";
        var tree = await _http.GetFromJsonAsync<GitTreeResponse>(treeUrl)
                   ?? throw new HttpRequestException("Tomt svar fra GitHub.");

        var folders = tree.Tree
            .Where(item => item.Type == "tree" && !item.Path.Contains('/'))
            .Select(item => item.Path)
            .ToList();

        var allFiles = tree.Tree
            .Where(item => item.Type == "blob")
            .ToList();

        var projects = new List<Project>();

        foreach (var folder in folders)
        {
            var folderItems = allFiles.Where(item => item.Path.StartsWith(folder + "/")).ToList();
            var folderFiles = folderItems.Select(item => item.Path).ToList();

            // Teller filer per språk og regner om til prosent
            var languageCounts = folderFiles
                .Select(path => LanguageByExtension.GetValueOrDefault(Path.GetExtension(path)))
                .Where(language => language is not null)
                .GroupBy(language => language!)
                .OrderByDescending(group => group.Count())
                .Select(group => new { Name = group.Key, Count = group.Count() })
                .ToList();

            int totalCodeFiles = languageCounts.Sum(language => language.Count);

            var languageShares = languageCounts
                .Take(4)
                .Select(language => new LanguageShare
                {
                    Name = language.Name,
                    Percent = (int)Math.Round(100.0 * language.Count / totalCodeFiles),
                })
                .ToList();

            var (previewFile, codePreview) = await GetCodePreviewAsync(folderItems, languageCounts.FirstOrDefault()?.Name);

            projects.Add(new Project
            {
                Name = folder,
                Url = $"https://github.com/{_options.Owner}/{_options.Repo}/tree/{_options.Branch}/{Uri.EscapeDataString(folder)}",
                Languages = languageShares.Take(3).Select(language => language.Name).ToList(),
                LanguageShares = languageShares,
                FileCount = folderFiles.Count,
                Description = await GetDescriptionAsync(folder, folderFiles),
                PreviewFile = previewFile,
                CodePreview = codePreview,
            });
        }

        _cache.Set(CacheKey, projects, TimeSpan.FromMinutes(_options.CacheMinutes));
        return projects;
    }

    private async Task<string> GetDescriptionAsync(string folder, List<string> folderFiles)
    {
        if (_options.Descriptions.TryGetValue(folder, out var custom))
        {
            return custom;
        }

        var readmePath = folderFiles.FirstOrDefault(path =>
            path.Equals($"{folder}/README.md", StringComparison.OrdinalIgnoreCase));

        if (readmePath is not null)
        {
            try
            {
                var encodedPath = string.Join("/", readmePath.Split('/').Select(Uri.EscapeDataString));
                var rawUrl = $"https://raw.githubusercontent.com/{_options.Owner}/{_options.Repo}/{_options.Branch}/{encodedPath}";
                var markdown = await _http.GetStringAsync(rawUrl);
                var paragraph = FirstParagraph(markdown);
                if (!string.IsNullOrWhiteSpace(paragraph))
                {
                    return paragraph;
                }
            }
            catch (HttpRequestException ex)
            {
                _logger.LogWarning(ex, "Fant ikke README for {Folder}", folder);
            }
        }

        return $"Skoleprosjekter i {folder}.";
    }

    // Velger én kodefil i hovedspråket og henter de første interessante linjene
    private async Task<(string PreviewFile, string CodePreview)> GetCodePreviewAsync(List<GitTreeItem> folderItems, string? mainLanguage)
    {
        if (mainLanguage is null)
        {
            return (string.Empty, string.Empty);
        }

        GitTreeItem? chosen = folderItems
            .Where(item => LanguageByExtension.GetValueOrDefault(Path.GetExtension(item.Path)) == mainLanguage)
            .Where(item => item.Size is > 300 and < 40000)
            .OrderByDescending(item => PreferredFileNames.Contains(Path.GetFileNameWithoutExtension(item.Path).ToLowerInvariant()))
            .ThenBy(item => Math.Abs((item.Size ?? 0) - 3000))
            .FirstOrDefault();

        if (chosen is null)
        {
            return (string.Empty, string.Empty);
        }

        try
        {
            var encodedPath = string.Join("/", chosen.Path.Split('/').Select(Uri.EscapeDataString));
            var rawUrl = $"https://raw.githubusercontent.com/{_options.Owner}/{_options.Repo}/{_options.Branch}/{encodedPath}";
            var code = await _http.GetStringAsync(rawUrl);
            return (Path.GetFileName(chosen.Path), ExtractSnippet(code));
        }
        catch (HttpRequestException ex)
        {
            _logger.LogWarning(ex, "Fant ikke kodefil {File}", chosen.Path);
            return (string.Empty, string.Empty);
        }
    }

    // Hopper over imports og kommentarer i toppen, og tar med de neste linjene
    private static string ExtractSnippet(string code, int maxLines = 16)
    {
        var lines = code.Replace("\r", "").Replace("\t", "    ").Split('\n');
        var result = new List<string>();
        var inBlockComment = false;
        var started = false;

        foreach (var line in lines)
        {
            var trimmed = line.Trim();

            if (!started)
            {
                if (inBlockComment)
                {
                    if (trimmed.Contains("*/"))
                    {
                        inBlockComment = false;
                    }
                    continue;
                }

                if (trimmed.StartsWith("/*"))
                {
                    inBlockComment = !trimmed.Contains("*/");
                    continue;
                }

                if (trimmed.Length == 0 || BoringLinePrefixes.Any(prefix => trimmed.StartsWith(prefix)))
                {
                    continue;
                }

                started = true;
            }

            result.Add(line.Length > 72 ? line[..71] + "…" : line);

            if (result.Count >= maxLines)
            {
                break;
            }
        }

        return string.Join("\n", result).TrimEnd();
    }

    // Plukker ut første vanlige tekstavsnitt fra en README (hopper over overskrifter, bilder og kode)
    private static string FirstParagraph(string markdown)
    {
        var lines = new List<string>();
        var inCodeBlock = false;

        foreach (var rawLine in markdown.Split('\n'))
        {
            var line = rawLine.Trim();
            if (line.StartsWith("```"))
            {
                inCodeBlock = !inCodeBlock;
                continue;
            }

            if (inCodeBlock)
            {
                continue;
            }

            if (line.Length == 0 || line.StartsWith('#') || line.StartsWith("![") || line.StartsWith('<'))
            {
                if (lines.Count > 0)
                {
                    break;
                }
                continue;
            }

            lines.Add(line.Replace("**", "").Replace("`", ""));
        }

        var text = string.Join(" ", lines);
        return text.Length > 220 ? text[..217].TrimEnd() + "…" : text;
    }
}
