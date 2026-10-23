using PortfolioApi.Models;

namespace PortfolioApi.Interfaces;

public interface IEmailService
{
    Task SendContactNotificationAsync(ContactMessage contactMessage);
}
