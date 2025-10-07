<template>
  <div class="card">
    <!-- Search Header -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <Icon name="search" icon-class="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหาลูกค้า, รหัสคิว, เบอร์โทร, อีเมล..."
            :value="searchTerm"
            @input="handleSearchInput"
            class="flex-1 min-w-0 text-sm border-0 focus:ring-0 focus:outline-none placeholder-gray-400"
          />
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="toggleAdvancedSearch"
            :class="[
              'px-3 py-1.5 text-sm rounded-md transition-colors flex items-center space-x-1',
              advancedSearchOpen ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            <Icon name="filter" icon-class="w-4 h-4" />
            <span>ค้นหาขั้นสูง</span>
          </button>
          <button
            v-if="hasActiveFilters"
            @click="clearAllFilters"
            class="px-3 py-1.5 text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
          >
            ล้างตัวกรอง
          </button>
        </div>
      </div>
    </div>

    <!-- Advanced Search Panel -->
    <div v-if="advancedSearchOpen" class="p-4 bg-gray-50 border-b border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <!-- สถานะ -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">สถานะ</label>
          <select 
            :value="selectedStatus"
            @change="handleStatusChange"
            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
          >
            <option value="all">ทุกสถานะ</option>
            <option value="in-progress">กำลังทดสอบ</option>
            <option value="scheduled">รอคิว</option>
            <option value="completed">เสร็จสิ้น</option>
            <option value="cancelled">ยกเลิก</option>
          </select>
        </div>

        <!-- สาขา -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">สาขา</label>
          <select 
            :value="selectedLocation"
            @change="handleLocationChange"
            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
          >
            <option value="all">ทุกสาขา</option>
            <option v-for="location in uniqueLocations" :key="location" :value="location">
              {{ location }}
            </option>
          </select>
        </div>

        <!-- รุ่นรถ -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">รุ่นรถ</label>
          <select 
            :value="selectedCarModel"
            @change="handleCarModelChange"
            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
          >
            <option value="all">ทุกรุ่น</option>
            <option v-for="model in carModelOptions" :key="model.value" :value="model.value">
              {{ model.label }}
            </option>
          </select>
        </div>

        <!-- เซลส์ -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">เซลส์</label>
          <select 
            :value="selectedSalesRep"
            @change="handleSalesRepChange"
            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
          >
            <option value="all">ทุกคน</option>
            <option v-for="rep in uniqueSalesReps" :key="rep" :value="rep">
              {{ rep }}
            </option>
          </select>
        </div>

        <!-- ประเภทลูกค้า -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ประเภทลูกค้า</label>
          <select 
            :value="selectedCustomerType"
            @change="handleCustomerTypeChange"
            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
          >
            <option value="all">ทุกประเภท</option>
            <option v-for="type in uniqueCustomerTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </div>

        <!-- วันที่เริ่มต้น -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">วันที่เริ่มต้น</label>
          <input
            type="date"
            :value="dateRange.start"
            @input="handleDateRangeChange('start', $event.target.value)"
            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        <!-- วันที่สิ้นสุด -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">วันที่สิ้นสุด</label>
          <input
            type="date"
            :value="dateRange.end"
            @input="handleDateRangeChange('end', $event.target.value)"
            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
          />
        </div>
      </div>

      <!-- Quick Date Filters -->
      <div class="mt-4 flex items-center space-x-2">
        <span class="text-sm text-gray-600">ช่วงเวลา:</span>
        <button 
          @click="setQuickDateRange('today')"
          class="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          วันนี้
        </button>
        <button 
          @click="setQuickDateRange('week')"
          class="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          สัปดาห์นี้
        </button>
        <button 
          @click="setQuickDateRange('month')"
          class="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          เดือนนี้
        </button>
      </div>
    </div>

    <!-- Active Filters Display -->
    <div v-if="activeFilters.length > 0" class="p-3 bg-blue-50 border-b border-gray-200">
      <div class="flex items-center space-x-2 flex-wrap">
        <span class="text-sm text-blue-700 font-medium">ตัวกรองที่ใช้:</span>
        <div class="flex items-center space-x-1 flex-wrap">
          <span 
            v-for="filter in activeFilters" 
            :key="filter.key"
            class="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
          >
            <span>{{ filter.label }}</span>
            <button @click="removeFilter(filter.key)" class="hover:text-blue-900">
              <Icon name="close" icon-class="w-3 h-3" />
            </button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'AdvancedSearch',
  computed: {
    ...mapState('dashboard', [
      'searchTerm', 'selectedStatus', 'selectedLocation', 'selectedCarModel',
      'selectedSalesRep', 'selectedCustomerType', 'dateRange', 'advancedSearchOpen'
    ]),
    ...mapGetters('dashboard', [
      'uniqueCarModels', 'uniqueSalesReps', 'uniqueCustomerTypes', 'uniqueLocations'
    ]),
    
    carModelOptions() {
      return [
        { value: 'D-MAX', label: 'D-MAX ทุกรุ่น' },
        { value: 'MU-X', label: 'MU-X ทุกรุ่น' },
        { value: 'Blue Power', label: 'Blue Power' },
        { value: 'X-Series', label: 'X-Series' }
      ]
    },

    hasActiveFilters() {
      return this.searchTerm || 
             this.selectedStatus !== 'all' || 
             this.selectedLocation !== 'all' ||
             this.selectedCarModel !== 'all' ||
             this.selectedSalesRep !== 'all' ||
             this.selectedCustomerType !== 'all' ||
             this.dateRange.start || 
             this.dateRange.end
    },

    activeFilters() {
      const filters = []
      
      if (this.searchTerm) {
        filters.push({ key: 'search', label: `ค้นหา: "${this.searchTerm}"` })
      }
      if (this.selectedStatus !== 'all') {
        const statusLabels = {
          'in-progress': 'กำลังทดสอบ',
          'scheduled': 'รอคิว',
          'completed': 'เสร็จสิ้น',
          'cancelled': 'ยกเลิก'
        }
        filters.push({ key: 'status', label: `สถานะ: ${statusLabels[this.selectedStatus]}` })
      }
      if (this.selectedLocation !== 'all') {
        filters.push({ key: 'location', label: `สาขา: ${this.selectedLocation}` })
      }
      if (this.selectedCarModel !== 'all') {
        filters.push({ key: 'carModel', label: `รุ่นรถ: ${this.selectedCarModel}` })
      }
      if (this.selectedSalesRep !== 'all') {
        filters.push({ key: 'salesRep', label: `เซลส์: ${this.selectedSalesRep}` })
      }
      if (this.selectedCustomerType !== 'all') {
        filters.push({ key: 'customerType', label: `ประเภท: ${this.selectedCustomerType}` })
      }
      if (this.dateRange.start && this.dateRange.end) {
        filters.push({ key: 'dateRange', label: `${this.dateRange.start} - ${this.dateRange.end}` })
      }
      
      return filters
    }
  },
  methods: {
    ...mapMutations('dashboard', [
      'setSearchTerm', 'setSelectedStatus', 'setSelectedLocation', 'setSelectedCarModel',
      'setSelectedSalesRep', 'setSelectedCustomerType', 'setDateRange', 
      'setAdvancedSearchOpen', 'clearFilters'
    ]),

    handleSearchInput(event) {
      this.setSearchTerm(event.target.value)
    },

    toggleAdvancedSearch() {
      this.setAdvancedSearchOpen(!this.advancedSearchOpen)
    },

    handleStatusChange(event) {
      this.setSelectedStatus(event.target.value)
    },

    handleLocationChange(event) {
      this.setSelectedLocation(event.target.value)
    },

    handleCarModelChange(event) {
      this.setSelectedCarModel(event.target.value)
    },

    handleSalesRepChange(event) {
      this.setSelectedSalesRep(event.target.value)
    },

    handleCustomerTypeChange(event) {
      this.setSelectedCustomerType(event.target.value)
    },

    handleDateRangeChange(type, value) {
      const newRange = { ...this.dateRange }
      newRange[type] = value
      this.setDateRange(newRange)
    },

    setQuickDateRange(period) {
      const today = new Date()
      let start, end

      switch (period) {
        case 'today':
          start = end = today.toISOString().split('T')[0]
          break
        case 'week':
          const weekStart = new Date(today)
          weekStart.setDate(today.getDate() - today.getDay())
          const weekEnd = new Date(weekStart)
          weekEnd.setDate(weekStart.getDate() + 6)
          start = weekStart.toISOString().split('T')[0]
          end = weekEnd.toISOString().split('T')[0]
          break
        case 'month':
          start = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]
          end = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0]
          break
      }

      this.setDateRange({ start, end })
    },

    removeFilter(key) {
      switch (key) {
        case 'search':
          this.setSearchTerm('')
          break
        case 'status':
          this.setSelectedStatus('all')
          break
        case 'location':
          this.setSelectedLocation('all')
          break
        case 'carModel':
          this.setSelectedCarModel('all')
          break
        case 'salesRep':
          this.setSelectedSalesRep('all')
          break
        case 'customerType':
          this.setSelectedCustomerType('all')
          break
        case 'dateRange':
          this.setDateRange({ start: '', end: '' })
          break
      }
    },

    clearAllFilters() {
      this.clearFilters()
    }
  }
}
</script>
