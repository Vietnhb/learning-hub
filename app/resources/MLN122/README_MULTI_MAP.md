# 🗺️ Multi-Map Farming System

## ✨ Tính năng mới

### **Chuyển đổi giữa 7 loại trang trại từ Stardew Valley**

Giờ bạn có thể chọn và xem workers tự động farming trên bất kỳ map nào!

## 🎮 Cách sử dụng

1. Vào game MLN122 → màn hình **"Farming"**
2. Click vào **dropdown map selector** ở đầu màn hình
3. Chọn 1 trong 7 loại farm:
   - 🌾 **Trang trại Tiêu chuẩn** (Đề xuất) - Diện tích lớn nhất
   - ⛰️ **Trang trại Đồi núi** - Có quặng để khai thác
   - 🎣 **Trang trại Ven sông** - Nhiều chỗ câu cá
   - 🌲 **Trang trại Rừng** - Cây cối và hái lượm
   - ⚔️ **Trang trại Hoang dã** - Quái vật xuất hiện
   - ✨ **Trang trại Bốn góc** - 4 khu vực riêng biệt
   - 🐄 **Trang trại Bãi biển** - Phù hợp chăn nuôi

4. Workers sẽ **tự động**:
   - 🔨 Cày đất
   - 🌱 Gieo hạt
   - 🌾 Chờ cây lớn
   - ✂️ Thu hoạch
   - 🔄 Lặp lại chu kỳ

## 📊 Thông tin kỹ thuật

### Assets từ game gốc
- ✅ Extracted 3,550 files từ Stardew Valley
- ✅ Sử dụng sprites thật: đất cày, cây trồng, buildings
- ✅ 7 TMX map files từ game

### Hiệu suất
- 60 FPS mượt mà
- 6 workers + 80 tiles
- Animation tự động không lag

### Code
- TypeScript + React hooks
- Fully typed, no `any`
- Performance optimized

## 📁 Files tạo mới

```
farm-maps-config.ts         → Cấu hình 7 farm types
farm-map-selector.tsx       → UI component chọn map
multi-map-farming.tsx       → Logic automated farming
page.tsx                    → Updated để dùng multi-map
```

## 🎯 Demo

Xem trực tiếp tại: **MLN122 → Farming Screen**

---

💡 **Tip:** Map "Tiêu chuẩn" có diện tích trồng trọt lớn nhất, phù hợp để xem workers làm việc!
