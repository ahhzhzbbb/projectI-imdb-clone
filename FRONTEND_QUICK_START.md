# IMDB Clone Frontend - Quick Start Guide

## What Has Been Completed ✅

### Pages Created
1. **HomePage** - Movie grid with hero section
2. **MovieDetailPage** - Complete movie info, reviews, seasons
3. **LoginPage** - User authentication
4. **SignupPage** - New user registration
5. **WishlistPage** - User's saved movies
6. **AdminDashboard** - Admin panel home
7. **AdminMoviesPage** - Manage all movies (CRUD)
8. **AdminActorsPage** - Manage actors (CRUD)
9. **AdminDirectorsPage** - Manage directors (CRUD)
10. **AdminGenresPage** - Manage genres (CRUD)
11. **AdminSettingsPage** - System settings

### Components Created
- Button (4 variants: primary, secondary, danger, outline)
- Input (with validation)
- Navbar (responsive, user menu, search)
- MovieCard (interactive card with wishlist)
- MovieList (responsive grid)
- RatingStars (display and interactive)

### Features Implemented
✅ User authentication with JWT tokens
✅ Movie discovery and browsing
✅ Movie detail pages with reviews
✅ Wishlist management
✅ Admin panel with full CRUD operations
✅ Responsive design (mobile, tablet, desktop)
✅ Dark theme with yellow accents
✅ TypeScript strict mode
✅ Production-ready build

---

## How to Run

### Start Development Server
```bash
cd frontend
npm install  # if not done yet
npm run dev
```
The app will open at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

---

## Testing the Features

### 1. View Movies (No Login Required)
1. Open `http://localhost:5173`
2. See movie grid on home page
3. Hover over any movie to see details
4. Click movie card to view full details

### 2. View Movie Details
1. Click any movie from home page
2. See director, genres, cast
3. If TV series: see seasons and episodes
4. See user reviews and ratings
5. See wishlist button (need to login to use)

### 3. Login/Register
1. Click "Login" button in navbar
2. Use test credentials or signup as new user
3. After login, you'll see user menu in navbar

### 4. Wishlist (After Login)
1. Click heart icon on any movie card
2. Go to "Wishlist" in navbar
3. See all saved movies

### 5. Admin Panel (Admin Users Only)
1. Login with admin account (role: ADMIN)
2. Click user menu → "Admin Panel"
3. See 4 options:
   - **Movies**: Add/Edit/Delete movies
   - **Actors**: Add/Edit/Delete actors
   - **Directors**: Add/Edit/Delete directors
   - **Genres**: Add/Edit/Delete genres

### Admin Movie Management
1. Go to Admin Panel → Movies
2. Click "Add Movie"
3. Fill in:
   - Movie Name (required)
   - Description (optional)
   - Image URL (poster link)
   - Trailer URL (optional)
   - Check "TV Series" if applicable
4. Click "Create Movie"
5. See movie appear in grid
6. Click Edit/Delete buttons to modify

---

## API Endpoints (Backend)

The frontend connects to backend at `http://localhost:8080/api`

### Must Have Working:
- ✅ `POST /auth/login` - Login
- ✅ `POST /auth/signup` - Register
- ✅ `GET /auth/user` - Get current user
- ✅ `GET /movies` - List movies
- ✅ `GET /movies/{id}` - Get movie detail
- ✅ `POST /movies` - Create movie
- ✅ `DELETE /movies/{id}` - Delete movie

### Optional for Admin:
- Actors CRUD
- Directors CRUD
- Genres CRUD
- Reviews CRUD
- Ratings CRUD
- Wishlist CRUD

---

## User Roles

### Regular User
- View movies
- View movie details
- Submit reviews
- Manage wishlist
- View own reviews

### Admin User
- All regular user features +
- Manage movies (create, edit, delete)
- Manage actors
- Manage directors
- Manage genres
- View all user reviews

---

## Login Flow

1. User enters username and password
2. Submit login form
3. Backend returns: `{ userId, username, jwtToken, roles }`
4. Token saved to `localStorage` as `jwtToken`
5. Axios automatically includes token in future requests
6. User stays logged in on page refresh

---

## File Structure Reference

```
frontend/src/
├── api/             ← API calls to backend
├── components/      ← Reusable UI components
├── hooks/          ← Custom React hooks
├── pages/          ← Full page components
├── store/          ← Auth context (state)
├── styles/         ← CSS styling
├── types/          ← TypeScript interfaces
├── utils/          ← Helper functions
├── App.tsx         ← Main router
└── main.tsx        ← Entry point
```

---

## Common Issues & Solutions

### Problem: Build fails with TypeScript errors
**Solution**: 
```bash
rm -rf node_modules
npm install
npm run build
```

### Problem: Can't login
**Check**:
1. Backend is running on `http://localhost:8080`
2. Username/password are correct
3. Check browser console for error message

### Problem: Movies don't load
**Check**:
1. Backend API is running
2. Movies exist in database
3. Check network tab for failed requests

### Problem: Admin panel shows 404
**Check**:
1. User is logged in
2. User has ADMIN role (check in browser console)
3. Route exists: `/admin`

### Problem: Wishlist doesn't work
**Check**:
1. User is logged in (token in localStorage)
2. Backend wishlist endpoint is working
3. Check browser console for API errors

---

## Environment Variables

Create `.env` file in `frontend/` folder:
```
VITE_API_URL=http://localhost:8080/api
```

Currently defaults to `http://localhost:8080/api`

---

## Key Files to Know

- **App.tsx** - Routes and protected routes
- **AuthContext.tsx** - User authentication state
- **axiosConfig.ts** - API client setup with JWT
- **types/index.ts** - All TypeScript interfaces

---

## Next Steps

1. **Test everything works**
   - Run backend on port 8080
   - Run frontend on port 5173
   - Test login, movie view, admin panel

2. **Customize if needed**
   - Colors: Edit `tailwind.config.js`
   - Styles: Edit `src/styles/globals.css`
   - Components: Edit `src/components/`

3. **Deploy**
   - Build: `npm run build`
   - Upload `dist/` folder to hosting
   - Set API URL to production backend

---

## Support

For TypeScript errors or missing types:
1. Check `src/types/index.ts`
2. Ensure backend returns expected data format
3. Check API response in network tab

For routing issues:
1. Check route definitions in `App.tsx`
2. Verify page component exports in `pages/index.ts`
3. Check protected route requirements

---

**Everything is ready! Start with `npm run dev` and enjoy! 🚀**
