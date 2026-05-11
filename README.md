# Brainy AI - Lark Docs Add-on

**Brainy AI** là một tiện ích mở rộng (Docs Add-on) được tích hợp trực tiếp vào trình soạn thảo của Lark Docs. Brainy đóng vai trò như một người trợ lý ảo AI (JemOS), giúp phân tích ngữ pháp, tinh chỉnh giọng điệu, và tương tác trực tiếp (chat, thay thế văn bản, lên ý tưởng) ngay khi bạn đang soạn thảo.

## 📁 Cấu trúc thư mục

Dự án bao gồm 2 thành phần chính:

- `frontend/`: Ứng dụng React (tích hợp Webpack) render giao diện Sidebar/Block bên trong Lark Docs. Chịu trách nhiệm tương tác UI/UX và gọi API của Lark (Lark SDK).
- `backend/`: Node.js Express API. Đóng vai trò là Proxy an toàn giao tiếp với Google AI (Gemini 2.5 Flash / Vertex AI).
- `docs/`: Tài liệu chi tiết về kiến trúc, đặc tả sản phẩm (PRD), hướng dẫn UI, deployment và tài liệu gốc của Lark.

---

## 🚀 Hướng dẫn thiết lập & khởi chạy

### 1. Chuẩn bị ứng dụng trên Lark Developer Console
1. Truy cập [Lark Developer Console](https://open.larksuite.com/app) và tạo một ứng dụng mới (Custom App).
2. Thêm tính năng **Docs Add-on** (hoặc Gadget/Block).
3. Lấy `App ID` và `App Secret` lưu vào biến môi trường.
4. Vào phần `Add Feature`, tìm `Docss add-on`, bấm `Add`.
5. Trong phần cài đặt của `Docs add-on`, copy `BlockTypeID` và lưu vào biến môi trường.

### 2. Thiết lập Biến môi trường
Copy file `.env.example` thành `.env` (tại thư mục gốc) và điền các thông tin của bạn.

> [!IMPORTANT]
> Dự án sử dụng cơ chế **Dynamic Config**. Các giá trị `appID` và `blockTypeID` trong file `.env` sẽ tự động được script `generate-config.js` ghi đè vào cấu hình khi build/upload. Bạn **KHÔNG CẦN** sửa file `frontend/app.json` thủ công.

```bash
# Windows (PowerShell/CMD)
copy .env.example .env

# macOS/Linux/Git Bash
cp .env.example .env
```
*(Tham khảo `.env.example` để biết chi tiết từng trường).*

### 3. Khởi chạy Backend (Proxy AI)
Backend phục vụ request AI và cần chạy ở port `3001`.

```bash
cd backend
npm install
npm run dev
# Server sẽ chạy tại http://localhost:3001
```

### 4. Upload lên Lark Console
Để upload extension trực tiếp từ dòng lệnh lên Lark Developer Console, bạn cần cài đặt Lark SDK (`@lark-opdev/cli`) và đăng nhập.

```bash
# Cài đặt Lark Developer CLI toàn cục (nếu chưa có)
npm install -g @lark-opdev/cli

# Đăng nhập vào Lark
opdev login

# Chuyển vào thư mục frontend và tiến hành upload
cd frontend
npm install
npm run upload

# 💡 Lưu ý: 
# 1. Lệnh upload sẽ yêu cầu bạn nhập Version (ví dụ: 1.1.0) và Description trực tiếp trên terminal.
# 2. Bạn cần đảm bảo đã chạy `opdev login` trước đó.
# 3. Code sẽ được đẩy lên phân đoạn "Thử nghiệm" (Testing) trên Lark Console.
```


---

## 📚 Tài liệu tham khảo thêm

- [Đặc tả sản phẩm (PRD)](./docs/PRODUCT_SPEC.md)
- [Kiến trúc kỹ thuật](./docs/ARCHITECTURE.md)
- [Tài liệu chính thức của Lark Docs Add-on](./docs/Docs%20add%20on%20introduction.md)

---
*Brainy AI - Virtual CTO & Productivity Assistant*
