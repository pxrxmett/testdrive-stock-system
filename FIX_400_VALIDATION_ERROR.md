# แก้ไขปัญหา 400 Bad Request - Field Validation

## ปัญหาที่เจอ

```
Error: Request failed with status code 400
{
  "error": "Bad Request",
  "message": [
    "property vin should not exist",
    "property chassisNumber should not exist",
    "property engineNumber should not exist"
  ],
  "statusCode": 400
}
```

## สาเหตุ

Error นี้เกิดจาก **2 สถานการณ์ที่เป็นไปได้:**

### 1. Frontend ส่ง field `vin` ที่ไม่ได้อยู่ใน spec

API ของเรารองรับ fields เหล่านี้:
- ✅ `chassisNumber` - เลขตัวถัง (อนุญาต)
- ✅ `engineNumber` - เลขเครื่องยนต์ (อนุญาต)
- ❌ `vin` - Vehicle Identification Number (ไม่อนุญาต)

### 2. มี NestJS Backend อื่นรันอยู่ port 3000

ถ้าคุณมี NestJS backend อยู่แล้ว error นี้มาจาก ValidationPipe ของ NestJS

## วิธีแก้ไข

### วิธีที่ 1: ใช้ API Server ของเรา (Express)

1. **หยุด NestJS backend** (ถ้ามี):
   ```bash
   # หา process ที่รันอยู่ port 3000
   lsof -ti:3000 | xargs kill -9
   ```

2. **รัน API Server ของเรา:**
   ```bash
   npm run api
   ```

3. **เช็คว่ารันแล้ว:**
   ```bash
   curl http://localhost:3000/api
   ```

### วิธีที่ 2: แก้ไข Frontend ไม่ให้ส่ง field `vin`

ถ้า frontend ส่ง field `vin` มา ให้ลบออก หรือ map เป็น `chassisNumber`:

```javascript
// ก่อนส่ง request
const updateData = {
  model: data.model,
  variant: data.variant,
  year: data.year,
  color: data.color,
  licensePlate: data.licensePlate,
  chassisNumber: data.chassisNumber, // ไม่ใช่ vin
  engineNumber: data.engineNumber,
  status: data.status,
  // ... อื่นๆ
}

// ห้ามส่ง
delete updateData.vin // ลบ vin ออก
```

### วิธีที่ 3: แก้ไข NestJS DTO (ถ้าใช้ NestJS)

ถ้าคุณใช้ NestJS backend แก้ไขไฟล์ DTO:

```typescript
// update-vehicle.dto.ts
export class UpdateVehicleDto {
  @IsOptional()
  @IsString()
  chassisNumber?: string; // เปลี่ยนจาก vin

  @IsOptional()
  @IsString()
  engineNumber?: string;

  // ... fields อื่นๆ
}
```

## Allowed Fields สำหรับ Vehicle Update

API ของเรารองรับ fields เหล่านี้:

✅ **Allowed:**
- `model` - รุ่นรถ
- `variant` - รุ่นย่อย
- `year` - ปี
- `color` - สี
- `licensePlate` - ทะเบียนรถ
- `chassisNumber` - เลขตัวถัง
- `engineNumber` - เลขเครื่องยนต์
- `status` - สถานะ (available, inService, maintenance, sold, reserved)
- `purchasePrice` - ราคาซื้อ
- `sellingPrice` - ราคาขาย
- `mileage` - เลขไมล์
- `fuelType` - ประเภทเชื้อเพลิง
- `transmission` - ระบบเกียร์
- `batteryCapacity` - ความจุแบตเตอรี่ (สำหรับรถไฟฟ้า)
- `range` - ระยะทางต่อการชาร์จ (สำหรับรถไฟฟ้า)
- `notes` - หมายเหตุ
- `images` - รูปภาพ

❌ **NOT Allowed:**
- `vin` - ใช้ `chassisNumber` แทน
- `id` - ไม่สามารถแก้ไข ID ได้
- `vehicleCode` - ไม่สามารถแก้ไขรหัสรถได้
- `brandCode` - ไม่สามารถเปลี่ยนแบรนด์ได้
- `createdAt` - ระบบจัดการเอง
- `updatedAt` - ระบบจัดการเอง

## ตัวอย่างการ Update ที่ถูกต้อง

### Request:
```bash
curl -X PATCH http://localhost:3000/api/ISUZU/stock/161 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "model": "D-MAX",
    "variant": "Hi-Lander 3.0",
    "year": 2024,
    "color": "White",
    "licensePlate": "กข-1234",
    "chassisNumber": "MRLSK28G0J0000001",
    "engineNumber": "4JJ1-0000001",
    "status": "available",
    "mileage": 1500
  }'
```

### Response (Success):
```json
{
  "success": true,
  "message": "Vehicle updated successfully",
  "data": {
    "id": "161",
    "vehicleCode": "ISZ-161",
    "brandCode": "ISUZU",
    "model": "D-MAX",
    "variant": "Hi-Lander 3.0",
    "year": 2024,
    "color": "White",
    "licensePlate": "กข-1234",
    "chassisNumber": "MRLSK28G0J0000001",
    "engineNumber": "4JJ1-0000001",
    "status": "available",
    "mileage": 1500,
    "updatedAt": "2025-11-23T12:00:00.000Z"
  }
}
```

### Response (Error - Invalid Field):
```json
{
  "error": "The following fields are not allowed: vin. Allowed fields: model, variant, year, color, licensePlate, chassisNumber, engineNumber, status, purchasePrice, sellingPrice, mileage, fuelType, transmission, batteryCapacity, range, notes, images",
  "statusCode": 400
}
```

## Debug Logging

API Server ตอนนี้มี logging สำหรับ debug:

```
📝 Update vehicle request: { id: '161', updates: { ... } }
⚠️ Disallowed fields in request: ['vin']
✅ Vehicle updated successfully: ISZ-161
```

เช็ค console ของ API server เพื่อดูว่า request ที่เข้ามามี fields อะไรบ้าง

## เช็คว่า API Server ไหนรันอยู่

```bash
# เช็ค process ที่รันอยู่ port 3000
lsof -ti:3000

# เช็คว่าเป็น API ไหน
curl http://localhost:3000/api

# ของเรา (Express) จะตอบ:
{
  "name": "Stock Management API",
  "version": "1.0.0",
  "description": "API documentation for Stock Management System",
  "status": "active",
  "timestamp": "..."
}

# ถ้าเป็น NestJS จะตอบอย่างอื่น
```

## สรุป

1. ✅ Pull code ล่าสุด
2. ✅ หยุด backend เก่า (ถ้ามี): `lsof -ti:3000 | xargs kill -9`
3. ✅ รัน API ของเรา: `npm run api`
4. ✅ แก้ไข frontend ไม่ให้ส่ง field `vin`
5. ✅ Test: `curl http://localhost:3000/api/ISUZU/stock/161 -X PATCH ...`
