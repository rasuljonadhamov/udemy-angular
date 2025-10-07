# Udemy Angular - Complete Learning Platform

A comprehensive Angular application built with modern practices, featuring a complete e-learning platform with courses, authentication, shopping cart, and more.

## 🚀 Features

- **Authentication System**: Login/Register with JWT tokens
- **Course Management**: Browse, search, filter, and purchase courses
- **Shopping Cart**: Add courses to cart and checkout
- **Favorites**: Save favorite courses
- **Video Player**: Watch purchased courses
- **Reviews & Ratings**: Rate and review courses
- **Responsive Design**: Mobile-first approach
- **Real-time Notifications**: Toast notifications for user feedback

## 🏗️ Architecture

### Core Features
- **Signal Stores**: State management using @ngrx/signals
- **Interceptors**: HTTP request/response handling
- **Guards**: Route protection (Auth, Guest, Purchase)
- **Services**: Business logic and API communication
- **Models**: TypeScript interfaces for type safety

### Shared Components
- **Pipes**: Currency, Duration, Time Ago, Search Filter, etc.
- **Directives**: Auto Focus, Click Outside, Debounce Click, etc.
- **Validators**: Custom form validation
- **Utilities**: Helper functions for common operations

## 📁 Project Structure

```
src/app/
├── core/                    # Core functionality
│   ├── constants/          # Application constants
│   ├── guards/             # Route guards
│   ├── interceptors/       # HTTP interceptors
│   ├── models/             # TypeScript interfaces
│   ├── services/           # Business services
│   └── utils/              # Utility functions
├── features/               # Feature modules
│   ├── auth/               # Authentication
│   ├── courses/            # Course management
│   ├── cart/               # Shopping cart
│   └── favorites/          # Favorite courses
├── shared/                 # Shared components
│   ├── components/         # Reusable components
│   ├── directives/         # Custom directives
│   ├── pipes/              # Custom pipes
│   ├── utils/              # Shared utilities
│   └── validators/         # Form validators
├── store/                  # Signal stores
└── styles/                 # Global styles
```

## 🛠️ Technologies Used

- **Angular 18+**: Latest Angular with standalone components
- **@ngrx/signals**: Modern state management
- **RxJS**: Reactive programming
- **TypeScript**: Type-safe development
- **CSS Grid/Flexbox**: Modern layouts
- **Angular Forms**: Reactive forms with validation

## 🔧 Development Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Angular CLI

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd udemy-angular
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
ng serve
```

4. Start the backend server (if available)
```bash
cd backend
npm install
npm start
```

### Available Scripts

```bash
ng serve          # Start development server
ng build          # Build for production
ng test           # Run unit tests
ng lint           # Run linting
ng e2e            # Run e2e tests
```

## 🎯 Key Components

### Authentication
- Login/Register forms with validation
- JWT token management
- Route protection with guards
- Persistent login state

### Course Management
- Course listing with search and filters
- Course details with reviews
- Video player for purchased courses
- Rating and review system

### Shopping Experience
- Add courses to cart
- Secure checkout process
- Purchase history
- Favorites management

### State Management
- **AuthStore**: User authentication state
- **CoursesStore**: Course data and filters
- **CartStore**: Shopping cart items
- **FavoritesStore**: User favorites
- **ThemeStore**: UI theme preferences

## 🔒 Security Features

- JWT token authentication
- Route guards for protected pages
- Input validation and sanitization
- XSS protection
- CSRF protection

## 📱 Responsive Design

- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interfaces
- Optimized for all screen sizes

## 🚀 Performance Optimizations

- Lazy loading routes
- OnPush change detection
- Optimized bundle sizes
- Image lazy loading
- Caching strategies

## 🧪 Testing

```bash
# Unit tests
ng test

# E2E tests
ng e2e

# Coverage report
ng test --code-coverage
```

## 📦 Building for Production

```bash
ng build --configuration production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Additional Resources

- [Angular Documentation](https://angular.dev)
- [NgRx Signals](https://ngrx.io/guide/signals)
- [RxJS Documentation](https://rxjs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
