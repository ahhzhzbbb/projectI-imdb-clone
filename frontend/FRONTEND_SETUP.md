# IMDB Clone Frontend

Xây dựng giao diện React TypeScript cho ứng dụng IMDB Clone.

## 📁 Cấu trúc Thư mục

```
src/
├── api/              # Cấu hình Axios và API endpoints
│   ├── axiosConfig.ts         # Cấu hình Axios client
│   ├── authAPI.ts             # Auth endpoints (login, signup)
│   ├── movieAPI.ts            # Movie endpoints
│   ├── reviewAPI.ts           # Review & Rating endpoints
│   ├── wishlistAPI.ts         # Wishlist endpoints
│   ├── otherAPI.ts            # Actor, Director, Genre endpoints
│   └── index.ts               # Export tất cả APIs
│
├── assets/           # Ảnh, icon, font
│
├── components/       # UI Components
│   ├── common/       # Reusable components
│   │   ├── Button.tsx         # Button component
│   │   ├── Input.tsx          # Input component
│   │   ├── Navbar.tsx         # Navigation bar
│   │   ├── RatingStars.tsx    # Rating stars display
│   │   └── index.ts
│   │
│   ├── movie/        # Movie-related components
│   │   ├── MovieCard.tsx      # Movie card display
│   │   ├── MovieList.tsx      # Movie grid list
│   │   └── index.ts
│   │
│   └── review/       # Review-related components (placeholder)
│
├── hooks/            # Custom React Hooks
│   ├── useAuth.ts             # Auth-related hooks
│   ├── useWishlist.ts         # Wishlist management
│   ├── useFetch.ts            # Generic fetch hook
│   └── index.ts
│
├── layouts/          # Layout wrappers
│   ├── MainLayout.tsx         # Main layout (Navbar + Footer)
│   └── index.ts
│
├── pages/            # Page components
│   ├── HomePage.tsx           # Home page
│   ├── LoginPage.tsx          # Login page
│   ├── SignupPage.tsx         # Sign up page
│   ├── WishlistPage.tsx       # Wishlist page
│   └── index.ts
│
├── store/            # State management
│   ├── AuthContext.tsx        # Auth context & provider
│   └── index.ts
│
├── styles/           # Global styles
│   └── globals.css            # Tailwind + custom CSS
│
├── types/            # TypeScript interfaces
│   └── index.ts               # Tất cả TS types/interfaces
│
├── utils/            # Helper functions
│   └── helpers.ts             # Common utility functions
│
├── App.tsx           # Main app & routing
├── main.tsx          # Entry point
├── index.css         # Base CSS
└── App.css           # App CSS
```

## 🎨 Giao Diện Thiết Kế

- **Màu sắc chủ đạo**: Đen (#000000) & Vàng (#fcd34d)
- **Framework CSS**: Tailwind CSS v3.4.19
- **Design**: Tương tự IMDB - tối giản, chuyên nghiệp
- **Responsive**: Mobile-first approach

## 🔧 Công Nghệ

- **React**: v19.2.0
- **TypeScript**: v5.9
- **React Router**: v7.12.0
- **Axios**: v1.13.2
- **Tailwind CSS**: v3.4.19
- **Lucide Icons**: v0.562.0

## 📦 TypeScript Interfaces

Tất cả interfaces được định nghĩa trong `src/types/index.ts` và đồng bộ với Backend entities:

### Main Types

- **IUser** - Người dùng
- **IMovie** - Thông tin phim
- **IMovieDetail** - Chi tiết phim (kèm seasons, actors, genres)
- **IDirector** - Đạo diễn
- **IActor** - Diễn viên
- **IGenre** - Thể loại phim
- **IReview** - Bình luận/review
- **IRating** - Đánh giá tập phim
- **IWishList** - Danh sách yêu thích

## 🚀 Cách Chạy

### Cài đặt dependencies
```bash
npm install
```

### Development server
```bash
npm run dev
```

### Build production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

### Lint code
```bash
npm run lint
```

## 🔑 Environment Variables

Tạo file `.env` từ `.env.example`:

```env
VITE_API_URL=http://localhost:8080/api
```

## 🎯 API Integration

Tất cả API calls được quản lý trong thư mục `src/api/`:

### Auth API
- `POST /auth/login` - Đăng nhập
- `POST /auth/signup` - Đăng ký
- `GET /auth/current-user` - Lấy user hiện tại
- `GET /auth/username` - Lấy username hiện tại

### Movie API
- `GET /movies` - Lấy tất cả phim
- `GET /movie/{id}/seasons` - Lấy chi tiết phim + seasons
- `POST /movie` - Tạo phim (Admin only)
- `DELETE /movie/{id}` - Xóa phim (Admin only)

### Review API
- `GET /reviews/movie/{id}` - Lấy reviews của phim
- `POST /reviews` - Tạo review mới
- `PUT /reviews/{id}` - Cập nhật review
- `DELETE /reviews/{id}` - Xóa review

### Rating API
- `POST /ratings` - Đánh giá episode
- `GET /ratings/episode/{id}` - Lấy rating của user cho episode
- `DELETE /ratings/{id}` - Xóa rating

### Wishlist API
- `GET /wishlist` - Lấy wishlist của user
- `POST /wishlist` - Thêm vào wishlist
- `DELETE /wishlist/{id}` - Xóa khỏi wishlist

## 📝 Authentication Flow

1. User đăng nhập/đăng ký
2. Backend trả JWT token qua Set-Cookie header
3. Token tự động được gửi kèm mỗi request (via Axios interceptor)
4. AuthContext quản lý trạng thái user toàn app

## 🎭 Component Architecture

### Atomic Design Pattern

- **common/** - Atoms (Button, Input, Stars)
- **movie/** - Molecules (MovieCard, MovieList)
- **pages/** - Organisms/Pages (HomePage, LoginPage)
- **layouts/** - Templates (MainLayout)

## 🔐 Protected Routes

Routes được bảo vệ bằng `ProtectedRoute` component:

```tsx
<Route
  path="/wishlist"
  element={
    <ProtectedRoute>
      <WishlistPage />
    </ProtectedRoute>
  }
/>
```

## 📚 Custom Hooks

- **useAuth()** - Truy cập auth context
- **useIsAdmin()** - Kiểm tra user là admin
- **useIsAuthenticated()** - Kiểm tra user đã login
- **useCurrentUser()** - Lấy user hiện tại
- **useWishlist()** - Quản lý wishlist
- **useFetch()** - Generic hook để fetch dữ liệu

## 🎨 Styling

- Sử dụng Tailwind CSS utility classes
- Custom CSS cho các animationen & styles phức tạp
- Dark theme mặc định
- Responsive design với breakpoints Tailwind

## ⚠️ Lưu Ý

1. **JWT Token**: Được lưu tự động qua Set-Cookie header từ backend
2. **CORS**: Đảm bảo backend có cấu hình CORS để chấp nhận requests từ frontend
3. **API URL**: Cấu hình `VITE_API_URL` trong `.env` để trỏ đúng backend
4. **TypeScript**: Tất cả code được viết theo TypeScript strict mode

## 📄 License

MIT
