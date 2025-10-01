# Busify Next - AI Coding Agent Instructions

## Architecture Overview

**Busify Next** is a Next.js 15 bus management system with a microservices backend architecture:

- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS + Radix UI
- **Backend**: Spring Boot API at `http://localhost:8080/` (configured via `NEXT_PUBLIC_API_URL`)
- **Real-time**: WebSocket/STOMP for chat features
- **Auth**: NextAuth.js with JWT tokens managed via `TokenManager`
- **i18n**: next-intl with cookie-based locale switching (en/vi/ko/jp)

## Key Patterns & Conventions

### API Communication
- **Location**: `src/lib/data/*.ts` - Server-side API functions
- **Client**: `src/app/api/*` - Next.js API routes for client-side calls
- **Instance**: Use `api` from `axios-instance.ts` for authenticated requests
- **Token Management**: Automatic JWT refresh via interceptors in `axios-instance.ts`
- **Error Handling**: Check `response_error.ts` for standardized error responses

### Component Structure
```
src/components/
├── ui/           # Shadcn/ui base components (don't modify)
├── custom/       # Project-specific components
│   ├── navigation/    # Header, nav components
│   ├── booking/       # Booking-related components
│   └── [feature]/     # Feature-specific folders
```

### Styling & Theming
- **CSS Variables**: Use theme colors from `globals.css` (`--primary`, `--accent`, `--muted`, etc.)
- **Tailwind Classes**: `bg-primary`, `text-accent-foreground`, `hover:bg-muted`
- **Dark Mode**: Automatic via `next-themes` with `class` attribute
- **Avoid**: Hardcoded colors like `bg-green-100` - use theme variables

### Internationalization
- **Hook**: `const t = useTranslations('Namespace')`
- **Files**: `messages/{locale}.json`
- **Locale Detection**: Cookie-based (`locale` cookie)
- **Supported**: en, vi, ko, jp

### State Management
- **Providers**: Nested in `layout.tsx` (Session → WebSocket → TripFilter → Preferences)
- **WebSocket**: STOMP client for real-time chat/notifications
- **Session**: NextAuth.js session context

### Forms & Validation
- **Library**: React Hook Form + Zod schemas
- **Location**: `src/lib/schemas/` for validation schemas
- **Pattern**: `useForm` with `zodResolver(schema)`

### File Organization
- **Pages**: `src/app/` (App Router structure)
- **Utils**: `src/lib/utils/` and `src/lib/constants/`
- **Hooks**: `src/hooks/` for custom React hooks
- **Contexts**: `src/lib/contexts/` for React contexts

## Development Workflow

### Environment Setup
```bash
# Install dependencies
pnpm install

# Start dev server (Turbopack enabled)
pnpm dev

# Backend API (separate service)
# Must be running on localhost:8080
```

### Common Tasks
- **Add new API endpoint**: Create function in `src/lib/data/` using the `api` instance
- **Add new page**: Create folder in `src/app/` with `page.tsx`
- **Add translation**: Update all `messages/*.json` files
- **Add component**: Use `src/components/custom/` for feature components
- **WebSocket subscription**: Use `WebSocketContext` for real-time features

### Build & Deploy
```bash
# Production build
pnpm build

# Start production server
pnpm start

# Docker deployment available (check Dockerfile)
```

## Code Examples

### API Call Pattern
```typescript
// src/lib/data/trips.ts
import api from './axios-instance'

export const getTrips = async (params: TripParams) => {
  const response = await api.get('/trips', { params })
  return response.data
}
```

### Component with i18n
```tsx
// src/components/custom/MyComponent.tsx
import { useTranslations } from 'next-intl'

export default function MyComponent() {
  const t = useTranslations('MyComponent')
  
  return <h1>{t('title')}</h1>
}
```

### Themed Component
```tsx
// Use theme variables, not hardcoded colors
<button className="bg-primary hover:bg-primary/90 text-primary-foreground">
  {t('button')}
</button>
```

### Form with Validation
```tsx
// src/lib/schemas/login.ts
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

// Component
const form = useForm({
  resolver: zodResolver(loginSchema),
  // ...
})
```

## Important Notes

- **Backend Dependency**: Always ensure Spring Boot backend is running for API calls
- **WebSocket**: Required for chat features - check `WebSocketContext` for connection management
- **Environment Variables**: Configure `NEXT_PUBLIC_API_URL` for backend URL
- **Theme Consistency**: Use CSS custom properties from `globals.css` for all colors
- **Type Safety**: Leverage TypeScript interfaces from API responses
- **i18n Coverage**: Add translations to all locale files when adding new text</content>
<parameter name="filePath">d:\Documents\Github\bus-manage-system\busify-next\.github\copilot-instructions.md