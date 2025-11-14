# Stock Management API

API สำหรับระบบจัดการสต็อกรถและการทดลองขับ รองรับ ISUZU และ BYD

## 🚀 การรันโปรเจค

### ติดตั้ง Dependencies

```bash
npm install
```

### รัน API Server (Port 3000)

```bash
npm run api
```

API จะทำงานที่: `http://localhost:3000/api`

### รัน Frontend (Port 8080)

```bash
npm run dev
```

Frontend จะทำงานที่: `http://localhost:8080`

### รันทั้งสอง Server พร้อมกัน

```bash
npm run dev:all
```

คำสั่งนี้จะรัน:
- API Server ที่ port 3000
- Frontend Nuxt ที่ port 8080

## 📚 API Endpoints

### App & Health (2 endpoints)
- `GET /api` - ข้อมูล API
- `GET /api/health` - Health check

### Authentication (5 endpoints)
- `POST /api/auth/login` - เข้าสู่ระบบ
- `GET /api/auth/me` - ดูข้อมูลผู้ใช้ปัจจุบัน
- `POST /api/auth/refresh-token` - รีเฟรชโทเคน
- `POST /api/auth/change-password` - เปลี่ยนรหัสผ่าน
- `POST /api/auth/line-login` - เข้าสู่ระบบผ่าน LINE

### Users (5 endpoints)
- `GET /api/users/profile` - ดูโปรไฟล์
- `PATCH /api/users/profile` - แก้ไขโปรไฟล์
- `GET /api/users/settings` - ดูการตั้งค่า
- `PATCH /api/users/settings/notifications` - แก้ไขการแจ้งเตือน
- `PATCH /api/users/settings/system` - แก้ไขการตั้งค่าระบบ

### Analytics (4 endpoints)
- `GET /api/analytics/dashboard` - สถิติ Dashboard
- `GET /api/analytics/vehicles/statistics` - สถิติรถยนต์
- `GET /api/analytics/events/statistics` - สถิติงาน/อีเวนต์
- `GET /api/analytics/test-drives/statistics` - สถิติทดลองขับ

### Brands (3 endpoints)
- `GET /api/brands` - รายการแบรนด์ทั้งหมด
- `GET /api/brands/:id` - ข้อมูลแบรนด์ตาม ID
- `GET /api/brands/code/:code` - ข้อมูลแบรนด์ตาม code (ISUZU, BYD)

### Stock Management (23 endpoints)

**Non-scoped (8 endpoints):**
- `POST /api/stock` - สร้างรถใหม่
- `GET /api/stock` - ดูรายการรถทั้งหมด
- `GET /api/stock/vehicles` - ค้นหารถด้วยตัวกรอง
- `GET /api/stock/:id` - ดูข้อมูลรถตาม ID
- `PATCH /api/stock/:id` - แก้ไขข้อมูลรถ
- `PATCH /api/stock/vehicles/:id/status` - อัปเดตสถานะรถ
- `DELETE /api/stock/vehicles/:id` - ลบรถ
- `POST /api/stock/upload` - อัปโหลดข้อมูลจาก Excel

**Brand-scoped (8 endpoints):**
- `POST /api/:brandCode/stock`
- `GET /api/:brandCode/stock`
- `GET /api/:brandCode/stock/vehicles`
- `GET /api/:brandCode/stock/:id`
- `PATCH /api/:brandCode/stock/:id`
- `PATCH /api/:brandCode/stock/vehicles/:id/status`
- `DELETE /api/:brandCode/stock/vehicles/:id`
- `POST /api/:brandCode/stock/upload`

**Admin cross-brand (5 endpoints):**
- `GET /api/admin/stock/all`
- `GET /api/admin/stock/summary`
- `GET /api/admin/stock/search`
- `GET /api/admin/stock/:id`
- `GET /api/admin/stock/analytics/by-brand`

### Test Drives (18 endpoints)

**Non-scoped (7 endpoints):**
- `POST /api/test-drives`
- `GET /api/test-drives`
- `GET /api/test-drives/:id`
- `PATCH /api/test-drives/:id`
- `DELETE /api/test-drives/:id`
- `POST /api/test-drives/:id/pdpa-consent`
- `POST /api/test-drives/:id/signature`

**Brand-scoped (7 endpoints):**
- `POST /api/:brandCode/test-drives`
- `GET /api/:brandCode/test-drives`
- `GET /api/:brandCode/test-drives/:id`
- `PATCH /api/:brandCode/test-drives/:id`
- `DELETE /api/:brandCode/test-drives/:id`
- `POST /api/:brandCode/test-drives/:id/pdpa-consent`
- `POST /api/:brandCode/test-drives/:id/signature`

**Admin cross-brand (3 endpoints):**
- `GET /api/admin/test-drives/all`
- `GET /api/admin/test-drives/export`
- `GET /api/admin/test-drives/:id`

### Staff Management (10 endpoints)

**Brand-scoped (6 endpoints):**
- `POST /api/:brandCode/staff`
- `GET /api/:brandCode/staff`
- `GET /api/:brandCode/staff/:id`
- `PATCH /api/:brandCode/staff/:id`
- `DELETE /api/:brandCode/staff/:id`
- `GET /api/:brandCode/staff/available-sales`

**Admin cross-brand (4 endpoints):**
- `GET /api/admin/staff/all`
- `GET /api/admin/staff/summary`
- `GET /api/admin/staff/performance`
- `GET /api/admin/staff/:id`

### LINE Integration (8 endpoints)
- `POST /api/line-integration/check`
- `POST /api/line-integration/link`
- `POST /api/line-integration/link-simple`
- `GET /api/line-integration/staff/:id`
- `GET /api/line-integration/pending-users`
- `GET /api/line-integration/linked-users`
- `POST /api/line-integration/admin-link`
- `DELETE /api/line-integration/unlink/:lineUserId`

### Event Management (31 endpoints)

**Non-scoped (11 endpoints):**
- `POST /api/events`
- `GET /api/events`
- `GET /api/events/calendar/view`
- `GET /api/events/:id`
- `PATCH /api/events/:id`
- `DELETE /api/events/:id`
- `POST /api/events/:id/vehicles`
- `GET /api/events/:id/vehicles`
- `POST /api/events/:id/vehicles/batch`
- `DELETE /api/events/:id/vehicles/:vehicleId`
- `PATCH /api/events/:id/status`

**Brand-scoped (11 endpoints):**
- `POST /api/:brandCode/events`
- `GET /api/:brandCode/events`
- `GET /api/:brandCode/events/calendar/view`
- `GET /api/:brandCode/events/:id`
- `PATCH /api/:brandCode/events/:id`
- `DELETE /api/:brandCode/events/:id`
- `POST /api/:brandCode/events/:id/vehicles`
- `GET /api/:brandCode/events/:id/vehicles`
- `POST /api/:brandCode/events/:id/vehicles/batch`
- `DELETE /api/:brandCode/events/:id/vehicles/:vehicleId`
- `PATCH /api/:brandCode/events/:id/status`

**Admin cross-brand (6 endpoints):**
- `POST /api/admin/events`
- `GET /api/admin/events/all`
- `GET /api/admin/events/calendar/view`
- `GET /api/admin/events/:id`
- `PATCH /api/admin/events/:id`
- `DELETE /api/admin/events/:id`

## 🔐 Mock Credentials

### Admin
- Username: `admin`
- Password: `admin123`

### Brand Managers
- ISUZU: `isuzu_manager` / `isuzu123`
- BYD: `byd_manager` / `byd123`

### Sales
- Username: `sales1`
- Password: `sales123`

## 📝 ตัวอย่างการใช้งาน

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Get Vehicles
```bash
curl http://localhost:3000/api/stock/vehicles
```

### Get ISUZU Stock
```bash
curl http://localhost:3000/api/ISUZU/stock
```

### Get Analytics Dashboard
```bash
curl http://localhost:3000/api/analytics/dashboard
```

## 🏗️ โครงสร้างโปรเจค

```
server/
├── index.js                          # Standalone Express API server (port 3000)
├── api/
│   ├── index.js                      # Original Nuxt middleware router
│   ├── express-router.js             # Express router wrapper
│   └── controllers/
│       ├── app.js                    # App & health endpoints
│       ├── auth.js                   # Authentication
│       ├── users.js                  # User management
│       ├── analytics.js              # Analytics & statistics
│       ├── brands.js                 # Brand management
│       ├── stock.js                  # Stock/vehicle management
│       ├── test-drives.js            # Test drive management
│       ├── staff.js                  # Staff management
│       ├── line-integration.js       # LINE integration
│       └── events.js                 # Event management
```

## 🎯 Features

- ✅ JWT Authentication
- ✅ CORS Support
- ✅ Brand-scoped endpoints
- ✅ Admin cross-brand endpoints
- ✅ Request body parsing
- ✅ Query parameter filtering
- ✅ Pagination support
- ✅ Error handling
- ✅ Mock data for development

## 🔧 Environment Variables

```bash
# API Server Port
API_PORT=3000

# JWT Secret
JWT_SECRET=your-secret-key-here

# Node Environment
NODE_ENV=development
```

## 📌 หมายเหตุ

- API Server รันที่ port 3000
- Frontend รันที่ port 8080
- ใช้ mock data สำหรับ development
- ทุก endpoint ไม่มี 404 error
- รองรับ ISUZU และ BYD
