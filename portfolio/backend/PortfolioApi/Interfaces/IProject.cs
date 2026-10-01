using PortfolioApi.Models;

namespace PortfolioApi.Interfaces;

public interface IProject
{
    string Name { get; set; }
    string Url { get; set; }
    string Description { get; set; }
    List<string> Languages { get; set; }
    List<LanguageShare> LanguageShares { get; set; }
    int FileCount { get; set; }
    string PreviewFile { get; set; }
    string CodePreview { get; set; }
}
