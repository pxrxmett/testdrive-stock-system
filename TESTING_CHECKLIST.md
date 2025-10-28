# Integration Testing Checklist

This document outlines the testing procedures for the mock-to-API integration completed on the testdrive-stock-system frontend.

## Prerequisites

### 1. Backend Server Running
```bash
cd ../isuzustock-management
npm install
npm run start:dev
```
Backend should be running on `http://localhost:3000`

### 2. Frontend Server Running
```bash
cd testdrive-stock-system
npm install
npm run dev
```
Frontend should be running on `http://localhost:8080`

### 3. Database Setup
Ensure the backend database is migrated and seeded with test data:
```bash
# In backend directory
npm run migration:run
npm run seed
```

---

## Test Suite 1: Dashboard Store (Queue Management)

**File Modified:** `store/dashboard.js`

**API Endpoint:** `GET /api/test-drives`

### Test Cases:

#### ✅ Test 1.1: Load Queue Data
1. Navigate to `/dashboard/queue`
2. **Expected:** Queue list loads from API
3. **Verify:**
   - Data displays correctly
   - Customer names, phone numbers visible
   - Vehicle models show correctly
   - Time slots formatted properly
   - Status badges display

#### ✅ Test 1.2: Create New Test Drive
1. Click "สร้างคิวใหม่" button
2. Fill in form with test data:
   - Customer name: "Test Customer"
   - Phone: "0812345678"
   - Vehicle model: Select any
   - Date & time: Tomorrow
3. Submit form
4. **Expected:**
   - Success toast notification
   - New queue appears in list
   - API call to `POST /api/test-drives` succeeds

#### ✅ Test 1.3: Update Test Drive
1. Click edit button on any queue item
2. Change customer name
3. Save changes
4. **Expected:**
   - Success toast notification
   - Changes reflected in list
   - API call to `PATCH /api/test-drives/:id` succeeds

#### ✅ Test 1.4: Delete Test Drive
1. Click delete button on any queue item
2. Confirm deletion
3. **Expected:**
   - Success toast notification
   - Item removed from list
   - API call to `DELETE /api/test-drives/:id` succeeds

#### ✅ Test 1.5: Search and Filters
1. Use search box to search for customer name
2. **Expected:** Filtered results display
3. Try status filter dropdown
4. **Expected:** Filter by status works

#### ✅ Test 1.6: Error Handling (Backend Down)
1. Stop backend server
2. Refresh page
3. **Expected:**
   - Error message displays (NOT "undefined" error)
   - Page doesn't crash
   - Empty queue list shows

---

## Test Suite 2: Events Page

**File Modified:** `pages/dashboard/events.vue`

**API Endpoints:**
- `GET /api/events`
- `POST /api/events`
- `POST /api/events/:id/return-vehicles`
- `PATCH /api/events/:id/extend`
- `POST /api/events/auto-return`

### Test Cases:

#### ✅ Test 2.1: Load Events Data
1. Navigate to `/dashboard/events`
2. **Expected:** Events list loads from API
3. **Verify:**
   - Event names, locations display
   - Start/end dates formatted correctly
   - Status badges show Thai labels
   - Type labels display correctly
   - Booked vehicles count shows

#### ✅ Test 2.2: Create Quick Emergency Event
1. Click "อีเวนต์ฉุกเฉิน" button
2. Enter event name in prompt
3. **Expected:**
   - API call to `POST /api/events` succeeds
   - New event appears in list
   - Success toast notification

#### ✅ Test 2.3: Return Vehicles from Event
1. Find event with booked vehicles
2. Click "คืนรถ" button
3. Confirm action
4. **Expected:**
   - API call to `POST /api/events/:id/return-vehicles` succeeds
   - Vehicle count updates to 0
   - Event status changes to "เสร็จสิ้น"
   - Success toast notification

#### ✅ Test 2.4: Extend Event Duration
1. Click "ขยายอีเวนต์" on any active event
2. Enter number of days (e.g., "3")
3. **Expected:**
   - API call to `PATCH /api/events/:id/extend` succeeds
   - End date extends by specified days
   - Success toast notification

#### ✅ Test 2.5: Auto-Return Overdue Vehicles
1. If overdue events exist (check orange alert banner)
2. Click "คืนรถทั้งหมด" button
3. Confirm action
4. **Expected:**
   - API call to `POST /api/events/auto-return` succeeds
   - All overdue vehicles returned
   - Events marked as completed
   - Alert banner disappears

#### ✅ Test 2.6: Event Statistics
1. Check stats cards at top of page
2. **Expected:**
   - Total events count correct
   - Active events count correct
   - Booked vehicles count matches
   - Upcoming events count correct

#### ✅ Test 2.7: Event Filters
1. Use search box to search for event name
2. **Expected:** Filtered results display
3. Try status filter dropdown
4. **Expected:** Filter by status works

#### ✅ Test 2.8: Field Mapping Verification
Verify Thai labels map correctly to API:
- Status mapping:
  - "วางแผน" ↔ `planning`
  - "เตรียมการ" ↔ `preparing`
  - "กำลังดำเนินการ" ↔ `in_progress`
  - "เสร็จสิ้น" ↔ `completed`
  - "เลยกำหนด" ↔ `overdue`
- Type mapping:
  - "งานแสดงรถ" ↔ `car_show`
  - "ทดลองขับ" ↔ `test_drive`
  - "การตลาด" ↔ `marketing`
  - "ส่งมอบรถ" ↔ `delivery`
  - "ฉุกเฉิน" ↔ `emergency`

---

## Test Suite 3: Stock Page

**File Modified:** `pages/dashboard/stock/index.vue`

**API Endpoints:**
- `GET /api/stock/vehicles`
- `PATCH /api/stock/vehicles/:id/status`

### Test Cases:

#### ✅ Test 3.1: Load Vehicles Data
1. Navigate to `/dashboard/stock`
2. **Expected:** Vehicle list loads from API
3. **Verify:**
   - Plate numbers display
   - Vehicle models show correctly
   - Categories and types visible
   - Colors display
   - VIN/Chassis numbers show
   - Status badges display Thai labels

#### ✅ Test 3.2: Vehicle Statistics
1. Check stats cards at top of page
2. **Expected:**
   - Total vehicles count correct
   - Available count correct
   - In-use count correct
   - Event-locked count correct

#### ✅ Test 3.3: Update Vehicle Status
1. Click status dropdown on any vehicle
2. Select new status (e.g., "บำรุงรักษา")
3. **Expected:**
   - API call to `PATCH /api/stock/vehicles/:id/status` succeeds
   - Status badge updates immediately
   - Statistics update
   - Success toast notification

#### ✅ Test 3.4: Search Vehicles
1. Use search box to search for plate number
2. **Expected:** Filtered results display
3. Try searching by model name
4. **Expected:** Search works

#### ✅ Test 3.5: Filter Vehicles
1. Use category filter (กระบะ/SUV)
2. **Expected:** Filter by category works
3. Use type filter (น้ำมัน/ไฟฟ้า)
4. **Expected:** Filter by fuel type works
5. Use status filter
6. **Expected:** Filter by status works

#### ✅ Test 3.6: View Modes
1. Toggle between "cards" and "list" view
2. **Expected:** Both views display data correctly

#### ✅ Test 3.7: Event-Locked Vehicles
1. Find vehicles with status "ล็อกสำหรับอีเวนต์"
2. **Expected:**
   - Event details display (event name, location)
   - Different badge color
   - Return button shows if applicable

#### ✅ Test 3.8: Field Mapping Verification
Verify Thai labels map correctly to API:
- Status mapping:
  - "พร้อมใช้" ↔ `available`
  - "ใช้งาน" ↔ `in_use`
  - "บำรุงรักษา" ↔ `maintenance`
  - "ล็อกสำหรับอีเวนต์" ↔ `locked_for_event`
  - "ไม่พร้อมใช้" ↔ `unavailable`

---

## Test Suite 4: API Plugin Configuration

**Files Modified:**
- `plugins/api.js`
- `nuxt.config.js`

### Test Cases:

#### ✅ Test 4.1: API Base URL
1. Open browser DevTools → Network tab
2. Navigate through pages
3. **Expected:** All API calls go to `http://localhost:3000/api`

#### ✅ Test 4.2: API Methods Availability
1. Open browser console
2. Type: `$nuxt.$api`
3. **Expected:** Should show object with:
   - `testDrives` (5 methods)
   - `stock` (6 methods)
   - `events` (11 methods)

#### ✅ Test 4.3: Request Interceptor
1. Check Network tab
2. **Expected:** All requests have:
   - `Accept: application/json, text/plain, */*` header
   - Console logs: "Making request to /api/..."

---

## Test Suite 5: Integration Tests

### Test Cases:

#### ✅ Test 5.1: Cross-Page Navigation
1. Navigate: Queue → Events → Stock → Queue
2. **Expected:** All pages load correctly without errors

#### ✅ Test 5.2: Data Consistency
1. Create a test drive in Queue Management
2. Navigate to Calendar page
3. **Expected:** New test drive appears in calendar

#### ✅ Test 5.3: Event + Stock Integration
1. Go to Events page
2. Create new event
3. Book vehicles for event (if feature exists)
4. Go to Stock page
5. **Expected:** Vehicles show "ล็อกสำหรับอีเวนต์" status

#### ✅ Test 5.4: Real-time Updates
1. Open page in two browser windows
2. Create/update/delete item in window 1
3. Refresh window 2
4. **Expected:** Changes appear in window 2

---

## Test Suite 6: Error Handling

### Test Cases:

#### ✅ Test 6.1: Backend Unavailable
1. Stop backend server
2. Try to load any page
3. **Expected:**
   - Error message displays
   - No "undefined" errors
   - Page doesn't crash

#### ✅ Test 6.2: Network Timeout
1. Simulate slow network (DevTools → Network → Slow 3G)
2. Navigate between pages
3. **Expected:**
   - Loading indicators show
   - Eventually loads or shows error

#### ✅ Test 6.3: Invalid API Response
1. (Backend developer) Temporarily break API endpoint
2. Try to load data
3. **Expected:**
   - Graceful error handling
   - Error toast notification
   - Empty state displays

#### ✅ Test 6.4: Authentication Error (401)
1. (Backend developer) Require authentication on endpoint
2. Try to load data without token
3. **Expected:**
   - Redirect to login page
   - Or show authentication error

---

## Performance Tests

### Test Cases:

#### ✅ Test 7.1: Page Load Time
1. Open DevTools → Performance tab
2. Record page load
3. **Expected:** Page loads in < 3 seconds

#### ✅ Test 7.2: API Response Time
1. Check Network tab
2. Look at API call durations
3. **Expected:** API responses in < 500ms

#### ✅ Test 7.3: Large Dataset Handling
1. (Backend) Seed database with 100+ records
2. Load pages
3. **Expected:**
   - Pagination works (if implemented)
   - No UI freeze
   - Smooth scrolling

---

## Browser Compatibility

Test in these browsers:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (if on Mac)
- [ ] Edge (latest)

---

## Mobile Responsiveness

Test on these screen sizes:

- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

---

## Known Issues / Limitations

Document any issues found during testing:

1. **Analytics Page**: Still uses mock data - needs backend implementation (Phase 2)
2. **Event Vehicle Booking UI**: May need enhancement for better UX
3. **Stock Upload Feature**: Not tested (requires file upload implementation)

---

## Sign-off

| Test Suite | Tester | Date | Status | Notes |
|------------|--------|------|--------|-------|
| Dashboard Store | | | | |
| Events Page | | | | |
| Stock Page | | | | |
| API Plugin | | | | |
| Integration Tests | | | | |
| Error Handling | | | | |
| Performance | | | | |

---

## Regression Testing

After any fixes or changes, re-test:
- All failed test cases
- Related functionality
- Critical user paths

---

## Next Steps

After all tests pass:
1. ✅ Create pull request
2. ✅ Code review
3. ✅ Deploy to staging environment
4. ✅ UAT (User Acceptance Testing)
5. ✅ Deploy to production
