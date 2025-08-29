# CreatorApp Client

> React + TypeScript frontend for the CreatorApp visual site builder

## 🛠 Technology Stack

- **React 18** with TypeScript for type safety
- **Vite** for lightning-fast development and builds
- **Material-UI (MUI)** for professional component library
- **Zustand** for lightweight state management
- **React Router** for client-side routing
- **ESLint + TypeScript** for code quality

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/              # Authentication components
│   ├── features/          # Feature-specific components
│   │   ├── ElementEditor/ # Visual editor components
│   │   ├── TreeView/      # Component tree navigation
│   │   └── CodeEditor/    # JSON/code editor
│   └── layouts/           # Layout components
├── pages/                 # Page components
├── store/                 # Zustand state management
├── hooks/                 # Custom React hooks
├── api/                   # API integration
├── types/                 # TypeScript definitions
├── utils/                 # Utility functions
└── theme/                 # Material-UI theme configuration
```

## 🎨 Key Features

### Visual Editor
- Drag-and-drop interface for building pages
- Real-time preview with responsive design
- Property panels for element customization
- Undo/redo functionality with keyboard shortcuts

### Component System
- Extensible element types (div, text, image, row, etc.)
- Custom styling with desktop/mobile variants
- Interactive elements with event handling
- Grid system for responsive layouts

### State Management
- Zustand for lightweight, TypeScript-friendly state
- Persistent storage in localStorage
- Optimistic updates for better UX

## 🔧 Development

### Code Quality
- ESLint configuration for consistent code style
- TypeScript strict mode for type safety
- Component composition over inheritance
- Custom hooks for reusable logic

### Performance
- Vite's fast HMR for instant feedback
- Code splitting with React.lazy
- Optimized bundle size with tree shaking
- Efficient re-renders with proper memoization

## 🧪 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

## 📝 Configuration

### Environment Variables
Create a `.env.local` file:

```bash
VITE_API_BASE_URL=https://localhost:7158
VITE_STATIC_SITE_BASE_URL=https://localhost:7159
```

### Vite Configuration
The `vite.config.ts` includes:
- React plugin with Fast Refresh
- TypeScript path mapping (`@/` alias)
- HTTPS development server
- Proxy configuration for API calls

## 🎯 Architecture Patterns

### Component Patterns
- **Composition**: Building complex UIs from simple components
- **Render Props**: Sharing logic between components
- **Custom Hooks**: Extracting stateful logic
- **Context**: Managing global state (theme, auth)

### State Management
- **Zustand**: Lightweight alternative to Redux
- **Local State**: useState for component-specific data
- **Server State**: Custom hooks for API data fetching
- **Persistent State**: localStorage integration

## 🚧 Future Enhancements

- [ ] Add component testing with React Testing Library
- [ ] Implement Service Worker for offline functionality
- [ ] Add internationalization (i18n) support
- [ ] Enhance accessibility features
- [ ] Add Storybook for component documentation

---

Part of the [CreatorApp](../README.md) full-stack site builder project.
