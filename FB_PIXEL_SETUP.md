# Hướng Dẫn Triển Khai Facebook Pixel + Conversions API + Meta Dataset

## 📋 Tổng Quan

Hệ thống tracking này bao gồm:

- **Facebook Pixel** (client-side): Track các sự kiện trên trình duyệt
- **Conversions API** (server-side): Gửi sự kiện từ server để tăng độ chính xác
- **Meta Dataset**: Lưu trữ dữ liệu tùy chỉnh cho phân tích nâng cao

## 🎯 Các Events Được Track

### Client-Side Events (Pixel)

- ✅ `page_view` - Tự động khi load trang
- ✅ `view_content` - Khi xem trang dịch vụ
- ✅ `scroll_depth` - Khi scroll 50%, 70%
- ✅ `engaged_view` - Khi ở trang >20-30 giây
- ✅ `click_hotline` - Click vào số điện thoại
- ✅ `click_zalo` - Click vào link Zalo
- ✅ `click_messenger` - Click vào Messenger
- ✅ `click_booking` - Click vào nút đặt lịch
- ✅ `click_price` - Click vào giá dịch vụ

### Server-Side Events (CAPI)

- ✅ `view_service_page` - Xem trang dịch vụ
- ✅ `read_blog` - Đọc blog (mỗi 30 giây)
- ✅ `scroll_depth` - Độ scroll (50%, 70%)
- ✅ `engaged_view` - Thời gian ở trang
- ✅ `returning_user` - Người dùng quay lại
- ✅ `click_hotline` - Click hotline
- ✅ `click_zalo` - Click Zalo
- ✅ `click_price` - Click giá
- ✅ `conversion_intent` - Ý định chuyển đổi (returning_user > 2)
- ✅ `lead_submit` - Gửi form

### Dataset Events

- ✅ `high_quality_read` - Đọc blog chất lượng cao
- ✅ `service_view_intent` - Xem dịch vụ có ý định
- ✅ `price_viewer` - Xem giá
- ✅ `contact_click` - Click liên hệ
- ✅ `returning_user` - Người dùng quay lại
- ✅ `pre_lead_intent` - Ý định lead trước khi submit

---

## 🚀 Bước 1: Chuẩn Bị Facebook Pixel & Access Token

### 1.1. Lấy Facebook Pixel ID

1. Vào [Meta Events Manager](https://business.facebook.com/events_manager2)
2. Chọn Pixel của bạn (hoặc tạo mới)
3. Copy **Pixel ID** (ví dụ: `123456789012345`)

### 1.2. Tạo Access Token

1. Vào [Meta Business Settings](https://business.facebook.com/settings)
2. Chọn **System Users** > Tạo System User mới
3. Cấp quyền:
   - `ads_management`
   - `business_management`
4. Tạo **Access Token** với các quyền:
   - `ads_management`
   - `business_management`
   - `events_business_management`
5. Copy Access Token (bắt đầu bằng `EAA...`)

⚠️ **Lưu ý**: Access Token có thể hết hạn. Sử dụng **Long-lived Token** hoặc **System User Token**.

### 1.3. Tạo Meta Dataset (Optional)

1. Vào Meta Business > **Data Sources** > **Datasets**
2. Tạo Dataset mới
3. Copy **Dataset ID**

---

## ☁️ Bước 2: Setup Cloudflare Worker

### 2.1. Tạo Cloudflare Worker

1. Đăng nhập [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Vào **Workers & Pages** > **Create application**
3. Chọn **Create Worker**
4. Đặt tên worker (ví dụ: `fb-pixel-capi`)
5. Copy code từ file `cloudflare-worker.js` vào editor
6. Click **Deploy**

### 2.2. Cấu Hình Environment Variables

Trong Cloudflare Worker dashboard:

1. Vào **Settings** > **Variables**
2. Thêm các biến môi trường:

```
FB_ACCESS_TOKEN = EAA... (Access Token của bạn)
FB_PIXEL_ID = 123456789012345 (Pixel ID của bạn)
FB_DATASET_ID = your_dataset_id (Nếu có)
```

### 2.3. Lấy Worker URL

Sau khi deploy, bạn sẽ có URL dạng:

```
https://fb-pixel-capi.your-subdomain.workers.dev
```

Lưu URL này để dùng trong bước tiếp theo.

---

## 📝 Bước 3: Cấu Hình Website

### 3.1. Tạo File Config

1. Copy file `fb-pixel-config.example.js` thành `fb-pixel-config.js`
2. Mở `fb-pixel-config.js` và điền thông tin:

```javascript
window.FB_PIXEL_CONFIG = {
  pixelId: "123456789012345", // Pixel ID của bạn
  capiEndpoint: "https://fb-pixel-capi.your-subdomain.workers.dev/api/capi",
  datasetEndpoint:
    "https://fb-pixel-capi.your-subdomain.workers.dev/api/dataset",
  accessToken: "EAA...", // Access Token (hoặc để trống nếu dùng env var)
  datasetId: "your_dataset_id", // Nếu có
  testEventCode: "", // Để test trong Meta Event Manager
  debug: false,
};
```

### 3.2. Thêm Script Vào HTML

Thêm vào `<head>` của tất cả các trang HTML (hoặc vào file header component):

```html
<!-- Facebook Pixel Config -->
<script src="/fb-pixel-config.js"></script>

<!-- Facebook Pixel Script -->
<script
  src="/js/facebook-pixel.js"
  data-fb-pixel
  data-pixel-id="YOUR_PIXEL_ID"
  data-capi-endpoint="https://your-worker.workers.dev/api/capi"
  data-dataset-endpoint="https://your-worker.workers.dev/api/dataset"
  data-access-token="YOUR_ACCESS_TOKEN"
  data-dataset-id="YOUR_DATASET_ID"
></script>
```

**Hoặc** nếu bạn đã load `fb-pixel-config.js`, script sẽ tự động đọc config từ `window.FB_PIXEL_CONFIG`.

### 3.3. Thêm Vào Tất Cả Các Trang

Thêm script vào:

- `index.html`
- `vi/index.html`, `en/index.html`, `ko/index.html`
- Tất cả các trang trong `vi/blogs/`, `en/blogs/`, `ko/blogs/`
- Tất cả các trang trong `vi/services/`, `en/services/`, `ko/services/`
- Các trang khác: `contact.html`, `gallery.html`, `feedback.html`

**Hoặc** nếu bạn có file header component (`components/header-vi.html`, etc.), thêm vào đó.

---

## 🧪 Bước 4: Test Events

### 4.1. Test Trong Meta Event Manager

1. Vào [Meta Events Manager](https://business.facebook.com/events_manager2)
2. Chọn Pixel của bạn
3. Vào tab **Test Events**
4. Copy **Test Event Code**
5. Thêm vào config:

```javascript
testEventCode: 'TEST12345',
```

6. Reload trang và thực hiện các hành động (click, scroll, etc.)
7. Kiểm tra events trong **Test Events** tab

### 4.2. Test Browser Console

Mở Console (F12) và kiểm tra:

- Không có lỗi
- Events được gửi (nếu `debug: true`)

### 4.3. Test Cloudflare Worker

1. Vào Cloudflare Dashboard > Workers
2. Chọn worker của bạn
3. Vào tab **Logs**
4. Reload trang và kiểm tra logs

---

## 📊 Bước 5: Track Form Submissions

Nếu bạn có form liên hệ, thêm tracking khi submit:

```javascript
// Trong code xử lý form submit
document.querySelector("form").addEventListener("submit", function (e) {
  // ... xử lý form ...

  // Track lead submit
  if (window.trackFBLeadSubmit) {
    window.trackFBLeadSubmit({
      form_type: "contact",
      service_interest: "khử thâm môi", // Tùy chỉnh
    });
  }
});
```

---

## 🔒 Bước 6: Bảo Mật

### 6.1. Thêm vào .gitignore

Thêm vào `.gitignore`:

```
fb-pixel-config.js
```

⚠️ **KHÔNG** commit file config chứa Access Token vào Git!

### 6.2. Sử Dụng Environment Variables

Tốt nhất là lưu Access Token trong Cloudflare Worker Environment Variables, không gửi từ client-side.

Để làm điều này:

1. Xóa `accessToken` khỏi `fb-pixel-config.js`
2. Cloudflare Worker sẽ tự động dùng `env.FB_ACCESS_TOKEN`

---

## 📈 Bước 7: Verify Events

### 7.1. Meta Events Manager

1. Vào **Events Manager** > **Test Events**
2. Kiểm tra các events:
   - `PageView`
   - `ViewContent`
   - `ScrollDepth`
   - `EngagedView`
   - `click_hotline`, `click_zalo`, etc.

### 7.2. Meta Dataset

1. Vào **Data Sources** > **Datasets**
2. Chọn dataset của bạn
3. Kiểm tra data đã được gửi

---

## 🐛 Troubleshooting

### Events không xuất hiện trong Meta Events Manager

1. ✅ Kiểm tra Pixel ID đúng chưa
2. ✅ Kiểm tra Access Token còn hạn không
3. ✅ Kiểm tra CORS trong Cloudflare Worker
4. ✅ Kiểm tra Console có lỗi không
5. ✅ Kiểm tra Cloudflare Worker Logs

### CAPI events không được gửi

1. ✅ Kiểm tra Worker URL đúng chưa
2. ✅ Kiểm tra Environment Variables trong Cloudflare
3. ✅ Kiểm tra Network tab trong DevTools (request có thành công không)

### Dataset không nhận data

1. ✅ Kiểm tra Dataset ID đúng chưa
2. ✅ Kiểm tra API endpoint của Meta Dataset (có thể khác với code mẫu)
3. ✅ Kiểm tra quyền của Access Token

---

## 📚 Tài Liệu Tham Khảo

- [Facebook Pixel Documentation](https://developers.facebook.com/docs/meta-pixel)
- [Conversions API Documentation](https://developers.facebook.com/docs/marketing-api/conversions-api)
- [Meta Dataset API](https://developers.facebook.com/docs/marketing-api/datasets)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)

---

## ✅ Checklist Triển Khai

- [ ] Lấy Facebook Pixel ID
- [ ] Tạo Access Token
- [ ] Tạo Cloudflare Worker
- [ ] Cấu hình Environment Variables
- [ ] Tạo file `fb-pixel-config.js`
- [ ] Thêm script vào tất cả các trang HTML
- [ ] Test events trong Meta Event Manager
- [ ] Verify events đang được track
- [ ] Thêm `.gitignore` cho config file
- [ ] Deploy lên GitHub Pages

---

## 🎉 Hoàn Thành!

Sau khi hoàn thành các bước trên, website của bạn đã được tích hợp đầy đủ Facebook Pixel + Conversions API + Meta Dataset!

Nếu có vấn đề, hãy kiểm tra:

1. Browser Console
2. Cloudflare Worker Logs
3. Meta Events Manager Test Events
