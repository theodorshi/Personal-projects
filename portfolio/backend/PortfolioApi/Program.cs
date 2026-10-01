using System.Net.Http.Headers;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using PortfolioApi.Contexts;
using PortfolioApi.Interfaces;
using PortfolioApi.Models;
using PortfolioApi.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(
    options =>
    {
        options.AddPolicy("AllowAnyOrigin",
            policies => policies
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader()
        );
    }
);

builder.Services.AddControllers();
builder.Services.AddMemoryCache();

// Database: lokalt ligger fila i Databases/, på Azure settes stien i Configuration
string connectionString = builder.Configuration.GetConnectionString("Portfolio")
    ?? "Data Source=Databases/Portfolio.db";

// Sørger for at mappa til databasefila finnes
string databaseFile = new SqliteConnectionStringBuilder(connectionString).DataSource;
string? databaseFolder = Path.GetDirectoryName(Path.GetFullPath(databaseFile));
if (!string.IsNullOrEmpty(databaseFolder))
{
    Directory.CreateDirectory(databaseFolder);
}

builder.Services.AddDbContext<PortfolioContext>(
    options => options.UseSqlite(connectionString)
);
builder.Services.AddScoped<IContactRepository, ContactRepository>();

// Maks 10 meldinger per 10. minutt til sammen, så ingen kan fylle opp databasen
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddFixedWindowLimiter("contact", limiter =>
    {
        limiter.PermitLimit = 10;
        limiter.Window = TimeSpan.FromMinutes(10);
    });
});

// GitHub
builder.Services.Configure<GitHubOptions>(builder.Configuration.GetSection("GitHub"));
builder.Services.AddHttpClient<IGitHubRepository, GitHubRepository>((serviceProvider, client) =>
{
    var options = serviceProvider.GetRequiredService<IOptions<GitHubOptions>>().Value;
    client.BaseAddress = new Uri("https://api.github.com/");
    client.DefaultRequestHeaders.UserAgent.ParseAdd("portfolio-api");
    client.DefaultRequestHeaders.Accept.ParseAdd("application/vnd.github+json");

    // Token er valgfritt, men gir 5000 kall i timen i stedet for 60
    if (!string.IsNullOrWhiteSpace(options.Token))
    {
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", options.Token);
    }
});

var app = builder.Build();

// Oppretter/oppdaterer databasen automatisk ved oppstart (også på Azure)
using (var scope = app.Services.CreateScope())
{
    PortfolioContext context = scope.ServiceProvider.GetRequiredService<PortfolioContext>();
    context.Database.Migrate();
}

app.UseCors("AllowAnyOrigin");
app.UseRateLimiter();
app.MapControllers();

app.Run();
