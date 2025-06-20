# Pokemon TCG Demo

A modern web application for exploring and collecting Pokemon Trading Card Game cards. Built with Next.js 15, this app allows users to search through the extensive Pokemon TCG database, create personal collections, and discover cards with advanced filtering capabilities.

## 🎯 Features

### Card Search & Discovery

- **Basic Search**: Search cards by Pokemon name with real-time results
- **Advanced Search**: Filter cards by multiple criteria including:
  - Energy types (Fire, Water, Grass, etc.)
  - Card subtypes (GX, V, VMAX, etc.)
  - Set and series
  - Rarity levels
  - HP range
  - Artist
  - Weaknesses and resistances
- **Card Details**: View comprehensive card information including images, stats, and abilities

### Collection Management

- **Personal Collections**: Create and manage multiple card collections
- **Favorites System**: Automatically track your favorite cards
- **Collection Organization**: Organize cards into custom collections
- **User Authentication**: Secure user accounts with Clerk authentication

### User Experience

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface with Tailwind CSS styling
- **Loading States**: Smooth loading animations and skeleton screens
- **Pagination**: Efficient browsing with paginated results

## 🛠️ Technology Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **SCSS** - Advanced styling with modules

### Backend & APIs

- **Pokemon TCG API** - Official Pokemon TCG database integration
- **MongoDB** - Database for user collections and data storage
- **Clerk** - Authentication and user management

### Development Tools

- **Turbopack** - Fast development server
- **ESLint** - Code linting
- **PostCSS** - CSS processing

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- MongoDB database
- Pokemon TCG API key (free from [Pokemon TCG Developer Portal](https://dev.pokemontcg.io/))
- Clerk account for authentication

### Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Pokemon TCG API
NEXT_PUBLIC_POKEMON_TCG_API_KEY=your_pokemon_tcg_api_key

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# App Configuration
NEXT_PUBLIC_FAVORITE_COLLECTION_NAME=Favorites
```

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd tcg-demo
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── collections/        # User collections management
│   ├── search/            # Card search functionality
│   │   ├── cards/         # Basic card search
│   │   └── advanced-search/ # Advanced filtering
│   └── utils/             # Utility functions and API clients
├── components/            # Reusable React components
├── constants/             # App constants and data
├── types/                 # TypeScript type definitions
└── styles/               # Global styles and SCSS partials
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

## 🌟 Key Features in Detail

### Advanced Search Capabilities

The app integrates with the Pokemon TCG API to provide comprehensive search functionality:

- **Multi-criteria filtering** with AND/OR logic
- **Real-time search results** with pagination
- **Set and series browsing** with organized grouping
- **Rarity and subtype filtering** for collectors

### Collection System

Users can create and manage personal card collections:

- **Multiple collections** per user
- **Automatic favorites tracking**
- **Collection sharing** (future feature)
- **Export capabilities** (future feature)

### Performance Optimizations

- **Image optimization** with Next.js Image component
- **API response caching** for better performance
- **Lazy loading** for card images
- **Efficient pagination** to handle large datasets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Pokemon TCG API](https://dev.pokemontcg.io/) for providing the card data
- [Clerk](https://clerk.com/) for authentication services
- [Next.js](https://nextjs.org/) team for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

## 📞 Support

If you encounter any issues or have questions, please:

1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

---

**Gotta Collect 'Em All!** 🎴✨
