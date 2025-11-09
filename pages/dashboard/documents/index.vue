<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-semibold text-gray-900">เอกสารทดลองขับ</h1>
              <p class="text-sm text-gray-600">จัดการและพิมพ์เอกสารทดลองขับรถยนต์</p>
            </div>
          </div>

          <!-- Export Button -->
          <button
            @click="exportToExcel"
            class="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span>Export Excel</span>
          </button>
        </div>
      </div>
    </header>

    <main class="px-6 py-6 space-y-6">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="text-center">
          <svg class="animate-spin h-12 w-12 text-red-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <svg class="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h3 class="text-lg font-medium text-red-900 mb-2">เกิดข้อผิดพลาด</h3>
        <p class="text-red-700">{{ error }}</p>
        <button @click="loadTestDrives" class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          ลองอีกครั้ง
        </button>
      </div>

      <template v-else>
        <!-- Dashboard Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">เอกสารทั้งหมด</p>
                <p class="text-3xl font-bold text-gray-900">{{ totalDocuments }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">พร้อมพิมพ์</p>
                <p class="text-3xl font-bold text-green-600">{{ readyDocuments }}</p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">รอดำเนินการ</p>
                <p class="text-3xl font-bold text-yellow-600">{{ partialDocuments }}</p>
              </div>
              <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">ไม่พร้อม</p>
                <p class="text-3xl font-bold text-red-600">{{ notReadyDocuments }}</p>
              </div>
              <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Filters -->
        <section class="bg-white rounded-lg border border-gray-200 p-4">
          <div class="flex flex-wrap gap-2">
            <button
              v-for="qf in quickFilters"
              :key="qf.value"
              @click="applyQuickFilter(qf.value)"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                activeQuickFilter === qf.value
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ qf.label }}
            </button>
          </div>
        </section>

        <!-- Advanced Filters -->
        <section class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">ค้นหาและกรองข้อมูล</h3>
            <button
              @click="clearFilters"
              class="flex items-center space-x-2 px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <span>รีเซ็ต</span>
            </button>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-6 gap-4">
            <!-- Search -->
            <div class="lg:col-span-2 relative">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                v-model="filters.search"
                type="text"
                placeholder="ค้นหาเลขที่เอกสาร, ชื่อ, เบอร์โทร..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div>

            <!-- Date Range From -->
            <div>
              <input
                v-model="filters.dateFrom"
                type="date"
                placeholder="จากวันที่"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div>

            <!-- Date Range To -->
            <div>
              <input
                v-model="filters.dateTo"
                type="date"
                placeholder="ถึงวันที่"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div>

            <!-- Vehicle Model Filter -->
            <select
              v-model="filters.vehicleModel"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
            >
              <option value="">รุ่นรถทั้งหมด</option>
              <option v-for="model in vehicleModels" :key="model" :value="model">
                {{ model }}
              </option>
            </select>

            <!-- Document Status Filter -->
            <select
              v-model="filters.docStatus"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
            >
              <option value="">สถานะเอกสารทั้งหมด</option>
              <option value="ready">🟢 พร้อมพิมพ์</option>
              <option value="partial">🟡 พร้อมบางส่วน</option>
              <option value="not_ready">🔴 ไม่พร้อม</option>
            </select>
          </div>

          <!-- Sorting -->
          <div class="mt-4 flex items-center space-x-2">
            <span class="text-sm text-gray-600">เรียงตาม:</span>
            <select
              v-model="sortBy"
              class="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
            >
              <option value="date_desc">วันที่ (ใหม่สุด → เก่าสุด)</option>
              <option value="date_asc">วันที่ (เก่าสุด → ใหม่สุด)</option>
              <option value="doc_number_desc">เลขที่เอกสาร (มาก → น้อย)</option>
              <option value="doc_number_asc">เลขที่เอกสาร (น้อย → มาก)</option>
              <option value="name_asc">ชื่อลูกค้า (ก-ฮ)</option>
              <option value="name_desc">ชื่อลูกค้า (ฮ-ก)</option>
            </select>
          </div>
        </section>

        <!-- Table -->
        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เลขที่เอกสาร</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่-เวลา</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อลูกค้า</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เบอร์โทร</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รุ่นรถ</th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะเอกสาร</th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">การจัดการ</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="testDrive in paginatedTestDrives" :key="testDrive.id" class="hover:bg-gray-50">
                  <!-- Document Number -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="text-sm font-mono font-medium text-gray-900">
                        {{ getDocumentNumber(testDrive) }}
                      </div>
                    </div>
                  </td>

                  <!-- Date Time -->
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatDateTime(testDrive.start_time || testDrive.startTime || testDrive.scheduled_start) }}
                  </td>

                  <!-- Customer Name -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ testDrive.customer_name || testDrive.customerName || '-' }}</div>
                  </td>

                  <!-- Phone -->
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ testDrive.customer_phone || testDrive.customerPhone || testDrive.phone || '-' }}
                  </td>

                  <!-- Vehicle Model -->
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ testDrive.vehicle?.model || '-' }}
                  </td>

                  <!-- Document Status -->
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <span :class="getDocStatusClass(testDrive)" class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                      {{ getDocStatusText(testDrive) }}
                    </span>
                  </td>

                  <!-- Actions -->
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <div class="flex items-center justify-center space-x-2">
                      <button
                        @click="viewDocument(testDrive.id)"
                        class="text-blue-600 hover:text-blue-900"
                        title="ดูเอกสาร"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                      </button>
                      <button
                        @click="quickPrint(testDrive.id)"
                        :disabled="!isDocReady(testDrive)"
                        :class="[
                          'hover:text-green-900',
                          isDocReady(testDrive) ? 'text-green-600' : 'text-gray-300 cursor-not-allowed'
                        ]"
                        title="พิมพ์เอกสาร"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                        </svg>
                      </button>
                      <button
                        @click="copyDocumentLink(testDrive.id)"
                        class="text-purple-600 hover:text-purple-900"
                        title="คัดลอกลิงก์"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div v-if="filteredTestDrives.length === 0" class="text-center py-12">
            <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">ไม่พบข้อมูลเอกสาร</h3>
            <p class="text-gray-600 mb-4">ยังไม่มีข้อมูลการทดลองขับในระบบ หรือลองปรับเปลี่ยนเงื่อนไขการค้นหา</p>
          </div>

          <!-- Pagination -->
          <div v-if="filteredTestDrives.length > 0" class="bg-white px-6 py-4 border-t border-gray-200">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
              <!-- Per Page Selector -->
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-600">แสดง</span>
                <select
                  v-model.number="perPage"
                  class="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                >
                  <option :value="20">20</option>
                  <option :value="50">50</option>
                  <option :value="100">100</option>
                </select>
                <span class="text-sm text-gray-600">รายการต่อหน้า</span>
              </div>

              <!-- Page Info -->
              <div class="text-sm text-gray-600">
                แสดง <span class="font-medium text-gray-900">{{ startIndex + 1 }}-{{ endIndex }}</span> จาก <span class="font-medium text-gray-900">{{ filteredTestDrives.length }}</span> รายการ
              </div>

              <!-- Page Navigation -->
              <div class="flex items-center space-x-2">
                <button
                  @click="currentPage = 1"
                  :disabled="currentPage === 1"
                  class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  หน้าแรก
                </button>
                <button
                  @click="currentPage--"
                  :disabled="currentPage === 1"
                  class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  ก่อนหน้า
                </button>

                <div class="flex items-center space-x-1">
                  <button
                    v-for="page in visiblePages"
                    :key="page"
                    @click="currentPage = page"
                    :class="[
                      'px-3 py-1.5 border rounded-lg text-sm font-medium',
                      currentPage === page
                        ? 'bg-red-600 text-white border-red-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    ]"
                  >
                    {{ page }}
                  </button>
                </div>

                <button
                  @click="currentPage++"
                  :disabled="currentPage === totalPages"
                  class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  ถัดไป
                </button>
                <button
                  @click="currentPage = totalPages"
                  :disabled="currentPage === totalPages"
                  class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  หน้าสุดท้าย
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </main>
  </div>
</template>

<script>
export default {
  name: 'DocumentsList',
  layout: 'dashboard',
  data() {
    return {
      testDrives: [],
      loading: false,
      error: null,
      filters: {
        search: '',
        dateFrom: '',
        dateTo: '',
        vehicleModel: '',
        docStatus: ''
      },
      activeQuickFilter: '',
      sortBy: 'date_desc',
      currentPage: 1,
      perPage: 20,
      quickFilters: [
        { label: 'ทั้งหมด', value: '' },
        { label: 'วันนี้', value: 'today' },
        { label: 'สัปดาห์นี้', value: 'this_week' },
        { label: 'เดือนนี้', value: 'this_month' },
        { label: 'พร้อมพิมพ์', value: 'ready' }
      ]
    }
  },
  computed: {
    vehicleModels() {
      const models = new Set()
      this.testDrives.forEach(td => {
        if (td.vehicle?.model) {
          models.add(td.vehicle.model)
        }
      })
      return Array.from(models).sort()
    },

    filteredTestDrives() {
      let filtered = this.testDrives

      // Search filter
      if (this.filters.search) {
        const search = this.filters.search.toLowerCase()
        filtered = filtered.filter(td => {
          const docNumber = this.getDocumentNumber(td).toLowerCase()
          const name = (td.customer_name || td.customerName || '').toLowerCase()
          const phone = td.customer_phone || td.customerPhone || td.phone || ''
          return docNumber.includes(search) || name.includes(search) || phone.includes(search)
        })
      }

      // Date range filter
      if (this.filters.dateFrom) {
        filtered = filtered.filter(td => {
          const datetime = td.start_time || td.startTime || td.scheduled_start
          if (!datetime) return false
          const tdDate = new Date(datetime).toISOString().split('T')[0]
          return tdDate >= this.filters.dateFrom
        })
      }

      if (this.filters.dateTo) {
        filtered = filtered.filter(td => {
          const datetime = td.start_time || td.startTime || td.scheduled_start
          if (!datetime) return false
          const tdDate = new Date(datetime).toISOString().split('T')[0]
          return tdDate <= this.filters.dateTo
        })
      }

      // Vehicle model filter
      if (this.filters.vehicleModel) {
        filtered = filtered.filter(td => td.vehicle?.model === this.filters.vehicleModel)
      }

      // Document status filter
      if (this.filters.docStatus) {
        filtered = filtered.filter(td => this.getDocStatus(td) === this.filters.docStatus)
      }

      // Sorting
      filtered = this.sortDocuments(filtered)

      return filtered
    },

    paginatedTestDrives() {
      const start = (this.currentPage - 1) * this.perPage
      const end = start + this.perPage
      return this.filteredTestDrives.slice(start, end)
    },

    totalPages() {
      return Math.ceil(this.filteredTestDrives.length / this.perPage)
    },

    visiblePages() {
      const pages = []
      const maxVisible = 5
      let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2))
      let end = Math.min(this.totalPages, start + maxVisible - 1)

      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1)
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    },

    startIndex() {
      return (this.currentPage - 1) * this.perPage
    },

    endIndex() {
      return Math.min(this.startIndex + this.perPage, this.filteredTestDrives.length)
    },

    totalDocuments() {
      return this.testDrives.length
    },

    readyDocuments() {
      return this.testDrives.filter(td => this.getDocStatus(td) === 'ready').length
    },

    partialDocuments() {
      return this.testDrives.filter(td => this.getDocStatus(td) === 'partial').length
    },

    notReadyDocuments() {
      return this.testDrives.filter(td => this.getDocStatus(td) === 'not_ready').length
    }
  },

  watch: {
    perPage() {
      this.currentPage = 1
    }
  },

  methods: {
    async loadTestDrives() {
      this.loading = true
      this.error = null

      try {
        const response = await this.$api.testDrives.getAll()
        this.testDrives = Array.isArray(response) ? response : (response.data || [])
      } catch (error) {
        console.error('Error loading test drives:', error)
        this.error = error.response?.data?.message || 'ไม่สามารถโหลดข้อมูลได้'
        this.$toast?.error(this.error)
      } finally {
        this.loading = false
      }
    },

    clearFilters() {
      this.filters = {
        search: '',
        dateFrom: '',
        dateTo: '',
        vehicleModel: '',
        docStatus: ''
      }
      this.activeQuickFilter = ''
      this.currentPage = 1
    },

    applyQuickFilter(filter) {
      this.activeQuickFilter = filter
      const today = new Date()

      // Clear filters first
      this.filters.dateFrom = ''
      this.filters.dateTo = ''
      this.filters.docStatus = ''

      if (filter === 'today') {
        const todayStr = today.toISOString().split('T')[0]
        this.filters.dateFrom = todayStr
        this.filters.dateTo = todayStr
      } else if (filter === 'this_week') {
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay())
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)
        this.filters.dateFrom = startOfWeek.toISOString().split('T')[0]
        this.filters.dateTo = endOfWeek.toISOString().split('T')[0]
      } else if (filter === 'this_month') {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        this.filters.dateFrom = startOfMonth.toISOString().split('T')[0]
        this.filters.dateTo = endOfMonth.toISOString().split('T')[0]
      } else if (filter === 'ready') {
        this.filters.docStatus = 'ready'
      }

      this.currentPage = 1
    },

    viewDocument(id) {
      this.$router.push(`/dashboard/documents/${id}`)
    },

    quickPrint(id) {
      this.$router.push(`/dashboard/documents/${id}?print=true`)
    },

    copyDocumentLink(id) {
      const url = `${window.location.origin}/dashboard/documents/${id}`
      navigator.clipboard.writeText(url).then(() => {
        this.$toast?.success('คัดลอกลิงก์เรียบร้อย')
      }).catch(() => {
        this.$toast?.error('ไม่สามารถคัดลอกลิงก์ได้')
      })
    },

    getDocumentNumber(testDrive) {
      // Generate document number: TD-YYYYMMDD-XXXX
      const datetime = testDrive.start_time || testDrive.startTime || testDrive.scheduled_start || testDrive.created_at
      if (!datetime) return `TD-${testDrive.id}`

      const date = new Date(datetime)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const sequence = String(testDrive.id).padStart(4, '0')

      return `TD-${year}${month}${day}-${sequence}`
    },

    getDocStatus(testDrive) {
      const hasPdpa = testDrive.pdpa_consent
      const hasSignature = testDrive.signature_data

      if (hasPdpa && hasSignature) return 'ready'
      if (hasPdpa || hasSignature) return 'partial'
      return 'not_ready'
    },

    isDocReady(testDrive) {
      return this.getDocStatus(testDrive) === 'ready'
    },

    getDocStatusClass(testDrive) {
      const status = this.getDocStatus(testDrive)
      const classes = {
        'ready': 'bg-green-100 text-green-800',
        'partial': 'bg-yellow-100 text-yellow-800',
        'not_ready': 'bg-red-100 text-red-800'
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    },

    getDocStatusText(testDrive) {
      const status = this.getDocStatus(testDrive)
      const texts = {
        'ready': '🟢 พร้อมพิมพ์',
        'partial': '🟡 พร้อมบางส่วน',
        'not_ready': '🔴 ไม่พร้อม'
      }
      return texts[status] || status
    },

    sortDocuments(docs) {
      const sorted = [...docs]

      switch (this.sortBy) {
        case 'date_desc':
          return sorted.sort((a, b) => {
            const dateA = new Date(a.start_time || a.startTime || a.scheduled_start || 0)
            const dateB = new Date(b.start_time || b.startTime || b.scheduled_start || 0)
            return dateB - dateA
          })

        case 'date_asc':
          return sorted.sort((a, b) => {
            const dateA = new Date(a.start_time || a.startTime || a.scheduled_start || 0)
            const dateB = new Date(b.start_time || b.startTime || b.scheduled_start || 0)
            return dateA - dateB
          })

        case 'doc_number_desc':
          return sorted.sort((a, b) => (b.id || 0) - (a.id || 0))

        case 'doc_number_asc':
          return sorted.sort((a, b) => (a.id || 0) - (b.id || 0))

        case 'name_asc':
          return sorted.sort((a, b) => {
            const nameA = (a.customer_name || a.customerName || '').toLowerCase()
            const nameB = (b.customer_name || b.customerName || '').toLowerCase()
            return nameA.localeCompare(nameB, 'th')
          })

        case 'name_desc':
          return sorted.sort((a, b) => {
            const nameA = (a.customer_name || a.customerName || '').toLowerCase()
            const nameB = (b.customer_name || b.customerName || '').toLowerCase()
            return nameB.localeCompare(nameA, 'th')
          })

        default:
          return sorted
      }
    },

    formatDateTime(datetime) {
      if (!datetime) return '-'
      const date = new Date(datetime)
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    exportToExcel() {
      // Prepare data for export
      const data = this.filteredTestDrives.map(td => ({
        'เลขที่เอกสาร': this.getDocumentNumber(td),
        'วันที่-เวลา': this.formatDateTime(td.start_time || td.startTime || td.scheduled_start),
        'ชื่อลูกค้า': td.customer_name || td.customerName || '-',
        'เบอร์โทร': td.customer_phone || td.customerPhone || td.phone || '-',
        'รุ่นรถ': td.vehicle?.model || '-',
        'สถานะเอกสาร': this.getDocStatusText(td).replace(/[🟢🟡🔴]/g, '').trim(),
        'PDPA': td.pdpa_consent ? 'ยินยอม' : 'ยังไม่ยินยอม',
        'ลายเซ็น': td.signature_data ? 'มี' : 'ยังไม่มี'
      }))

      // Convert to CSV
      const headers = Object.keys(data[0])
      const csv = [
        headers.join(','),
        ...data.map(row => headers.map(header => {
          const value = row[header] || ''
          // Escape commas and quotes
          return `"${String(value).replace(/"/g, '""')}"`
        }).join(','))
      ].join('\n')

      // Add BOM for UTF-8
      const BOM = '\uFEFF'
      const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' })

      // Create download link
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      const timestamp = new Date().toISOString().split('T')[0]

      link.setAttribute('href', url)
      link.setAttribute('download', `เอกสารทดลองขับ_${timestamp}.csv`)
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      this.$toast?.success('Export Excel เรียบร้อย')
    }
  },

  mounted() {
    this.loadTestDrives()
  },

  head() {
    return {
      title: 'เอกสารทดลองขับ - ISUZU Enterprise System'
    }
  }
}
</script>
