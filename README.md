# CreatorApp

> 🚧 **Portfolio Project - Work in Progress** 🚧  
> A full-stack visual site builder demonstrating modern .NET and React development practices.

CreatorApp is a visual website builder that allows users to create responsive web pages through a drag-and-drop interface. It generates clean, static HTML/CSS from a component tree, supporting both desktop and mobile layouts.

## 🎯 Key Features

- **Visual Page Builder**: Drag-and-drop interface with real-time preview
- **Responsive Design**: Separate desktop/mobile styling with configurable breakpoints
- **Component System**: Extensible element types with customizable properties
- **Static Site Generation**: Produces clean HTML/CSS files ready for hosting
- **Multi-Backend Support**: Pluggable architecture supporting .NET services or Azure Functions
- **Authentication & Authorization**: JWT-based auth with user isolation
- **Image Management**: Upload and manage images with automatic path handling

## 🎥 Demo

https://github.com/user-attachments/assets/2f3e0f20-4e1d-46f5-a668-d3d6cc157667

### Screenshots

<img width="1917" height="937" alt="Editor Interface" src="https://github.com/user-attachments/assets/07f88d94-b820-4551-a264-be8be91982e7" />

<img width="1916" height="958" alt="Component Properties" src="https://github.com/user-attachments/assets/230f721a-cdfe-4807-bdb4-17dbdfce9891" />

<img width="1911" height="971" alt="Generated Output" src="https://github.com/user-attachments/assets/22920da7-c417-44db-a167-efa7f696d5e2" />

## 🛠️ Technology Stack

### Backend
- **ASP.NET Core 8**: Web API with minimal APIs
- **Entity Framework Core**: Code-first with SQLite (easily swappable)
- **Authentication**: JWT Bearer tokens with BCrypt password hashing
- **Testing**: xUnit, Moq, FluentAssertions

### Frontend
- **React 18**: With TypeScript for type safety
- **Vite**: Lightning-fast dev server and build tool
- **Material-UI**: Professional component library
- **State Management**: Zustand with React hooks
- **Editor**: Custom drag-and-drop with property panels

### Infrastructure
- **Docker Ready**: Multi-stage builds for production
- **Azure Functions**: Optional serverless backend
- **Static Hosting**: Generated sites work on any static host

## 🏗️ Architecture

```
CreatorApp/
├── CreatorApp.Server/          # ASP.NET Core Web API
│   ├── Controllers/            # RESTful endpoints
│   ├── Services/               # Business logic (SOLID principles)
│   ├── Repositories/           # Data access layer
│   └── Data/                   # EF Core context & migrations
├── CreatorApp.Generator/       # HTML/CSS generation engine
│   ├── GenerateHtmlVisitor.cs  # Visitor pattern implementation
│   └── Templates/              # HTML templates
├── CreatorApp.StaticSiteService/ # Static file hosting service
│   └── Services/               # Extracted file/image services
├── CreatorApp.Domain/          # Shared models and interfaces
├── CreatorApp.Generator.Tests/ # Unit tests with comprehensive coverage
├── CreatorAppFunctions/        # Optional Azure Functions
└── creatorapp.client/          # React TypeScript frontend
```

## 🚀 Getting Started

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/)
- [Visual Studio 2022](https://visualstudio.microsoft.com/) or [VS Code](https://code.visualstudio.com/)
- Azure Functions Core Tools (optional)

### Quick Start (Visual Studio)

1. **Clone and build**
```bash
git clone https://github.com/yourusername/CreatorApp.git
cd CreatorApp
```

2. **Configure startup projects**
   - Solution Properties → Startup Project → Multiple startup projects
   - Set both `CreatorApp.Server` and `CreatorApp.StaticSiteService` to "Start"

3. **Run the backend**
   - Press F5 or click Start Debugging

4. **Run the frontend**
```bash
cd creatorapp.client
npm install
npm run dev
```

5. **Open browser**
   - Navigate to https://localhost:5173

### Quick Start (CLI)

```bash
# Backend
dotnet restore
dotnet build
dotnet ef database update --project CreatorApp.Server
dotnet run --project CreatorApp.Server &
dotnet run --project CreatorApp.StaticSiteService &

# Frontend
cd creatorapp.client
npm install
npm run dev
```

## ⚙️ Configuration

Update `CreatorApp.Server/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=AppData/creatorapp.db"
  },
  "Authentication": {
    "Jwt": {
      "SigningKey": "YOUR-256-BIT-SECRET-HERE",
      "Issuer": "CreatorApp",
      "Audience": "CreatorAppUsers"
    }
  },
  "Backends": {
    "Mode": "NetApp"  // or "Functions"
  }
}
```

## 🧪 Testing

```bash
# Run all tests
dotnet test

# With coverage
dotnet test /p:CollectCoverage=true /p:CoverletOutputFormat=opencover
```

## 📦 Building for Production

```bash
# Backend
dotnet publish -c Release -o ./publish

# Frontend
cd creatorapp.client
npm run build
```



## 🎨 How HTML Generation Works

The application uses a sophisticated Visitor pattern for HTML generation:

1. **Element Tree**: The editor produces a tree of `Element` objects from the domain model
2. **Visitor Processing**: `GenerateHtmlVisitor` traverses the tree to:
   - Map element types and merge attributes/classes
   - Extract desktop/mobile styles into responsive CSS
   - Handle special cases like grid rows with column spans
   - Render inner text with HTML passthrough support
3. **Template Merging**: Generated content combines with HTML templates
4. **Static Output**: Clean, optimized HTML/CSS ready for hosting


## 📡 Key Endpoints

### CreatorApp.Server
- `/api/pages` - Page CRUD operations
- `/api/generator` - Site publishing
- `/api/images` - Image upload/management
- `/api/auth` - Authentication

### CreatorApp.StaticSiteService
- `/api/site/generate-full-site` - Static site generation
- `/api/images/upload` - Image storage
- `/api/images/list` - Image listing

## 🗄️ Database & Migrations

- **Default**: SQLite for easy development
- **Production**: Easily switch to SQL Server or PostgreSQL
- **Migrations**: Entity Framework Core with code-first approach

```bash
# Create migration
dotnet ef migrations add MigrationName --project CreatorApp.Server

# Update database
dotnet ef database update --project CreatorApp.Server
```

## ☁️ Azure Functions (Optional)

Alternative serverless backend implementation:

- Set `Backends.Mode` to "Functions" in appsettings.json
- Deploy to Azure Functions for scalable hosting
- Supports same API surface as the main .NET service


## 🚧 Roadmap

- [ ] Add more component types (forms, charts, carousels)
- [ ] Implement version history and rollback
- [ ] Add collaborative editing capabilities
- [ ] Enhanced mobile editor experience
- [ ] Custom domain integration
- [ ] A/B testing framework
- [ ] Performance analytics dashboard

## 🤝 Contributing

This is a portfolio project showcasing modern development practices. Feel free to:
- Report bugs or suggest improvements
- Fork and experiment with new features
- Use as a reference for similar projects


## 👤 Author

**[Liam Coffey]**
- GitHub: [@LiamCoffey1](https://github.com/LiamCoffey1)

---
