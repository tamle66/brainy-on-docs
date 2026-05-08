FROM node:18-alpine

# Cấu hình thư mục làm việc
WORKDIR /app

# Copy các file package để tận dụng Docker cache cho node_modules
COPY package*.json ./

# Cài đặt dependencies (chỉ production)
RUN npm install --production

# Copy toàn bộ mã nguồn backend
COPY . .

# Mở port (trùng với config trong server.js)
EXPOSE 3001

# Lệnh khởi chạy
CMD ["npm", "start"]
