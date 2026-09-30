using System.ComponentModel.DataAnnotations;
using PortfolioApi.Interfaces;

namespace PortfolioApi.Models;

public class ContactMessage : IContactMessage
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Navn må fylles ut.")]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "E-post må fylles ut.")]
    [EmailAddress(ErrorMessage = "E-postadressen er ikke gyldig.")]
    [MaxLength(200)]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Meldingen kan ikke være tom.")]
    [MaxLength(2000)]
    public string Message { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
