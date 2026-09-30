using PortfolioApi.Models;

namespace PortfolioApi.Interfaces;

public interface IGitHubRepository
{
    Task<List<Project>> GetProjectsAsync();
}
