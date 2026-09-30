namespace PortfolioApi.Interfaces;

public interface IContactMessage
{
    int Id { get; set; }
    string Name { get; set; }
    string Email { get; set; }
    string Message { get; set; }
    DateTime CreatedAt { get; set; }
}
