using Microsoft.AspNetCore.Mvc;
using PortfolioApi.Interfaces;
using PortfolioApi.Models;

namespace PortfolioApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController(IGitHubRepository _gitHubRepository) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<Project>>> Get()
    {
        try
        {
            List<Project> projects = await _gitHubRepository.GetProjectsAsync();
            return Ok(projects);
        }
        catch (HttpRequestException)
        {
            return StatusCode(StatusCodes.Status502BadGateway, "Kunne ikke hente prosjekter fra GitHub.");
        }
    }
}
