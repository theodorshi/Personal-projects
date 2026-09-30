namespace PortfolioApi.Models;

// Formen på svaret fra GitHub sitt "git trees"-endepunkt
public record GitTreeResponse(List<GitTreeItem> Tree, bool Truncated);

public record GitTreeItem(string Path, string Type);
