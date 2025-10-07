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

    <!-- Advanced Search -->
    <AdvancedSearch />

    <!-- Results Summary -->
    <div v-if="filteredQueues.length > 0" class="text-sm text-gray-600">
      แสดงผลลัพธ์ {{ filteredQueues.length }} รายการ
    </div>
    <div v-else class="card p-8 text-center">
      <Icon name="search" icon-class="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">ไม่พบข้อมูลที่ค้นหา</h3>
      <p class="text-gray-500">ลองเปลี่ยนเงื่อนไขการค้นหาหรือล้างตัวกรอง</p>
    </div>

    <!-- Queue Table -->
    <QueueTable 
      v-if="filteredQueues.length > 0"
      :queues="filteredQueues"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDelete"
    />

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

export default {
  name: 'QueueManagement',
  layout: 'dashboard',
  data() {
    return {
      selectedRows: []
    }
  },
  computed: {
    ...mapGetters('dashboard', ['filteredQueues', 'statsData'])
  },
  async mounted() {
    if (this.$store) {
      await this.$store.dispatch('dashboard/fetchQueues')
    }
  },
  methods: {
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
