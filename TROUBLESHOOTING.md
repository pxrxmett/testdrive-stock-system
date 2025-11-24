# Troubleshooting Guide - Admin Dashboard Issues

## ปัญหาที่พบและแก้ไข

### 1. Backend API Server ไม่ได้รัน (Fixed ✅)

**อาการ:**
- Console แสดง error 404 สำหรับ API endpoints
- ไม่สามารถดึงข้อมูลจากฐานข้อมูลได้

**สาเหตุ:**
- Express server ไม่ได้เริ่มต้น
- Dependencies ไม่ได้ install

**วิธีแก้:**
```bash
# Install dependencies
npm install

# Start backend API server
npm run api
```

### 2. JavaScript `this` Binding Issue (Fixed ✅)

**อาการ:**
- Controller functions ไม่ทำงาน
- Internal function calls (เช่น `this.getAll()`) ไม่สามารถเรียกได้

**สาเหตุ:**
- เมื่อ pass controller methods ไปที่ Express router, `this` context หายไป
- JavaScript ไม่ auto-bind `this` เมื่อ pass functions

**วิธีแก้:**
```javascript
// Before (ไม่ทำงาน)
router.get('/admin/test-drives/all', wrap(testDrivesController.adminGetAll))

// After (ทำงาน)
router.get('/admin/test-drives/all', wrap(testDrivesController.adminGetAll.bind(testDrivesController)))
```

### 3. Express Route Matching Order Issue (Partial Fix ⚠️)

**อาการ:**
- `/api/admin/test-drives/all` ให้ error 404 "Test drive not found"
- Admin endpoints อื่นๆ ก็มีปัญหาเหมือนกัน

**สาเหตุ:**
- Express จับคู่ routes ตามลำดับจากบนลงล่าง
- Brand-scoped routes (`/:brandCode/test-drives/:id`) อยู่ก่อน admin routes
- Express คิดว่า `"admin"` คือ `brandCode` parameter

**วิธีแก้ (ยังไม่สมบูรณ์):**
ต้องเปลี่ยนลำดับ routes ใน `server/api/express-router.js`:
1. วาง **ADMIN routes** ไว้ก่อน
2. วาง **Brand-scoped routes** (`/:brandCode/*`) ไว้หลัง

หรือเปลี่ยน URL structure เป็น `/brands/:brandCode/*` แทน `/:brandCode/*`

### 4. User Authentication State Issue (Not Fixed ❌)

**อาการ:**
- Console แสดง: `👤 Current user: null`
- ไม่สามารถสร้าง events ได้เพราะไม่มี user ID

**สาเหตุ:**
- Vuex store ไม่มี user data
- Authentication state ไม่ถูก persist หรือ restore

**วิธีแก้ (ต้องตรวจสอบ):**
1. ตรวจสอบว่า login flow ทำงานถูกต้องหรือไม่
2. ตรวจสอบว่า auth token ถูก store และ restore จาก cookies
3. ตรวจสอบว่า `/api/auth/me` endpoint ทำงานและ return user data

## การเริ่มต้นระบบ

### Development Mode

```bash
# Terminal 1: Start Backend API (port 3000)
npm run api

# Terminal 2: Start Frontend (port 8080)
npm run dev
```

### Production Mode

```bash
# Build frontend
npm run build

# Start production server
npm start
```

## Endpoints ที่มีปัญหา

### 401 Unauthorized
- `/api/line-integration/pending-users` - ต้องการ authentication

### 404 Not Found (ต้องแก้ route order)
- `/api/admin/test-drives/all`
- `/api/admin/events/all`
- `/api/admin/stock/all`
- `/api/admin/staff/all`

## การแก้ไขต่อไป

1. **แก้ Route Matching Order** - เปลี่ยนลำดับใน express-router.js
2. **แก้ User State** - ตรวจสอบ authentication flow
3. **เพิ่ม Authentication Middleware** - ให้ admin endpoints ต้อง login
4. **แก้ Pending Users 401 Error** - เพิ่ม auth token หรือทำเป็น public endpoint

## Files ที่แก้ไข

- `server/api/express-router.js` - เพิ่ม `.bind()` และ middleware guard
- `server/api/controllers/test-drives.js` - เพิ่ม debug logging

## สำหรับ Developer

หากต้องการ debug routes:
```javascript
// ดู request logs
console.log(`📥 ${req.method} ${req.originalUrl}`)

// ดู route matching
console.log('🟢 MATCHED:', route_path, req.params)
```
