# E-commerce Demo with Next.js & Mock.js

This is a [Next.js](https://nextjs.org) e-commerce demo project using [Mock.js](http://mockjs.com/) for dynamic data generation.

## Features

- 🎨 Modern UI with Tailwind CSS
- 📦 Dynamic product generation with Mock.js
- 🛒 Full shopping cart functionality
- 🔍 Product search and filtering
- 📱 Responsive design
- ⚡ Built with Next.js 15 (App Router)

## Getting Started

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

```bash
pnpm build
pnpm start
```

## Project Structure

- `/app` - Next.js app router pages
- `/components` - React components
- `/lib/mock` - Mock data generation using Mock.js
  - `index.ts` - Main API functions
  - `mock-data.ts` - Mock.js data generators
  - `types.ts` - TypeScript type definitions

## Mock Data

This project uses Mock.js to generate dynamic product data. All data is generated in-memory and includes:

- 20 random products across 4 categories
- Product variants (colors, sizes)
- Shopping cart functionality
- Collections and menus
- Static pages

## Technologies

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Mock Data**: Mock.js
- **Icons**: Heroicons