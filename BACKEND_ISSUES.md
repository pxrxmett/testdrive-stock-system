# 🐛 Backend Issues - ต้องแก้ไข

## ❌ CRITICAL: Vehicle Assignment Foreign Key Error

### ปัญหา
เมื่อพยายาม assign รถยนต์เข้า event ผ่าน endpoint:
```
POST /api/events/{eventId}/vehicles/batch
Body: { "vehicleIds": [138, 139, 140] }
```

จะได้ error:
```
Cannot add or update a child row: a foreign key constraint fails
(`stock_management`.`event_vehicles`, CONSTRAINT `FK_event_vehicles_vehicleId`
FOREIGN KEY (`vehicleId`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE)
```

### สาเหตุ

**Database Schema Mismatch:**

1. Frontend ดึงรถยนต์จาก endpoint `/api/stock/vehicles`
   - Return ข้อมูลจาก table `stock`
   - Vehicle IDs: 138, 139, 140, 141... (integer)

2. Frontend ส่ง vehicle IDs เหล่านี้ไปยัง `/api/events/{id}/vehicles/batch`
   - ตาม Swagger spec ที่ถูกต้อง: `{ "vehicleIds": [1, 2, 3] }`

3. แต่ table `event_vehicles` มี foreign key:
   ```sql
   FOREIGN KEY (`vehicleId`) REFERENCES `vehicles` (`id`)
   ```
   - Foreign key ชี้ไปที่ table `vehicles`
   - แต่ table `vehicles` **ไม่มี** records ที่ id = 138, 139, 140

### วิธีแก้ (เลือก 1 จาก 3 แบบ)

#### Option 1: เปลี่ยน Foreign Key Constraint (แนะนำ)

เปลี่ยน foreign key ให้ชี้ไปที่ table `stock` แทน:

```sql
-- Drop existing constraint
ALTER TABLE event_vehicles
DROP FOREIGN KEY FK_event_vehicles_vehicleId;

-- Add new constraint pointing to stock table
ALTER TABLE event_vehicles
ADD CONSTRAINT FK_event_vehicles_vehicleId
FOREIGN KEY (vehicleId) REFERENCES stock(id) ON DELETE CASCADE;
```

#### Option 2: Sync Data ระหว่าง Tables

สร้างระบบ sync ข้อมูลระหว่าง `stock` และ `vehicles`:

```typescript
// ใน stock.service.ts
async createVehicle(data: CreateVehicleDto) {
  // 1. Create in stock table
  const stockVehicle = await this.stockRepository.save(data);

  // 2. Also create in vehicles table (for events relationship)
  await this.vehiclesRepository.save({
    id: stockVehicle.id,
    // ... copy relevant fields
  });

  return stockVehicle;
}
```

#### Option 3: ใช้ Table เดียว

Merge `vehicles` และ `stock` เป็น table เดียว หรือให้ `vehicles` เป็น alias ของ `stock`

---

## 🔍 ข้อมูลเพิ่มเติม

### Current Database Schema (สันนิษฐาน)

```
Table: stock
- id: INTEGER PRIMARY KEY
- carCard: VARCHAR
- modelCode: VARCHAR
- status: VARCHAR
- ...

Table: vehicles (???)
- id: UUID/INTEGER PRIMARY KEY (?)
- ...

Table: event_vehicles
- eventId: UUID (FK to events.id)
- vehicleId: INTEGER (FK to vehicles.id) ← ปัญหาตรงนี้!
```

### Test Case

```bash
# 1. Get vehicles from stock
curl http://localhost:3000/api/stock/vehicles
# Response: [{ "id": 138, "carCard": "กข-1234", ... }, ...]

# 2. Try to assign to event
curl -X POST http://localhost:3000/api/events/{eventId}/vehicles/batch \
  -H "Content-Type: application/json" \
  -d '{ "vehicleIds": [138] }'

# Result:
# {
#   "success": 0,
#   "failed": 1,
#   "errors": [
#     "Vehicle 138: Cannot add or update a child row: a foreign key constraint fails..."
#   ]
# }
```

---

## ✅ การแก้ไขที่ Frontend ทำไปแล้ว

1. ✅ เพิ่ม error handling ที่ดีขึ้น
2. ✅ แสดง error message ที่ชัดเจนให้ user
3. ✅ Log รายละเอียด error สำหรับ debugging
4. ✅ แจ้งให้ user รู้ว่าต้องติดต่อ admin

---

## 📋 Action Items สำหรับ Backend Developer

- [ ] ตรวจสอบ database schema ของ tables: `stock`, `vehicles`, `event_vehicles`
- [ ] เลือกวิธีแก้ (Option 1, 2, หรือ 3)
- [ ] แก้ไข migration files
- [ ] Run migration บน development database
- [ ] ทดสอบ vehicle assignment
- [ ] แจ้งเมื่อแก้เสร็จเพื่อให้ frontend ทดสอบอีกครั้ง

---

## 📞 Contact

ถ้ามีคำถามหรือต้องการข้อมูลเพิ่มเติม กรุณาติดต่อ Frontend Developer

**Created**: 2025-11-03
**Status**: OPEN - รอ Backend แก้ไข
