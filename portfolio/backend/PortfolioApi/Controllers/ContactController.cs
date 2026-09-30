using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using PortfolioApi.Interfaces;
using PortfolioApi.Models;

namespace PortfolioApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController(IContactRepository _contactRepository, IWebHostEnvironment _environment) : ControllerBase
{
    // Alle kan sende en melding (med en grense mot spam)
    [HttpPost]
    [EnableRateLimiting("contact")]
    public async Task<ActionResult<ContactMessage>> Post(ContactMessage newMessage)
    {
        try
        {
            // Id og tidspunkt settes av backend, ikke av den som sender
            newMessage.Id = 0;
            newMessage.CreatedAt = DateTime.UtcNow;

            ContactMessage savedMessage = await _contactRepository.AddAsync(newMessage);
            return CreatedAtAction(nameof(GetById), new { id = savedMessage.Id }, savedMessage);
        }
        catch (Exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, "Meldingen kunne ikke lagres.");
        }
    }

    // Lesing og sletting er bare åpent når du kjører lokalt (Development).
    // Ellers kunne hvem som helst lest meldingene du får.
    [HttpGet]
    public async Task<ActionResult<List<ContactMessage>>> Get()
    {
        if (!_environment.IsDevelopment())
        {
            return NotFound();
        }

        try
        {
            List<ContactMessage> messages = await _contactRepository.GetAllAsync();
            return Ok(messages);
        }
        catch (Exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ContactMessage>> GetById(int id)
    {
        if (!_environment.IsDevelopment())
        {
            return NotFound();
        }

        try
        {
            ContactMessage? message = await _contactRepository.GetByIdAsync(id);

            if (message != null)
            {
                return Ok(message);
            }
            else
            {
                return NotFound();
            }
        }
        catch (Exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (!_environment.IsDevelopment())
        {
            return NotFound();
        }

        try
        {
            bool deleted = await _contactRepository.DeleteAsync(id);

            if (deleted)
            {
                return NoContent();
            }
            else
            {
                return NotFound();
            }
        }
        catch (Exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}
