# 🔧 Backend Fixes Required - ISUZU Stock Management System

> **สำหรับ Backend Developer**: นี่คือรายการปัญหาที่ต้องแก้ไขใน Backend API ทั้งหมด
> จัดลำดับตาม Priority: CRITICAL → HIGH → MEDIUM → LOW

---

## 📌 Table of Contents
1. [🚨 CRITICAL Issues](#-critical-issues)
2. [⚠️ HIGH Priority](#️-high-priority)
3. [📋 MEDIUM Priority](#-medium-priority)
4. [ℹ️ LOW Priority](#️-low-priority)
5. [📊 Summary & Action Items](#-summary--action-items)

---

## 🚨 CRITICAL Issues

### ❌ CRITICAL #1: Field Naming Inconsistency (snake_case vs camelCase)

**ปัญหา:** API responses มีการใช้ทั้ง `snake_case` และ `camelCase` ปนกันในหลายจุด

**Examples:**

**Stock API (`GET /api/stock/vehicles`):**
```json
{
  "id": 138,
  "carCard": "คก-2366",           // ✅ camelCase
  "plate_number": "คก-2366",      // ❌ snake_case
  "modelCode": "BYD001",          // ✅ camelCase
  "engine_number": "ABC123",      // ❌ snake_case
  "chassis_number": "XYZ789",     // ❌ snake_case
  "createdAt": "2024-01-15",      // ✅ camelCase
  "created_at": "2024-01-15"      // ❌ snake_case duplicate
}
```

**Events API (`GET /api/events`):**
```json
{
  "id": "uuid-here",
  "eventName": "Event A",         // ✅ camelCase
  "start_date": "2024-01-01",     // ❌ snake_case
  "end_date": "2024-01-10",       // ❌ snake_case
  "startDate": "2024-01-01",      // ✅ camelCase duplicate
  "endDate": "2024-01-10"         // ✅ camelCase duplicate
}
```

**Impact:**
- Frontend code เปราะบางมาก ต้องใช้ fallback operator `||` ทุกที่:
  ```javascript
  const plateNumber = vehicle.plateNumber || vehicle.plate_number || vehicle.carCard || 'N/A'
  const startDate = event.startDate || event.start_date
  const createdAt = item.createdAt || item.created_at
  ```
- Code ยาวขึ้น maintenance ยาก
- เสี่ยงต่อ bugs เมื่อมี fields ใหม่

**วิธีแก้:**

**🎯 ให้เลือกใช้ camelCase ทั้งระบบ** (ตามมาตรฐาน JavaScript/JSON)

#### 1. เพิ่ม Global Transform Interceptor

```typescript
// src/common/interceptors/transform.interceptor.ts

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { camelCase } from 'lodash';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => this.transformKeys(data))
    );
  }

  private transformKeys(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.transformKeys(item));
    }

    if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj).reduce((result, key) => {
        const camelKey = camelCase(key);
        result[camelKey] = this.transformKeys(obj[key]);
        return result;
      }, {});
    }

    return obj;
  }
}
```

#### 2. Apply ใน main.ts

```typescript
// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply global transform
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(3000);
}
bootstrap();
```

#### 3. อัพเดท TypeORM Entity Mappings

```typescript
// src/stock/entities/stock.entity.ts

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('stock')
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'plate_number' })  // Database: snake_case
  plateNumber: string;                // API: camelCase

  @Column({ name: 'model_code' })
  modelCode: string;

  @Column({ name: 'engine_number' })
  engineNumber: string;

  @Column({ name: 'chassis_number' })
  chassisNumber: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;
}
```

#### 4. อัพเดท DTOs

```typescript
// src/stock/dto/update-vehicle.dto.ts

export class UpdateVehicleDto {
  @IsOptional()
  @IsString()
  plateNumber?: string;  // ✅ camelCase only

  @IsOptional()
  @IsString()
  modelCode?: string;

  @IsOptional()
  @IsString()
  engineNumber?: string;

  @IsOptional()
  @IsString()
  chassisNumber?: string;
}
```

**Expected Result:**
```json
// ✅ AFTER: Consistent camelCase
{
  "id": 138,
  "plateNumber": "คก-2366",
  "modelCode": "BYD001",
  "engineNumber": "ABC123",
  "chassisNumber": "XYZ789",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

---

### ❌ CRITICAL #2: Vehicle Assignment Foreign Key Constraint

**ปัญหา:** ไม่สามารถ assign รถยนต์เข้า event ได้

**Error:**
```
Cannot add or update a child row: a foreign key constraint fails
(`stock_management`.`event_vehicles`, CONSTRAINT `FK_event_vehicles_vehicleId`
FOREIGN KEY (`vehicleId`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE)
```

**สาเหตุ:**

```
Frontend:
  GET /api/stock/vehicles
  → Returns vehicles from `stock` table
  → IDs: 138, 139, 140, 141...

  POST /api/events/{eventId}/vehicles/batch
  → Body: { "vehicleIds": [138, 139, 140] }

Backend:
  Table: event_vehicles
  ├─ eventId (FK → events.id) ✅
  └─ vehicleId (FK → vehicles.id) ❌ Wrong table!

Problem:
  ❌ FK points to `vehicles` table
  ✅ But data is in `stock` table
  → FK constraint fails!
```

**วิธีแก้ (เลือก 1 อัน):**

#### Option 1: เปลี่ยน FK ชี้ไปที่ `stock` table (แนะนำ!)

```sql
-- Step 1: Drop existing constraint
ALTER TABLE event_vehicles
DROP FOREIGN KEY FK_event_vehicles_vehicleId;

-- Step 2: Add new constraint pointing to stock table
ALTER TABLE event_vehicles
ADD CONSTRAINT FK_event_vehicles_vehicleId
FOREIGN KEY (vehicleId) REFERENCES stock(id) ON DELETE CASCADE;
```

**TypeORM Migration:**
```typescript
// src/migrations/1730123456789-FixEventVehiclesFK.ts

import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixEventVehiclesFK1730123456789 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop old FK
    await queryRunner.query(
      `ALTER TABLE event_vehicles DROP FOREIGN KEY FK_event_vehicles_vehicleId`
    );

    // Add new FK pointing to stock table
    await queryRunner.query(
      `ALTER TABLE event_vehicles
       ADD CONSTRAINT FK_event_vehicles_vehicleId
       FOREIGN KEY (vehicleId) REFERENCES stock(id) ON DELETE CASCADE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE event_vehicles DROP FOREIGN KEY FK_event_vehicles_vehicleId`
    );

    await queryRunner.query(
      `ALTER TABLE event_vehicles
       ADD CONSTRAINT FK_event_vehicles_vehicleId
       FOREIGN KEY (vehicleId) REFERENCES vehicles(id) ON DELETE CASCADE`
    );
  }
}
```

**อัพเดท Entity:**
```typescript
// src/events/entities/event-vehicle.entity.ts

import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Event } from './event.entity';
import { Stock } from '../../stock/entities/stock.entity';  // Changed from Vehicle

@Entity('event_vehicles')
export class EventVehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Event, event => event.eventVehicles)
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @ManyToOne(() => Stock)  // ✅ Changed: vehicles → stock
  @JoinColumn({ name: 'vehicleId' })
  vehicle: Stock;
}
```

#### Option 2: Sync ข้อมูลระหว่าง `stock` และ `vehicles` tables

```typescript
// src/stock/stock.service.ts

async create(createStockDto: CreateStockDto) {
  // 1. Create in stock table
  const stock = await this.stockRepository.save(createStockDto);

  // 2. Also sync to vehicles table (for FK compatibility)
  await this.vehiclesRepository.save({
    id: stock.id,
    plateNumber: stock.plateNumber,
    model: stock.modelCode,
    // ... map other fields
  });

  return stock;
}

async update(id: number, updateStockDto: UpdateStockDto) {
  // 1. Update stock table
  await this.stockRepository.update(id, updateStockDto);

  // 2. Sync to vehicles table
  await this.vehiclesRepository.update(id, {
    plateNumber: updateStockDto.plateNumber,
    // ... map fields
  });

  return this.stockRepository.findOne({ where: { id } });
}

async delete(id: number) {
  // Both will cascade delete
  await this.stockRepository.delete(id);
  await this.vehiclesRepository.delete(id);
}
```

#### Option 3: Merge tables เป็นตัวเดียว

ถ้า `vehicles` table ไม่มีความจำเป็น ให้ใช้ `stock` table เพียงอย่างเดียว

**แนะนำ Option 1** เพราะ:
- ✅ แก้ไขง่ายที่สุด (แค่เปลี่ยน FK)
- ✅ ไม่ต้อง maintain duplicate data
- ✅ Performance ดีกว่า (ไม่ต้อง sync)

---

## ⚠️ HIGH Priority

### ⚠️ HIGH #1: Analytics API - 500 Internal Server Error

**🔴 UPDATE (2025-11-05):** Endpoints มีแล้วแต่ return **500 Internal Server Error**

**สถานะปัจจุบัน:**
- ✅ Endpoints มีแล้ว: `/api/analytics/dashboard`, `/api/analytics/vehicles/statistics`, etc.
- ❌ ทุก endpoints return 500 Internal Server Error
- ✅ Frontend เชื่อมต่อแล้ว แต่ Backend มี bug

**Error Response:**
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

**สาเหตุที่เป็นไปได้:**
1. Logic ยังไม่ได้ implement จริง (เป็น placeholder)
2. Database query ผิดพลาด
3. มี unhandled exceptions
4. ไม่มีข้อมูลใน database ทำให้ query fail
5. TypeORM relations หรือ joins ไม่ถูกต้อง

**ขั้นตอนแก้ไข:**
1. ตรวจสอบ Backend logs ดูว่า error อะไร
2. ตรวจสอบว่า implement logic จริงหรือยัง
3. Test database queries แยกต่างหาก
4. เพิ่ม try-catch และ error logging
5. ทดสอบด้วย Postman/curl

---

**ปัญหาเดิม (แก้แล้ว):** หน้า Analytics ใช้ข้อมูล hardcoded/mock ทั้งหมด
- ✅ Frontend เชื่อมต่อกับ API แล้ว
- ✅ ไม่มี 400 Bad Request แล้ว (field naming ถูกต้องแล้ว)

**ต้องการ Endpoints เหล่านี้ (มีแล้วแต่ต้องแก้ 500 error):**

#### 1. GET /api/analytics/overview

**Request:**
```http
GET /api/analytics/overview?period=12months
```

**Response:**
```json
{
  "conversionRate": {
    "value": 68.4,
    "unit": "%",
    "change": 8.7,
    "trend": "up",
    "description": "จากทดสอบเป็นซื้อ"
  },
  "customerSatisfaction": {
    "value": 4.6,
    "unit": "/5",
    "change": 5.1,
    "trend": "up",
    "description": "เฉลี่ยลูกค้า"
  },
  "newCustomers": {
    "value": 156,
    "unit": "คน",
    "change": 12.5,
    "trend": "up",
    "description": "เดือนนี้"
  },
  "projectedRevenue": {
    "value": 15800000,
    "unit": "THB",
    "change": 23,
    "trend": "up",
    "description": "บาท"
  }
}
```

#### 2. GET /api/analytics/popular-cars

**Response:**
```json
{
  "data": [
    {
      "model": "BYD DOLPHIN",
      "testDrives": 45,
      "conversions": 32,
      "conversionRate": 71.1
    },
    {
      "model": "BYD ATTO 3",
      "testDrives": 38,
      "conversions": 25,
      "conversionRate": 65.8
    }
  ]
}
```

#### 3. GET /api/analytics/revenue

**Request:**
```http
GET /api/analytics/revenue?period=12months
```

**Response:**
```json
{
  "monthly": [
    { "month": "ม.ค.", "value": 1200000 },
    { "month": "ก.พ.", "value": 1350000 },
    { "month": "มี.ค.", "value": 1450000 }
  ],
  "total": 15800000,
  "average": 1316666
}
```

#### 4. GET /api/analytics/system-performance

**Response:**
```json
{
  "uptime": 94.2,
  "averageTestDriveDuration": 45,
  "efficiency": 89,
  "previousAverageDuration": 50
}
```

**SQL Examples:**

```sql
-- Conversion Rate
SELECT
  COUNT(*) as total_test_drives,
  COUNT(CASE WHEN purchased = true THEN 1 END) as conversions,
  (COUNT(CASE WHEN purchased = true THEN 1 END) * 100.0 / COUNT(*)) as conversion_rate
FROM test_drives
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY);

-- Popular Cars
SELECT
  s.model_code as model,
  COUNT(td.id) as test_drives,
  COUNT(CASE WHEN td.purchased = true THEN 1 END) as conversions,
  (COUNT(CASE WHEN td.purchased = true THEN 1 END) * 100.0 / COUNT(td.id)) as conversion_rate
FROM stock s
LEFT JOIN test_drives td ON s.id = td.vehicle_id
WHERE td.created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
GROUP BY s.model_code
ORDER BY test_drives DESC
LIMIT 10;

-- Revenue by Month
SELECT
  DATE_FORMAT(created_at, '%b') as month,
  SUM(price) as value
FROM test_drives
WHERE purchased = true
  AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
GROUP BY DATE_FORMAT(created_at, '%Y-%m')
ORDER BY created_at;
```

---

### ⚠️ HIGH #2: Settings/Profile API Missing

**ปัญหา:** Settings page บันทึกแค่ localStorage ไม่บันทึกที่ server

**ไฟล์:** `/pages/dashboard/settings.vue`

**API ที่ถูก comment ไว้:**
```javascript
// Line 425-426 (Profile)
// await this.$api.users.updateProfile(this.profileForm)

// Line 448-451 (Password)
// await this.$api.auth.changePassword({
//   currentPassword: this.securityForm.currentPassword,
//   newPassword: this.securityForm.newPassword
// })

// Line 470 (Notifications)
// await this.$api.users.updateNotificationSettings(this.notificationForm)

// Line 483 (System)
// await this.$api.users.updateSystemSettings(this.systemForm)
```

**ต้องการ Endpoints:**

#### 1. PATCH /api/users/profile

**Request:**
```json
{
  "firstName": "สมชาย",
  "lastName": "ใจดี",
  "nickname": "ชาย",
  "email": "somchai@example.com",
  "phone": "0812345678",
  "position": "Sales Manager"
}
```

**Response:**
```json
{
  "id": 1,
  "firstName": "สมชาย",
  "lastName": "ใจดี",
  "nickname": "ชาย",
  "email": "somchai@example.com",
  "phone": "0812345678",
  "position": "Sales Manager",
  "role": "admin",
  "updatedAt": "2024-11-03T10:00:00Z"
}
```

#### 2. POST /api/auth/change-password

**Request:**
```json
{
  "currentPassword": "oldpass123",
  "newPassword": "newpass456"
}
```

**Response:**
```json
{
  "message": "Password changed successfully",
  "requireRelogin": false
}
```

#### 3. PATCH /api/users/settings/notifications

**Request:**
```json
{
  "email": true,
  "line": false,
  "newQueue": true,
  "queueStatus": true,
  "events": true
}
```

#### 4. PATCH /api/users/settings/system

**Request:**
```json
{
  "language": "th",
  "timezone": "Asia/Bangkok",
  "dateFormat": "DD/MM/YYYY",
  "darkMode": false
}
```

**Database Schema:**

```sql
CREATE TABLE user_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,

  -- Notification settings
  notify_email BOOLEAN DEFAULT true,
  notify_line BOOLEAN DEFAULT false,
  notify_new_queue BOOLEAN DEFAULT true,
  notify_queue_status BOOLEAN DEFAULT true,
  notify_events BOOLEAN DEFAULT true,

  -- System settings
  language VARCHAR(5) DEFAULT 'th',
  timezone VARCHAR(50) DEFAULT 'Asia/Bangkok',
  date_format VARCHAR(20) DEFAULT 'DD/MM/YYYY',
  dark_mode BOOLEAN DEFAULT false,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_settings (user_id)
);
```

---

### ⚠️ HIGH #3: Better Error Response for Vehicle Assignment

**ปัญหา:** เมื่อ vehicle assignment ล้มเหลว error response ไม่ชัดเจนพอ

**Current Response:**
```json
{
  "success": 0,
  "failed": 3,
  "errors": [
    "Vehicle 138: Cannot add or update a child row...",
    "Vehicle 139: Cannot add or update a child row...",
    "Vehicle 140: Cannot add or update a child row..."
  ]
}
```

**ปรับปรุงเป็น:**

```json
{
  "success": 0,
  "failed": 3,
  "totalRequested": 3,
  "results": [
    {
      "vehicleId": 138,
      "plateNumber": "คก-2366",
      "success": false,
      "errorCode": "FK_CONSTRAINT_VIOLATION",
      "errorMessage": "Vehicle not found in vehicles table",
      "errorDetail": "This vehicle exists in stock table but not in vehicles table. Please contact system administrator."
    },
    {
      "vehicleId": 139,
      "plateNumber": "คก-2367",
      "success": false,
      "errorCode": "FK_CONSTRAINT_VIOLATION",
      "errorMessage": "Vehicle not found in vehicles table",
      "errorDetail": "This vehicle exists in stock table but not in vehicles table. Please contact system administrator."
    }
  ],
  "hasPartialSuccess": false,
  "recommendation": "Database schema issue detected. FK constraint needs to be updated to reference stock table instead of vehicles table."
}
```

**Implementation:**

```typescript
// src/events/events.service.ts

async assignVehiclesBatch(eventId: string, vehicleIds: number[]) {
  const results = [];
  let successCount = 0;
  let failedCount = 0;

  for (const vehicleId of vehicleIds) {
    try {
      // Check if vehicle exists in stock
      const stockVehicle = await this.stockRepository.findOne({
        where: { id: vehicleId }
      });

      if (!stockVehicle) {
        results.push({
          vehicleId,
          plateNumber: null,
          success: false,
          errorCode: 'VEHICLE_NOT_FOUND',
          errorMessage: 'Vehicle does not exist in stock',
          errorDetail: `No vehicle with ID ${vehicleId} found in database`
        });
        failedCount++;
        continue;
      }

      // Check if already assigned
      const existing = await this.eventVehicleRepository.findOne({
        where: { eventId, vehicleId }
      });

      if (existing) {
        results.push({
          vehicleId,
          plateNumber: stockVehicle.plateNumber,
          success: false,
          errorCode: 'ALREADY_ASSIGNED',
          errorMessage: 'Vehicle already assigned to this event',
          errorDetail: `Vehicle ${stockVehicle.plateNumber} is already part of this event`
        });
        failedCount++;
        continue;
      }

      // Try to assign
      await this.eventVehicleRepository.save({
        eventId,
        vehicleId
      });

      results.push({
        vehicleId,
        plateNumber: stockVehicle.plateNumber,
        success: true
      });
      successCount++;

    } catch (error) {
      const stockVehicle = await this.stockRepository.findOne({
        where: { id: vehicleId }
      });

      // Detect FK constraint violation
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        results.push({
          vehicleId,
          plateNumber: stockVehicle?.plateNumber,
          success: false,
          errorCode: 'FK_CONSTRAINT_VIOLATION',
          errorMessage: 'Vehicle not found in vehicles table',
          errorDetail: 'This vehicle exists in stock table but not in vehicles table. Please contact system administrator.'
        });
      } else {
        results.push({
          vehicleId,
          plateNumber: stockVehicle?.plateNumber,
          success: false,
          errorCode: 'UNKNOWN_ERROR',
          errorMessage: error.message,
          errorDetail: error.stack
        });
      }
      failedCount++;
    }
  }

  return {
    success: successCount,
    failed: failedCount,
    totalRequested: vehicleIds.length,
    results,
    hasPartialSuccess: successCount > 0 && failedCount > 0,
    recommendation: failedCount > 0 && results.some(r => r.errorCode === 'FK_CONSTRAINT_VIOLATION')
      ? 'Database schema issue detected. FK constraint needs to be updated to reference stock table instead of vehicles table.'
      : null
  };
}
```

---

## 📋 MEDIUM Priority

### 📋 MEDIUM #1: Pagination Support

**ปัญหา:** Stock list โหลดทั้งหมดมาพร้อมกัน (ไม่มี pagination)

**ไฟล์:** `GET /api/stock/vehicles`

**Current:**
```http
GET /api/stock/vehicles
→ Returns all vehicles (could be 1000+ records)
```

**ต้องการ:**
```http
GET /api/stock/vehicles?page=1&limit=20&sort=createdAt&order=desc
```

**Response:**
```json
{
  "data": [
    { "id": 138, "plateNumber": "คก-2366", ... },
    { "id": 139, "plateNumber": "คก-2367", ... }
  ],
  "meta": {
    "total": 1250,
    "page": 1,
    "limit": 20,
    "totalPages": 63,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

**Implementation:**

```typescript
// src/stock/stock.controller.ts

@Get('vehicles')
async getVehicles(
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 20,
  @Query('sort') sort: string = 'createdAt',
  @Query('order') order: 'ASC' | 'DESC' = 'DESC',
  @Query('status') status?: string,
  @Query('search') search?: string
) {
  return this.stockService.findAllPaginated({
    page,
    limit,
    sort,
    order,
    status,
    search
  });
}
```

```typescript
// src/stock/stock.service.ts

async findAllPaginated(options: PaginationOptions) {
  const { page, limit, sort, order, status, search } = options;
  const skip = (page - 1) * limit;

  const query = this.stockRepository.createQueryBuilder('stock');

  // Filters
  if (status) {
    query.andWhere('stock.status = :status', { status });
  }

  if (search) {
    query.andWhere(
      '(stock.plateNumber LIKE :search OR stock.modelCode LIKE :search)',
      { search: `%${search}%` }
    );
  }

  // Sort
  query.orderBy(`stock.${sort}`, order);

  // Pagination
  const [data, total] = await query
    .skip(skip)
    .take(limit)
    .getManyAndCount();

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1
    }
  };
}
```

---

### 📋 MEDIUM #2: Complete CRUD Operations

**ปัญหาที่เหลือ:**

1. ✅ `PATCH /api/stock/{id}` - **แก้แล้ว!** (ตาม context ล่าสุด)
2. ❌ `PUT /api/events/{id}` - ยังไม่มี full update event
3. ❌ `GET /api/events/{id}/history` - ไม่มี event history
4. ❌ `GET /api/test-drives/stats` - ไม่มี test drive statistics

**เพิ่ม Endpoints:**

#### PUT /api/events/{id} - Full event update

```typescript
@Put(':id')
async updateEvent(
  @Param('id') id: string,
  @Body() updateEventDto: UpdateEventDto
) {
  return this.eventsService.update(id, updateEventDto);
}
```

#### GET /api/events/{id}/history

```json
{
  "eventId": "uuid",
  "history": [
    {
      "timestamp": "2024-11-01T10:00:00Z",
      "action": "created",
      "actor": "admin@example.com",
      "changes": {}
    },
    {
      "timestamp": "2024-11-02T14:30:00Z",
      "action": "vehicle_assigned",
      "actor": "staff@example.com",
      "changes": {
        "vehicleId": 138,
        "plateNumber": "คก-2366"
      }
    }
  ]
}
```

---

## ℹ️ LOW Priority

### ℹ️ LOW #1: Export API (CSV/PDF)

**ต้องการ:**

```http
GET /api/stock/export?format=csv
GET /api/stock/export?format=pdf
GET /api/events/export?format=csv
GET /api/test-drives/export?format=csv
```

**Response:**
```
Content-Type: text/csv
Content-Disposition: attachment; filename="stock-export-2024-11-03.csv"
```

**Implementation ด้วย Libraries:**
- CSV: `json2csv` หรือ `papaparse`
- PDF: `pdfkit` หรือ `puppeteer`

---

### ℹ️ LOW #2: Console Logging Cleanup

**ไม่จำเป็นต้องทำอะไร** - นี่เป็นปัญหาฝั่ง Frontend

แต่แนะนำให้:
- ใช้ proper logging library (Winston, Pino)
- ตั้ง log levels (debug, info, warn, error)
- ไม่ log sensitive data

---

## 📊 Summary & Action Items

### Priority Matrix

| Priority | Issue | Estimated Effort | Impact |
|----------|-------|-----------------|--------|
| 🚨 CRITICAL | Field Naming Consistency | 4-6 hours | Very High |
| 🚨 CRITICAL | FK Constraint Fix | 2-3 hours | Very High |
| ⚠️ HIGH | Analytics API | 8-12 hours | High |
| ⚠️ HIGH | Settings/Profile API | 4-6 hours | High |
| ⚠️ HIGH | Better Error Responses | 2-3 hours | Medium |
| 📋 MEDIUM | Pagination | 3-4 hours | Medium |
| 📋 MEDIUM | Complete CRUD | 4-6 hours | Medium |
| ℹ️ LOW | Export APIs | 6-8 hours | Low |

### Recommended Order

**Week 1 (Critical):**
1. ✅ Fix FK Constraint (CRITICAL #2) - 2-3 hours
2. ✅ Field Naming Consistency (CRITICAL #1) - 4-6 hours
3. ✅ Better Error Responses (HIGH #3) - 2-3 hours

**Week 2 (High Priority):**
4. ⚠️ Settings/Profile API (HIGH #2) - 4-6 hours
5. ⚠️ Pagination (MEDIUM #1) - 3-4 hours

**Week 3 (Medium Priority):**
6. 📋 Analytics API (HIGH #1) - 8-12 hours
7. 📋 Complete CRUD (MEDIUM #2) - 4-6 hours

**Week 4 (Low Priority):**
8. ℹ️ Export APIs (LOW #1) - 6-8 hours

### Total Estimated Effort: 40-54 hours (1-1.5 sprints)

---

## 🧪 Testing Checklist

หลังแก้แล้วต้องทดสอบ:

- [ ] Stock CRUD ทั้งหมด (Create, Read, Update, Delete)
- [ ] Event vehicle assignment (ต้องไม่มี FK error)
- [ ] Pagination ทุก endpoint ที่มี list
- [ ] Field naming consistency ทุก endpoint (ต้องเป็น camelCase)
- [ ] Error responses ต้องชัดเจนและมีรายละเอียด
- [ ] Analytics API ต้องคำนวณถูกต้อง
- [ ] Settings API บันทึกและโหลดได้
- [ ] Export CSV/PDF ได้

---

## 📞 Contact

ถ้ามีคำถามหรือต้องการข้อมูลเพิ่มเติม:
- Frontend Developer: [ใส่ contact]
- Backend Developer: [ใส่ contact]

**Created:** 2025-11-03
**Last Updated:** 2025-11-03
**Status:** OPEN - รอ Backend แก้ไข

---

## 📎 Related Documents

- `BACKEND_ISSUES.md` - รายละเอียด Critical issues ก่อนหน้า
- `FRONTEND_AUDIT_REPORT.md` - รายงานการตรวจสอบ Frontend
- Swagger API Docs: `http://localhost:3000/api-docs`
