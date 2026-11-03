# FilmLog – Full-Stack Movie Tracking App

FilmLog is a full-stack movie tracking application built with **Ionic/Angular** on the frontend and **ASP.NET Core (.NET 8)** on the backend.

## Features
- User registration and login
- JWT-based authentication
- Movie search and movie details via OMDb
- Personal watchlist
- Watched-movie tracking
- Viewing statistics

## Project structure

```text
FilmLog-Full-Stack-Movie-Tracking-App/
├── frontend/   # Ionic + Angular application
├── backend/    # ASP.NET Core Web API + tests
├── .gitignore
└── README.md
```

## Local configuration
The public portfolio version does not include private API keys or signing secrets.
Before running the backend, configure:
- `Jwt:Key`
- `OMDb:ApiKey`

The LocalDB connection string remains configured for local development.

## Run the frontend
```bash
cd frontend
npm install
ionic serve
```

## Run the backend
```bash
cd backend/u23641178_HW03_BackEnd
dotnet restore
dotnet run
```

## Technology stack
- Ionic
- Angular
- TypeScript
- C#
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server LocalDB
- JWT authentication
- OMDb API
