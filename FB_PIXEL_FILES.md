# 📁 Danh Sách Files Facebook Pixel Integration

## Files Đã Tạo

### 1. Core Files (Bắt Buộc)

#### `js/facebook-pixel.js`

- **Mô tả**: File JavaScript chính cho client-side tracking
- **Chức năng**:
  - Load Facebook Pixel
  - Track các events (scroll, click, view, etc.)
  - Gửi events đến Conversions API
  - Gửi data đến Meta Dataset
- **Sử dụng**: Thêm vào `<head>` của tất cả HTML pages

#### `cloudflare-worker.js`

- **Mô tả**: Cloudflare Worker script cho server-side Conversions API
- **Chức năng**:
  - Nhận events từ client
  - Gửi đến Facebook Conversions API
  - Hash PII (email, phone) để bảo mật
  - Xử lý Meta Dataset API
- **Sử dụng**: Copy vào Cloudflare Worker dashboard và deploy

### 2. Configuration Files

#### `fb-pixel-config.example.js`

- **Mô tả**: File mẫu cấu hình
- **Sử dụng**: Copy thành `fb-pixel-config.js` và điền thông tin thực tế

#### `fb-pixel-config.js` (Tạo sau khi copy từ example)

- **Mô tả**: File config thực tế chứa Pixel ID, Access Token, etc.
- **⚠️ LƯU Ý**: File này chứa sensitive data, KHÔNG commit vào Git!
- **Đã được thêm vào `.gitignore`**

### 3. Documentation Files

#### `FB_PIXEL_SETUP.md`

- **Mô tả**: Hướng dẫn chi tiết đầy đủ từng bước
- **Nội dung**:
  - Setup Facebook Pixel
  - Setup Cloudflare Worker
  - Cấu hình website
  - Test và verify
  - Troubleshooting

#### `FB_PIXEL_QUICKSTART.md`

- **Mô tả**: Hướng dẫn nhanh 5 phút
- **Sử dụng**: Cho người muốn setup nhanh

#### `FB_PIXEL_FILES.md` (File này)

- **Mô tả**: Tổng hợp danh sách files và mục đích

#### `fb-pixel-integration-example.html`

- **Mô tả**: Ví dụ code HTML để tích hợp
- **Sử dụng**: Tham khảo cách thêm script vào HTML

### 4. Security Files

#### `.gitignore`

- **Mô tả**: Bảo vệ file config khỏi commit vào Git
- **Đã thêm**: `fb-pixel-config.js`

---

## 📋 Checklist Sử Dụng

### Bước 1: Setup Cloudflare Worker

- [ ] Copy code từ `cloudflare-worker.js`
- [ ] Tạo Worker mới trên Cloudflare
- [ ] Thêm Environment Variables
- [ ] Deploy và lấy URL

### Bước 2: Cấu Hình Website

- [ ] Copy `fb-pixel-config.example.js` → `fb-pixel-config.js`
- [ ] Điền thông tin vào `fb-pixel-config.js`
- [ ] Thêm script vào HTML (xem `fb-pixel-integration-example.html`)

### Bước 3: Test

- [ ] Test trong Meta Events Manager
- [ ] Kiểm tra Cloudflare Worker Logs
- [ ] Verify events đang được track

---

## 🔗 Liên Kết Nhanh

- **Hướng dẫn chi tiết**: `FB_PIXEL_SETUP.md`
- **Hướng dẫn nhanh**: `FB_PIXEL_QUICKSTART.md`
- **Ví dụ tích hợp**: `fb-pixel-integration-example.html`

---

## 📞 Support

Nếu gặp vấn đề:

1. Kiểm tra Browser Console (F12)
2. Kiểm tra Cloudflare Worker Logs
3. Kiểm tra Meta Events Manager → Test Events
4. Xem phần Troubleshooting trong `FB_PIXEL_SETUP.md`
