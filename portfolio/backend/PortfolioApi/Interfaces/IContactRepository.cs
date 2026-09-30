using PortfolioApi.Models;

namespace PortfolioApi.Interfaces;

public interface IContactRepository
{
    Task<List<ContactMessage>> GetAllAsync();
    Task<ContactMessage?> GetByIdAsync(int id);
    Task<ContactMessage> AddAsync(ContactMessage newMessage);
    Task<bool> DeleteAsync(int id);
}
