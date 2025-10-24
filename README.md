# 🎰 Mozzart Sports Matches Application

A real-time sports matches application built with Next.js, featuring live updates, visual highlighting, filtering, search, and a casino-themed UI.

## 🚀 Installation Instructions

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd mozzart
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Step 3: Environment Setup

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_API_URL=http://172.235.235.11
```

### Step 4: Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### Step 5: Open the Application

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏃‍♂️ Running Instructions

1. **Start the Application**: Run `npm run dev` in the terminal
2. **Login**: Enter your email address in the login form
3. **View Matches**: Browse live sports matches with real-time updates
4. **Filter & Search**: Use the filter panel to find specific matches
5. **Favorites**: Click the heart icon to mark matches as favorites
6. **Real-time Updates**: Watch for new matches (green highlight) and removed matches (red highlight)

## 📚 Lista korišćenih biblioteka i zašto ste ih odabrali

### Core Framework

- **Next.js 16.0.0** - Modern React framework with App Router, Server Components, and excellent performance
- **React 19.2.0** - Latest React with improved concurrent features and better performance
- **TypeScript 5.9.3** - Type safety and better developer experience

### Styling & UI

- **Tailwind CSS 4.1.16** - Utility-first CSS framework for rapid UI development
- **Lucide React 0.547.0** - Beautiful, customizable SVG icons
- **Framer Motion 12.23.24** - Advanced animations and scroll progress indicators

### Data & API

- **Axios 1.12.2** - HTTP client for API requests with timeout and error handling
- **Socket.io Client 4.8.1** - Real-time WebSocket communication for live updates

### Utilities

- **clsx 2.1.1** - Conditional className utility for dynamic styling

### Development Tools

- **ESLint 9.38.0** - Code linting and quality assurance
- **@types/node, @types/react, @types/react-dom** - TypeScript type definitions

## 🎯 Zašto su odabrane ove biblioteke?

### **Next.js** - Izabran zbog:

- Server-side rendering (SSR) za bolje SEO
- App Router za modernu arhitekturu
- Built-in optimizacije performansi
- Excellent developer experience

### **Tailwind CSS** - Izabran zbog:

- Brzina razvoja UI komponenti
- Konsistentan design system
- Responsive design out-of-the-box
- Utility-first pristup za fleksibilnost

### **Framer Motion** - Izabran zbog:

- Smooth animacije za scroll progress
- Professional hover effects
- Performance optimizovane animacije
- Declarative animation API

### **Socket.io** - Izabran zbog:

- Real-time komunikacija
- Automatic fallback na polling
- Robust error handling
- Cross-browser kompatibilnost

### **TypeScript** - Izabran zbog:

- Type safety za manje bugova
- Better IDE support
- Self-documenting code
- Easier refactoring

## 🎰 Features

- ✅ **Real-time Updates** - Live match data with visual highlighting
- ✅ **Authentication** - Email-based login with localStorage persistence
- ✅ **Filtering & Search** - Filter by league, status, team name
- ✅ **Favorites System** - Mark and filter favorite matches
- ✅ **Responsive Design** - Works on all device sizes
- ✅ **Performance Optimized** - Virtual scrolling and memoization
- ✅ **Casino Theme** - Dark, gambling-themed UI with neon colors
- ✅ **Error Handling** - Comprehensive error states and retry mechanisms

## 🚀 Production Deployment

The easiest way to deploy is using [Vercel Platform](https://vercel.com/new):

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

## 📝 Development Notes

- Uses Next.js App Router with parallel routes for authentication
- Implements custom hooks for data management
- Features comprehensive error handling and loading states
- Optimized for performance with React.memo and useCallback
- Zero setTimeout usage for better performance
