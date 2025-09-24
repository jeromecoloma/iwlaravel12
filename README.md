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
- **Git Hooks** - Automated quality checks with Lefthook

## Quick Start

### Prerequisites

- PHP 8.3 or higher
- Node.js 22 or higher
- Composer
- NPM

### Installation

1. **Install dependencies**
   ```bash
   cd www
   composer install
   npm install
   ```

2. **Environment setup**
   ```bash
   cd www
   cp .env.example .env
   php artisan key:generate
   ```

3. **Database setup**
   ```bash
   cd www
   touch database/database.sqlite
   php artisan migrate
   ```

4. **Build assets**
   ```bash
   cd www
   npm run build
   ```

### Development

Start the development server:
```bash
cd www
composer run dev
```

This will start:
- Laravel development server (port 8000)
- Vite development server for assets
- Queue worker
- Log monitoring

## Git Hooks Setup

This project uses [Lefthook](https://github.com/evilmartians/lefthook) for managing git hooks to ensure code quality.

### Install Lefthook

**macOS:**
```bash
brew install lefthook
```

**Linux/Windows:**
```bash
# Using Go
go install github.com/evilmartians/lefthook@latest

# Or download binary from releases
curl -1sLf 'https://dl.cloudsmith.io/public/evilmartians/lefthook/setup.deb.sh' | sudo -E bash
sudo apt install lefthook
```

### Setup Git Hooks

After installing Lefthook, initialize it in the project:
```bash
lefthook install
```

### Pre-push Hook

The pre-push hook will automatically run:
- Backend tests (Pest)
- Frontend tests (Vitest)
- PHP code formatting check (Pint)
- JavaScript linting (ESLint)
- TypeScript type checking

## GitHub Actions Testing (Optional)

You can test GitHub Actions locally using [act](https://github.com/nektos/act).

### Install act

**macOS:**
```bash
brew install act
```

**Linux:**
```bash
# Using curl
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
```

**Windows:**
```bash
choco install act-cli
```

### Run Actions Locally

```bash
# Run all workflows
act

# Run specific workflow
act -W .github/workflows/your-workflow.yml

# Run with specific event
act push
```

## Testing

For detailed testing information, see **[www/docs/testing.md](www/docs/testing.md)**.

### Quick Test Commands
```bash
cd www

# Backend tests
composer test

# Frontend tests
npm run test

# Code quality
vendor/bin/pint && vendor/bin/phpstan analyse && npm run lint
```

## Documentation

- **[Testing Guide](www/docs/testing.md)** - Comprehensive testing documentation
- **[Creating Pages](www/docs/creating-pages.md)** - Complete guide to creating new pages in the application

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

### Code Quality & Development Tools
- **PHPStan** - PHP static analysis
- **Laravel Pint** - PHP formatting
- **ESLint** - JavaScript linting
- **Prettier** - Code formatting
- **Lefthook** - Git hooks management
- **act** - Local GitHub Actions testing

## Project Structure

```
├── www/                    # Main Laravel application
│   ├── app/               # Laravel application code
│   ├── bootstrap/         # Laravel bootstrap files
│   ├── config/            # Configuration files
│   ├── database/          # Database migrations and seeders
│   ├── docs/              # Project documentation
│   ├── public/            # Public web files
│   ├── resources/
│   │   ├── js/           # React/TypeScript frontend
│   │   └── views/        # Blade templates
│   ├── routes/           # Application routes
│   ├── tests/            # Test files
│   └── vendor/           # Composer dependencies
├── lefthook.yml           # Git hooks configuration
└── README.md             # This file
```

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. All pre-push hooks must pass (tests, linting, formatting)
4. Follow the Laravel and React best practices

## License

[MIT License](https://opensource.org/licenses/MIT)