<template>
  <div class="space-y-6">
    <!-- Enhanced Page Header with Actions -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">รายงานและสถิติ</h1>
          <p class="text-gray-600 mt-1">วิเคราะห์ข้อมูลและประสิทธิภาพของระบบ</p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <!-- Date Range Selector -->
          <select
            v-model="selectedPeriod"
            @change="handlePeriodChange"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="7days">7 วันที่ผ่านมา</option>
            <option value="30days">30 วันที่ผ่านมา</option>
            <option value="3months">3 เดือนที่ผ่านมา</option>
            <option value="6months">6 เดือนที่ผ่านมา</option>
            <option value="12months" selected>12 เดือนที่ผ่านมา</option>
            <option value="custom">กำหนดเอง</option>
          </select>

          <!-- Compare Toggle -->
          <button
            @click="compareMode = !compareMode"
            :class="compareMode ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border border-gray-300'"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>เปรียบเทียบ</span>
          </button>

          <!-- Export Menu -->
          <div class="relative">
            <button
              @click="showExportMenu = !showExportMenu"
              class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export</span>
            </button>

            <!-- Export Dropdown -->
            <div v-if="showExportMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              <button @click="exportToPDF" class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>Export เป็น PDF</span>
              </button>
              <button @click="exportToExcel" class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Export เป็น Excel</span>
              </button>
              <button @click="exportToCSV" class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Export เป็น CSV</span>
              </button>
            </div>
          </div>

          <!-- Refresh Button -->
          <button
            @click="refreshData"
            :disabled="loading"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <svg
              :class="loading ? 'animate-spin' : ''"
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{{ loading ? 'กำลังโหลด...' : 'รีเฟรช' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="i in 4" :key="i" class="card p-6 animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div class="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center space-x-3">
        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 class="text-red-800 font-medium">เกิดข้อผิดพลาด</h3>
          <p class="text-red-600 text-sm">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Key Metrics with Comparison -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="(metric, index) in metrics"
        :key="index"
        class="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
        @click="drillDownMetric(metric)"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600 mb-1">{{ metric.title }}</p>
            <p class="text-3xl font-bold text-gray-900 mb-2">{{ metric.value }}</p>

            <!-- Trend Indicator -->
            <div class="flex items-center space-x-2">
              <div
                :class="[
                  'flex items-center space-x-1 text-sm font-medium px-2 py-1 rounded-full',
                  metric.trend === 'up' ? 'bg-green-100 text-green-700' :
                  metric.trend === 'down' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                ]"
              >
                <svg
                  v-if="metric.trend === 'up'"
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <svg
                  v-else-if="metric.trend === 'down'"
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <svg
                  v-else
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14" />
                </svg>
                <span>{{ metric.change }}</span>
              </div>
              <p class="text-xs text-gray-500">{{ metric.description }}</p>
            </div>

            <!-- Comparison Data (if enabled) -->
            <div v-if="compareMode && metric.comparison" class="mt-3 pt-3 border-t border-gray-200">
              <p class="text-xs text-gray-500">เปรียบเทียบกับช่วงก่อน</p>
              <p class="text-sm font-medium text-gray-700">{{ metric.comparison }}</p>
            </div>
          </div>

          <!-- Icon -->
          <div
            :class="[
              'w-12 h-12 rounded-lg flex items-center justify-center',
              metric.color === 'green' ? 'bg-green-100' :
              metric.color === 'blue' ? 'bg-blue-100' :
              metric.color === 'purple' ? 'bg-purple-100' :
              metric.color === 'red' ? 'bg-red-100' :
              'bg-gray-100'
            ]"
          >
            <svg class="w-6 h-6" :class="`text-${metric.color}-600`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="metric.icon" />
            </svg>
          </div>
        </div>

        <!-- Mini Sparkline (optional) -->
        <div v-if="metric.sparkline" class="mt-4 h-8">
          <svg class="w-full h-full" viewBox="0 0 100 30">
            <polyline
              :points="metric.sparkline"
              fill="none"
              :stroke="metric.color === 'green' ? '#10b981' : '#3b82f6'"
              stroke-width="2"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Charts Section with Tabs -->
    <div class="card p-6">
      <div class="border-b border-gray-200 mb-6">
        <nav class="flex space-x-8" aria-label="Tabs">
          <button
            v-for="tab in chartTabs"
            :key="tab.id"
            @click="activeChartTab = tab.id"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeChartTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Revenue Chart -->
      <div v-show="activeChartTab === 'revenue'">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">รายได้และยอดขาย</h3>
            <p class="text-sm text-gray-600">เปรียบเทียบตลอดปี</p>
          </div>
          <div class="flex items-center space-x-2">
            <button
              v-for="period in ['รายวัน', 'รายสัปดาห์', 'รายเดือน']"
              :key="period"
              @click="revenueChartPeriod = period"
              :class="[
                'px-3 py-1 rounded text-xs font-medium transition-colors',
                revenueChartPeriod === period
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              {{ period }}
            </button>
          </div>
        </div>

        <div class="h-80 bg-gray-50 rounded-lg border border-gray-200 p-4">
          <!-- Enhanced Bar Chart -->
          <div class="h-full flex items-end justify-center space-x-2">
            <div
              v-for="(data, index) in revenueChartData"
              :key="index"
              class="flex-1 max-w-12 group relative"
            >
              <!-- Bar -->
              <div
                class="bg-gradient-to-t from-red-600 to-red-400 rounded-t transition-all duration-300 hover:from-red-700 hover:to-red-500 cursor-pointer relative"
                :style="{ height: data.height + '%' }"
                @mouseenter="showChartTooltip(index, data, $event)"
                @mouseleave="hideChartTooltip"
              >
                <!-- Value on top of bar -->
                <div class="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium text-gray-700 whitespace-nowrap">
                  {{ data.value }}
                </div>
              </div>

              <!-- Month Label -->
              <div class="text-center mt-2">
                <span class="text-xs text-gray-500 font-medium">{{ data.month }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Chart Legend -->
        <div class="mt-4 flex items-center justify-center space-x-6 text-sm">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-gradient-to-r from-red-600 to-red-400 rounded-full"></div>
            <span class="text-gray-600">ยอดขายจริง</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-gray-300 rounded-full"></div>
            <span class="text-gray-600">เป้าหมาย</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span class="text-gray-600">ช่วงเดียวกันปีก่อน</span>
          </div>
        </div>
      </div>

      <!-- Popular Cars Chart -->
      <div v-show="activeChartTab === 'popular'">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">รถยนต์ยอดนิยม</h3>
            <p class="text-sm text-gray-600">{{ selectedPeriod === '12months' ? 'ปีนี้' : 'ตามช่วงเวลาที่เลือก' }}</p>
          </div>
        </div>

        <div class="space-y-4">
          <div
            v-for="(car, index) in popularCarsData"
            :key="index"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            @click="drillDownCar(car)"
          >
            <div class="flex items-center space-x-4 flex-1">
              <!-- Rank Badge -->
              <div
                :class="[
                  'w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white',
                  index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                  index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                  index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                  'bg-gradient-to-br from-blue-400 to-blue-600'
                ]"
              >
                {{ index + 1 }}
              </div>

              <!-- Car Info -->
              <div class="flex-1">
                <p class="text-sm font-semibold text-gray-900">{{ car.model }}</p>
                <div class="flex items-center space-x-3 mt-1">
                  <span class="text-xs text-gray-500">{{ car.count }} ครั้ง</span>
                  <span class="text-xs text-gray-400">•</span>
                  <span class="text-xs text-gray-500">{{ car.percentage }}%</span>
                  <span class="text-xs text-gray-400">•</span>
                  <div
                    :class="[
                      'flex items-center text-xs font-medium',
                      car.trend === 'up' ? 'text-green-600' :
                      car.trend === 'down' ? 'text-red-600' :
                      'text-gray-600'
                    ]"
                  >
                    <svg
                      v-if="car.trend !== 'stable'"
                      class="w-3 h-3 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        :d="car.trend === 'up' ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'"
                      />
                    </svg>
                    {{ car.trendValue }}
                  </div>
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="w-32 hidden md:block">
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    :class="[
                      'h-2 rounded-full transition-all duration-500',
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-orange-500' :
                      'bg-blue-500'
                    ]"
                    :style="{ width: car.percentage + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Metrics -->
      <div v-show="activeChartTab === 'performance'">
        <div class="mb-4">
          <h3 class="text-lg font-semibold text-gray-900">ประสิทธิภาพระบบ</h3>
          <p class="text-sm text-gray-600">ตัวชี้วัดสำคัญของระบบ</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div class="text-right">
                <p class="text-3xl font-bold text-green-900">94.2%</p>
                <p class="text-sm text-green-700">อัตราใช้งาน</p>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-green-700">ระบบทำงานปกติ</span>
              <div class="flex items-center space-x-1 text-xs text-green-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>+2.5%</span>
              </div>
            </div>
          </div>

          <div class="p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="text-right">
                <p class="text-3xl font-bold text-amber-900">45</p>
                <p class="text-sm text-amber-700">นาที/ครั้ง</p>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-amber-700">เวลาทดสอบเฉลี่ย</span>
              <div class="flex items-center space-x-1 text-xs text-green-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span>-5 นาที</span>
              </div>
            </div>
          </div>

          <div class="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div class="text-right">
                <p class="text-3xl font-bold text-blue-900">89%</p>
                <p class="text-sm text-blue-700">ประสิทธิภาพ</p>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-blue-700">คะแนนรวม</span>
              <div class="flex items-center space-x-1 text-xs text-green-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>+12%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Performance Metrics -->
        <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-6 bg-white border border-gray-200 rounded-lg">
            <h4 class="text-sm font-semibold text-gray-900 mb-4">อัตราความสำเร็จ</h4>
            <div class="space-y-3">
              <div>
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm text-gray-600">จองครบตามเป้า</span>
                  <span class="text-sm font-medium text-gray-900">85%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-green-500 h-2 rounded-full" style="width: 85%"></div>
                </div>
              </div>
              <div>
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm text-gray-600">ลูกค้าพึงพอใจ</span>
                  <span class="text-sm font-medium text-gray-900">92%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-500 h-2 rounded-full" style="width: 92%"></div>
                </div>
              </div>
              <div>
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm text-gray-600">ทำตามกำหนด</span>
                  <span class="text-sm font-medium text-gray-900">78%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-purple-500 h-2 rounded-full" style="width: 78%"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="p-6 bg-white border border-gray-200 rounded-lg">
            <h4 class="text-sm font-semibold text-gray-900 mb-4">การใช้งานรถยนต์</h4>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">จำนวนรถทั้งหมด</span>
                <span class="text-sm font-medium text-gray-900">24 คัน</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">ใช้งานอยู่</span>
                <span class="text-sm font-medium text-green-600">18 คัน (75%)</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">ว่างพร้อมใช้</span>
                <span class="text-sm font-medium text-blue-600">6 คัน (25%)</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">เข้าบำรุงรักษา</span>
                <span class="text-sm font-medium text-amber-600">0 คัน</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Insights -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Top Performing Staff -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">พนักงานขายยอดเยี่ยม</h3>
        <div class="space-y-3">
          <div
            v-for="(staff, index) in topStaff"
            :key="index"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                {{ staff.initials }}
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ staff.name }}</p>
                <p class="text-xs text-gray-500">{{ staff.sales }} ยอดขาย</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold text-gray-900">{{ staff.revenue }}</p>
              <p class="text-xs text-green-600">{{ staff.growth }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Achievements -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">ความสำเร็จล่าสุด</h3>
        <div class="space-y-3">
          <div
            v-for="(achievement, index) in achievements"
            :key="index"
            class="flex items-start space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200"
          >
            <div class="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">{{ achievement.title }}</p>
              <p class="text-xs text-gray-600">{{ achievement.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnalyticsImproved',
  layout: 'dashboard',

  data() {
    return {
      loading: false,
      error: null,
      selectedPeriod: '12months',
      compareMode: false,
      showExportMenu: false,
      activeChartTab: 'revenue',
      revenueChartPeriod: 'รายเดือน',

      chartTabs: [
        { id: 'revenue', name: 'รายได้และยอดขาย' },
        { id: 'popular', name: 'รถยนต์ยอดนิยม' },
        { id: 'performance', name: 'ประสิทธิภาพ' }
      ],

      metrics: [
        {
          title: 'อัตราการแปลง',
          value: '68.4%',
          change: '+8.7%',
          trend: 'up',
          color: 'green',
          description: 'จากทดสอบเป็นซื้อ',
          icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
          comparison: 'ก่อนหน้า: 59.7%',
          sparkline: '0,40 10,35 20,42 30,45 40,48 50,50 60,55 70,52 80,58 90,60 100,68'
        },
        {
          title: 'ความพึงพอใจ',
          value: '4.6/5',
          change: '+5.1%',
          trend: 'up',
          color: 'blue',
          description: 'เฉลี่ยลูกค้า',
          icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
          comparison: 'ก่อนหน้า: 4.4/5'
        },
        {
          title: 'ลูกค้าใหม่',
          value: '156',
          change: '+12.5%',
          trend: 'up',
          color: 'purple',
          description: 'เดือนนี้',
          icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
          comparison: 'ก่อนหน้า: 138 คน'
        },
        {
          title: 'รายได้คาดการณ์',
          value: '15.8M',
          change: '+23%',
          trend: 'up',
          color: 'red',
          description: 'บาท',
          icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
          comparison: 'ก่อนหน้า: 12.9M'
        }
      ],

      revenueChartData: [
        { height: 45, month: 'ม.ค.', value: '2.1M', target: '2.0M' },
        { height: 52, month: 'ก.พ.', value: '2.4M', target: '2.2M' },
        { height: 48, month: 'มี.ค.', value: '2.2M', target: '2.3M' },
        { height: 61, month: 'เม.ย.', value: '2.8M', target: '2.5M' },
        { height: 55, month: 'พ.ค.', value: '2.5M', target: '2.4M' },
        { height: 67, month: 'มิ.ย.', value: '3.1M', target: '2.8M' },
        { height: 59, month: 'ก.ค.', value: '2.7M', target: '2.6M' },
        { height: 73, month: 'ส.ค.', value: '3.4M', target: '3.0M' },
        { height: 69, month: 'ก.ย.', value: '3.2M', target: '2.9M' },
        { height: 81, month: 'ต.ค.', value: '3.7M', target: '3.2M' },
        { height: 76, month: 'พ.ย.', value: '3.5M', target: '3.3M' },
        { height: 84, month: 'ธ.ค.', value: '3.9M', target: '3.5M' }
      ],

      popularCarsData: [
        {
          model: 'D-MAX Blue Power 1.9',
          count: 145,
          percentage: 35.3,
          trend: 'up',
          trendValue: '+8.2%'
        },
        {
          model: 'MU-X Blue Power 3.0',
          count: 98,
          percentage: 23.9,
          trend: 'up',
          trendValue: '+12.1%'
        },
        {
          model: 'D-MAX X-Series',
          count: 72,
          percentage: 17.5,
          trend: 'down',
          trendValue: '-3.5%'
        },
        {
          model: 'MU-X Supreme',
          count: 58,
          percentage: 14.1,
          trend: 'stable',
          trendValue: '0%'
        },
        {
          model: 'D-MAX Prestige',
          count: 38,
          percentage: 9.2,
          trend: 'up',
          trendValue: '+5.8%'
        }
      ],

      topStaff: [
        { name: 'คุณสมชาย ใจดี', initials: 'ส', sales: 45, revenue: '4.2M', growth: '+15%' },
        { name: 'คุณสุดา แสงจันทร์', initials: 'ส', sales: 38, revenue: '3.8M', growth: '+22%' },
        { name: 'คุณจิรายุ ธนาสมบัติ', initials: 'จ', sales: 32, revenue: '3.1M', growth: '+8%' }
      ],

      achievements: [
        {
          title: 'ยอดขายสูงสุดในรอบ 6 เดือน',
          description: 'บรรลุเป้าหมาย 3.9M บาท เดือนธันวาคม'
        },
        {
          title: 'ความพึงพอใจลูกค้า 4.6/5',
          description: 'เพิ่มขึ้นจาก 4.4/5 ในเดือนที่แล้ว'
        },
        {
          title: 'อัตราการแปลงสูงสุด 68.4%',
          description: 'เพิ่มขึ้น 8.7% จากเดือนก่อน'
        }
      ]
    }
  },

  async mounted() {
    await this.loadAnalyticsData()
  },

  methods: {
    async loadAnalyticsData() {
      this.loading = true
      this.error = null

      try {
        // TODO: Replace with real API calls
        // const testDrives = await this.$api.testDrives.getAll()
        // this.calculateMetrics(testDrives)
        // this.calculatePopularCars(testDrives)
        // this.calculateRevenue(testDrives)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        this.error = 'ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง'
        console.error('Error loading analytics:', error)
      } finally {
        this.loading = false
      }
    },

    async refreshData() {
      await this.loadAnalyticsData()
    },

    handlePeriodChange() {
      if (this.selectedPeriod === 'custom') {
        // Show date range picker
        alert('ฟีเจอร์เลือกวันที่กำหนดเองจะพร้อมใช้งานเร็วๆ นี้')
      } else {
        this.loadAnalyticsData()
      }
    },

    drillDownMetric(metric) {
      console.log('Drill down into metric:', metric.title)
      // Navigate to detailed view
    },

    drillDownCar(car) {
      console.log('Drill down into car:', car.model)
      // Show detailed car statistics
    },

    showChartTooltip(index, data, event) {
      // Implement tooltip logic
      console.log('Show tooltip for:', data)
    },

    hideChartTooltip() {
      // Hide tooltip
    },

    async exportToPDF() {
      this.showExportMenu = false
      alert('กำลังเตรียม PDF...')
      // Implement PDF export
    },

    async exportToExcel() {
      this.showExportMenu = false
      alert('กำลังเตรียม Excel...')
      // Implement Excel export
    },

    async exportToCSV() {
      this.showExportMenu = false
      alert('กำลังเตรียม CSV...')
      // Implement CSV export
    }
  }
}
</script>

<style scoped>
/* Add custom animations if needed */
</style>
