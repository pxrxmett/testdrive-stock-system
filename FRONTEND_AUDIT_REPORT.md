# Frontend Mock Data Audit Report
## testdrive-stock-system Project

**Date**: 2025-10-27
**Audited By**: Claude Code
**Project**: ISUZU Test Drive Stock Management System

---

## Executive Summary

A comprehensive audit of the testdrive-stock-system frontend application revealed **3 critical pages** and **3 components** still using hardcoded mock data, despite having functional backend APIs already implemented and available.

### Key Findings:
- 🔴 **3 Critical Pages** need immediate API integration
- 🟡 **1 Store** has commented-out API calls
- 🟢 **4 Pages/Components** already connected to APIs
- ⚠️ **Analytics system** requires new backend endpoints

---

## Detailed Audit Results

### 🔴 CRITICAL: Pages Using Mock Data (HIGH PRIORITY)

#### 1. Events Management Page 🔥🔥🔥
**File**: `/pages/dashboard/events.vue`
- **Status**: 100% Mock Data
- **Lines**: 509-583 (hardcoded events array)
- **Impact**: CRITICAL
- **API Available**: ✅ YES - Full Events API exists
- **Estimated Fix Time**: 2-3 hours

**Mock Data Found**:
```javascript
events: [
  { id: 'EVT001', name: 'Motor Expo 2024', ... },
  { id: 'EVT002', name: 'Test Drive Event', ... },
  // 6 hardcoded events total
]
```

**Available API Endpoints**:
- `$api.events.getAll()`
- `$api.events.getStats()`
- `$api.events.create()`
- `$api.events.update()`
- `$api.events.delete()`
- `$api.events.bookVehicles()`
- `$api.events.returnVehicles()`
- `$api.events.extendEvent()`

---

#### 2. Stock Management Page 🔥🔥🔥
**File**: `/pages/dashboard/stock/index.vue`
- **Status**: 100% Mock Data
- **Lines**: 522-590 (hardcoded vehicles array)
- **Impact**: CRITICAL
- **API Available**: ✅ YES - Stock API exists
- **Estimated Fix Time**: 2-3 hours

**Mock Data Found**:
```javascript
vehicles: [
  { id: 'ST001', plateNumber: 'กข-1234', ... },
  { id: 'ST002', plateNumber: 'คง-5678', ... },
  // 4 hardcoded vehicles
]
```

**Available API Endpoints**:
- `$api.stock.getVehicles()`
- `$api.stock.getAll()`
- `$api.stock.getById()`
- `$api.stock.updateStatus()`
- `$api.stock.create()`
- `$api.stock.delete()`

---

#### 3. Analytics Page 🔥🔥
**File**: `/pages/dashboard/analytics.vue`
- **Status**: 100% Mock Data
- **Lines**: Entire page
- **Impact**: HIGH
- **API Available**: ❌ NO - Analytics API doesn't exist
- **Estimated Fix Time**: Option A: 8-10 hours (new API), Option B: 4-5 hours (calculate from test-drives)

**Mock Data Found**:
- MetricCard values (lines 17-48)
- PopularCarsChart data (lines 49-55)
- RevenueChart data (lines 61-74)
- Performance metrics (lines 62-105)

**Solutions**:
1. **Option A** (Recommended): Create backend analytics API
2. **Option B** (Quick): Calculate analytics from test-drives data client-side

---

### 🟡 PARTIAL: Store with Commented API

#### Dashboard Store
**File**: `/store/dashboard.js`
- **Status**: API call commented out, using mock
- **Lines**: 82-114 (fetchQueues action)
- **Impact**: MEDIUM
- **Estimated Fix Time**: 30 minutes

**Issue**:
```javascript
// เรียก API จริง
// const response = await this.$api.testDrives.getAll()  // COMMENTED!
// Mock data สำหรับ development
const mockResponse = { /* hardcoded */ }
const response = mockResponse  // USING MOCK!
```

**Fix**: Uncomment API call, remove mock fallback

---

### 🟢 WORKING: Already Using APIs

These are functioning correctly:

1. **Queue Management** (`/pages/dashboard/queue/index.vue`) ✅
2. **Queue Add Form** (`/pages/dashboard/queue/add.vue`) ✅
3. **Calendar** (`/pages/dashboard/calendar.vue`) ✅
   - Uses Vuex store connected to API
4. **QuickStats Component** (`/components/QuickStats.vue`) ✅
5. **RecentActivity Component** (`/components/RecentActivity.vue`) ✅

---

## Prioritized Implementation Plan

### PHASE 1: Critical API Connections (Week 1)
**Total Effort**: ~6 hours

#### Task 1.1: Events Page API Integration ⏱️ 2-3 hours
**Priority**: 🔥 CRITICAL

**Steps**:
1. Remove mock events array (lines 509-583)
2. Add `loading` and `error` state
3. Add `async mounted()` to load events
4. Implement `loadEvents()` method
5. Implement `loadEventStats()` method
6. Connect all action methods (create, update, delete, book, return)
7. Add error handling and loading states
8. Test all CRUD operations

**Code Template**:
```javascript
data() {
  return {
    events: [],  // Remove mock data
    eventStats: { total: 0, active: 0, ... },
    loading: false,
    error: null
  }
},

async mounted() {
  await this.loadEvents()
  await this.loadEventStats()
},

methods: {
  async loadEvents() {
    try {
      this.loading = true
      this.events = await this.$api.events.getAll({
        status: this.filterStatus !== 'ทั้งหมด' ? this.filterStatus : undefined,
        type: this.filterType !== 'ทั้งหมด' ? this.filterType : undefined
      })
    } catch (error) {
      this.error = 'ไม่สามารถโหลดข้อมูลได้'
    } finally {
      this.loading = false
    }
  },

  async loadEventStats() {
    try {
      this.eventStats = await this.$api.events.getStats()
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }
}
```

---

#### Task 1.2: Stock Page API Integration ⏱️ 2-3 hours
**Priority**: 🔥 CRITICAL

**Steps**:
1. Remove mock vehicles array (lines 522-590)
2. Add loading/error states
3. Add `async mounted()` to load vehicles
4. Implement `loadVehicles()` with filters
5. Connect vehicle status updates
6. Connect event locking/unlocking
7. Add error handling
8. Test filtering and CRUD operations

**Code Template**:
```javascript
data() {
  return {
    vehicles: [],  // Remove mock data
    stats: { total: 0, available: 0, inUse: 0, eventLocked: 0 },
    loading: false,
    error: null
  }
},

async mounted() {
  await this.loadVehicles()
},

methods: {
  async loadVehicles() {
    try {
      this.loading = true
      const response = await this.$api.stock.getVehicles({
        category: this.filterCategory !== 'ทั้งหมด' ? this.filterCategory : undefined,
        type: this.filterType !== 'ทั้งหมด' ? this.filterType : undefined,
        status: this.filterStatus !== 'ทั้งหมด' ? this.filterStatus : undefined
      })
      this.vehicles = response
      this.updateStats()
    } catch (error) {
      this.error = 'ไม่สามารถโหลดข้อมูลได้'
    } finally {
      this.loading = false
    }
  },

  updateStats() {
    this.stats.total = this.vehicles.length
    this.stats.available = this.vehicles.filter(v => v.status === 'available').length
    // ... calculate other stats
  }
}
```

---

#### Task 1.3: Dashboard Store API Activation ⏱️ 30 minutes
**Priority**: 🔥 HIGH

**Steps**:
1. Uncomment API call on line 82
2. Remove mock response (lines 84-114)
3. Verify field mapping
4. Test error handling
5. Remove mock data fallback

**Changes**:
```javascript
async fetchQueues({ commit }) {
  try {
    commit('setLoading', true)
    commit('setError', null)

    // Uncomment this:
    const response = await this.$api.testDrives.getAll()

    // Remove the mock response entirely
    const queues = response.map(item => ({
      id: item.id,
      customerName: item.customer_name,  // Check API field names!
      phone: item.customer_phone,
      // ... map all fields correctly
    }))

    commit('setQueues', queues)
  } catch (error) {
    commit('setError', 'ไม่สามารถดึงข้อมูลได้')
    // REMOVE loadMockData fallback
  } finally {
    commit('setLoading', false)
  }
}
```

---

### PHASE 2: Analytics Implementation (Week 2)
**Total Effort**: 4-10 hours

#### Option A: Create Backend Analytics API (Recommended) ⏱️ 8-10 hours
**Backend Work Required**:

Create endpoints:
```
GET /analytics/dashboard
GET /analytics/metrics
GET /analytics/popular-cars
GET /analytics/revenue
GET /analytics/performance
```

**Response Example**:
```json
{
  "metrics": {
    "conversionRate": { "value": 68.4, "change": 8.7, "trend": "up" },
    "satisfaction": { "value": 4.6, "change": 5.1, "trend": "up" },
    "newCustomers": { "value": 156, "change": 12.5, "trend": "up" },
    "revenue": { "value": 15800000, "change": 23, "trend": "up" }
  },
  "popularCars": [...],
  "revenue": [...],
  "performance": {...}
}
```

---

#### Option B: Calculate from Test Drives (Quick Fix) ⏱️ 4-5 hours
**Client-Side Calculation**:

```javascript
async mounted() {
  const testDrives = await this.$api.testDrives.getAll()

  this.metrics = {
    conversionRate: this.calculateConversionRate(testDrives),
    satisfaction: this.calculateSatisfaction(testDrives),
    newCustomers: this.countNewCustomers(testDrives),
    revenue: this.calculateRevenue(testDrives)
  }

  this.popularCars = this.calculatePopularCars(testDrives)
  this.revenueChart = this.calculateRevenueByMonth(testDrives)
}

methods: {
  calculateConversionRate(testDrives) {
    const completed = testDrives.filter(td => td.status === 'completed')
    const converted = completed.filter(td => td.converted === true)
    return (converted.length / completed.length * 100).toFixed(1)
  },

  calculatePopularCars(testDrives) {
    const carCounts = {}
    testDrives.forEach(td => {
      carCounts[td.vehicleModel] = (carCounts[td.vehicleModel] || 0) + 1
    })
    return Object.entries(carCounts)
      .map(([model, count]) => ({
        model,
        count,
        percentage: (count / testDrives.length * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  },

  calculateRevenueByMonth(testDrives) {
    const monthlyRevenue = {}
    testDrives.forEach(td => {
      const month = new Date(td.createdAt).getMonth()
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (td.expectedRevenue || 0)
    })
    return Object.entries(monthlyRevenue).map(([month, revenue]) => ({
      month: this.getMonthName(month),
      value: revenue,
      height: (revenue / Math.max(...Object.values(monthlyRevenue)) * 100)
    }))
  }
}
```

---

### PHASE 3: UI Improvements (Week 3)
**Total Effort**: 6-8 hours

#### Replace analytics.vue with Improved Version

I've created `analytics-improved.vue` with:

**New Features**:
✅ Interactive date range selector
✅ Comparison mode (month-over-month, year-over-year)
✅ Export options (PDF, Excel, CSV)
✅ Tabbed interface for different chart types
✅ Drill-down capabilities
✅ Loading states and error handling
✅ Responsive design
✅ Trend indicators with sparklines
✅ Top performing staff section
✅ Achievements section
✅ Enhanced visualizations

**To Use**:
1. Review `/pages/dashboard/analytics-improved.vue`
2. Customize as needed
3. Replace current analytics.vue OR rename and test
4. Connect to real data sources

---

## Testing Checklist

### Events Page
- [ ] Load events list
- [ ] Filter by status
- [ ] Filter by type
- [ ] Create new event
- [ ] Edit existing event
- [ ] Delete event
- [ ] Book vehicles for event
- [ ] Return vehicles from event
- [ ] View event statistics
- [ ] Handle API errors gracefully
- [ ] Show loading states

### Stock Page
- [ ] Load vehicles list
- [ ] Filter by category
- [ ] Filter by type
- [ ] Filter by status
- [ ] Search vehicles
- [ ] Lock vehicle for event
- [ ] Return vehicle from event
- [ ] View vehicle details
- [ ] Update vehicle status
- [ ] Handle API errors
- [ ] Show loading states

### Dashboard Store
- [ ] Fetch test drives on mount
- [ ] Handle API errors
- [ ] Display correct data
- [ ] Update statistics
- [ ] Filter functionality works

### Analytics (After Implementation)
- [ ] Load all metrics
- [ ] Switch between time periods
- [ ] Export to PDF
- [ ] Export to Excel
- [ ] Export to CSV
- [ ] Compare periods
- [ ] Drill down into metrics
- [ ] View different chart types
- [ ] Handle no data scenarios

---

## Quick Start Guide

### Step 1: Update Events Page (PRIORITY 1)
```bash
# Edit the file
vim pages/dashboard/events.vue

# Find lines 509-583
# Delete the mock events array
# Add the async mounted() hook
# Implement loadEvents() and loadEventStats()
# Test with: npm run dev
```

### Step 2: Update Stock Page (PRIORITY 2)
```bash
# Edit the file
vim pages/dashboard/stock/index.vue

# Find lines 522-590
# Delete the mock vehicles array
# Add async mounted() hook
# Implement loadVehicles()
# Test filtering and CRUD
```

### Step 3: Fix Dashboard Store (PRIORITY 3)
```bash
# Edit the file
vim store/dashboard.js

# Line 82: Uncomment the API call
# Lines 84-114: Delete mock response
# Lines 142-143: Remove loadMockData call
# Test queue management pages
```

### Step 4: Analytics (PRIORITY 4)
```bash
# Choose Option A or B
# Option A: Create backend API (better long-term)
# Option B: Calculate client-side (faster to implement)

# Replace analytics.vue with improved version
cp pages/dashboard/analytics-improved.vue pages/dashboard/analytics.vue
```

---

## Expected Outcomes

After completing all phases:

### Phase 1 Complete:
- ✅ Events management fully functional with real data
- ✅ Stock management showing live inventory
- ✅ Queue management using API throughout
- ✅ No mock data in production code

### Phase 2 Complete:
- ✅ Real-time analytics and reporting
- ✅ Accurate business metrics
- ✅ Data-driven decision making

### Phase 3 Complete:
- ✅ Modern, interactive UI
- ✅ Better user experience
- ✅ Professional data visualization
- ✅ Export capabilities

---

## Risk Assessment

### Low Risk:
- Events page update (API already exists and tested)
- Stock page update (API already exists)
- Dashboard store fix (simple uncomment)

### Medium Risk:
- Analytics implementation (requires careful calculation OR backend work)

### High Risk:
- None identified

---

## Recommendations

### Immediate Actions (This Week):
1. **Update Events Page** - CRITICAL, API exists, easy fix
2. **Update Stock Page** - CRITICAL, API exists, easy fix
3. **Fix Dashboard Store** - HIGH, simple change

### Short Term (Next Week):
4. **Implement Analytics** - Choose Option A or B
5. **Deploy Improved Analytics UI**

### Long Term (Next Month):
6. **Create remaining analytics endpoints** (if Option B chosen first)
7. **Add more visualizations**
8. **Implement real-time updates** (WebSockets)
9. **Add export functionality**
10. **Performance optimization**

---

## Support Resources

### Documentation:
- Backend API: `/API_DOCUMENTATION.md` (in isuzustock-management repo)
- Implementation Guide: `/IMPLEMENTATION_SUMMARY.md`
- This Report: `/FRONTEND_AUDIT_REPORT.md`

### API Endpoints Available:
```javascript
// Test Drives
$api.testDrives.getAll()
$api.testDrives.create()
$api.testDrives.update()
$api.testDrives.delete()

// Events (NEW)
$api.events.getAll()
$api.events.getStats()
$api.events.create()
$api.events.update()
$api.events.delete()
$api.events.bookVehicles()
$api.events.returnVehicles()
$api.events.extendEvent()

// Stock
$api.stock.getAll()
$api.stock.getVehicles()
$api.stock.getById()
$api.stock.updateStatus()
$api.stock.create()
$api.stock.delete()
```

---

## Conclusion

The testdrive-stock-system has **3 critical pages** that need immediate attention to connect to existing APIs. The work is straightforward and can be completed in approximately **6 hours** for Phase 1.

**Analytics** requires either backend development (8-10 hours) OR client-side calculation (4-5 hours). I recommend Option B for quick deployment, then migrate to Option A later.

All necessary APIs are already implemented and documented. The main task is removing mock data and adding proper API integration with error handling and loading states.

---

**Generated with Claude Code**
**Date**: 2025-10-27
