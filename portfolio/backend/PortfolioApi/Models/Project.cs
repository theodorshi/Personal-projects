using PortfolioApi.Interfaces;

namespace PortfolioApi.Models;

public class Project : IProject
{
    public string Name { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<string> Languages { get; set; } = new();
    public List<LanguageShare> LanguageShares { get; set; } = new();
    public int FileCount { get; set; }
    public string PreviewFile { get; set; } = string.Empty;
    public string CodePreview { get; set; } = string.Empty;
}
