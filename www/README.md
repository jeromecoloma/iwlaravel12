# Laravel + React + Inertia Project

A modern web application built with Laravel 12, React 19, and Inertia.js v2.

## Features

- **Laravel 12** - Latest Laravel framework with streamlined structure
- **React 19** - Modern React with latest features
- **Inertia.js v2** - Seamless SPA experience with server-side routing
- **Tailwind CSS v4** - Utility-first styling
- **TypeScript** - Type-safe JavaScript development
- **Pest** - Elegant PHP testing framework
- **Vitest** - Fast frontend testing

## Quick Start

### Prerequisites

- PHP 8.3 or higher
- Node.js 22 or higher
- Composer
- NPM

### Installation

1. **Install dependencies**
   ```bash
   composer install
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Database setup**
   ```bash
   touch database/database.sqlite
   php artisan migrate
   ```

4. **Build assets**
   ```bash
   npm run build
   ```

### Development

Start the development server:
```bash
composer run dev
```

This will start:
- Laravel development server (port 8000)
- Vite development server for assets
- Queue worker
- Log monitoring

## Testing

For detailed testing information, see **[docs/testing.md](docs/testing.md)**.

### Quick Test Commands
```bash
# Backend tests
composer test

# Frontend tests
npm run test

# Code quality
vendor/bin/pint && vendor/bin/phpstan analyse && npm run lint
```

## Documentation

- **[Testing Guide](docs/testing.md)** - Comprehensive testing documentation
- **[Creating Pages](docs/creating-pages.md)** - Complete guide to creating new pages in the application

## Technology Stack

### Backend
- **Laravel 12** - PHP framework
- **PHP 8.4** - Programming language
- **SQLite** - Development database
- **Pest** - Testing framework

### Frontend
- **React 19** - UI library
- **TypeScript** - Type system
- **Inertia.js v2** - SPA framework
- **Tailwind CSS v4** - Styling
- **Vite** - Build tool
- **Vitest** - Testing framework

### Code Quality
- **PHPStan** - PHP static analysis
- **Laravel Pint** - PHP formatting
- **ESLint** - JavaScript linting
- **Prettier** - Code formatting

## Project Structure

```
├── app/                    # Laravel application code
├── bootstrap/              # Laravel bootstrap files
├── config/                 # Configuration files
├── database/               # Database migrations and seeders
├── docs/                   # Project documentation
├── public/                 # Public web files
├── resources/
│   ├── js/                # React/TypeScript frontend
│   └── views/             # Blade templates
├── routes/                 # Application routes
├── tests/                 # Test files
└── vendor/                # Composer dependencies
```

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Run quality checks before committing
4. Follow the Laravel and React best practices

## License

[MIT License](https://opensource.org/licenses/MIT)