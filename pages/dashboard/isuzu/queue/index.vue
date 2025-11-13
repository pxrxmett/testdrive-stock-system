<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">จัดการคิวทดลองขับ</h1>
        <p class="text-sm text-gray-600 mt-1">จัดการและติดตามคิวทดลองขับรถยนต์ ISUZU ทุกสาขา</p>
      </div>
      <button
        @click="handleAddQueue"
        class="px-4 py-2.5 bg-gradient-to-r from-[#D52B1E] to-[#B91C1C] text-white text-sm font-medium rounded-lg hover:from-[#B91C1C] hover:to-[#991B1B] transition-all duration-150 shadow-sm hover:shadow-md flex items-center space-x-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>เพิ่มคิวใหม่</span>
      </button>
    </div>

    <!-- Loading State -->
    <LoadingSkeleton
      v-if="loading"
      variant="card"
      :count="5"
      grid
      :cols="1"
    />

    <!-- Content -->
    <template v-else>
      <!-- Stats Cards -->
      <QueueStatsCards :stats="stats" />

      <!-- Queue Table -->
      <QueueTableAdvanced
        :queues="enrichedQueues"
        @view="handleViewQueue"
        @edit="handleEditQueue"
        @delete="handleDeleteQueue"
        @status-click="handleStatusClick"
      />
    </template>
  </div>
</template>

<script>
import QueueStatsCards from '~/components/queue/StatsCards.vue'
import QueueTableAdvanced from '~/components/queue/TableAdvanced.vue'

export default {
  name: 'IsuzuQueuePage',
  layout: 'dashboard',
  middleware: false,
  components: {
    QueueStatsCards,
    QueueTableAdvanced
  },
  data() {
    return {
      brand: 'isuzu',
      loading: true,
      queues: []
    }
  },
  head() {
    return {
      title: 'จัดการคิวทดลองขับ ISUZU - Multi-Brand TestDrive System'
    }
  },
  computed: {
    stats() {
      return {
        total: this.queues.length,
        inProgress: this.queues.filter(q => q.status === 'in_progress').length,
        waiting: this.queues.filter(q => q.status === 'pending' || q.status === 'confirmed').length,
        completed: this.queues.filter(q => q.status === 'completed').length
      }
    },

    enrichedQueues() {
      // Enrich queues with additional data for display
      return this.queues.map((queue, index) => {
        // Determine customer type based on name or random for demo
        const customerTypes = ['vip', 'family', 'business', null]
        const customerType = index % 4 === 0 ? customerTypes[index % 4] : null

        // Sample sales persons
        const salesPersons = [
          { name: 'สมชาย ใจดี', position: 'เซลล์อาวุโส' },
          { name: 'สมหญิง รักงาน', position: 'เซลล์' },
          { name: 'วิชัย ขยัน', position: 'หัวหน้าเซลล์' },
          null
        ]
        const salesPerson = salesPersons[index % salesPersons.length]

        // Sample branches
        const branches = ['กรุงเทพ', 'เชียงใหม่', 'ภูเก็ต', 'ขอนแก่น']

        return {
          ...queue,
          customerType,
          salesPerson: salesPerson?.name,
          salesPosition: salesPerson?.position,
          branch: branches[index % branches.length],
          duration: 60, // Default duration in minutes
          testDriveDate: queue.test_drive_date || queue.testDriveDate || queue.appointmentDate || new Date().toISOString(),
          testDriveTime: queue.test_drive_time || queue.testDriveTime || queue.appointmentTime || '10:00',
          customerName: queue.customer_name || queue.customerName || 'ไม่ระบุ',
          customerPhone: queue.customer_phone || queue.customerPhone || queue.phone || '-',
          vehicleModel: queue.vehicle_model || queue.vehicleModel || queue.carModel || 'ISUZU D-Max'
        }
      })
    }
  },
  async mounted() {
    await this.fetchQueues()
  },
  methods: {
    async fetchQueues() {
      try {
        this.loading = true

        // Fetch queues from API
        const response = await this.$api.testDrives.getAll('ISUZU')

        // Handle different response formats
        if (Array.isArray(response)) {
          this.queues = response
        } else if (response.data) {
          this.queues = response.data
        } else if (response.testDrives) {
          this.queues = response.testDrives
        } else {
          this.queues = []
        }

        console.log('✅ Fetched ISUZU queues:', this.queues.length)
      } catch (error) {
        console.error('Error fetching queues:', error)
        this.queues = []
      } finally {
        this.loading = false
      }
    },

    handleAddQueue() {
      this.$router.push('/dashboard/queue/add?brand=isuzu')
    },

    handleViewQueue(queue) {
      this.$router.push(`/dashboard/queue/${queue.id}`)
    },

    handleEditQueue(queue) {
      this.$router.push(`/dashboard/queue/${queue.id}/edit`)
    },

    async handleDeleteQueue(queue) {
      if (!confirm(`ต้องการลบคิวของ ${queue.customerName} ใช่หรือไม่?`)) {
        return
      }

      try {
        await this.$api.testDrives.delete('ISUZU', queue.id)
        console.log('Success:', 'ลบคิวเรียบร้อยแล้ว')
        await this.fetchQueues()
      } catch (error) {
        console.error('Error deleting queue:', error)
        console.error('ไม่สามารถลบคิวได้')
      }
    },

    handleStatusClick(queue) {
      // TODO: Implement status change dialog
      console.log('Status clicked for queue:', queue.id)
    }
  }
}
</script>
