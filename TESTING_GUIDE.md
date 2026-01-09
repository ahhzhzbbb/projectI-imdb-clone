# 🧪 IMDB Clone Frontend - Testing Guide

## Pre-Test Checklist

Before running tests, ensure:
- ✅ Backend is running on `http://localhost:8080`
- ✅ Frontend installed: `cd frontend && npm install`
- ✅ Database has test data (at least 2 movies)
- ✅ You have a test user account (or can create one)
- ✅ Backend endpoints are responding

---

## Quick Start Test

### 1. Start the Dev Server
```bash
cd frontend
npm run dev
```
Expected output:
```
VITE v7.3.1  ready in 234 ms

➜  Local:   http://localhost:5173/
```

### 2. Open in Browser
Visit `http://localhost:5173` - should see:
- Black navbar with yellow IMDB logo
- Search bar in center
- Login/Sign Up buttons on right
- Home page with movie grid below

---

## Feature Test Cases

### Test 1: View Movies (No Auth Required)

**Steps:**
1. Open http://localhost:5173
2. Scroll down to see movie grid
3. Each movie should show:
   - Poster image
   - Movie title on hover
   - Star rating
   - Review count
   - Wishlist button (heart icon)

**Expected Result**: ✅ Multiple movies visible with images and info

**Troubleshooting**:
- No movies showing?
  - Check backend is running: `curl http://localhost:8080/api/movies`
  - Check database has movies
  - Check browser console for API errors

---

### Test 2: View Movie Details

**Steps:**
1. From home page, click any movie card
2. URL should change to `/movie/{movieId}`
3. Should see:
   - Large poster
   - Movie title and description
   - Director name
   - Genres (tags)
   - Cast/actors list
   - If TV series: Seasons dropdown with episodes
   - User reviews section
   - Wishlist button
   - Trailer button (if URL provided)

**Expected Result**: ✅ Full movie details display correctly

**Troubleshooting**:
- Blank page?
  - Check console for errors
  - Verify movieId in URL is valid
  - Confirm backend endpoint works: `curl http://localhost:8080/api/movies/1`

---

### Test 3: User Registration

**Steps:**
1. Click "Sign Up" button in navbar
2. Fill form:
   - Username: `testuser123` (3-20 chars)
   - Email: `test@example.com` (optional)
   - Password: `password123` (6+ chars)
   - Confirm Password: `password123`
   - Phone: (optional)
3. Click "Sign Up"
4. Should redirect to home page

**Expected Result**: ✅ New user created, redirected to home

**Troubleshooting**:
- "Username already exists"?
  - Use different username
- Backend error?
  - Check backend signup endpoint: `POST /auth/signup`
  - Check database user table

---

### Test 4: User Login

**Steps:**
1. Click "Login" button in navbar
2. Enter username and password
3. Click "Login"
4. Should redirect to home page
5. Navbar should show username in top right

**Expected Result**: ✅ User logged in, profile menu shows

**Verification**:
- Open browser DevTools → Application → LocalStorage
- Should see `jwtToken` key with token value

**Troubleshooting**:
- "Invalid credentials"?
  - Check username/password are correct
  - Try signup first if account doesn't exist
- Token not saving?
  - Check browser allows localStorage
  - Check browser console for errors

---

### Test 5: User Menu

**Steps:**
1. Login (from Test 4)
2. Click user profile menu (username in top right)
3. Should see options:
   - My Profile (not yet implemented)
   - My Reviews (not yet implemented)
   - Admin Panel (only if user is admin)
   - Logout

**Expected Result**: ✅ Menu appears with correct options

**Note**: Profile and Reviews pages are placeholders

---

### Test 6: Wishlist - Add Movie

**Steps:**
1. Login as user
2. From home page, click heart icon on any movie
3. Heart should turn red/filled
4. Click again to remove

**Expected Result**: ✅ Heart toggles between filled/empty

**Verification**:
- Click heart to add
- Go to "Wishlist" link in navbar
- Movie should appear on wishlist page
- Click heart again to remove
- Movie disappears from wishlist

**Troubleshooting**:
- Heart doesn't toggle?
  - Check console for API errors
  - Verify user is logged in
  - Check jwtToken in localStorage

---

### Test 7: Wishlist Page

**Steps:**
1. Login as user
2. Add 2-3 movies to wishlist (from Test 6)
3. Click "Wishlist" in navbar
4. Should see page with saved movies

**Expected Result**: ✅ Wishlist page shows saved movies

**Functionality**:
- Movies display as grid
- Can click to see details
- Can remove from wishlist via heart icon
- Page updates immediately

---

### Test 8: Admin Access (Requires Admin User)

**Steps:**
1. Create admin user OR use existing admin account
   - Must have role `ADMIN`
2. Login as admin
3. Click user menu
4. Should see "Admin Panel" link
5. Click to go to admin dashboard

**Expected Result**: ✅ Admin panel accessible with menu

**Note**: If you don't have admin user, skip to Test 9

---

### Test 9: Admin Movie Management (Requires Admin)

**Steps:**
1. Goto Admin Panel → Movies
2. Should see:
   - Table of existing movies
   - "Add Movie" button
3. Click "Add Movie"
4. Fill form:
   - Movie Name: `Test Movie`
   - Description: `This is a test`
   - Image URL: `https://via.placeholder.com/300x400`
   - Trailer URL: (optional)
   - Check "TV Series" if want (optional)
5. Click "Create Movie"
6. Should see new movie in table

**Expected Result**: ✅ New movie created and appears in list

**Edit Movie:**
1. In table, click "Edit" icon (pencil)
2. (Edit form support in progress)

**Delete Movie:**
1. In table, click "Delete" icon (trash)
2. Confirm dialog appears
3. Click confirm
4. Movie removed from table

**Troubleshooting**:
- "Unauthorized" error?
  - Verify user has ADMIN role
  - Check user role in browser DevTools
- Can't see admin panel?
  - Verify using admin account
  - Check user menu for "Admin Panel" link

---

### Test 10: Admin Actors Management

**Steps:**
1. Go to Admin Panel → Actors
2. Should see:
   - Grid of actors
   - "Add Actor" button
3. Click "Add Actor"
4. Fill form:
   - Actor Name: `Test Actor`
   - Introduction: `Famous actor`
   - Image URL: `https://via.placeholder.com/300x400`
5. Click "Create Actor"
6. Should see new actor in grid

**Expected Result**: ✅ New actor appears in grid

**Features:**
- Click Edit to modify (if backend supports)
- Click Delete to remove
- Form toggles on/off with "Cancel"

---

### Test 11: Admin Directors Management

**Steps:**
1. Go to Admin Panel → Directors
2. Should see:
   - Grid of directors
   - "Add Director" button
3. Click "Add Director"
4. Fill form:
   - Director Name: `Test Director`
   - Introduction: `Oscar winner`
   - Image URL: `https://via.placeholder.com/300x400`
5. Click "Create Director"

**Expected Result**: ✅ New director appears in grid

**Functionality:** Same as actors (create, edit, delete)

---

### Test 12: Admin Genres Management

**Steps:**
1. Go to Admin Panel → Genres
2. Should see:
   - Table of genres
   - "Add Genre" button
3. Click "Add Genre"
4. Fill form:
   - Genre Name: `Action`
5. Click "Create Genre"
6. Should see new genre in table

**Expected Result**: ✅ New genre appears in table

**Features:**
- Click Edit to modify
- Click Delete to remove
- Simple name field

---

### Test 13: Admin Settings

**Steps:**
1. Go to Admin Panel → Settings
2. Should see:
   - Application Name field
   - Application Description field
   - Feature toggle switches
   - Save/Reset buttons
3. Modify settings
4. Click "Save Settings"

**Expected Result**: ✅ Settings page loads (functionality in progress)

**Note**: This is a placeholder page for future implementation

---

### Test 14: Navigation Between Pages

**Steps:**
1. Click logo "IMDB Clone" - should go to home
2. Click movie card - should go to detail page
3. Use browser back button - should work
4. From movie detail, click movie card again - page updates
5. From admin page, click "Admin Panel" in menu - back to dashboard

**Expected Result**: ✅ All navigation works smoothly

---

### Test 15: Responsive Design - Mobile

**Steps:**
1. Open DevTools (F12)
2. Click responsive design button (Ctrl+Shift+M)
3. Select iPhone 12 Pro (390x844)
4. Test on different pages:
   - Home page - grid should be 1 column
   - Movie detail - should stack vertically
   - Admin - forms should be full width
   - Navbar - should show hamburger menu

**Expected Result**: ✅ Layout adapts to mobile

**Verification:**
- Text readable
- Buttons clickable
- Images scale properly
- No horizontal scroll

---

### Test 16: Search Bar

**Steps:**
1. Click search bar in navbar
2. Type movie name
3. Press Enter or click search icon

**Current Status**: 🟡 Placeholder (backend integration ready)

**Note**: Search functionality ready once backend search endpoint implemented

---

### Test 17: Dark Theme

**Steps:**
1. Open browser DevTools
2. Check computed styles
3. Elements should have:
   - Dark backgrounds (#030712, #111827)
   - Yellow accents (#EAB308)
   - White text (#FFFFFF)
   - No harsh brightness

**Expected Result**: ✅ Entire app is dark themed

---

### Test 18: Console Errors

**Steps:**
1. Open DevTools (F12)
2. Go to Console tab
3. Test different features
4. Check for errors (red messages)

**Expected Result**: ✅ No errors in console

**If errors appear:**
- Note the error message
- Check which page/action causes it
- Check network tab for failed API calls

---

### Test 19: Network Requests

**Steps:**
1. Open DevTools → Network tab
2. Perform actions:
   - Click on movie → should see GET /movies/{id}
   - Login → should see POST /auth/login
   - Add to wishlist → should see POST /api/wishlist
3. Check request/response
4. All should return status 200 (or 201 for creates)

**Expected Result**: ✅ All API calls successful

**Debug Failed Requests:**
1. Click on failed request
2. Check "Response" tab for error message
3. Verify backend is running
4. Check API endpoint exists

---

## Bulk Feature Testing Workflow

### Scenario: Complete User Journey

**Step 1: Browse**
- [ ] Open homepage
- [ ] See movie grid
- [ ] Hover over movie
- [ ] See info overlay

**Step 2: View Details**
- [ ] Click movie
- [ ] See full details
- [ ] See reviews
- [ ] See seasons (if TV)

**Step 3: Register**
- [ ] Click Sign Up
- [ ] Create account
- [ ] Redirected to home

**Step 4: Login**
- [ ] Click Login
- [ ] Enter credentials
- [ ] See profile menu

**Step 5: Wishlist**
- [ ] Click heart on movie
- [ ] Go to Wishlist
- [ ] See saved movie
- [ ] Remove from wishlist

**Step 6: Review**
- [ ] Click on movie
- [ ] Scroll to review form
- [ ] Enter review & rating
- [ ] Submit
- [ ] See review appear

**Expected Result**: ✅ All features work end-to-end

---

### Scenario: Admin Content Management

**Step 1: Login as Admin**
- [ ] Login with admin credentials
- [ ] See "Admin Panel" in menu

**Step 2: Add Movie**
- [ ] Click Admin Panel → Movies
- [ ] Click "Add Movie"
- [ ] Fill form
- [ ] See movie in table

**Step 3: Edit Content**
- [ ] Click Edit on movie
- [ ] Modify fields
- [ ] Save changes

**Step 4: Delete Content**
- [ ] Click Delete on movie
- [ ] Confirm dialog
- [ ] Movie removed

**Expected Result**: ✅ All admin features work

---

## Performance Testing

### Page Load Time
```bash
# Open DevTools → Performance tab
# Click record
# Reload page
# Check metrics:
# - First Contentful Paint < 1s
# - Time to Interactive < 2s
```

### Bundle Size
```bash
# After npm run build, check dist/ folder:
# - JS: ~100 KB gzipped
# - CSS: ~5 KB gzipped
# - Total: ~105 KB gzipped
```

### Network Requests
- Home page: ~3-5 API calls
- Movie detail: ~1-2 API calls
- Admin pages: ~1 API call (list data)

---

## Common Test Issues & Solutions

### Issue: "Cannot GET /movie/1"
**Cause**: Backend API returning 404
**Solution**: 
- Check if movie exists: `curl http://localhost:8080/api/movies/1`
- Verify movieId is correct
- Check backend server is running

### Issue: Login form submission doesn't work
**Cause**: Missing API response or network error
**Solution**:
- Check backend is on port 8080
- Verify `/auth/login` endpoint exists
- Check network tab for error response
- Verify credentials are correct

### Issue: Wishlist button doesn't toggle
**Cause**: User not authenticated
**Solution**:
- Verify jwtToken in localStorage
- Check user is logged in
- Try logout and login again
- Check browser allows localStorage

### Issue: Admin panel not showing
**Cause**: User doesn't have ADMIN role
**Solution**:
- Login with admin account
- Check user role: `localStorage.getItem('user')`
- Create admin user if needed

### Issue: "TypeScript errors in build"
**Cause**: Stale dependencies
**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## Success Criteria

### All Features Working
✅ Home page displays movies
✅ Movie details page works
✅ User registration/login works
✅ Wishlist add/remove works
✅ Admin panel accessible (for admin users)
✅ CRUD operations work
✅ Responsive design works
✅ No console errors
✅ All API calls succeed

### Performance Acceptable
✅ Build completes without errors
✅ Page loads in < 3 seconds
✅ Navigation is smooth
✅ No lag when clicking buttons
✅ Images load properly

### Code Quality
✅ No TypeScript errors
✅ No console warnings
✅ No failed API calls
✅ Proper error handling

---

## Final Verification Checklist

- [ ] Dev server starts: `npm run dev`
- [ ] App loads on localhost:5173
- [ ] Movies display on home page
- [ ] Can click movie to see details
- [ ] Can login with test user
- [ ] Can logout
- [ ] Can add/remove from wishlist
- [ ] Admin can access admin panel
- [ ] Can create new movie
- [ ] Can edit movie
- [ ] Can delete movie
- [ ] Same works for actors, directors, genres
- [ ] Responsive design works on mobile
- [ ] No errors in console
- [ ] Production build succeeds: `npm run build`

---

## Reporting Issues

If you find any issues:

1. **Note the issue**:
   - What were you doing?
   - What should happen?
   - What actually happened?

2. **Collect information**:
   - Screenshot or video
   - Browser console errors
   - Network tab requests
   - Browser/OS/device info

3. **Check prerequisites**:
   - Backend running?
   - Database has data?
   - All dependencies installed?

4. **Try to reproduce**:
   - Clear cache (Ctrl+Shift+Del)
   - Restart dev server
   - Rebuild project

---

**Testing Complete!** 🎉

If all tests pass, the frontend is ready for use and deployment.
