# Busify Next - Bus Management System

A modern web application for bus management built with Next.js 15, React 19, and TypeScript. This project is part of the Busify ecosystem that provides comprehensive bus transportation management solutions.

## 🚌 About

Busify Next is the main web interface for the bus management system, providing an intuitive and responsive user experience for managing bus operations, routes, schedules, and passenger services.

## ✨ Features

- **Modern Stack**: Built with Next.js 15, React 19, and TypeScript
- **Authentication**: Secure user authentication with NextAuth.js
- **UI Components**: Beautiful UI components with Radix UI and Tailwind CSS
- **Dark/Light Mode**: Theme switching with next-themes
- **Responsive Design**: Mobile-first responsive design
- **Type Safety**: Full TypeScript support for better development experience

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Lucide React Icons
- **Authentication**: NextAuth.js
- **Theme**: next-themes for dark/light mode
- **Notifications**: Sonner for toast notifications

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 18 or higher)
- npm, yarn, pnpm, or bun package manager
- Git

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd bus-manage-system/busify-next
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory and add your environment variables:

```bash
# Example environment variables
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
# Add other required environment variables
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
busify-next/
├── src/
│   ├── app/           # Next.js app directory (routing)
│   ├── components/    # Reusable UI components
│   └── lib/          # Utility functions and configurations
├── public/           # Static assets
├── components.json   # Shadcn/ui components configuration
└── package.json      # Project dependencies and scripts
```

## 🎨 Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code linting

### Code Style

This project uses:
- ESLint for code linting
- TypeScript for type checking
- Tailwind CSS for styling

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📖 Related Projects

This project is part of the Busify ecosystem:
- **busify-admin**: Admin dashboard for system management
- **busify-provider**: Backend API and services
- **busify-next**: Main web application (this repository)

## 📚 Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [React Documentation](https://react.dev) - Learn about React
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - Learn about TypeScript
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Learn about Tailwind CSS
- [Radix UI Documentation](https://www.radix-ui.com/docs) - Learn about Radix UI components

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub or contact the development team.

---

Built with ❤️ by the Busify team

