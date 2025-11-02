<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Clean Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-semibold text-gray-900">จัดการสต็อกรถยนต์</h1>
              <p class="text-sm text-gray-600">ระบบจัดการและติดตามสถานะรถยนต์</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <button
              @click="$router.push('/dashboard/stock/upload')"
              class="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span class="text-sm font-medium">📤 อัพโหลดไฟล์</span>
            </button>

            <button
              @click="$router.push('/dashboard/stock/create')"
              class="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span class="text-sm font-medium">+ เพิ่มรถใหม่</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="px-6 py-6 space-y-6">
      <!-- Stats Cards -->
      <section class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white p-6 rounded-lg border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">รถทั้งหมด</p>
              <p class="text-2xl font-semibold text-gray-900 mt-1">{{ stats.total }}</p>
              <div class="flex items-center mt-2">
                <svg class="w-3 h-3 text-green-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
                <span class="text-xs text-green-600">+8.7%</span>
              </div>
            </div>
            <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-lg border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">พร้อมใช้</p>
              <p class="text-2xl font-semibold text-gray-900 mt-1">{{ stats.available }}</p>
              <div class="flex items-center mt-2">
                <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span class="text-xs text-gray-600">สถานะปกติ</span>
              </div>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-lg border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">กำลังใช้งาน</p>
              <p class="text-2xl font-semibold text-gray-900 mt-1">{{ stats.inUse }}</p>
              <div class="flex items-center mt-2">
                <div class="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span class="text-xs text-gray-600">ใช้งานอยู่</span>
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
              <p class="text-sm font-medium text-gray-600">ล็อกอีเวนต์</p>
              <p class="text-2xl font-semibold text-gray-900 mt-1">{{ stats.eventLocked }}</p>
              <div class="flex items-center mt-2">
                <svg class="w-3 h-3 text-purple-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"/>
                </svg>
                <span class="text-xs text-gray-600">อีเวนต์พิเศษ</span>
              </div>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <!-- Search and Filters -->
      <section class="bg-white rounded-lg border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">ค้นหาและกรองข้อมูล</h3>
        
        <div class="grid grid-cols-1 lg:grid-cols-6 gap-4">
          <div class="lg:col-span-2 relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              v-model="searchTerm"
              type="text"
              placeholder="ค้นหาโดยรหัส, รุ่น, VIN, เลขทะเบียน..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          
          <select 
            v-model="filterCategory" 
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="ทั้งหมด">หมวดหมู่ทั้งหมด</option>
            <option value="กระบะ">กระบะ</option>
            <option value="SUV">SUV</option>
          </select>
          
          <select 
            v-model="filterType" 
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="ทั้งหมด">ประเภททั้งหมด</option>
            <option value="น้ำมัน">น้ำมัน</option>
            <option value="ไฟฟ้า">ไฟฟ้า</option>
          </select>
          
          <select 
            v-model="filterStatus" 
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="ทั้งหมด">สถานะทั้งหมด</option>
            <option value="พร้อมใช้">พร้อมใช้</option>
            <option value="ใช้งาน">ใช้งาน</option>
            <option value="บำรุงรักษา">บำรุงรักษา</option>
            <option value="ล็อกสำหรับอีเวนต์">ล็อกอีเวนต์</option>
          </select>
          
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

      <!-- Vehicle Display -->
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">รายการรถยนต์ในสต็อก</h3>
          <div class="flex items-center space-x-3">
            <span class="text-sm text-gray-600">
              แสดง <span class="font-medium text-gray-900">{{ filteredVehicles.length }}</span> จาก <span class="font-medium text-gray-900">{{ vehicles.length }}</span> รายการ
            </span>
            
            <!-- View Toggle -->
            <div class="flex bg-gray-100 rounded-lg p-1">
              <button 
                @click="viewMode = 'cards'"
                :class="viewMode === 'cards' ? 'bg-white shadow-sm' : ''"
                class="px-3 py-1 text-sm rounded transition-all"
                title="Card View"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
              </button>
              <button 
                @click="viewMode = 'list'"
                :class="viewMode === 'list' ? 'bg-white shadow-sm' : ''"
                class="px-3 py-1 text-sm rounded transition-all"
                title="List View"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                </svg>
              </button>
            </div>
            
            <button class="flex items-center space-x-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <span>Export</span>
            </button>
          </div>
        </div>

        <!-- Card Grid View -->
        <div v-if="viewMode === 'cards'" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div 
            v-for="vehicle in filteredVehicles" 
            :key="vehicle.id" 
            class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <!-- Header -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span class="text-sm font-semibold text-blue-600">{{ vehicle?.id?.toString().slice(-2) || '--' }}</span>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ vehicle.model || 'N/A' }}</div>
                  <div class="text-sm text-blue-600">{{ vehicle.plateNumber || 'ไม่มีทะเบียน' }}</div>
                </div>
              </div>
              <span :class="getStatusClass(vehicle.status)" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border">
                {{ getStatusText(vehicle.status) }}
              </span>
            </div>

            <!-- Vehicle Info -->
            <div class="mb-4">
              <h4 class="font-medium text-gray-900 mb-2">{{ vehicle.model }}</h4>
              <div class="flex items-center space-x-2 mb-3">
                <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                  {{ vehicle.category }}
                </span>
                <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                  {{ vehicle.year }}
                </span>
                <span :class="vehicle.type === 'ไฟฟ้า' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'" 
                      class="inline-flex items-center px-2 py-1 rounded text-xs font-medium">
                  {{ vehicle.type === 'ไฟฟ้า' ? 'EV' : 'ICE' }}
                </span>
              </div>
              <div class="text-sm text-gray-600">{{ vehicle.color }}</div>
            </div>

            <!-- Technical Info -->
            <div class="mb-4 space-y-2">
              <div class="bg-gray-50 p-3 rounded">
                <div class="text-xs text-gray-500 mb-1">VIN</div>
                <div class="text-sm font-mono text-gray-900">{{ vehicle.vin }}</div>
              </div>
              <div class="bg-gray-50 p-3 rounded">
                <div class="text-xs text-gray-500 mb-1">{{ vehicle.type === 'ไฟฟ้า' ? 'มอเตอร์' : 'เครื่องยนต์' }}</div>
                <div class="text-sm font-mono text-gray-900">
                  {{ vehicle.type === 'ไฟฟ้า' ? vehicle.motorNumber : vehicle.engineNumber }}
                </div>
              </div>
            </div>

            <!-- Event Info -->
            <div v-if="vehicle.eventDetails" class="mb-4 bg-purple-50 p-3 rounded">
              <div class="text-xs text-purple-600 font-medium mb-1">อีเวนต์</div>
              <div class="text-sm font-medium text-purple-900">{{ vehicle.eventDetails.eventName }}</div>
              <div class="text-xs text-purple-700">{{ vehicle.eventDetails.location }}</div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-100">
              <div class="flex items-center space-x-1">
                <button 
                  v-if="vehicle.status === 'ล็อกสำหรับอีเวนต์'"
                  @click="returnFromEvent(vehicle)"
                  class="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                  title="คืนจากอีเวนต์"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
                  </svg>
                </button>
                <button 
                  v-else-if="vehicle.status === 'พร้อมใช้'"
                  @click="lockForEvent(vehicle)"
                  class="p-2 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                  title="ล็อกสำหรับอีเวนต์"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"/>
                  </svg>
                </button>
              </div>

              <div class="flex items-center space-x-1">
                <button 
                  @click="viewVehicle(vehicle)"
                  class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  title="ดูรายละเอียด"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
                
                <button 
                  @click="editVehicle(vehicle)"
                  class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="แก้ไขข้อมูล"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>
                
                <button 
                  @click="deleteVehicle(vehicle)"
                  class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="ลบข้อมูล"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Compact List View -->
        <div v-else-if="viewMode === 'list'" class="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div class="divide-y divide-gray-200">
            <div 
              v-for="vehicle in filteredVehicles" 
              :key="vehicle.id" 
              class="p-4 hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-center justify-between">
                <!-- Left: Main Info -->
                <div class="flex items-center space-x-4 flex-1">
                  <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span class="text-xs font-semibold text-blue-600">{{ vehicle?.id?.toString().slice(-2) || '--' }}</span>
                  </div>

                  <div class="min-w-0 flex-1">
                    <!-- Model (License Plate) -->
                    <div class="text-base font-bold text-gray-900">
                      {{ vehicle.model }} <span class="text-blue-600">({{ vehicle.plateNumber || vehicle.plate_number || 'N/A' }})</span>
                    </div>
                    <!-- Color | Year | Status -->
                    <div class="flex items-center space-x-3 mt-1 text-sm text-gray-600">
                      <span class="flex items-center">
                        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16z" clip-rule="evenodd"/>
                        </svg>
                        {{ vehicle.color || 'N/A' }}
                      </span>
                      <span>|</span>
                      <span>{{ vehicle.year || 'N/A' }}</span>
                      <span>|</span>
                      <span :class="getStatusClass(vehicle.status)" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium">
                        {{ getStatusText(vehicle.status) || 'N/A' }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Center: Technical Info -->
                <div class="hidden lg:block text-sm text-gray-600 text-center px-4">
                  <div class="font-mono text-xs">{{ vehicle.vin }}</div>
                  <div class="font-mono text-xs">
                    {{ vehicle.type === 'ไฟฟ้า' ? vehicle.motorNumber : vehicle.engineNumber }}
                  </div>
                </div>

                <!-- Right: Status & Actions -->
                <div class="flex items-center space-x-3">
                  <!-- Event Info -->
                  <div v-if="vehicle.eventDetails" class="text-xs text-center">
                    <div class="font-medium text-purple-900">{{ vehicle.eventDetails.eventName }}</div>
                    <div class="text-purple-600">{{ vehicle.eventDetails.location }}</div>
                  </div>
                  
                  <!-- Status -->
                  <span :class="getStatusClass(vehicle.status)" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border whitespace-nowrap">
                    {{ getStatusText(vehicle.status) }}
                  </span>

                  <!-- Actions -->
                  <div class="flex items-center space-x-1">
                    <button 
                      v-if="vehicle.status === 'ล็อกสำหรับอีเวนต์'"
                      @click="returnFromEvent(vehicle)"
                      class="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                      title="คืนจากอีเวนต์"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
                      </svg>
                    </button>
                    <button 
                      v-else-if="vehicle.status === 'พร้อมใช้'"
                      @click="lockForEvent(vehicle)"
                      class="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                      title="ล็อกสำหรับอีเวนต์"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"/>
                      </svg>
                    </button>
                    
                    <button 
                      @click="viewVehicle(vehicle)"
                      class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      title="ดูรายละเอียด"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    </button>
                    
                    <button 
                      @click="editVehicle(vehicle)"
                      class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="แก้ไขข้อมูล"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>
                    
                    <button 
                      @click="deleteVehicle(vehicle)"
                      class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="ลบข้อมูล"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-if="filteredVehicles.length === 0" class="text-center py-12">
          <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">ไม่พบข้อมูลรถยนต์</h3>
          <p class="text-gray-600 mb-4">ลองปรับเปลี่ยนเงื่อนไขการค้นหาหรือเพิ่มรถยนต์ใหม่</p>
          <button @click="showAddModal = true" class="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            <span>เพิ่มรถยนต์ใหม่</span>
          </button>
        </div>
      </section>

      <!-- Simple Footer -->
      <section class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-600">
            <span class="font-medium text-gray-900">{{ filteredVehicles.length }}</span> รายการ
            <span v-if="filteredVehicles.length !== vehicles.length">
              จากทั้งหมด <span class="font-medium text-gray-900">{{ vehicles.length }}</span> คัน
            </span>
          </div>
          
          <div class="flex items-center space-x-3">
            <button class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm">
              Export CSV
            </button>
            <button class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm">
              Export PDF
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'CleanStockManagement',
  layout: 'dashboard',
  
  data() {
    return {
      searchTerm: '',
      filterCategory: 'ทั้งหมด',
      filterType: 'ทั้งหมด',
      filterStatus: 'ทั้งหมด',
      showAddModal: false,
      showUploadModal: false,
      viewMode: 'cards', // 'cards' or 'list'
      stats: {
        total: 0,
        available: 0,
        inUse: 0,
        eventLocked: 0
      },
      vehicles: [],
      loading: false,
      error: null,
      // Vehicle models lookup
      vehicleModels: {
        1: 'D-Max',
        2: 'D-Max Spark',
        3: 'MU-X',
        4: 'V-Cross',
        5: 'Hi-Lander',
        6: 'Spacecab',
        'D-Max': 'D-Max',
        'D-Max Spark': 'D-Max Spark',
        'MU-X': 'MU-X',
        'V-Cross': 'V-Cross',
        'Hi-Lander': 'Hi-Lander',
        'Spacecab': 'Spacecab'
      }
    }
  },
  
  computed: {
    filteredVehicles() {
      let filtered = this.vehicles
      
      if (this.searchTerm) {
        const search = this.searchTerm.toLowerCase()
        filtered = filtered.filter(vehicle =>
          vehicle.model?.toLowerCase().includes(search) ||
          vehicle.id?.toLowerCase().includes(search) ||
          vehicle.vin?.toLowerCase().includes(search) ||
          vehicle.plateNumber?.toLowerCase().includes(search) ||
          vehicle.chassisNumber?.toLowerCase().includes(search)
        )
      }
      
      if (this.filterCategory !== 'ทั้งหมด') {
        filtered = filtered.filter(vehicle => vehicle.category === this.filterCategory)
      }
      
      if (this.filterType !== 'ทั้งหมด') {
        filtered = filtered.filter(vehicle => vehicle.type === this.filterType)
      }
      
      if (this.filterStatus !== 'ทั้งหมด') {
        filtered = filtered.filter(vehicle => vehicle.status === this.filterStatus)
      }
      
      return filtered
    }
  },
  
  methods: {
    // API Integration Methods
    async fetchVehicles() {
      try {
        this.loading = true
        this.error = null

        const response = await this.$api.stock.getVehicles()
        const apiData = Array.isArray(response) ? response : (response.data || response.vehicles || [])

        console.log('📥 Raw API Response:', {
          isArray: Array.isArray(response),
          hasData: !!response.data,
          hasVehicles: !!response.vehicles,
          firstItem: apiData[0],
          totalItems: apiData.length
        })

        // Map API data to frontend format
        // API uses different field names: modelGeneral, carCard, engineNo, chassisNo
        this.vehicles = apiData.map(vehicle => {
          return {
            id: vehicle.id,
            // Use carCard for plate number
            plateNumber: vehicle.carCard || vehicle.plate_number || vehicle.plateNumber || 'ไม่มีทะเบียน',
            // Use modelGeneral for model name
            model: vehicle.modelGeneral || vehicle.model || vehicle.modelCode || 'N/A',
            // Use type field for category
            category: vehicle.type || vehicle.category || 'กระบะ',
            // Fuel type - may need to derive from model or type
            type: vehicle.fuelType || vehicle.fuel_type || 'น้ำมัน',
            // Color
            color: vehicle.color || 'ไม่ระบุ',
            // Year - may not be in API, use current year
            year: vehicle.year || vehicle.model_year || new Date().getFullYear(),
            // Use chassisNo for VIN
            vin: vehicle.chassisNo || vehicle.chassis_number || vehicle.vin || '-',
            chassisNumber: vehicle.chassisNo || vehicle.chassis_number || vehicle.vin || '-',
            // Use engineNo for engine number
            engineNumber: vehicle.engineNo || vehicle.engine_number || vehicle.engineNumber || '-',
            motorNumber: vehicle.motorNumber || vehicle.motor_number || '-',
            // Map status
            status: this.mapAPIStatus(vehicle.status),
            eventStatus: vehicle.event_status || vehicle.eventStatus,
            eventDetails: vehicle.event_details || vehicle.eventDetails
          }
        })

        console.log('✅ Mapped vehicles:', this.vehicles.length, 'vehicles')
        if (this.vehicles.length > 0) {
          console.log('📋 First vehicle after mapping:', this.vehicles[0])
        }

        this.updateStats()
      } catch (error) {
        console.error('Error fetching vehicles:', error)
        this.error = error.response?.data?.message || error.message || 'ไม่สามารถดึงข้อมูลรถได้'
        this.$toast?.error(`เกิดข้อผิดพลาด: ${this.error}`)
      } finally {
        this.loading = false
      }
    },

    updateStats() {
      this.stats = {
        total: this.vehicles.length,
        available: this.vehicles.filter(v => v.status === 'พร้อมใช้').length,
        inUse: this.vehicles.filter(v => v.status === 'ใช้งาน').length,
        eventLocked: this.vehicles.filter(v => v.status === 'ล็อกสำหรับอีเวนต์').length
      }
    },

    mapAPIStatus(apiStatus) {
      const statusMap = {
        'available': 'พร้อมใช้',
        'in_use': 'ใช้งาน',
        'maintenance': 'บำรุงรักษา',
        'locked_for_event': 'ล็อกสำหรับอีเวนต์',
        'unavailable': 'ไม่พร้อมใช้'
      }
      return statusMap[apiStatus] || apiStatus
    },

    mapStatusToAPI(frontendStatus) {
      const statusMap = {
        'พร้อมใช้': 'available',
        'ใช้งาน': 'in_use',
        'บำรุงรักษา': 'maintenance',
        'ล็อกสำหรับอีเวนต์': 'locked_for_event',
        'ไม่พร้อมใช้': 'unavailable'
      }
      return statusMap[frontendStatus] || frontendStatus
    },

    getStatusText(status) {
      // If already in Thai, return as-is
      if (status && status.match(/[ก-๙]/)) {
        return status
      }
      // Otherwise map from English to Thai
      const statusMap = {
        'available': 'พร้อมใช้',
        'in_use': 'ใช้งาน',
        'maintenance': 'บำรุงรักษา',
        'locked': 'ล็อกสำหรับอีเวนต์',
        'locked_for_event': 'ล็อกสำหรับอีเวนต์',
        'unavailable': 'ไม่พร้อมใช้'
      }
      return statusMap[status] || status || 'N/A'
    },

    async updateVehicleStatus(vehicleId, newStatus) {
      try {
        const apiStatus = this.mapStatusToAPI(newStatus)
        await this.$api.stock.updateStatus(vehicleId, apiStatus)
        await this.fetchVehicles() // Refresh vehicle list
        this.$toast?.success('อัปเดตสถานะรถเรียบร้อยแล้ว')
      } catch (error) {
        console.error('Error updating vehicle status:', error)
        this.$toast?.error('ไม่สามารถอัปเดตสถานะได้')
      }
    },

    getStatusClass(status) {
      // Handle both Thai and English status
      const statusLower = (status || '').toLowerCase()

      // Map status to color classes
      if (status === 'พร้อมใช้' || statusLower === 'available') {
        return 'text-green-700 bg-green-50 border-green-200'
      } else if (status === 'ใช้งาน' || statusLower === 'in_use' || statusLower === 'in use') {
        return 'text-blue-700 bg-blue-50 border-blue-200'
      } else if (status === 'บำรุงรักษา' || statusLower === 'maintenance') {
        return 'text-amber-700 bg-amber-50 border-amber-200'
      } else if (status === 'ล็อกสำหรับอีเวนต์' || statusLower === 'locked_for_event' || statusLower === 'locked') {
        return 'text-purple-700 bg-purple-50 border-purple-200'
      } else if (status === 'ไม่พร้อมใช้' || statusLower === 'unavailable') {
        return 'text-red-700 bg-red-50 border-red-200'
      } else {
        return 'text-gray-700 bg-gray-50 border-gray-200'
      }
    },
    
    clearFilters() {
      this.searchTerm = ''
      this.filterCategory = 'ทั้งหมด'
      this.filterType = 'ทั้งหมด'
      this.filterStatus = 'ทั้งหมด'
      this.$toast?.success('ล้างตัวกรองเรียบร้อยแล้ว')
    },
    
    lockForEvent(vehicle) {
      console.log('Lock for event:', vehicle.id)
      this.$toast?.info(`เตรียมล็อกรถ ${vehicle.plateNumber} สำหรับอีเวนต์`)
    },
    
    returnFromEvent(vehicle) {
      if (confirm(`คืนรถ ${vehicle.plateNumber} จากอีเวนต์หรือไม่?`)) {
        vehicle.status = 'พร้อมใช้'
        vehicle.eventStatus = null
        vehicle.eventDetails = null
        this.updateStats()
        this.$toast?.success(`คืนรถ ${vehicle.plateNumber} เรียบร้อยแล้ว`)
      }
    },
    
    editVehicle(vehicle) {
      console.log('Edit vehicle:', vehicle.id)
      this.$router.push(`/dashboard/stock/${vehicle.id}/edit`)
    },

    viewVehicle(vehicle) {
      console.log('View vehicle:', vehicle.id)
      this.$router.push(`/dashboard/stock/${vehicle.id}`)
    },
    
    deleteVehicle(vehicle) {
      if (confirm(`ลบรถ ${vehicle.plateNumber} หรือไม่?\n\nการดำเนินการนี้ไม่สามารถย้อนกลับได้`)) {
        const index = this.vehicles.findIndex(v => v.id === vehicle.id)
        if (index !== -1) {
          this.vehicles.splice(index, 1)
          this.updateStats()
          this.$toast?.success(`ลบรถ ${vehicle.plateNumber} เรียบร้อยแล้ว`)
        }
      }
    },
    
    updateStats() {
      this.stats.total = this.vehicles.length
      this.stats.available = this.vehicles.filter(v => v.status === 'พร้อมใช้').length
      this.stats.inUse = this.vehicles.filter(v => v.status === 'ใช้งาน').length
      this.stats.eventLocked = this.vehicles.filter(v => v.status === 'ล็อกสำหรับอีเวนต์').length
    }
  },

  async mounted() {
    await this.fetchVehicles()
  },

  head() {
    return {
      title: 'จัดการสต็อกรถยนต์ - ISUZU Enterprise System'
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
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Custom scrollbar for table */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>