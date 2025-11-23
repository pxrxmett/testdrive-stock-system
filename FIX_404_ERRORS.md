# วิธีแก้ไขปัญหา 404 Errors

## ปัญหาที่พบ

Frontend เรียก API endpoints เหล่านี้แล้วได้ 404:
- ❌ `GET /api/admin/test-drives/all`
- ❌ `GET /api/admin/events/all`
- ❌ `GET /api/admin/staff/all`
- ❌ `GET /api/line-users/pending`
- ❌ `GET /api/staff`

## สาเหตุ

**API Server ไม่ได้รันอยู่ที่ port 3000**

## วิธีแก้ไข

### 1. รัน API Server

เปิด terminal แล้วรันคำสั่ง:

```bash
# รัน API server อย่างเดียว
npm run api
```

หรือ

```bash
# รันทั้ง API + Frontend พร้อมกัน
npm run dev:all
```

### 2. เช็คว่า API รันแล้ว

เปิดเบราว์เซอร์ไปที่:
- http://localhost:3000/api - ควรเห็น API info
- http://localhost:3000/api/health - ควรเห็น health check

หรือใช้ curl:

```bash
curl http://localhost:3000/api
curl http://localhost:3000/api/health
```

### 3. Test Endpoints ที่มีปัญหา

```bash
# Test admin endpoints
curl http://localhost:3000/api/admin/test-drives/all
curl http://localhost:3000/api/admin/events/all
curl http://localhost:3000/api/admin/staff/all

# Test legacy endpoints
curl http://localhost:3000/api/line-users/pending
curl http://localhost:3000/api/staff
```

## สิ่งที่แก้ไขแล้ว

✅ เพิ่ม legacy endpoints ใน `server/api/express-router.js`:
- `/api/line-users/pending` → maps to `/api/line-integration/pending-users`
- `/api/line-users/linked` → maps to `/api/line-integration/linked-users`
- `/api/staff` → maps to `/api/admin/staff/all`
- `/api/line-users/:id/link` → maps to admin link
- `/api/line-users/:id/unlink` → maps to unlink

## โครงสร้างการรัน

```
Port 3000: API Server (Express)
Port 8080: Frontend (Nuxt)
```

**สำคัญ:** ต้องรัน API server ที่ port 3000 ก่อน frontend ถึงจะทำงานได้

## คำสั่งที่ใช้

| คำสั่ง | ทำอะไร |
|--------|--------|
| `npm run api` | รัน API server ที่ port 3000 |
| `npm run dev` | รัน Frontend ที่ port 8080 |
| `npm run dev:all` | รันทั้งสองพร้อมกัน |

## การทดสอบ

หลังจากรัน `npm run api` หรือ `npm run dev:all` แล้ว:

1. เปิด http://localhost:8080 (Frontend)
2. Login ด้วย admin/admin123
3. ไปที่หน้า Calendar, Events, Admin Staff, LINE Users
4. ควรไม่เห็น 404 errors ในคอนโซล

## Troubleshooting

### ถ้ายังเจอ 404:

1. **เช็คว่า API รันอยู่ไหม:**
   ```bash
   lsof -ti:3000
   ```
   ถ้ามีเลขออกมา แปลว่ารันอยู่

2. **Kill process ที่ค้างแล้วรันใหม่:**
   ```bash
   lsof -ti:3000 | xargs kill -9
   npm run api
   ```

3. **เช็ค console logs:**
   - ดู terminal ที่รัน `npm run api`
   - ดู browser console (F12)

### ถ้า jsonwebtoken error:

```bash
npm install
```

## ที่อยู่ Endpoints

**API Base URL:** `http://localhost:3000/api`

**ตัวอย่าง:**
- Health check: `http://localhost:3000/api/health`
- Brands: `http://localhost:3000/api/brands`
- Stock: `http://localhost:3000/api/stock/vehicles`
- Test drives: `http://localhost:3000/api/admin/test-drives/all`
- Events: `http://localhost:3000/api/admin/events/all`
- Staff: `http://localhost:3000/api/admin/staff/all`
