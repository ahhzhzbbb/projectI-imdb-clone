# IMDB Clone - Project Onboarding Guide

## Project Overview

This is a full-stack IMDb clone application built with **Spring Boot** (backend) and **React + TypeScript** (frontend). It's a movie/TV show database application where users can browse movies, view details, read and write reviews, rate content, and manage wish lists.

**Project Name:** projectI-imdb-clone  
**Technology Stack:** Spring Boot 3.5.6 (Java 21) + React 19 + TypeScript + Vite  
**Database:** MariaDB  
**Current Status:** Development in progress

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────┐
│       Frontend (React + TypeScript)     │
│  - Vite Dev Server (Port 5173)          │
│  - TypeScript 5.9 + React 19            │
│  - Tailwind CSS + Lucide React Icons    │
└──────────────┬──────────────────────────┘
               │ HTTP/REST API
               │ Axios Client
               ▼
┌─────────────────────────────────────────┐
│    Backend (Spring Boot 3.5.6)          │
│  - REST API Server (Port 8080)          │
│  - Java 21 + Spring Security + JWT      │
│  - JPA/Hibernate ORM                    │
└──────────────┬──────────────────────────┘
               │ JDBC Connection
               ▼
┌─────────────────────────────────────────┐
│         MariaDB Database                │
│  - Host: localhost:3306                 │
│  - Database: imdb                       │
└─────────────────────────────────────────┘
```

---

## Project Structure

### Backend Structure (`/backend`)

```
backend/
├── pom.xml                              # Maven dependencies & build config
├── mvnw, mvnw.cmd                       # Maven wrapper scripts
├── HELP.md                              # Maven help documentation
└── src/
    ├── main/
    │   ├── java/com/hoangmp/imdb/
    │   │   ├── ImdbApplication.java     # Spring Boot entry point
    │   │   ├── models/                  # JPA Entity classes
    │   │   │   ├── Movie.java
    │   │   │   ├── User.java
    │   │   │   ├── Actor.java
    │   │   │   ├── Director.java
    │   │   │   ├── Genre.java
    │   │   │   ├── Review.java
    │   │   │   ├── Rating.java
    │   │   │   ├── Episode.java
    │   │   │   ├── Season.java
    │   │   │   ├── WishList.java
    │   │   │   ├── MovieActor.java      # Junction entity
    │   │   │   ├── MovieGenre.java      # Junction entity
    │   │   │   └── Role.java
    │   │   ├── controllers/             # REST API Endpoints
    │   │   │   ├── MovieController.java
    │   │   │   ├── ActorController.java
    │   │   │   ├── ReviewController.java
    │   │   │   ├── RatingController.java
    │   │   │   ├── GenreController.java
    │   │   │   ├── SeasonController.java
    │   │   │   ├── EpisodeController.java
    │   │   │   ├── MovieActorController.java
    │   │   │   └── WishListController.java
    │   │   ├── repositories/            # JPA Repository interfaces
    │   │   │   ├── MovieRepository.java
    │   │   │   ├── UserRepository.java
    │   │   │   ├── ActorRepository.java
    │   │   │   └── ... (more repositories)
    │   │   ├── services/                # Business logic layer
    │   │   ├── dto/                     # Data Transfer Objects
    │   │   ├── security/                # Authentication & JWT
    │   │   ├── config/                  # Spring configuration
    │   │   └── exceptions/              # Custom exceptions
    │   └── resources/
    │       ├── application.properties   # Database & app config
    │       ├── banner.txt
    │       ├── static/                  # Static files
    │       └── templates/               # Thymeleaf templates (if used)
    └── test/
        └── java/com/hoangmp/imdb/      # Unit tests
```

### Frontend Structure (`/frontend`)

```
frontend/
├── package.json                         # Dependencies & scripts
├── tsconfig.json                        # TypeScript configuration
├── vite.config.ts                       # Vite build config
├── tailwind.config.js                   # Tailwind CSS config
├── eslint.config.js                     # ESLint rules
├── index.html                           # HTML entry point
├── src/
│   ├── main.tsx                         # React entry point
│   ├── App.tsx                          # Root component
│   ├── App.css                          # Global styles
│   ├── index.css                        # Base styles
│   ├── api/                             # API client modules
│   │   ├── axiosConfig.ts              # Axios instance & interceptors
│   │   ├── authAPI.ts                  # Authentication endpoints
│   │   ├── movieAPI.ts                 # Movie endpoints
│   │   ├── reviewAPI.ts                # Review endpoints
│   │   ├── wishlistAPI.ts              # Wishlist endpoints
│   │   ├── seasonEpisodeAPI.ts         # Season/Episode endpoints
│   │   └── otherAPI.ts                 # Other endpoints
│   ├── components/                      # Reusable React components
│   │   ├── common/                      # Common/shared components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── RatingStars.tsx
│   │   │   └── SearchAndFilter.tsx
│   │   ├── layout/                      # Layout components
│   │   │   ├── Navbar.tsx
│   │   │   ├── MobileMenu.tsx
│   │   │   ├── ProfileDropdown.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── movie/                       # Movie-specific components
│   │   │   ├── MovieCard.tsx
│   │   │   └── MovieList.tsx
│   │   ├── features/                    # Feature-specific components
│   │   │   ├── movie/
│   │   │   └── review/
│   │   └── index.ts                     # Component exports
│   ├── pages/                           # Page components
│   │   ├── HomePage.tsx
│   │   ├── MovieDetailPage.tsx
│   │   ├── ActorDetailPage.tsx
│   │   ├── GenreDetailPage.tsx
│   │   ├── EpisodeDetailPage.tsx
│   │   ├── SearchPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── WishlistPage.tsx
│   │   ├── GenresPage.tsx
│   │   ├── admin/                      # Admin pages
│   │   └── home/
│   ├── layouts/                         # Layout templates
│   │   ├── MainLayout.tsx
│   │   └── AdminLayout.tsx
│   ├── hooks/                           # Custom React hooks
│   │   ├── useAuth.ts                  # Authentication context hook
│   │   ├── useFetch.ts                 # Data fetching hook
│   │   ├── useMovieDetail.ts           # Movie detail hook
│   │   ├── useReviewForm.ts            # Review form hook
│   │   └── useWishlist.ts              # Wishlist hook
│   ├── store/                           # State management
│   │   └── AuthContext.tsx             # Auth context provider
│   ├── types/                           # TypeScript type definitions
│   │   └── index.ts
│   ├── constants/                       # Constants & enums
│   │   ├── api.ts                      # API endpoints
│   │   ├── routes.ts                   # Route paths
│   │   └── ui.ts                       # UI constants
│   ├── utils/                           # Utility functions
│   │   ├── formatters.ts               # Format data functions
│   │   ├── helpers.ts                  # Helper functions
│   │   └── youtube.ts                  # YouTube utility
│   ├── styles/                          # Global styles
│   └── assets/                          # Images, fonts, etc
└── public/                              # Static assets
```

---

## Technology Stack Details

### Backend Dependencies
- **Spring Boot 3.5.6**: Web framework & dependency injection
- **Spring Data JPA**: ORM & database abstraction
- **Spring Security**: Authentication & authorization
- **JWT (JJWT 0.13.0)**: Token-based authentication
- **MariaDB Driver**: Database connectivity
- **Lombok**: Reduce boilerplate code
- **ModelMapper**: Object mapping
- **SpringDoc OpenAPI 2.8.14**: API documentation & Swagger UI
- **Java 21**: Latest LTS Java version

### Frontend Dependencies
- **React 19.2.0**: UI framework
- **TypeScript 5.9**: Type-safe JavaScript
- **Vite 7.2.4**: Build tool & dev server
- **React Router 7.12.0**: Client-side routing
- **Axios 1.13.2**: HTTP client
- **Tailwind CSS 3.4.19**: Utility-first CSS framework
- **Lucide React**: Icon library
- **ESLint 9.39.1**: Code linting

---

## Database Configuration

### Current Configuration (MariaDB)
```properties
Database Host: localhost:3306
Database Name: imdb
Username: hoang
Password: aqws12345zx
Driver: MariaDB JDBC Driver
Dialect: MariaDBDialect
```

### Entities & Relationships
- **User**: Users of the application
- **Movie**: Movie/TV show information
- **Director**: Directors of movies
- **Actor**: Actors in movies
- **MovieActor**: Junction table for Movie-Actor relationship
- **Genre**: Movie genres
- **MovieGenre**: Junction table for Movie-Genre relationship
- **Season**: TV show seasons
- **Episode**: Episodes of seasons
- **Review**: User reviews of movies
- **Rating**: User ratings of movies
- **WishList**: User's saved movies
- **Role**: User roles (admin, user, etc.)

### JPA Configuration
- **DDL Auto**: `update` (auto-updates schema on startup)
- **Show SQL**: `true` (logs SQL queries)
- **Dialect**: MariaDBDialect

---

## API Endpoints Structure

The backend provides RESTful APIs with the following controller structure:

| Controller | Base Path | Purpose |
|------------|-----------|---------|
| MovieController | `/api/movies` | Movie CRUD operations |
| ActorController | `/api/actors` | Actor management |
| ReviewController | `/api/reviews` | Review management |
| RatingController | `/api/ratings` | Rating operations |
| GenreController | `/api/genres` | Genre operations |
| SeasonController | `/api/seasons` | Season management |
| EpisodeController | `/api/episodes` | Episode management |
| MovieActorController | `/api/movie-actors` | Movie-Actor associations |
| WishListController | `/api/wishlists` | Wishlist operations |

### API Documentation
Swagger UI is available at: `http://localhost:8080/swagger-ui.html`

---

## Frontend Routes & Pages

| Page | Route | Purpose |
|------|-------|---------|
| HomePage | `/` | Main landing page with movie feed |
| MovieDetailPage | `/movie/:id` | Detailed view of a single movie |
| ActorDetailPage | `/actor/:id` | Actor profile & filmography |
| GenreDetailPage | `/genre/:id` | Movies filtered by genre |
| GenresPage | `/genres` | Browse all genres |
| EpisodeDetailPage | `/episode/:id` | TV episode details |
| SearchPage | `/search` | Search results page |
| LoginPage | `/login` | User login |
| SignupPage | `/signup` | User registration |
| ProfilePage | `/profile` | User profile & preferences |
| WishlistPage | `/wishlist` | User's saved movies |

---

## Authentication & Security

### JWT Configuration
- **JWT Secret**: Configured in `application.properties`
- **Token Expiration**: Configured via `spring.app.jwtExpirationMs`
- **Cookie Name**: `phamminhhoang` (for JWT storage)
- **Security Implementation**: Spring Security + JWT

### Frontend Auth
- **AuthContext**: Centralized auth state in `store/AuthContext.tsx`
- **useAuth Hook**: Custom hook to access auth state across components
- **Axios Interceptor**: Auto-attaches JWT token to requests

---

## Getting Started

### Prerequisites
- **Java 21+**
- **Node.js 18+**
- **MariaDB 10.5+**
- **Maven 3.8+** (included via mvnw wrapper)
- **npm** or **yarn**

### 1. Backend Setup

```bash
cd backend

# Build the project
./mvnw clean package

# Or run directly
./mvnw spring-boot:run
```

**Backend runs on:** `http://localhost:8080`

**Database Connection Required:**
- MariaDB must be running on `localhost:3306`
- Database `imdb` must exist
- Credentials: `hoang` / `aqws12345zx`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

**Frontend runs on:** `http://localhost:5173`

### 3. Database Setup

The database schema is auto-created via Hibernate with `ddl-auto=update`. Simply ensure MariaDB is running and the `imdb` database exists.

```sql
CREATE DATABASE imdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## Key Features to Explore

### 1. **Movie Management**
- Browse movies with pagination
- View detailed movie information
- Search movies by title
- Filter by genre
- View cast and crew

### 2. **Reviews & Ratings**
- Submit reviews with ratings
- View community reviews
- Edit/delete own reviews
- Rate movies (1-10 scale)

### 3. **Wishlist**
- Save favorite movies
- Manage saved lists
- Quick access to favorites

### 4. **TV Shows & Episodes**
- Browse TV series
- View seasons and episodes
- Episode-specific details

### 5. **User Profiles**
- User registration & login
- Profile management
- View user reviews & ratings
- Wishlist management

### 6. **Search & Discovery**
- Global search functionality
- Genre browsing
- Actor/Director filmography
- Advanced filtering

---

## Development Workflow

### Frontend Development
1. **Component Development**: Add new `.tsx` files in `src/components/`
2. **API Integration**: Use hooks like `useFetch()` for data fetching
3. **State Management**: Use `AuthContext` for global auth state
4. **Styling**: Use Tailwind CSS classes directly in JSX
5. **Type Safety**: Define types in `src/types/index.ts`

### Backend Development
1. **Entity Creation**: Add JPA entity in `models/`
2. **Repository**: Create JpaRepository interface in `repositories/`
3. **Service**: Implement business logic in `services/`
4. **Controller**: Expose REST endpoints in `controllers/`
5. **DTO**: Use DTOs for API request/response payloads

### Common Patterns

**Frontend - Data Fetching:**
```typescript
const { data, loading, error } = useFetch(`/api/movies`);
```

**Backend - Create Endpoint:**
```java
@PostMapping
public ResponseEntity<?> create(@RequestBody MovieDTO dto) {
    // Implementation
}
```

---

## Important Configuration Files

| File | Purpose |
|------|---------|
| `backend/src/main/resources/application.properties` | Database, JWT, security config |
| `frontend/vite.config.ts` | Vite bundler configuration |
| `frontend/tailwind.config.js` | Tailwind CSS theme customization |
| `frontend/tsconfig.json` | TypeScript compiler options |
| `backend/pom.xml` | Maven dependencies & build config |
| `frontend/package.json` | npm dependencies & scripts |

---

## Useful Commands

### Backend
```bash
# Start backend server
cd backend && ./mvnw spring-boot:run

# Run tests
./mvnw test

# Build JAR
./mvnw clean package

# View API docs
# Open http://localhost:8080/swagger-ui.html
```

### Frontend
```bash
# Start dev server
cd frontend && npm run dev

# Build production
npm run build

# Lint & fix
npm run lint

# Preview production build locally
npm run preview
```

---

## Code Quality & Style

### Frontend
- **Linter**: ESLint with TypeScript support
- **Code Style**: Modern React with functional components & hooks
- **CSS**: Tailwind CSS utility classes
- **Type Safety**: Strict TypeScript enabled

### Backend
- **Build Tool**: Maven
- **Framework**: Spring Boot with annotations
- **Code Style**: Standard Java conventions
- **Dependency Injection**: Spring DI with @Autowired

---

## Troubleshooting

### Backend Issues
- **Port 8080 already in use**: Change port in `application.properties`
- **Database connection failed**: Ensure MariaDB is running and credentials are correct
- **Swagger UI not loading**: Check SpringDoc dependency in `pom.xml`

### Frontend Issues
- **Port 5173 already in use**: Vite will auto-select another port
- **CORS errors**: Ensure backend is running and API endpoints are correct
- **TypeScript errors**: Run `npm run lint` to check types

---

## Next Steps for Development

1. **Familiarize with the codebase**: Start with home page components
2. **Explore API documentation**: Open Swagger UI at `http://localhost:8080/swagger-ui.html`
3. **Run the application**: Follow the "Getting Started" section
4. **Review existing features**: Understand how reviews, ratings, and wishlist work
5. **Implement new features**: Follow the patterns established in existing code
6. **Test your changes**: Use browser DevTools and backend logs to debug

---

## Important Notes

- **Database Credentials**: In production, move credentials to environment variables
- **JWT Secret**: Should be long and randomly generated in production
- **CORS Configuration**: May need adjustment for production deployment
- **API Base URL**: Frontend uses `http://localhost:8080` for API calls (configurable)

---

## File References for Quick Navigation

- [Database Configuration](backend/src/main/resources/application.properties)
- [API Documentation Base](backend/src/main/java/com/hoangmp/imdb/controllers)
- [Frontend Entry Point](frontend/src/main.tsx)
- [API Client Config](frontend/src/api/axiosConfig.ts)
- [Auth Context](frontend/src/store/AuthContext.tsx)
- [Main Routes](frontend/src/App.tsx)

---

## Support & Questions

For questions about specific features:
1. Check existing controllers for API patterns
2. Review React hooks for frontend patterns
3. Look at similar entities for database schema patterns
4. Check Swagger UI for API documentation

Good luck with the project! 🚀
