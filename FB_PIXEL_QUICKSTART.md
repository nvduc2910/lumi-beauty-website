# 🚀 Facebook Pixel Quick Start Guide

## Bước Nhanh (5 phút)

### 1. Lấy Thông Tin Cần Thiết

- **Pixel ID**: Vào [Meta Events Manager](https://business.facebook.com/events_manager2) → Copy Pixel ID
- **Access Token**: Vào Meta Business → System Users → Tạo token với quyền `ads_management`, `events_business_management`

### 2. Tạo Cloudflare Worker

1. Đăng nhập [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Workers & Pages → Create Worker
3. Copy code từ `cloudflare-worker.js`
4. Deploy
5. Thêm Environment Variables:
   - `FB_ACCESS_TOKEN` = Access Token của bạn
   - `FB_PIXEL_ID` = Pixel ID của bạn
   - `FB_DATASET_ID` = Dataset ID (nếu có)

### 3. Cấu Hình Website

1. Copy `fb-pixel-config.example.js` → `fb-pixel-config.js`
2. Điền thông tin vào `fb-pixel-config.js`:

   ```javascript
   pixelId: 'YOUR_PIXEL_ID',
   capiEndpoint: 'https://your-worker.workers.dev/api/capi',
   datasetEndpoint: 'https://your-worker.workers.dev/api/dataset',
   ```

3. Thêm vào `<head>` của tất cả HTML files:
   ```html
   <script src="/fb-pixel-config.js"></script>
   <script src="/js/facebook-pixel.js"></script>
   ```

### 4. Test

1. Vào Meta Events Manager → Test Events
2. Copy Test Event Code → Thêm vào config
3. Reload trang → Kiểm tra events

## ✅ Done!

Xem `FB_PIXEL_SETUP.md` để biết chi tiết đầy đủ.
