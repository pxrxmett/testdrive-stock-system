<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Clean Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-semibold text-gray-900">จัดการอีเวนต์รถยนต์</h1>
              <p class="text-sm text-gray-600">ระบบจัดการและจองรถสำหรับงานแสดงและอีเวนต์</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <!-- Quick Event Button -->
            <button 
              @click="quickCreateEvent" 
              class="flex items-center space-x-2 px-4 py-2 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span class="text-sm font-medium">อีเวนต์ฉุกเฉิน</span>
            </button>
            
            <nuxt-link
              to="/dashboard/events/add"
              class="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span class="text-sm font-medium">สร้างอีเวนต์ใหม่</span>
            </nuxt-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Alert Section for Overdue Events -->
    <div v-if="overdueEvents.length > 0" class="mx-6 mt-6">
      <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div class="flex items-start space-x-3">
          <svg class="w-5 h-5 text-orange-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
          <div class="flex-1">
            <h3 class="text-sm font-medium text-orange-800">มีรถถูกล็อกในอีเวนต์ที่เลยกำหนดแล้ว</h3>
            <div class="mt-2 text-sm text-orange-700">
              มีรถ <span class="font-semibold">{{ getTotalOverdueVehicles() }}</span> คัน ในอีเวนต์ที่เลยกำหนดไป {{ overdueEvents.length }} อีเวนต์
            </div>
            <div class="mt-3 flex space-x-3">
              <button 
                @click="showOverdueModal = true"
                class="text-sm bg-white border border-orange-300 text-orange-700 px-3 py-1.5 rounded hover:bg-orange-50"
              >
                ดูรายละเอียด
              </button>
              <button 
                @click="returnAllOverdueVehicles"
                class="text-sm bg-orange-600 text-white px-3 py-1.5 rounded hover:bg-orange-700"
              >
                คืนรถทั้งหมด
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <main class="px-6 py-6 space-y-6">
      <!-- Stats Cards -->
      <section class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white p-6 rounded-lg border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">อีเวนต์ทั้งหมด</p>
              <p class="text-2xl font-semibold text-gray-900 mt-1">{{ eventStats.total }}</p>
              <div class="flex items-center mt-2">
                <svg class="w-3 h-3 text-green-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
                <span class="text-xs text-green-600">+15%</span>
              </div>
            </div>
            <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-lg border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">กำลังดำเนินการ</p>
              <p class="text-2xl font-semibold text-gray-900 mt-1">{{ eventStats.active }}</p>
              <div class="flex items-center mt-2">
                <div class="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span class="text-xs text-gray-600">ดำเนินการอยู่</span>
              </div>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-lg border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">รถที่จองแล้ว</p>
              <p class="text-2xl font-semibold text-gray-900 mt-1">{{ eventStats.bookedVehicles }}</p>
              <div class="flex items-center mt-2">
                <div class="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                <span class="text-xs text-gray-600">ถูกจองแล้ว</span>
              </div>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-lg border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">เลยกำหนด</p>
              <p class="text-2xl font-semibold text-gray-900 mt-1">{{ overdueEvents.length }}</p>
              <div class="flex items-center mt-2">
                <svg class="w-3 h-3 text-orange-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span class="text-xs text-gray-600">ต้องดำเนินการ</span>
              </div>
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <!-- Auto Return Settings -->
      <section class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">การตั้งค่าระบบ</h3>
          <div class="flex items-center space-x-4">
            <label class="flex items-center space-x-2">
              <input 
                v-model="systemSettings.autoReturnEnabled" 
                type="checkbox" 
                class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              >
              <span class="text-sm text-gray-700">เปิดการคืนรถอัตโนมัติ</span>
            </label>
            <div class="flex items-center space-x-2">
              <label class="text-sm text-gray-700">Grace Period:</label>
              <select 
                v-model="systemSettings.gracePeriodDays" 
                class="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="1">1 วัน</option>
                <option value="3">3 วัน</option>
                <option value="7">7 วัน</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              v-model="searchTerm"
              type="text"
              placeholder="ค้นหาชื่ออีเวนต์, สถานที่..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
            />
          </div>
          
          <select 
            v-model="filterStatus" 
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
          >
            <option value="ทั้งหมด">สถานะทั้งหมด</option>
            <option value="วางแผน">วางแผน</option>
            <option value="เตรียมการ">เตรียมการ</option>
            <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
            <option value="เสร็จสิ้น">เสร็จสิ้น</option>
            <option value="เลยกำหนด">เลยกำหนด</option>
          </select>
          
          <select 
            v-model="filterType" 
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
          >
            <option value="ทั้งหมด">ประเภททั้งหมด</option>
            <option value="งานแสดงรถ">งานแสดงรถ</option>
            <option value="ทดลองขับ">ทดลองขับ</option>
            <option value="ส่งมอบรถ">ส่งมอบรถ</option>
            <option value="การตลาด">การตลาด</option>
          </select>
          
          <input
            v-model="filterDate"
            type="date"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
          />
          
          <button 
            @click="clearFilters" 
            class="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span class="text-sm">รีเซ็ต</span>
          </button>
        </div>
      </section>

      <!-- Events Display -->
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">รายการอีเวนต์</h3>
          <div class="flex items-center space-x-3">
            <span class="text-sm text-gray-600">
              แสดง <span class="font-medium text-gray-900">{{ filteredEvents.length }}</span> จาก <span class="font-medium text-gray-900">{{ events.length }}</span> อีเวนต์
            </span>
          </div>
        </div>

        <!-- Events Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div 
            v-for="event in filteredEvents" 
            :key="event.id" 
            class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            :class="{ 'border-orange-300 bg-orange-50': isEventOverdue(event) }"
          >
            <!-- Event Header -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-500">{{ formatEventId(event.id) }}</div>
                  <div class="text-lg font-bold text-gray-900">{{ event.title || event.name }}</div>
                </div>
              </div>
              <div class="flex flex-col space-y-1">
                <span :class="getEventStatusClass(event)" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                  {{ getEventStatus(event) }}
                </span>
                <span v-if="isEventOverdue(event)" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  เลย {{ getDaysOverdue(event) }} วัน
                </span>
              </div>
            </div>

            <!-- Event Info -->
            <div class="mb-4 space-y-3">
              <div class="flex items-center space-x-2 text-sm text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                </svg>
                <span>{{ event.location }}</span>
              </div>
              
              <div class="flex items-center space-x-2 text-sm text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"/>
                </svg>
                <span>{{ formatDate(event.startDate) }} - {{ formatDate(event.endDate) }}</span>
              </div>
              
              <div class="flex items-center space-x-2">
                <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                  {{ event.type }}
                </span>
                <span class="text-xs text-gray-500">
                  {{ event.vehiclesCount || event.bookedVehicles.length }} รถถูกจอง
                </span>
              </div>

              <div class="flex items-center space-x-2 text-sm text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <span>สร้างโดย: {{ event.creatorName || 'ไม่ระบุ' }}</span>
              </div>

              <!-- Auto Return Info -->
              <div v-if="event.autoReturnEnabled && !event.autoReturnedAt" class="text-xs text-purple-600 bg-purple-50 p-2 rounded">
                คืนอัตโนมัติ: {{ formatAutoReturnTime(event) }}
              </div>
              <div v-if="event.autoReturnedAt" class="text-xs text-green-600 bg-green-50 p-2 rounded">
                คืนรถแล้ว: {{ formatDate(event.autoReturnedAt) }}
              </div>
            </div>

            <!-- Booked Vehicles -->
            <div v-if="event.bookedVehicles.length > 0" class="mb-4">
              <div class="text-xs font-medium text-gray-700 mb-2">รถที่จองแล้ว</div>
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="vehicle in event.bookedVehicles.slice(0, 3)" 
                  :key="vehicle" 
                  class="inline-flex items-center px-2 py-1 rounded text-xs bg-purple-100 text-purple-800"
                >
                  {{ vehicle }}
                </span>
                <span v-if="event.bookedVehicles.length > 3" class="text-xs text-gray-500 px-2 py-1">
                  +{{ event.bookedVehicles.length - 3 }} รายการ
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-100">
              <div class="flex items-center space-x-1">
                <!-- Quick Return Button -->
                <button 
                  v-if="event.bookedVehicles.length > 0"
                  @click="quickReturnVehicles(event)"
                  class="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                  title="คืนรถด่วน"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
                  </svg>
                </button>
                
                <!-- Extend Event Button -->
                <button 
                  v-if="isEventOverdue(event)"
                  @click="extendEvent(event)"
                  class="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="ขยายอีเวนต์"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </button>

                <!-- Manage Vehicles -->
                <button 
                  @click="manageVehicles(event)"
                  class="p-2 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                  title="จัดการรถยนต์"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                </button>
              </div>

              <div class="flex items-center space-x-1">
                <button 
                  @click="viewEvent(event)"
                  class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  title="ดูรายละเอียด"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
                
                <button 
                  @click="editEvent(event)"
                  class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="แก้ไขอีเวนต์"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>
                
                <button 
                  @click="deleteEvent(event)"
                  class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="ลบอีเวนต์"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <EmptyState
          v-if="filteredEvents.length === 0"
          title="ไม่พบอีเวนต์"
          description="ลองปรับเปลี่ยนเงื่อนไขการค้นหาหรือสร้างอีเวนต์ใหม่เพื่อเริ่มจัดการรถยนต์สำหรับงานแสดง"
          actionLabel="สร้างอีเวนต์ใหม่"
          actionVariant="primary"
          @action="() => $router.push('/dashboard/events/add')"
        >
          <template #icon>
            <div class="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"/>
              </svg>
            </div>
          </template>
        </EmptyState>
      </section>

      <!-- Summary Footer -->
      <section class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-600">
            <span class="font-medium text-gray-900">{{ filteredEvents.length }}</span> อีเวนต์
            <span v-if="filteredEvents.length !== events.length">
              จากทั้งหมด <span class="font-medium text-gray-900">{{ events.length }}</span> อีเวนต์
            </span>
          </div>
          
          <div class="flex items-center space-x-3">
            <button class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm">
              Export Calendar
            </button>
            <button class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm">
              Export Report
            </button>
          </div>
        </div>
      </section>
    </main>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div class="relative mx-auto p-8 border w-full max-w-md shadow-2xl rounded-xl bg-white">
        <!-- Icon -->
        <div class="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </div>

        <!-- Content -->
        <div class="text-center">
          <h3 class="text-xl font-bold text-gray-900 mb-2">ยืนยันการลบอีเวนต์</h3>
          <p class="text-sm text-gray-600 mb-4">การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>

          <!-- Event Info -->
          <div v-if="eventToDelete" class="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div class="space-y-2">
              <div class="flex items-start">
                <svg class="w-5 h-5 text-gray-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"/>
                </svg>
                <div class="flex-1">
                  <p class="text-xs text-gray-500">อีเวนต์</p>
                  <p class="font-medium text-gray-900">{{ eventToDelete.title || eventToDelete.name }}</p>
                </div>
              </div>

              <div class="flex items-start">
                <svg class="w-5 h-5 text-gray-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                </svg>
                <div class="flex-1">
                  <p class="text-xs text-gray-500">สถานที่</p>
                  <p class="font-medium text-gray-900">{{ eventToDelete.location }}</p>
                </div>
              </div>

              <div class="flex items-start">
                <svg class="w-5 h-5 text-gray-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
                <div class="flex-1">
                  <p class="text-xs text-gray-500">รถที่จอง</p>
                  <p class="font-medium text-gray-900">{{ eventToDelete.bookedVehicles?.length || 0 }} คัน</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end space-x-3">
            <button
              @click="cancelDelete"
              class="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              @click="confirmDelete"
              :disabled="deleting"
              class="px-5 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <svg v-if="deleting" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ deleting ? 'กำลังลบ...' : 'ลบอีเวนต์' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Event Modal -->
    <div v-if="showEventModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-10 mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
        <div class="mb-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-gray-900">สร้างอีเวนต์ใหม่</h3>
            <button @click="showEventModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <form @submit.prevent="createEvent" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">ชื่ออีเวนต์ <span class="text-red-500">*</span></label>
              <input
                v-model="newEvent.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="กรอกชื่ออีเวนต์"
              >
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">สถานที่ <span class="text-red-500">*</span></label>
              <input
                v-model="newEvent.location"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="กรอกสถานที่จัดงาน"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">วันเริ่มต้น <span class="text-red-500">*</span></label>
              <input
                v-model="newEvent.startDate"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">วันสิ้นสุด <span class="text-red-500">*</span></label>
              <input
                v-model="newEvent.endDate"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">ประเภท <span class="text-red-500">*</span></label>
              <select
                v-model="newEvent.type"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                :class="{ 'border-red-500': !newEvent.type }"
              >
                <option value="" disabled>-- เลือกประเภท --</option>
                <option value="งานแสดงรถ">งานแสดงรถ</option>
                <option value="ทดลองขับ">ทดลองขับ</option>
                <option value="ส่งมอบรถ">ส่งมอบรถ</option>
                <option value="การตลาด">การตลาด</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">สถานะ <span class="text-red-500">*</span></label>
              <select
                v-model="newEvent.status"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="วางแผน">วางแผน</option>
                <option value="เตรียมการ">เตรียมการ</option>
                <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
              </select>
            </div>

            <div class="md:col-span-2">
              <label class="flex items-center space-x-2">
                <input
                  v-model="newEvent.autoReturnEnabled"
                  type="checkbox"
                  class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                >
                <span class="text-sm text-gray-700">เปิดการคืนรถอัตโนมัติ</span>
              </label>
            </div>
          </div>

          <div class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              @click="showEventModal = false"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              สร้างอีเวนต์
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Overdue Events Modal -->
    <div v-if="showOverdueModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">อีเวนต์ที่เลยกำหนด</h3>
            <button @click="showOverdueModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="space-y-3 max-h-60 overflow-y-auto">
            <div v-for="event in overdueEvents" :key="event.id" class="p-3 border border-orange-200 rounded-lg bg-orange-50">
              <div class="font-medium text-gray-900">{{ event.name }}</div>
              <div class="text-sm text-gray-600">{{ event.bookedVehicles.length }} รถถูกจอง</div>
              <div class="text-xs text-orange-600">เลยกำหนด {{ getDaysOverdue(event) }} วัน</div>
              <div class="mt-2 flex space-x-2">
                <button
                  @click="quickReturnVehicles(event)"
                  class="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                >
                  คืนรถ
                </button>
                <button
                  @click="extendEvent(event)"
                  class="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                >
                  ขยายเวลา
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SmartEventManagement',
  layout: 'dashboard',
  
  data() {
    return {
      searchTerm: '',
      filterStatus: 'ทั้งหมด',
      filterType: 'ทั้งหมด',
      filterDate: '',
      showEventModal: false,
      showOverdueModal: false,
      showDeleteModal: false,
      eventToDelete: null,
      deleting: false,
      systemSettings: {
        autoReturnEnabled: true,
        gracePeriodDays: 3,
        notificationsEnabled: true
      },
      eventStats: {
        total: 0,
        active: 0,
        bookedVehicles: 0,
        upcoming: 0
      },
      events: [],
      loading: false,
      error: null,
      autoReturnTimer: null,
      notificationTimer: null,
      newEvent: {
        name: '',
        location: '',
        startDate: '',
        endDate: '',
        type: '',
        status: 'วางแผน',
        autoReturnEnabled: true
      }
    }
  },
  
  computed: {
    filteredEvents() {
      let filtered = this.events
      
      if (this.searchTerm) {
        const search = this.searchTerm.toLowerCase()
        filtered = filtered.filter(event =>
          event.name?.toLowerCase().includes(search) ||
          event.location?.toLowerCase().includes(search) ||
          event.id?.toLowerCase().includes(search)
        )
      }
      
      if (this.filterStatus !== 'ทั้งหมด') {
        if (this.filterStatus === 'เลยกำหนด') {
          filtered = filtered.filter(event => this.isEventOverdue(event))
        } else {
          filtered = filtered.filter(event => event.status === this.filterStatus)
        }
      }
      
      if (this.filterType !== 'ทั้งหมด') {
        filtered = filtered.filter(event => event.type === this.filterType)
      }
      
      if (this.filterDate) {
        filtered = filtered.filter(event => 
          event.startDate <= this.filterDate && event.endDate >= this.filterDate
        )
      }
      
      return filtered
    },
    
    overdueEvents() {
      return this.events.filter(event => this.isEventOverdue(event))
    }
  },
  
  methods: {
    // API Integration Methods
    async fetchEvents() {
      try {
        this.loading = true
        this.error = null

        const response = await this.$api.events.getAll()
        const apiData = Array.isArray(response) ? response : (response.data || [])

        console.log('📋 API Events Response:', apiData)

        // Fetch vehicles for each event separately
        const eventsWithVehicles = await Promise.all(
          apiData.map(async (event) => {
            // Fetch vehicles for this event
            let vehiclesList = []
            try {
              const vehiclesResponse = await this.$api.events.getVehicles(event.id)
              console.log(`📦 Raw vehicles response for ${event.title}:`, vehiclesResponse)
              vehiclesList = Array.isArray(vehiclesResponse)
                ? vehiclesResponse
                : (vehiclesResponse.data || vehiclesResponse.vehicles || [])
              console.log(`🚗 Event ${event.title}: ${vehiclesList.length} vehicles`, vehiclesList)
            } catch (err) {
              console.error(`Error fetching vehicles for event ${event.id}:`, err)
              vehiclesList = []
            }

            // Get creator name - use current user info if it's them
            let creatorName = 'ไม่ระบุ'
            if (event.createdBy) {
              const currentUser = this.$store.state.auth?.user
              if (currentUser && currentUser.id === event.createdBy) {
                // Event created by current user
                creatorName = currentUser.name || currentUser.username || 'คุณ'
              } else {
                // Event created by someone else - just show "Admin" or "Staff"
                // Backend doesn't have /staffs/{id} endpoint yet
                creatorName = 'Admin'
              }
            }

            return {
              id: event.id,
              name: event.title || event.name,
              title: event.title || event.name,
              location: event.location,
              startDate: event.start_date || event.startDate,
              endDate: event.end_date || event.endDate,
              status: this.mapAPIStatus(event.status),
              type: this.mapAPIType(event.type),
              bookedVehicles: vehiclesList.map(v => v.plateNumber || v.plate_number || v.carCard || v.id),
              vehiclesCount: vehiclesList.length,
              autoReturnEnabled: event.auto_return_enabled !== false,
              autoReturnedAt: event.auto_returned_at || event.autoReturnedAt,
              createdAt: event.created_at || event.createdAt,
              createdBy: event.createdBy,
              creatorName: creatorName
            }
          })
        )

        this.events = eventsWithVehicles

        // Calculate stats from events data
        this.updateEventStats()
      } catch (error) {
        console.error('Error fetching events:', error)
        this.error = error.response?.data?.message || error.message || 'ไม่สามารถดึงข้อมูลอีเวนต์ได้'
        this.$toast?.error(`เกิดข้อผิดพลาด: ${this.error}`)
      } finally {
        this.loading = false
      }
    },

    mapAPIStatus(apiStatus) {
      const statusMap = {
        'planning': 'วางแผน',
        'preparing': 'เตรียมการ',
        'in_progress': 'กำลังดำเนินการ',
        'completed': 'เสร็จสิ้น',
        'overdue': 'เลยกำหนด'
      }
      return statusMap[apiStatus] || apiStatus
    },

    mapAPIType(apiType) {
      const typeMap = {
        'car_show': 'งานแสดงรถ',
        'test_drive': 'ทดลองขับ',
        'marketing': 'การตลาด',
        'delivery': 'ส่งมอบรถ',
        'emergency': 'ฉุกเฉิน'
      }
      return typeMap[apiType] || apiType
    },

    mapStatusToAPI(frontendStatus) {
      const statusMap = {
        'วางแผน': 'planning',
        'เตรียมการ': 'preparing',
        'กำลังดำเนินการ': 'in_progress',
        'เสร็จสิ้น': 'completed',
        'เลยกำหนด': 'overdue'
      }
      return statusMap[frontendStatus] || frontendStatus
    },

    mapTypeToAPI(frontendType) {
      const typeMap = {
        'งานแสดงรถ': 'car_show',
        'ทดลองขับ': 'test_drive',
        'การตลาด': 'marketing',
        'ส่งมอบรถ': 'delivery',
        'ฉุกเฉิน': 'emergency'
      }
      return typeMap[frontendType] || frontendType
    },

    // Event Status Management
    getEventStatus(event) {
      if (this.isEventOverdue(event)) {
        return 'เลยกำหนด'
      }
      return event.status
    },
    
    getEventStatusClass(event) {
      const status = this.getEventStatus(event)
      switch (status) {
        case 'วางแผน': return 'text-gray-700 bg-gray-100 border border-gray-300'
        case 'เตรียมการ': return 'text-orange-700 bg-orange-100 border border-orange-300'
        case 'กำลังดำเนินการ': return 'text-blue-700 bg-blue-100 border border-blue-300'
        case 'เสร็จสิ้น': return 'text-green-700 bg-green-100 border border-green-300'
        case 'เลยกำหนด': return 'text-red-700 bg-red-100 border border-red-300'
        default: return 'text-gray-700 bg-gray-100 border border-gray-300'
      }
    },

    formatEventId(uuid) {
      // Convert UUID to readable Event ID (e.g., EVT-001)
      if (!uuid) return 'N/A'

      // Sort events by creation date (oldest first) to get consistent numbering
      const sortedEvents = [...this.events].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0)
        const dateB = new Date(b.createdAt || 0)
        return dateA - dateB
      })

      // Find the index of this event in the sorted array
      const eventIndex = sortedEvents.findIndex(e => e.id === uuid)

      if (eventIndex !== -1) {
        // Use index + 1 for sequential numbering (EVT-001, EVT-002, etc.)
        // Event created first = EVT-001, second = EVT-002, etc.
        return `EVT-${String(eventIndex + 1).padStart(3, '0')}`
      }

      // Fallback: use hash if not found (for details page when events array is not loaded)
      const hash = uuid.substring(0, 8)
      const num = parseInt(hash, 16) % 1000
      return `EVT-${String(num).padStart(3, '0')}`
    },
    
    isEventOverdue(event) {
      if (event.status === 'เสร็จสิ้น' || event.autoReturnedAt) return false
      
      const now = new Date()
      const eventEndDate = new Date(event.endDate)
      const gracePeriod = this.systemSettings.gracePeriodDays * 24 * 60 * 60 * 1000
      
      return now.getTime() > (eventEndDate.getTime() + gracePeriod)
    },
    
    getDaysOverdue(event) {
      const now = new Date()
      const eventEndDate = new Date(event.endDate)
      const gracePeriod = this.systemSettings.gracePeriodDays * 24 * 60 * 60 * 1000
      const overdueTime = now.getTime() - (eventEndDate.getTime() + gracePeriod)
      
      return Math.floor(overdueTime / (24 * 60 * 60 * 1000))
    },
    
    // Quick Actions
    async createEvent() {
      let eventData = null // Declare outside try-catch for error logging

      try {
        // Validate required fields
        if (!this.newEvent.name || !this.newEvent.name.trim()) {
          this.$toast?.error('กรุณากรอกชื่ออีเวนต์')
          return
        }

        if (!this.newEvent.location || !this.newEvent.location.trim()) {
          this.$toast?.error('กรุณากรอกสถานที่')
          return
        }

        if (!this.newEvent.type || this.newEvent.type === '') {
          this.$toast?.error('กรุณาเลือกประเภทอีเวนต์')
          return
        }

        if (!this.newEvent.startDate) {
          this.$toast?.error('กรุณาเลือกวันเริ่มต้น')
          return
        }

        if (!this.newEvent.endDate) {
          this.$toast?.error('กรุณาเลือกวันสิ้นสุด')
          return
        }

        // Validate dates are in ISO 8601 format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/
        if (!dateRegex.test(this.newEvent.startDate) || !dateRegex.test(this.newEvent.endDate)) {
          console.error('❌ Invalid date format:', {
            startDate: this.newEvent.startDate,
            endDate: this.newEvent.endDate
          })
          this.$toast?.error('รูปแบบวันที่ไม่ถูกต้อง กรุณาเลือกวันที่ใหม่')
          return
        }

        // Validate end date is after start date
        if (new Date(this.newEvent.endDate) < new Date(this.newEvent.startDate)) {
          this.$toast?.error('วันสิ้นสุดต้องมาหลังวันเริ่มต้น')
          return
        }

        // Map frontend data to API format (match backend DTO)
        eventData = {
          title: this.newEvent.name.trim(),  // Backend uses 'title' not 'name'
          location: this.newEvent.location.trim(),
          startDate: this.newEvent.startDate + 'T00:00:00.000Z',  // ISO 8601 format
          endDate: this.newEvent.endDate + 'T23:59:59.999Z',      // ISO 8601 format
          status: this.mapStatusToAPI(this.newEvent.status),
          type: this.mapTypeToAPI(this.newEvent.type),
          description: '' // Optional field
          // Note: auto_return_enabled and organized_by are not accepted by backend
        }

        console.log('📤 Creating event with data:', JSON.stringify(eventData, null, 2))

        try {
          const response = await this.$api.events.create(eventData)
          console.log('✅ Event created successfully:', response)
        } catch (apiError) {
          // Check if it's a network error or backend is down
          if (!apiError.response) {
            throw new Error('ไม่สามารถเชื่อมต่อกับ API Server ได้ กรุณาตรวจสอบว่า backend server ทำงานอยู่ที่ http://localhost:3000')
          }
          throw apiError
        }

        await this.fetchEvents() // Refresh events list
        this.$toast?.success(`สร้างอีเวนต์ "${this.newEvent.name}" เรียบร้อยแล้ว`)

        // Reset form and close modal
        this.newEvent = {
          name: '',
          location: '',
          startDate: '',
          endDate: '',
          type: '',
          status: 'วางแผน',
          autoReturnEnabled: true
        }
        this.showEventModal = false
      } catch (error) {
        console.error('❌ Error creating event:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers,
          formData: this.newEvent,
          eventData: eventData || 'Not created yet'
        })

        // Log full error response for debugging
        console.error('🔍 Full error response:', JSON.stringify(error.response?.data, null, 2))

        // Display detailed error message from backend
        let errorMessage = 'ไม่สามารถสร้างอีเวนต์ได้'

        if (error.response?.data) {
          const data = error.response.data

          // Handle validation errors
          if (data.errors && Array.isArray(data.errors)) {
            errorMessage = data.errors.map(e => e.message || e).join(', ')
          } else if (data.message) {
            errorMessage = data.message
          } else if (data.error) {
            errorMessage = data.error
          } else if (typeof data === 'string') {
            errorMessage = data
          } else {
            // If none of the above, show the whole data object
            errorMessage = JSON.stringify(data)
          }
        } else if (error.message) {
          errorMessage = error.message
        }

        this.$toast?.error(`เกิดข้อผิดพลาด: ${errorMessage}`)

        // Log detailed error for debugging
        console.log('📋 Validation failed for:', eventData)
      }
    },

    async quickCreateEvent() {
      const eventName = prompt('ชื่ออีเวนต์ฉุกเฉิน:')
      if (!eventName) return

      try {
        const today = new Date().toISOString().split('T')[0]
        const eventData = {
          title: eventName,  // Backend uses 'title' not 'name'
          location: 'ระบุสถานที่',
          startDate: today + 'T00:00:00.000Z',  // ISO 8601 format
          endDate: today + 'T23:59:59.999Z',    // ISO 8601 format
          status: 'in_progress',
          type: 'emergency',
          description: 'สร้างอีเวนต์ฉุกเฉิน'
        }

        const response = await this.$api.events.create(eventData)
        await this.fetchEvents() // Refresh events list
        this.$toast?.success(`สร้างอีเวนต์ฉุกเฉิน "${eventName}" เรียบร้อยแล้ว`)
      } catch (error) {
        console.error('Error creating quick event:', error)
        this.$toast?.error('ไม่สามารถสร้างอีเวนต์ได้')
      }
    },
    
    async quickReturnVehicles(event) {
      if (event.bookedVehicles.length === 0) {
        this.$toast?.info('ไม่มีรถที่ต้องคืน')
        return
      }

      if (confirm(`คืนรถ ${event.bookedVehicles.length} คัน จากอีเวนต์ "${event.name}" หรือไม่?`)) {
        try {
          const returnedCount = event.bookedVehicles.length
          await this.$api.events.returnVehicles(event.id)
          await this.fetchEvents() // Refresh events list
          this.$toast?.success(`คืนรถ ${returnedCount} คัน เรียบร้อยแล้ว`)

          // Emit to parent for stock management integration
          this.$emit('vehicles-returned', {
            eventId: event.id,
            returnedAt: new Date().toISOString()
          })
        } catch (error) {
          console.error('Error returning vehicles:', error)
          this.$toast?.error('ไม่สามารถคืนรถได้')
        }
      }
    },
    
    async extendEvent(event) {
      const days = prompt('ขยายอีเวนต์เป็นกี่วัน:', '3')
      if (!days || isNaN(days)) return

      try {
        await this.$api.events.extendEvent(event.id, parseInt(days))
        await this.fetchEvents() // Refresh events list
        this.$toast?.success(`ขยายอีเวนต์ "${event.name}" เป็น ${days} วัน`)
      } catch (error) {
        console.error('Error extending event:', error)
        this.$toast?.error('ไม่สามารถขยายอีเวนต์ได้')
      }
    },
    
    async returnAllOverdueVehicles() {
      if (!confirm(`คืนรถจากอีเวนต์ที่เลยกำหนดทั้งหมด ${this.overdueEvents.length} อีเวนต์ หรือไม่?`)) {
        return
      }

      try {
        const totalVehicles = this.getTotalOverdueVehicles()
        await this.$api.events.autoReturnOverdue()
        await this.fetchEvents() // Refresh events list
        this.showOverdueModal = false
        this.$toast?.success(`คืนรถทั้งหมด ${totalVehicles} คัน เรียบร้อยแล้ว`)
      } catch (error) {
        console.error('Error returning overdue vehicles:', error)
        this.$toast?.error('ไม่สามารถคืนรถได้')
      }
    },
    
    getTotalOverdueVehicles() {
      return this.overdueEvents.reduce((total, event) => total + event.bookedVehicles.length, 0)
    },
    
    // Auto Return System
    initSmartReturnSystem() {
      if (!this.systemSettings.autoReturnEnabled) return
      
      // Check every hour for overdue events
      this.autoReturnTimer = setInterval(() => {
        this.checkOverdueEvents()
      }, 60 * 60 * 1000)
      
      // Check notifications every 30 minutes
      this.notificationTimer = setInterval(() => {
        this.checkEventNotifications()
      }, 30 * 60 * 1000)
      
      // Initial check
      this.checkOverdueEvents()
      this.checkEventNotifications()
    },
    
    checkOverdueEvents() {
      const overdueEvents = this.events.filter(event => 
        this.isEventOverdue(event) && 
        event.bookedVehicles.length > 0 &&
        event.autoReturnEnabled &&
        !event.autoReturnedAt
      )
      
      overdueEvents.forEach(event => {
        const daysOverdue = this.getDaysOverdue(event)
        
        // Auto return after grace period + 3 additional days
        if (daysOverdue >= 3) {
          this.autoReturnEventVehicles(event)
        }
      })
    },
    
    checkEventNotifications() {
      if (!this.systemSettings.notificationsEnabled) return
      
      const today = new Date().toISOString().split('T')[0]
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      
      // Events ending today
      this.events.forEach(event => {
        if (event.endDate === today && event.bookedVehicles.length > 0) {
          this.$toast?.warning(`อีเวนต์ "${event.name}" จะสิ้นสุดวันนี้`)
        }
      })
      
      // Events ending tomorrow
      this.events.forEach(event => {
        if (event.endDate === tomorrow && event.bookedVehicles.length > 0) {
          this.$toast?.info(`อีเวนต์ "${event.name}" จะสิ้นสุดพรุ่งนี้`)
        }
      })
    },
    
    autoReturnEventVehicles(event) {
      const returnedVehicles = [...event.bookedVehicles]
      event.bookedVehicles = []
      event.status = 'เสร็จสิ้น'
      event.autoReturnedAt = new Date().toISOString()
      
      this.updateEventStats()
      this.$toast?.success(`คืนรถอัตโนมัติจากอีเวนต์ "${event.name}" - ${returnedVehicles.length} คัน`)
      
      this.$emit('vehicles-auto-returned', {
        eventId: event.id,
        vehicleIds: returnedVehicles,
        returnedAt: event.autoReturnedAt
      })
    },
    
    // Utility Methods
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
    
    formatAutoReturnTime(event) {
      if (!event.autoReturnEnabled || event.autoReturnedAt) return ''
      
      const eventEndDate = new Date(event.endDate)
      const gracePeriod = this.systemSettings.gracePeriodDays * 24 * 60 * 60 * 1000
      const autoReturnTime = new Date(eventEndDate.getTime() + gracePeriod)
      
      return autoReturnTime.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
    
    clearFilters() {
      this.searchTerm = ''
      this.filterStatus = 'ทั้งหมด'
      this.filterType = 'ทั้งหมด'
      this.filterDate = ''
    },
    
    manageVehicles(event) {
      this.$toast?.info(`จัดการรถยนต์สำหรับอีเวนต์ ${event.name}`)
    },
    
    viewEvent(event) {
      this.$router.push(`/dashboard/events/${event.id}`)
    },
    
    editEvent(event) {
      this.$router.push(`/dashboard/events/${event.id}/edit`)
    },
    
    deleteEvent(event) {
      // Show modal instead of browser confirm
      this.eventToDelete = event
      this.showDeleteModal = true
    },

    cancelDelete() {
      this.showDeleteModal = false
      this.eventToDelete = null
    },

    async confirmDelete() {
      if (!this.eventToDelete) return

      try {
        this.deleting = true

        // Call API to delete event
        await this.$api.events.delete(this.eventToDelete.id)

        // Remove from local array
        const index = this.events.findIndex(e => e.id === this.eventToDelete.id)
        if (index !== -1) {
          this.events.splice(index, 1)
          this.updateEventStats()
        }

        this.$toast?.success(`ลบอีเวนต์ "${this.eventToDelete.name || this.eventToDelete.title}" เรียบร้อยแล้ว`)

        // Close modal
        this.showDeleteModal = false
        this.eventToDelete = null
      } catch (error) {
        console.error('Error deleting event:', error)
        this.$toast?.error('ไม่สามารถลบอีเวนต์ได้')
      } finally {
        this.deleting = false
      }
    },
    
    updateEventStats() {
      this.eventStats.total = this.events.length
      this.eventStats.active = this.events.filter(e => e.status === 'กำลังดำเนินการ').length
      this.eventStats.upcoming = this.events.filter(e => 
        e.status === 'วางแผน' || e.status === 'เตรียมการ'
      ).length
      this.eventStats.bookedVehicles = this.events.reduce((total, event) => 
        total + event.bookedVehicles.length, 0
      )
    }
  },
  
  async mounted() {
    await this.fetchEvents()
    this.initSmartReturnSystem()
  },
  
  beforeDestroy() {
    if (this.autoReturnTimer) {
      clearInterval(this.autoReturnTimer)
    }
    if (this.notificationTimer) {
      clearInterval(this.notificationTimer)
    }
  },
  
  head() {
    return {
      title: 'จัดการอีเวนต์รถยนต์ - ISUZU Enterprise System'
    }
  }
}
</script>

<style scoped>
/* Clean, minimal styles */
.transition-colors {
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
}

/* Focus styles for accessibility */
button:focus,
input:focus,
select:focus {
  outline: 2px solid #9333ea;
  outline-offset: 2px;
}

/* Custom date input styling */
input[type="date"] {
  color-scheme: light;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
}

/* Modal overlay */
.fixed.inset-0 {
  backdrop-filter: blur(4px);
}

/* Alert animation */
@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.bg-orange-50 {
  animation: slideDown 0.3s ease-out;
}
</style>