using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using PortfolioApi.Interfaces;
using PortfolioApi.Models;

namespace PortfolioApi.Services;

public class EmailService(IOptions<EmailOptions> options, ILogger<EmailService> _logger) : IEmailService
{
    private readonly EmailOptions _options = options.Value;

    public async Task SendContactNotificationAsync(ContactMessage contactMessage)
    {
        // Uten passord (for eksempel lokalt) hopper vi over e-posten i stedet for å krasje
        if (string.IsNullOrWhiteSpace(_options.Username) || string.IsNullOrWhiteSpace(_options.Password))
        {
            _logger.LogWarning("E-post er ikke satt opp. Meldingen ble lagret, men ikke sendt på e-post.");
            return;
        }

        // Fjerner linjeskift fra navnet, så det ikke kan ødelegge emnefeltet
        string safeName = contactMessage.Name.Replace("\r", " ").Replace("\n", " ").Trim();
        string recipient = string.IsNullOrWhiteSpace(_options.To) ? _options.Username : _options.To;

        var email = new MimeMessage();
        email.From.Add(new MailboxAddress("Portfolio – kontaktskjema", _options.Username));
        email.To.Add(MailboxAddress.Parse(recipient));
        // "Svar" i e-postprogrammet går rett til den som skrev meldingen
        email.ReplyTo.Add(new MailboxAddress(safeName, contactMessage.Email));
        email.Subject = $"Ny melding fra {safeName} via portfolioen";
        email.Body = new TextPart("plain")
        {
            Text =
                $"Navn: {safeName}\n" +
                $"E-post: {contactMessage.Email}\n" +
                $"Sendt: {ToOsloTime(contactMessage.CreatedAt):dd.MM.yyyy HH:mm}\n\n" +
                $"{contactMessage.Message}\n\n" +
                "—\nSvar på denne e-posten for å svare avsenderen direkte.",
        };

        using var client = new SmtpClient();
        await client.ConnectAsync(_options.SmtpHost, _options.Port, SecureSocketOptions.StartTls);
        await client.AuthenticateAsync(_options.Username, _options.Password);
        await client.SendAsync(email);
        await client.DisconnectAsync(true);
    }

    private static DateTime ToOsloTime(DateTime utcTime)
    {
        try
        {
            TimeZoneInfo oslo = TimeZoneInfo.FindSystemTimeZoneById("Europe/Oslo");
            return TimeZoneInfo.ConvertTimeFromUtc(DateTime.SpecifyKind(utcTime, DateTimeKind.Utc), oslo);
        }
        catch (TimeZoneNotFoundException)
        {
            return utcTime;
        }
    }
}
