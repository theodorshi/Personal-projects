namespace PortfolioApi.Models;

public class GitHubOptions
{
    public string Owner { get; set; } = string.Empty;
    public string Repo { get; set; } = string.Empty;
    public string Branch { get; set; } = "main";
    public string? Token { get; set; }
    public int CacheMinutes { get; set; } = 60;

    // Egne beskrivelser per mappe. Brukes før README.
    public Dictionary<string, string> Descriptions { get; set; } = new();
}
