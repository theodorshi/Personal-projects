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
    };

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

        var files = tree.Tree
            .Where(item => item.Type == "blob")
            .Select(item => item.Path)
            .ToList();

        var projects = new List<Project>();

        foreach (var folder in folders)
        {
            var folderFiles = files.Where(path => path.StartsWith(folder + "/")).ToList();

            var languages = folderFiles
                .Select(path => LanguageByExtension.GetValueOrDefault(Path.GetExtension(path)))
                .Where(language => language is not null)
                .GroupBy(language => language!)
                .OrderByDescending(group => group.Count())
                .Take(3)
                .Select(group => group.Key)
                .ToList();

            projects.Add(new Project
            {
                Name = folder,
                Url = $"https://github.com/{_options.Owner}/{_options.Repo}/tree/{_options.Branch}/{Uri.EscapeDataString(folder)}",
                Languages = languages,
                FileCount = folderFiles.Count,
                Description = await GetDescriptionAsync(folder, folderFiles),
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
