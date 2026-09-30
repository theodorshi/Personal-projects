using Microsoft.EntityFrameworkCore;
using PortfolioApi.Contexts;
using PortfolioApi.Interfaces;
using PortfolioApi.Models;

namespace PortfolioApi.Repositories;

public class ContactRepository(PortfolioContext _context) : IContactRepository
{
    public async Task<List<ContactMessage>> GetAllAsync()
    {
        return await _context.ContactMessages
            .OrderByDescending(message => message.CreatedAt)
            .ToListAsync();
    }

    public async Task<ContactMessage?> GetByIdAsync(int id)
    {
        return await _context.ContactMessages.FindAsync(id);
    }

    public async Task<ContactMessage> AddAsync(ContactMessage newMessage)
    {
        _context.ContactMessages.Add(newMessage);
        await _context.SaveChangesAsync();
        return newMessage;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        ContactMessage? message = await _context.ContactMessages.FindAsync(id);

        if (message == null)
        {
            return false;
        }

        _context.ContactMessages.Remove(message);
        await _context.SaveChangesAsync();
        return true;
    }
}
