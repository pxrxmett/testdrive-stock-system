<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">รายงานและสถิติ</h1>
        <p class="text-gray-600">ดูสถิติและรายงานการใช้งานระบบ</p>
      </div>
      <div class="flex items-center space-x-2">
        <button class="btn-secondary text-sm">6 เดือน</button>
        <button class="btn-primary text-sm">12 เดือน</button>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard 
        title="อัตราการแปลง"
        value="68.4%"
        change="+8.7%"
        trend="up"
        color="green"
        description="จากทดสอบเป็นซื้อ"
      />
      <MetricCard 
        title="ความพึงพอใจ"
        value="4.6/5"
        change="+5.1%"
        trend="up"
        color="blue"
        description="เฉลี่ยลูกค้า"
      />
      <MetricCard 
        title="ลูกค้าใหม่"
        value="156"
        change="+12.5%"
        trend="up"
        color="purple"
        description="เดือนนี้"
      />
      <MetricCard 
        title="รายได้คาดการณ์"
        value="15.8M"
        change="+23%"
        trend="up"
        color="red"
        description="บาท"
      />
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Popular Cars -->
      <PopularCarsChart />
      
      <!-- Revenue Chart -->
      <RevenueChart />
    </div>

    <!-- Additional Analytics -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="card p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div class="text-right">
            <p class="text-xl font-bold text-gray-900">94.2%</p>
            <p class="text-sm text-gray-600">อัตราใช้งาน</p>
          </div>
        </div>
        <div class="flex items-center space-x-1 text-sm text-green-600">
          <span>ระบบทำงานปกติ</span>
        </div>
      </div>

      <div class="card p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <Icon name="clock" class="w-5 h-5 text-amber-600" />
          </div>
          <div class="text-right">
            <p class="text-xl font-bold text-gray-900">45</p>
            <p class="text-sm text-gray-600">นาที/ครั้ง</p>
          </div>
        </div>
        <div class="flex items-center space-x-1 text-sm text-amber-600">
          <span>ลดลง 5 นาที</span>
        </div>
      </div>

      <div class="card p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon name="chart" class="w-5 h-5 text-blue-600" />
          </div>
          <div class="text-right">
            <p class="text-xl font-bold text-gray-900">89%</p>
            <p class="text-sm text-gray-600">ประสิทธิภาพ</p>
          </div>
        </div>
        <div class="flex items-center space-x-1 text-sm text-blue-600">
          <span>เพิ่มขึ้น 12%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Analytics',
  layout: 'dashboard'
}
</script>
