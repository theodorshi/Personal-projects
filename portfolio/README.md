# Portfolio – React + TypeScript + C# .NET

## Mappestruktur
- backend/PortfolioApi – .NET Web API: prosjekter fra GitHub + kontaktskjema med SQLite
- frontend – React + TypeScript + Tailwind (Vite)

## Kom i gang

### 1. Backend
    cd backend/PortfolioApi
    dotnet tool install -g dotnet-ef --version 9.0.10   (bare første gang på maskinen)
    dotnet restore
    dotnet ef migrations add InitialCreate               (bare første gang)
    dotnet ef database update                            (bare første gang)
    dotnet watch run

Test: http://localhost:5000/api/projects og http://localhost:5000/api/contact

Valgfritt – GitHub-token (5000 kall/time i stedet for 60):
    dotnet user-secrets init
    dotnet user-secrets set "GitHub:Token" "ghp_dittToken"

### 2. Frontend
    cd frontend
    npm install
    npm run dev

Åpne http://localhost:5173

## Tilpass
- Navn, tekst og lenker: frontend/src/data/profile.ts
- Tidslinje: frontend/src/data/timeline.ts
- Bilder: frontend/public/images/meg.jpg (portrett) og bakgrunn.jpg (liggende)
- CV: frontend/public/cv/Theodor-Raaberg-CV.pdf
- Prosjektbeskrivelser: "Descriptions" i backend/PortfolioApi/appsettings.json
