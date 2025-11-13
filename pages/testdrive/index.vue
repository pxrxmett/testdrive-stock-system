<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p class="text-gray-600">กำลังโหลดข้อมูลคิว...</p>
      </div>
    </div>

    <!-- Header -->
    <header class="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="w-10 h-10 bg-[#D52B1E] rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-semibold text-gray-900">ISUZU คิวทดลองขับ</h1>
            <p class="text-sm text-gray-500">จัดการคิวและนัดหมายทดลองขับรถยนต์</p>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <!-- Search -->
          <div class="relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchTerm"
              type="text"
              placeholder="ค้นหาลูกค้า, รถ, เซลส์..."
              class="pl-10 pr-4 py-2 w-80 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
            />
          </div>
          
          <!-- Date Navigation -->
          <div class="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button 
              @click="changeDate(-1)"
              class="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-md transition-colors"
              :disabled="loading"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span class="px-4 py-2 text-sm font-medium text-gray-900 bg-white rounded-md min-w-[120px] text-center">
              {{ formatSelectedDate }}
            </span>
            <button 
              @click="changeDate(1)"
              class="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-md transition-colors"
              :disabled="loading"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <!-- Back Button -->
          <button 
            @click="$router.push('/')"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>กลับหน้าแรก</span>
          </button>
        </div>
      </div>
    </header>

    <div class="flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r border-gray-200 min-h-screen sticky top-16">
        <!-- Stats Overview -->
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">สรุปวันนี้</h2>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">คิวทั้งหมด</span>
              <span class="font-semibold text-gray-900">{{ totalQueues }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">กำลังทดสอบ</span>
              <span class="font-semibold text-green-600">{{ inProgressQueues }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">รอคิว</span>
              <span class="font-semibold text-amber-600">{{ pendingQueues }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">เสร็จสิ้น</span>
              <span class="font-semibold text-blue-600">{{ completedQueues }}</span>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="p-6">
          <h3 class="text-sm font-semibold text-gray-900 mb-3">ตัวกรอง</h3>
          <div class="space-y-3">
            <!-- Status Filter -->
            <div>
              <label class="text-xs text-gray-500 uppercase tracking-wider">สถานะ</label>
              <select v-model="filters.status" @change="applyFilters" class="w-full mt-1 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-red-500">
                <option value="">ทุกสถานะ</option>
                <option value="in-progress">กำลังทดสอบ</option>
                <option value="scheduled">รอคิว</option>
                <option value="completed">เสร็จสิ้น</option>
                <option value="cancelled">ยกเลิก</option>
              </select>
            </div>
            
            <!-- Location Filter -->
            <div>
              <label class="text-xs text-gray-500 uppercase tracking-wider">สาขา</label>
              <select v-model="filters.location" @change="applyFilters" class="w-full mt-1 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-red-500">
                <option value="">ทุกสาขา</option>
                <option v-for="location in locations" :key="location.id" :value="location.name">
                  {{ location.name }}
                </option>
              </select>
            </div>

            <!-- Sales Rep Filter -->
            <div>
              <label class="text-xs text-gray-500 uppercase tracking-wider">เซลส์</label>
              <select v-model="filters.salesRep" @change="applyFilters" class="w-full mt-1 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-red-500">
                <option value="">ทุกคน</option>
                <option v-for="rep in salesReps" :key="rep.id" :value="rep.name">
                  {{ rep.name }}
                </option>
              </select>
            </div>

            <!-- Clear Filters -->
            <button 
              @click="clearFilters"
              class="w-full mt-4 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              ล้างตัวกรอง
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-6">
        <!-- Empty State -->
        <div v-if="groupedQueues.length === 0" class="text-center py-12">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">ไม่พบคิวในวันนี้</h3>
          <p class="text-gray-500 mb-4">เมื่อมีการจองเข้ามา รายการจะแสดงที่นี่</p>
        </div>

        <!-- Sales Rep Groups -->
        <div v-else class="space-y-6">
          <div 
            v-for="group in groupedQueues" 
            :key="group.salesRep"
            class="bg-white rounded-lg border border-gray-200 shadow-sm transition-shadow hover:shadow-md"
          >
            <!-- Sales Rep Header -->
            <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span class="text-white font-semibold text-sm">
                      {{ getInitials(group.salesRep) }}
                    </span>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900">{{ group.salesRep }}</h3>
                    <p class="text-sm text-gray-500">{{ group.queues.length }} คิววันนี้</p>
                  </div>
                </div>
                
                <!-- Workload Indicator -->
                <div class="flex items-center space-x-2">
                  <div :class="getWorkloadClass(group.queues.length)" class="px-3 py-1 rounded-full text-xs font-medium">
                    {{ getWorkloadText(group.queues.length) }}
                  </div>
                  <button 
                    @click="toggleGroup(group.salesRep)"
                    class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg 
                      :class="{ 'rotate-180': expandedGroups.includes(group.salesRep) }"
                      class="w-5 h-5 transition-transform" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Queue Cards -->
            <div 
              v-show="expandedGroups.includes(group.salesRep)" 
              class="p-6"
            >
              <div class="grid grid-cols-1 gap-4">
                <div 
                  v-for="queue in group.queues" 
                  :key="queue.id"
                  class="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer"
                  @click="selectQueue(queue)"
                >
                  <!-- Queue Header -->
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center space-x-2">
                      <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span class="font-semibold text-gray-900">{{ queue.timeSlot }}</span>
                      <span class="text-sm text-gray-500">({{ queue.duration }}น.)</span>
                    </div>
                    
                    <!-- Status Badge -->
                    <div :class="getStatusClass(queue.status)" class="px-2 py-1 rounded-md text-xs font-medium">
                      {{ getStatusText(queue.status) }}
                    </div>
                  </div>

                  <!-- Customer Info -->
                  <div class="mb-3">
                    <div class="flex items-center space-x-2 mb-1">
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span class="font-medium text-gray-900">{{ queue.customerName }}</span>
                    </div>
                    <div class="flex items-center space-x-2 text-sm text-gray-500">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{{ queue.phone }}</span>
                    </div>
                  </div>

                  <!-- Car Model -->
                  <div class="mb-3">
                    <div class="flex items-center space-x-2">
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span class="text-sm font-medium text-gray-700 truncate">{{ queue.carModel }}</span>
                    </div>
                  </div>

                  <!-- Location & Priority -->
                  <div class="flex items-center justify-between text-xs text-gray-500">
                    <span class="truncate">{{ queue.location }}</span>
                    <div class="flex items-center space-x-1">
                      <span :class="getPriorityClass(queue.priority)" class="px-2 py-1 rounded">
                        {{ getPriorityText(queue.priority) }}
                      </span>
                    </div>
                  </div>

                  <!-- Queue ID -->
                  <div class="mt-2 pt-2 border-t border-gray-100">
                    <span class="text-xs font-mono text-gray-400">#{{ queue.id }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Queue Detail Modal -->
    <div v-if="selectedQueue" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" @click="closeModal">
      <div class="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" @click.stop>
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900">รายละเอียดคิว</h2>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Queue Details -->
          <div class="space-y-6">
            <!-- Status Banner -->
            <div :class="getStatusBannerClass(selectedQueue.status)" class="p-4 rounded-lg">
              <div class="flex items-center">
                <span class="font-medium">{{ getStatusText(selectedQueue.status) }}</span>
              </div>
            </div>

            <!-- Basic Info -->
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="text-sm font-medium text-gray-500">เวลานัดหมาย</label>
                <p class="text-lg font-semibold text-gray-900">{{ selectedQueue.timeSlot }} น.</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">ระยะเวลา</label>
                <p class="text-lg font-semibold text-gray-900">{{ selectedQueue.duration }} นาที</p>
              </div>
            </div>

            <!-- Customer Details -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">ข้อมูลลูกค้า</h3>
              <div class="bg-gray-50 rounded-lg p-4 space-y-2">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-500">ชื่อลูกค้า:</span>
                  <span class="text-sm font-medium">{{ selectedQueue.customerName }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-500">เบอร์โทร:</span>
                  <span class="text-sm font-medium">{{ selectedQueue.phone }}</span>
                </div>
                <div class="flex justify-between" v-if="selectedQueue.email">
                  <span class="text-sm text-gray-500">อีเมล:</span>
                  <span class="text-sm font-medium">{{ selectedQueue.email }}</span>
                </div>
              </div>
            </div>

            <!-- Car Details -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">ข้อมูลรถยนต์</h3>
              <div class="bg-gray-50 rounded-lg p-4 space-y-2">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-500">รุ่นรถ:</span>
                  <span class="text-sm font-medium">{{ selectedQueue.carModel }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-500">สาขา:</span>
                  <span class="text-sm font-medium">{{ selectedQueue.location }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-500">เซลส์:</span>
                  <span class="text-sm font-medium">{{ selectedQueue.salesRep }}</span>
                </div>
              </div>
            </div>

            <!-- Notes -->
            <div v-if="selectedQueue.notes">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">หมายเหตุ</h3>
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p class="text-sm text-gray-700">{{ selectedQueue.notes }}</p>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex space-x-3 pt-4 border-t">
              <button 
                @click="contactCustomer(selectedQueue)"
                class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                ติดต่อลูกค้า
              </button>
              <button 
                @click="closeModal"
                class="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestDriveDashboard',
  
  data() {
    return {
      selectedDate: new Date(),
      searchTerm: '',
      filters: {
        status: '',
        location: '',
        salesRep: ''
      },
      selectedQueue: null,
      expandedGroups: [],
      loading: false,
      
      locations: [
        { id: 1, name: 'สาขาเซ็นทรัล บางนา' },
        { id: 2, name: 'สาขาอีสท์วิลล์' },
        { id: 3, name: 'สาขาเวสต์เกต' }
      ],
      salesReps: [
        { id: 1, name: 'คุณจิรายุ ธนาสมบัติ' },
        { id: 2, name: 'คุณสุดา กิตติขุน' },
        { id: 3, name: 'คุณประจักษ์ วงศา' },
        { id: 4, name: 'คุณมาลี สุวรรณ' }
      ],
      
      // Mock data
      mockQueues: [
        {
          id: 'TD241216001',
          customerName: 'คุณสมชาย โอดี',
          phone: '081-234-5678',
          email: 'somchai.o@gmail.com',
          carModel: 'D-MAX Blue Power 1.9 Ddi Z Hi-Lander',
          timeSlot: '09:00',
          duration: 60,
          status: 'in-progress',
          priority: 'high',
          location: 'สาขาเซ็นทรัล บางนา',
          salesRep: 'คุณจิรายุ ธนาสมบัติ',
          customerType: 'VIP',
          notes: 'สนใจซื้อรถตู้ (5 คัน) ต้องการทดสอบเส้นทางภูเขา'
        },
        {
          id: 'TD241216002',
          customerName: 'คุณสมหญิง ปั่นมี',
          phone: '089-876-5432',
          email: 'somying.p@company.co.th',
          carModel: 'MU-X Blue Power 3.0 Ddi Supreme',
          timeSlot: '10:30',
          duration: 45,
          status: 'scheduled',
          priority: 'medium',
          location: 'สาขาอีสท์วิลล์',
          salesRep: 'คุณสุดา กิตติขุน',
          customerType: 'Corporate',
          notes: 'ขอทดสอบในเส้นทางเมือง และทางโปร่ง'
        },
        {
          id: 'TD241216003',
          customerName: 'คุณประยุทธ์ แสงใส',
          phone: '092-111-2233',
          email: 'prayuth.s@email.com',
          carModel: 'D-MAX Blue Power 1.9 Ddi Prestige',
          timeSlot: '14:00',
          duration: 30,
          status: 'completed',
          priority: 'low',
          location: 'สาขาเซ็นทรัล บางนา',
          salesRep: 'คุณจิรายุ ธนาสมบัติ',
          customerType: 'Walk-in',
          notes: 'ลูกค้าเก่า ซื้อรถไปแล้ว 2 คัน'
        }
      ]
    }
  },

  computed: {
    formatSelectedDate() {
      return this.selectedDate.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    },

    filteredQueues() {
      let filtered = [...this.mockQueues]
      
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase()
        filtered = filtered.filter(queue =>
          queue.customerName.toLowerCase().includes(term) ||
          queue.phone.includes(term) ||
          queue.carModel.toLowerCase().includes(term) ||
          queue.salesRep.toLowerCase().includes(term) ||
          queue.id.toLowerCase().includes(term)
        )
      }

      if (this.filters.status) {
        filtered = filtered.filter(queue => queue.status === this.filters.status)
      }

      if (this.filters.location) {
        filtered = filtered.filter(queue => queue.location === this.filters.location)
      }

      if (this.filters.salesRep) {
        filtered = filtered.filter(queue => queue.salesRep === this.filters.salesRep)
      }

      return filtered
    },

    groupedQueues() {
      const groups = {}
      
      this.filteredQueues.forEach(queue => {
        if (!groups[queue.salesRep]) {
          groups[queue.salesRep] = {
            salesRep: queue.salesRep,
            queues: []
          }
        }
        groups[queue.salesRep].queues.push(queue)
      })

      Object.values(groups).forEach(group => {
        group.queues.sort((a, b) => a.timeSlot.localeCompare(b.timeSlot))
      })

      return Object.values(groups).sort((a, b) => b.queues.length - a.queues.length)
    },

    totalQueues() {
      return this.filteredQueues.length
    },

    inProgressQueues() {
      return this.filteredQueues.filter(q => q.status === 'in-progress').length
    },

    pendingQueues() {
      return this.filteredQueues.filter(q => q.status === 'scheduled').length
    },

    completedQueues() {
      return this.filteredQueues.filter(q => q.status === 'completed').length
    }
  },

  created() {
    this.expandedGroups = this.groupedQueues.map(g => g.salesRep)
  },

  methods: {
    changeDate(direction) {
      const newDate = new Date(this.selectedDate)
      newDate.setDate(newDate.getDate() + direction)
      this.selectedDate = newDate
    },

    applyFilters() {
      // Filters applied automatically via computed property
    },

    clearFilters() {
      this.filters = {
        status: '',
        location: '',
        salesRep: ''
      }
      this.searchTerm = ''
    },

    toggleGroup(salesRep) {
      const index = this.expandedGroups.indexOf(salesRep)
      if (index > -1) {
        this.expandedGroups.splice(index, 1)
      } else {
        this.expandedGroups.push(salesRep)
      }
    },

    selectQueue(queue) {
      this.selectedQueue = queue
    },

    closeModal() {
      this.selectedQueue = null
    },

    async contactCustomer(queue) {
      if (process.client) {
        window.open(`tel:${queue.phone}`)
      }
    },

    getInitials(name) {
      const words = name.split(' ')
      if (words.length >= 2) {
        return words[1]?.charAt(0) || 'S'
      }
      return name.charAt(0)
    },

    getWorkloadClass(queueCount) {
      if (queueCount >= 6) {
        return 'bg-red-100 text-red-800'
      } else if (queueCount >= 4) {
        return 'bg-yellow-100 text-yellow-800'
      } else {
        return 'bg-green-100 text-green-800'
      }
    },

    getWorkloadText(queueCount) {
      if (queueCount >= 6) {
        return 'ยุ่งมาก'
      } else if (queueCount >= 4) {
        return 'ยุ่งปานกลาง'
      } else {
        return 'ว่าง'
      }
    },

    getStatusClass(status) {
      const classes = {
        'in-progress': 'bg-green-100 text-green-800',
        'scheduled': 'bg-yellow-100 text-yellow-800',
        'completed': 'bg-blue-100 text-blue-800',
        'cancelled': 'bg-red-100 text-red-800'
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    },

    getStatusText(status) {
      const texts = {
        'in-progress': 'กำลังทดสอบ',
        'scheduled': 'รอคิว',
        'completed': 'เสร็จสิ้น',
        'cancelled': 'ยกเลิก'
      }
      return texts[status] || 'ไม่ทราบสถานะ'
    },

    getStatusBannerClass(status) {
      const classes = {
        'in-progress': 'bg-green-50 border border-green-200',
        'scheduled': 'bg-yellow-50 border border-yellow-200',
        'completed': 'bg-blue-50 border border-blue-200',
        'cancelled': 'bg-red-50 border border-red-200'
      }
      return classes[status] || 'bg-gray-50 border border-gray-200'
    },

    getPriorityClass(priority) {
      const classes = {
        'high': 'bg-red-100 text-red-800',
        'medium': 'bg-yellow-100 text-yellow-800',
        'low': 'bg-gray-100 text-gray-800'
      }
      return classes[priority] || 'bg-gray-100 text-gray-800'
    },

    getPriorityText(priority) {
      const texts = {
        'high': 'ด่วน',
        'medium': 'ปกติ',
        'low': 'ไม่ด่วน'
      }
      return texts[priority] || 'ปกติ'
    }
  }
}
</script>
