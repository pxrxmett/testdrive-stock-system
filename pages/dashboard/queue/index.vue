<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">จัดการคิวทดลองขับ</h1>
        <p class="text-gray-600">จัดการและติดตามคิวทดลองขับรถยนต์</p>
      </div>
      <button 
        @click="handleAddQueue"
        class="btn-primary flex items-center space-x-2"
      >
        <Icon name="plus" icon-class="w-4 h-4" />
        <span>เพิ่มคิวใหม่</span>
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-2xl font-bold text-gray-900">{{ statsData.total }}</p>
            <p class="text-sm text-gray-600">คิวทั้งหมด</p>
          </div>
          <Icon name="list" icon-class="w-8 h-8 text-gray-400" />
        </div>
      </div>

      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-2xl font-bold text-green-600">{{ statsData.inProgress }}</p>
            <p class="text-sm text-gray-600">กำลังทดสอบ</p>
          </div>
          <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
      
      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-2xl font-bold text-yellow-600">{{ statsData.scheduled }}</p>
            <p class="text-sm text-gray-600">รอคิว</p>
          </div>
          <Icon name="clock" icon-class="w-8 h-8 text-yellow-400" />
        </div>
      </div>
      
      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-2xl font-bold text-blue-600">{{ statsData.completed }}</p>
            <p class="text-sm text-gray-600">เสร็จสิ้น</p>
          </div>
          <Icon name="check" icon-class="w-8 h-8 text-blue-400" />
        </div>
      </div>
    </div>

    <!-- Filters -->
    <QueueFilters :sales-list="salesList" @filter-change="handleFilterChange" />

    <!-- View Toggle -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-1">
        <button
          @click="currentView = 'list'"
          :class="[
            'px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center space-x-2',
            currentView === 'list' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          <Icon name="list" icon-class="w-4 h-4" />
          <span>รายการ</span>
        </button>
        <button
          @click="currentView = 'group'"
          :class="[
            'px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center space-x-2',
            currentView === 'group' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>จัดกลุ่มตามพนักงาน</span>
        </button>
        <button
          @click="currentView = 'calendar'"
          :class="[
            'px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center space-x-2',
            currentView === 'calendar' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          <Icon name="calendar" icon-class="w-4 h-4" />
          <span>ปฏิทิน</span>
        </button>
      </div>
      <div v-if="displayFilteredQueues.length > 0" class="text-sm text-gray-600">
        แสดงผลลัพธ์ {{ displayFilteredQueues.length }} รายการ
      </div>
    </div>

    <!-- Content Views -->
    <div v-if="displayFilteredQueues.length === 0" class="card p-8 text-center">
      <Icon name="search" icon-class="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">ไม่พบข้อมูลที่ค้นหา</h3>
      <p class="text-gray-500">ลองเปลี่ยนเงื่อนไขการค้นหาหรือล้างตัวกรอง</p>
    </div>

    <!-- List View (Original) -->
    <div v-else-if="currentView === 'list'">
      <QueueTable
        :queues="displayFilteredQueues"
        @view="handleView"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <!-- Group by Sales View -->
    <div v-else-if="currentView === 'group'" class="space-y-4">
      <SalesGroupCard
        v-for="group in groupedBySales"
        :key="group.salesId"
        :sales-person="group.salesPerson"
        :queues="group.queues"
        @queue-click="handleView($event.id)"
        @queue-view="handleView($event.id)"
        @queue-edit="handleEdit($event.id)"
        @queue-confirm="confirmQueue($event)"
        @queue-cancel="handleDelete($event.id)"
      />
    </div>

    <!-- Calendar View -->
    <div v-else-if="currentView === 'calendar'" class="card p-6">
      <p class="text-center text-gray-600">Calendar View - Coming Soon</p>
    </div>

    <!-- Export/Action Bar -->
    <div v-if="filteredQueues.length > 0" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div class="text-sm text-gray-600">
        เลือก {{ selectedRows.length }} รายการ
      </div>
      <div class="flex items-center space-x-2">
        <button 
          @click="exportToCSV"
          class="btn-secondary flex items-center space-x-2 text-sm"
        >
          <Icon name="download" icon-class="w-4 h-4" />
          <span>ส่งออก CSV</span>
        </button>
        <button 
          @click="exportToPDF"
          class="btn-secondary flex items-center space-x-2 text-sm"
        >
          <Icon name="download" icon-class="w-4 h-4" />
          <span>ส่งออก PDF</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import QueueFilters from '~/components/QueueFilters.vue'
import SalesGroupCard from '~/components/SalesGroupCard.vue'

export default {
  name: 'QueueManagement',
  layout: 'dashboard',
  components: {
    QueueFilters,
    SalesGroupCard
  },
  data() {
    return {
      selectedRows: [],
      currentView: 'list', // 'list', 'group', 'calendar'
      customFilters: {},
      salesList: []
    }
  },
  computed: {
    ...mapGetters('dashboard', ['filteredQueues', 'statsData']),
    displayFilteredQueues() {
      let filtered = [...this.filteredQueues]

      // Apply custom filters
      if (this.customFilters.search) {
        const search = this.customFilters.search.toLowerCase()
        filtered = filtered.filter(q =>
          q.customerName?.toLowerCase().includes(search) ||
          q.customer_name?.toLowerCase().includes(search) ||
          q.phone?.toLowerCase().includes(search) ||
          q.customer_phone?.toLowerCase().includes(search) ||
          q.vehicleModel?.toLowerCase().includes(search) ||
          q.vehicle_model?.toLowerCase().includes(search)
        )
      }

      if (this.customFilters.status) {
        filtered = filtered.filter(q => q.status === this.customFilters.status)
      }

      if (this.customFilters.salesId) {
        if (this.customFilters.salesId === 'unassigned') {
          filtered = filtered.filter(q => !q.salesId && !q.sales_id && !q.sales)
        } else {
          filtered = filtered.filter(q =>
            q.salesId === this.customFilters.salesId ||
            q.sales_id === this.customFilters.salesId ||
            q.sales?.id === this.customFilters.salesId
          )
        }
      }

      return filtered
    },
    groupedBySales() {
      const groups = new Map()

      this.displayFilteredQueues.forEach(queue => {
        const salesId = queue.salesId || queue.sales_id || queue.sales?.id || 'unassigned'

        if (!groups.has(salesId)) {
          // Find sales person by matching ID (handle both string and number comparison)
          const salesPerson = queue.sales || this.salesList.find(s =>
            s.id === salesId || s.id === Number(salesId) || String(s.id) === String(salesId)
          ) || null

          groups.set(salesId, {
            salesId,
            salesPerson,
            queues: []
          })
        }

        groups.get(salesId).queues.push(queue)
      })

      const result = Array.from(groups.values())

      // Sort: assigned first, then by queue count
      result.sort((a, b) => {
        if (a.salesId === 'unassigned') return 1
        if (b.salesId === 'unassigned') return -1
        return b.queues.length - a.queues.length
      })

      return result
    }
  },
  async mounted() {
    if (this.$store) {
      await this.$store.dispatch('dashboard/fetchQueues')
    }
    await this.fetchSalesList()
  },
  methods: {
    async fetchSalesList() {
      try {
        // Try to fetch from API first
        const response = await this.$api._axios.$get('/users', { params: { role: 'sales' } })
        this.salesList = response?.users || response || []
        console.log('✅ Fetched sales list from API:', this.salesList.length)
      } catch (error) {
        console.warn('⚠️ Could not fetch sales from API, using mock data:', error.message)
        // Fallback to mock data if API is not available
        this.salesList = [
          { id: 1, nickname: 'John', firstName: 'John', lastName: 'Smith', name: 'John Smith' },
          { id: 2, nickname: 'Mary', firstName: 'Mary', lastName: 'Johnson', name: 'Mary Johnson' },
          { id: 3, nickname: 'Mike', firstName: 'Mike', lastName: 'Wilson', name: 'Mike Wilson' }
        ]
      }
    },
    handleFilterChange(filters) {
      this.customFilters = filters
    },
    handleAddQueue() {
      this.$router.push('/dashboard/queue/add')
    },
    handleView(queueId) {
      this.$router.push(`/dashboard/queue/${queueId}`)
    },
    handleEdit(queueId) {
      this.$router.push(`/dashboard/queue/${queueId}/edit`)
    },
    async handleDelete(queueId) {
      if (confirm('คุณต้องการลบคิวนี้หรือไม่?')) {
        this.$store.commit('dashboard/deleteQueue', queueId)
      }
    },
    async confirmQueue(queue) {
      if (confirm(`ยืนยันคิวของ ${queue.customerName || queue.customer_name}?`)) {
        try {
          await this.$api.testDrives.update(queue.id, { status: 'confirmed' })
          this.$toast?.success('ยืนยันคิวสำเร็จ')
          await this.$store.dispatch('dashboard/fetchQueues')
        } catch (error) {
          console.error('Error confirming queue:', error)
          this.$toast?.error('ไม่สามารถยืนยันคิวได้')
        }
      }
    },
    exportToCSV() {
      // ส่งออกเป็น CSV
      console.log('Exporting to CSV...')
    },
    exportToPDF() {
      // ส่งออกเป็น PDF
      console.log('Exporting to PDF...')
    }
  }
}
</script>
