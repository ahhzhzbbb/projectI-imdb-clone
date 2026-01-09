# Hướng dẫn Onboarding dự án IMDB Clone

Chào mừng bạn đến với dự án IMDB Clone! Tài liệu này sẽ giúp bạn làm quen với cấu trúc và cách chạy dự án.

## 📁 Cấu trúc Codebase

Dự án được tổ chức thành mô hình Client-Server:

- **`backend/`**: Mã nguồn phía máy chủ.
  - Xây dựng bằng **Java 21** và **Spring Boot 3.5.6**.
  - Sử dụng **MariaDB** làm cơ sở dữ liệu.
  - Cung cấp RESTful API và bảo mật bằng **JWT**.
  
- **`frontend/`**: Mã nguồn phía giao diện.
  - Xây dựng bằng **React 19** và **Vite**.
  - Sử dụng **TypeScript** để đảm bảo an toàn kiểu dữ liệu.
  - Giao diện được thiết kế với **Tailwind CSS**.

- **`docs/`**: Chứa các tài liệu bổ sung.

## 🛠️ Yêu cầu môi trường

Trước khi bắt đầu, hãy đảm bảo bạn đã cài đặt:
- **Java JDK 21**
- **Node.js** (Khuyên dùng bản LTS)
- **MariaDB** (hoặc Docker container MariaDB)

## 🚀 Hướng dẫn chạy dự án

### 1. Khởi chạy Backend

1. Di chuyển vào thư mục backend:
   ```bash
   cd backend
   ```
2. Đảm bảo cấu hình database trong `src/main/resources/application.properties` trùng khớp với MariaDB local của bạn.
3. Chạy ứng dụng bằng Maven Wrapper:
   ```bash
   ./mvnw spring-boot:run
   ```
   Server sẽ khởi động tại `http://localhost:8080`.

### 2. Khởi chạy Frontend

1. Di chuyển vào thư mục frontend:
   ```bash
   cd frontend
   ```
2. Cài đặt các thư viện:
   ```bash
   npm install
   ```
3. Chạy server phát triển:
   ```bash
   npm run dev
   ```
   Ứng dụng sẽ chạy tại `http://localhost:5173`.

## 🔑 Các tính năng chính

- **Xác thực**: Đăng ký, Đăng nhập (JWT).
- **Phim**: Xem danh sách, chi tiết phim, trailers.
- **Người dùng**: Quản lý danh sách yêu thích (Wishlist), đánh giá phim.
- **Admin**: Dashboard quản lý phim, diễn viên, đạo diễn, thể loại.

## 📚 Tài liệu tham khảo thêm

- Kiểm tra thư mục gốc để xem các file hướng dẫn chi tiết khác như `FRONTEND_QUICK_START.md`.
