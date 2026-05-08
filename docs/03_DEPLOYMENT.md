# Hướng dẫn Deploy lên Easypanel

Brainy AI Add-on gồm 2 phần: Backend (Node.js) và Frontend (Static Assets). Dưới đây là cách cấu hình trên Easypanel.

## 1. Kiến trúc hệ thống
- **Backend**: Node.js Express API.
- **Frontend**: React (Webpack) build ra static files, được Lark client tải về qua HTTPS.

## 2. Chuẩn bị Backend (Service 1)
Trong Easypanel, tạo một **App** mới cho Backend:

- **Source**: Chọn GitHub repository của bạn.
- **Root Directory**: `backend`
- **Environment Variables**:
  - `PORT`: `3001`
  - `GEMINI_API_KEY`: [Lấy từ Google AI Studio]
- **Domain**: Ví dụ `api-brainy.yourdomain.com`
- **Build**: Easypanel (Nixpacks) sẽ tự nhận diện Node.js.

## 3. Chuẩn bị Frontend (Service 2)
Tạo một **App** mới (hoặc Static Site) cho Frontend:

- **Source**: Chọn cùng GitHub repository.
- **Root Directory**: `frontend`
- **Environment Variables**:
  - `BACKEND_URL`: `https://api-brainy.yourdomain.com` (URL của Backend ở bước 2)
- **Domain**: Ví dụ `brainy.yourdomain.com`
- **Build Configuration**:
  - **Build Command**: `npm install && npm run build`
  - **Publish Directory**: `dist`

## 4. Cấu hình trên Lark Developer Console
Sau khi deploy xong và có URL Frontend, bạn cần cập nhật trong Lark:

1. Truy cập [Lark Open Platform](https://open.larksuite.com/app).
2. Chọn App của bạn -> **Gadget/Block** -> **Block**.
3. Cập nhật **Mobile/Desktop Block URL**: `https://brainy.yourdomain.com/index.html`
4. Trong phần **H5 Trusted Domain**, thêm cả 2 domain:
   - `brainy.yourdomain.com`
   - `api-brainy.yourdomain.com`

## 5. Lưu ý quan trọng
- **HTTPS**: Easypanel tự động cấp SSL Let's Encrypt, điều này là bắt buộc vì Lark không chấp nhận HTTP.
- **CORS**: Backend đã được cấu hình cho phép các request từ client. Nếu gặp lỗi CORS, hãy kiểm tra lại cấu hình middleware trong `backend/server.js`.
- **Build Time Env**: Biến `BACKEND_URL` phải có sẵn **tại thời điểm build** frontend vì Webpack sẽ "nhúng" (inject) nó vào code static.

---
*Brainy AI - Virtual CTO Deployment Guide*
