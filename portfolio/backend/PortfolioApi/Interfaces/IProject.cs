namespace PortfolioApi.Interfaces;

public interface IProject
{
    string Name { get; set; }
    string Url { get; set; }
    string Description { get; set; }
    List<string> Languages { get; set; }
    int FileCount { get; set; }
}
