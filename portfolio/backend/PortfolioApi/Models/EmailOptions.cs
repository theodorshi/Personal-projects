namespace PortfolioApi.Models;

// Hentes fra "Email"-delen i appsettings.json og fra Azure-innstillingene
public class EmailOptions
{
    public string SmtpHost { get; set; } = "smtp.gmail.com";
    public int Port { get; set; } = 587;
    public string Username { get; set; } = string.Empty; // Gmail-adressen som sender
    public string Password { get; set; } = string.Empty; // App-passord fra Google, aldri det vanlige passordet
    public string To { get; set; } = string.Empty;       // Hvor meldingene skal sendes
}
