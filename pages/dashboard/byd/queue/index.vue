<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">จัดการคิวทดลองขับ</h1>
        <p class="text-sm text-gray-600 mt-1">จัดการและติดตามคิวทดลองขับรถยนต์ BYD ทุกสาขา</p>
      </div>
      <button
        @click="handleAddQueue"
        class="px-4 py-2.5 bg-gradient-to-r from-[#00A4E4] to-[#0284C7] text-white text-sm font-medium rounded-lg hover:from-[#0284C7] hover:to-[#0369A1] transition-all duration-150 shadow-sm hover:shadow-md flex items-center space-x-2"
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
  name: 'BydQueuePage',
  layout: 'dashboard',
  middleware: false,
  components: {
    QueueStatsCards,
    QueueTableAdvanced
  },
  data() {
    return {
      brand: 'byd',
      loading: true,
      queues: []
    }
  },
  head() {
    return {
      title: 'จัดการคิวทดลองขับ BYD - Multi-Brand TestDrive System'
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
      // Map API data to display format
      return this.queues.map((queue) => {
        return {
          ...queue,
          // Use real data from API
          customerType: queue.customer_type || queue.customerType || null,
          salesPerson: queue.sales_person || queue.salesPerson || queue.assigned_staff || null,
          salesPosition: queue.sales_position || queue.salesPosition || (queue.sales_person ? 'เซลล์' : null),
          branch: queue.branch || queue.location || null,
          duration: queue.duration || queue.test_drive_duration || 60,
          testDriveDate: queue.test_drive_date || queue.testDriveDate || queue.appointmentDate || queue.appointment_date || new Date().toISOString(),
          testDriveTime: queue.test_drive_time || queue.testDriveTime || queue.appointmentTime || queue.appointment_time || '10:00',
          customerName: queue.customer_name || queue.customerName || 'ไม่ระบุ',
          customerPhone: queue.customer_phone || queue.customerPhone || queue.phone || '-',
          vehicleModel: queue.vehicle_model || queue.vehicleModel || queue.carModel || queue.model || 'BYD ATTO 3'
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
        const response = await this.$api.testDrives.getAll('BYD')

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

        console.log('✅ Fetched BYD queues:', this.queues.length)
      } catch (error) {
        console.error('Error fetching queues:', error)
        this.queues = []
      } finally {
        this.loading = false
      }
    },

    handleAddQueue() {
      this.$router.push('/dashboard/queue/add?brand=byd')
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
        await this.$api.testDrives.delete('BYD', queue.id)
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
