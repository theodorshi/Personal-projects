namespace PortfolioApi.Models;

// Formen på svaret fra GitHub sitt "git trees"-endepunkt
public record GitTreeResponse(List<GitTreeItem> Tree, bool Truncated);

// Size er filstørrelsen i bytes (finnes bare på filer, ikke mapper)
public record GitTreeItem(string Path, string Type, long? Size);
