<template>
  <div class="space-y-4">
    <!-- Compact Page Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2.5">
        <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 16H9m10 0h3l-3.333-5.333M21 16v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1M3 16h3m0 0 3.333-5.333M6 16v5a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1m-3-5L10 3h4l3 8M6 11h12"/>
          </svg>
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <h1 class="text-xl font-bold text-gray-900">คิวทดลองขับ ISUZU</h1>
            <span class="px-2.5 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
              รถยนต์
            </span>
          </div>
          <p class="text-sm text-gray-600 mt-0.5">จัดการคิวทดลองขับรถยนต์ ISUZU</p>
        </div>
      </div>
      <Button
        variant="primary"
        @click="handleAddQueue"
        class="bg-red-600 hover:bg-red-700 shadow-sm"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        เพิ่มคิวใหม่
      </Button>
    </div>

    <!-- Loading State -->
    <LoadingSkeleton
      v-if="loading"
      variant="card"
      :count="3"
      grid
      :cols="1"
    />

    <!-- Empty State -->
    <EmptyState
      v-else-if="!loading && queues.length === 0"
      icon="clipboard"
      title="ยังไม่มีคิวทดลองขับ"
      description="เริ่มต้นสร้างคิวทดลองขับรถยนต์ ISUZU คิวแรกของคุณ คิวจะแสดงที่นี่เมื่อมีการสร้าง"
      actionLabel="สร้างคิวใหม่"
      actionVariant="primary"
      @action="handleAddQueue"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
      </template>
    </EmptyState>

    <!-- Queue List -->
    <div v-else class="space-y-4">
      <Card
        v-for="queue in queues"
        :key="queue.id"
        hover
        padding="lg"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <span class="text-red-600 font-bold">{{ queue.number }}</span>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">{{ queue.customerName }}</h3>
              <p class="text-sm text-gray-600">{{ queue.phone }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <span :class="['px-3 py-1 text-xs font-semibold rounded-full', getStatusClass(queue.status)]">
              {{ getStatusLabel(queue.status) }}
            </span>
            <Button variant="ghost" size="sm">
              ดูรายละเอียด
            </Button>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IsuzuQueuePage',
  layout: 'dashboard',
  middleware: false,
  data() {
    return {
      brand: 'isuzu',
      loading: true,
      queues: []
    }
  },
  head() {
    return {
      title: 'คิวทดลองขับ ISUZU - Multi-Brand TestDrive System'
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
        if (this.$axios) {
          const response = await this.$axios.get('/api/queues', {
            params: { brand: 'isuzu' }
          })
          this.queues = response.data || []
        }
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
    getStatusClass(status) {
      const classes = {
        pending: 'bg-yellow-100 text-yellow-700',
        confirmed: 'bg-blue-100 text-blue-700',
        completed: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700'
      }
      return classes[status] || 'bg-gray-100 text-gray-700'
    },
    getStatusLabel(status) {
      const labels = {
        pending: 'รอดำเนินการ',
        confirmed: 'ยืนยันแล้ว',
        completed: 'เสร็จสิ้น',
        cancelled: 'ยกเลิก'
      }
      return labels[status] || status
    }
  }
}
</script>
