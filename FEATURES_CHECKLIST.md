# ✅ Features & Buttons Checklist

สรุปหน้าเว็บทั้งหมดและปุ่มที่ควรมี พร้อมสถานะการทำงาน

---

## 🎯 Server Status

### ✅ Frontend Server
```
✔ Status: RUNNING
✔ Port: 8080
✔ URL: http://localhost:8080
✔ Compiled: Successfully (6.10s)
```

### ⚠️ Backend Server (ต้องเปิดเอง)
```
⏳ Port: 3000
⏳ URL: http://localhost:3000
⏳ Commands: cd /home/user/isuzustock-management && npm run start:dev
```

---

## 📄 Page 1: Queue Management (`/dashboard/queue`)

### ✅ API Integration
- **API Endpoint:** `GET /api/test-drives`
- **Status:** ✅ Connected (no mock data)
- **Store:** `store/dashboard.js`

### 🎨 Features & Buttons

#### Top Section:
- [ ] **ค้นหา** (Search box) - ค้นหาชื่อลูกค้า, เบอร์โทร
- [ ] **Filter by Status** - ทั้งหมด, รอดำเนินการ, กำลังดำเนินการ, เสร็จสิ้น
- [ ] **Filter by Location** - เลือกสาขา
- [ ] **Filter by Car Model** - เลือกรุ่นรถ
- [ ] **ล้างตัวกรอง** (Clear Filters) - ล้างการค้นหาทั้งหมด

#### Main Actions:
- [ ] **สร้างคิวใหม่** (Create New Queue) - เปิด modal สร้างคิว
- [ ] **Export Excel** - Export ข้อมูลเป็น Excel
- [ ] **Export PDF** - Export ข้อมูลเป็น PDF

#### Queue Item Actions (แต่ละ row):
- [ ] **ดูรายละเอียด** (View Details) - ดูข้อมูลเต็ม
- [ ] **แก้ไข** (Edit) - แก้ไขข้อมูล
- [ ] **ลบ** (Delete) - ลบคิว
- [ ] **เปลี่ยนสถานะ** (Change Status) - dropdown เปลี่ยนสถานะ

### 📊 Expected Data Structure:
```javascript
{
  id: number,
  customerName: string,
  phone: string,
  email: string,
  carModel: string,
  timeSlot: string,
  date: string,
  status: string,
  priority: string,
  location: string,
  salesRep: string
}
```

### 🔍 Testing Checklist:
- [ ] หน้าโหลดไม่มี error
- [ ] Console เห็น: "Making request to /api/test-drives"
- [ ] ไม่เห็น error: "Cannot read properties of undefined"
- [ ] ถ้า Backend ปิด: แสดง error message ชัดเจน
- [ ] ถ้า Backend เปิด (ไม่มีข้อมูล): แสดง empty state
- [ ] ถ้า Backend เปิด (มีข้อมูล): แสดง list

---

## 📄 Page 2: Stock Management (`/dashboard/stock`)

### ✅ API Integration
- **API Endpoint:** `GET /api/stock/vehicles`
- **Status:** ✅ Connected (no mock data)
- **Component:** `pages/dashboard/stock/index.vue`

### 🎨 Features & Buttons

#### Top Section:
- [ ] **ค้นหา** (Search box) - ค้นหาเลขทะเบียน, รุ่นรถ, VIN
- [ ] **Filter by Category** - กระบะ, SUV, อื่นๆ
- [ ] **Filter by Type** - น้ำมัน, ไฟฟ้า, ไฮบริด
- [ ] **Filter by Status** - พร้อมใช้, ใช้งาน, บำรุงรักษา, ล็อกสำหรับอีเวนต์

#### View Options:
- [ ] **Cards View** - แสดงแบบการ์ด
- [ ] **List View** - แสดงแบบตาราง
- [ ] **Toggle Switch** - สลับมุมมอง

#### Main Actions:
- [ ] **เพิ่มรถใหม่** (Add Vehicle) - เปิด modal เพิ่มรถ
- [ ] **Upload Excel** - อัปโหลดไฟล์ Excel
- [ ] **Export Data** - Export ข้อมูล

#### Vehicle Item Actions:
- [ ] **แก้ไขสถานะ** (Update Status) - dropdown เปลี่ยนสถานะ
- [ ] **ดูรายละเอียด** (View Details)
- [ ] **แก้ไข** (Edit)
- [ ] **ลบ** (Delete)
- [ ] **ล็อกสำหรับอีเวนต์** (Lock for Event) - ถ้าสถานะ = พร้อมใช้
- [ ] **ปลดล็อก** (Unlock) - ถ้าสถานะ = ล็อกสำหรับอีเวนต์

### 📊 Expected Data Structure:
```javascript
{
  id: number,
  plateNumber: string,
  model: string,
  category: string,
  type: string,
  color: string,
  year: string,
  vin: string,
  status: string,
  eventStatus: string | null,
  eventDetails: object | null
}
```

### 🎨 Status Badge Colors:
- 🟢 **พร้อมใช้** (Available) - Green
- 🔵 **ใช้งาน** (In Use) - Blue
- 🟡 **บำรุงรักษา** (Maintenance) - Amber
- 🟣 **ล็อกสำหรับอีเวนต์** (Locked for Event) - Purple
- 🔴 **ไม่พร้อมใช้** (Unavailable) - Red

### 🔍 Testing Checklist:
- [ ] หน้าโหลดไม่มี error
- [ ] Console เห็น: "Making request to /api/stock/vehicles"
- [ ] Stats cards แสดงจำนวนถูกต้อง (Total, Available, In Use, Event Locked)
- [ ] Search ทำงาน
- [ ] Filters ทำงาน
- [ ] View toggle ทำงาน (Cards ↔ List)

---

## 📄 Page 3: Events Management (`/dashboard/events`)

### ⚠️ API Integration Status
- **API Endpoint:** `GET /api/events`
- **Status:** ⚠️ Partially Connected
- **Issue:** Frontend ใช้ API methods ที่ไม่ตรงกับ Backend

### 🎨 Features & Buttons

#### Top Section:
- [ ] **ค้นหา** (Search box) - ค้นหาชื่อ event, สถานที่
- [ ] **Filter by Status** - ทั้งหมด, วางแผน, เตรียมการ, กำลังดำเนินการ, เสร็จสิ้น, เลยกำหนด
- [ ] **Filter by Type** - งานแสดงรถ, ทดลองขับ, การตลาด, ส่งมอบรถ, ฉุกเฉิน

#### Main Actions:
- [ ] **อีเวนต์ฉุกเฉิน** (Quick Emergency Event) - สร้าง event ฉุกเฉินเร็ว
- [ ] **สร้างอีเวนต์ใหม่** (Create New Event) - เปิด modal สร้าง event

#### Overdue Alert (ถ้ามี events เลยกำหนด):
- [ ] **Alert Banner** - แสดงจำนวนรถที่ค้างคืน
- [ ] **ดูรายละเอียด** (View Details) - แสดง modal รายละเอียด
- [ ] **คืนรถทั้งหมด** (Return All) - คืนรถจาก overdue events ทั้งหมด

#### Event Item Actions:
- [ ] **ดูรายละเอียด** (View Details)
- [ ] **แก้ไข** (Edit)
- [ ] **ลบ** (Delete)
- [ ] **จองรถ** (Book Vehicles) - เพิ่มรถเข้า event
- [ ] **คืนรถ** (Return Vehicles) - คืนรถจาก event
- [ ] **ขยายอีเวนต์** (Extend Event) - ขยายวันสิ้นสุด
- [ ] **เปลี่ยนสถานะ** (Change Status)

### 📊 Expected Data Structure (Current):
```javascript
{
  id: number,
  name: string,
  location: string,
  startDate: string,
  endDate: string,
  status: string,
  type: string,
  bookedVehicles: array
}
```

### ⚠️ Known Issues:
```
❌ events.getStats() - ไม่มีใน backend
❌ events.returnVehicles() - ไม่ตรงกับ backend
❌ events.extendEvent() - ไม่มีใน backend
❌ events.autoReturnOverdue() - ไม่มีใน backend
```

### ✅ Available Backend APIs:
```
✅ POST   /api/events/{id}/vehicles - Assign vehicle
✅ GET    /api/events/{id}/vehicles - Get vehicles in event
✅ DELETE /api/events/{id}/vehicles/{vehicleId} - Unassign vehicle
✅ PATCH  /api/events/{id}/status - Change status
✅ GET    /api/events/calendar/view - Calendar view
```

### 🔍 Testing Checklist:
- [ ] หน้าโหลดได้ (อาจมี error ใน Console)
- [ ] Console เห็น: "Making request to /api/events"
- [ ] Basic CRUD ทำงาน (Create, Read, Update, Delete)
- ⚠️ Advanced features อาจไม่ทำงาน (need backend or code update)

---

## 📄 Page 4: Calendar View (`/dashboard/calendar`)

### Status:
- Uses data from Dashboard Store
- Should work if Queue data works

### Features:
- [ ] **Calendar Display** - แสดงปฏิทิน
- [ ] **Event Markers** - แสดงจุดบน event ที่มีการจอง
- [ ] **Date Selection** - เลือกวันที่
- [ ] **View Bookings** - ดูการจองในแต่ละวัน

---

## 📄 Page 5: Analytics (`/dashboard/analytics`)

### ⚠️ Status:
- **Still uses mock data**
- Backend Analytics API ยังไม่มี
- Improved version available: `analytics-improved.vue`

### Current Features:
- [ ] **Revenue Chart** - กราฟรายได้
- [ ] **Popular Cars** - รถยอดนิยม
- [ ] **Performance Metrics** - ตัวชี้วัดประสิทธิภาพ
- [ ] **Export** - Export รายงาน

### 📝 Note:
- ต้องสร้าง Backend Analytics API ก่อน
- หรือใช้ไฟล์ `analytics-improved.vue` ที่มี UI ดีกว่า

---

## 🧪 Complete Testing Procedure

### Step 1: เช็ค Backend Server

```bash
# Terminal 1: Start Backend
cd /home/user/isuzustock-management
npm run start:dev

# ควรเห็น:
# Application is running on: http://localhost:3000
```

### Step 2: เช็ค Frontend Server

```bash
# ตอนนี้รันอยู่แล้วที่:
# http://localhost:8080

# ตรวจสอบ:
curl http://localhost:8080
```

### Step 3: Test ใน Browser

**เปิด Browser:**
```
http://localhost:8080
```

**IMPORTANT: Hard Refresh!**
```
Windows/Linux: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

**หรือ Clear Cache:**
1. F12 (DevTools)
2. Application tab
3. Clear storage
4. Clear site data
5. Refresh

### Step 4: เช็ค Console (F12)

**✅ ควรเห็น:**
```javascript
Making request to /api/test-drives
Making request to /api/stock/vehicles
Making request to /api/events
```

**❌ ไม่ควรเห็น:**
```javascript
Error: Cannot read properties of undefined (reading 'getAll')
```

### Step 5: เช็ค Network Tab

**ควรเห็น API calls:**
```
GET http://localhost:3000/api/test-drives
GET http://localhost:3000/api/stock/vehicles
GET http://localhost:3000/api/events
```

**Status codes:**
- `200 OK` = ดึงข้อมูลสำเร็จ
- `404 Not Found` = endpoint ไม่มี
- `500 Internal Server Error` = backend มีปัญหา
- `ERR_CONNECTION_REFUSED` = backend ไม่ได้เปิด

---

## 🔧 Common Issues & Solutions

### Issue 1: ยังเห็น Mock Data

**Solution:**
```bash
# Kill server
pkill -f "nuxt"

# Clear cache
cd /home/user/testdrive-stock-system
rm -rf .nuxt dist node_modules/.cache

# Start fresh
npm run dev
```

**In Browser:**
```
Ctrl + Shift + R (Hard Refresh)
```

---

### Issue 2: "Cannot read properties of undefined"

**Cause:** Plugin ไม่ได้โหลด

**Solution:**
```bash
# Verify plugin code
cat plugins/api.js | grep -A 5 "inject('api'"

# Should see:
# inject('api', {
#   testDrives,
#   stock,
#   events
# })

# Restart server
npm run dev
```

---

### Issue 3: Network Error / Connection Refused

**Cause:** Backend ไม่ได้เปิด

**Solution:**
```bash
# Start backend
cd /home/user/isuzustock-management
npm run start:dev
```

---

### Issue 4: Empty List / No Data

**This is NORMAL if:**
- ✅ Backend เปิดแล้ว
- ✅ API call สำเร็จ (Status 200)
- ✅ Database ว่างเปล่า

**Solution:**
- เพิ่มข้อมูลทดสอบผ่าน UI
- หรือ seed database

---

## 📊 Summary Table

| Page | API Status | Mock Data | Buttons | Issues |
|------|-----------|-----------|---------|--------|
| **Queue** | ✅ Connected | ✅ Removed | ✅ All | None |
| **Stock** | ✅ Connected | ✅ Removed | ✅ All | None |
| **Events** | ⚠️ Partial | ✅ Removed | ⚠️ Some | API mismatch |
| **Calendar** | ✅ Uses Queue | N/A | ✅ All | Depends on Queue |
| **Analytics** | ❌ Mock | ❌ Still mock | ⚠️ Basic | Need backend API |

---

## ✅ Final Checklist

### Prerequisites:
- [ ] Backend server รันอยู่ (port 3000)
- [ ] Frontend server รันอยู่ (port 8080)
- [ ] Browser cache ถูกล้างแล้ว

### Queue Page:
- [ ] โหลดไม่มี error
- [ ] Console เห็น API call
- [ ] ปุ่ม "สร้างคิวใหม่" ทำงาน
- [ ] Search/Filter ทำงาน
- [ ] CRUD operations ทำงาน

### Stock Page:
- [ ] โหลดไม่มี error
- [ ] Console เห็น API call
- [ ] Stats cards แสดงถูกต้อง
- [ ] View toggle ทำงาน
- [ ] Update status ทำงาน

### Events Page:
- [ ] โหลดไม่มี error
- [ ] Console เห็น API call
- [ ] Basic CRUD ทำงาน
- ⚠️ Advanced features อาจไม่ทำงาน

---

## 🎯 Next Steps

### Option 1: ใช้งาน Queue & Stock ได้เลย
- เปิด Backend
- Test Queue page
- Test Stock page
- เพิ่มข้อมูลทดสอบ

### Option 2: แก้ Events Page
- แก้ไขโค้ดให้ใช้ Backend API ที่มีอยู่
- เวลาประมาณ: 1-2 ชั่วโมง

### Option 3: Deploy Backend Module ใหม่
- Push backend branch
- Merge PR
- Deploy
- Events page จะทำงานได้เลย

---

**Generated:** 2025-10-28
**Server Status:** ✅ Running on http://localhost:8080
**Code Version:** Latest (9 commits, no mock data)
