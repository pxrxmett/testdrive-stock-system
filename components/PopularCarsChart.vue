<template>
  <div class="card p-6">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-base font-semibold text-gray-900">รถยนต์ยอดนิยม</h3>
        <p class="text-sm text-gray-600">สัปดาห์นี้</p>
      </div>
      <Icon name="chart" class="w-5 h-5 text-green-600" />
    </div>

    <div class="space-y-3">
      <div 
        v-for="(car, index) in popularCars" 
        :key="index"
        class="flex items-center justify-between p-3 bg-gray-50 rounded-md"
      >
        <div class="flex items-center space-x-3">
          <div :class="getRankClasses(index)">
            {{ index + 1 }}
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900">{{ car.model }}</p>
            <p class="text-xs text-gray-500">{{ car.count }} ครั้ง • {{ car.percentage }}%</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <div :class="getTrendIconClasses(car.trend)">
            <div v-if="car.trend === 'up'" class="w-2 h-2 border-t-2 border-r-2 border-green-500 transform rotate-45"></div>
            <div v-else-if="car.trend === 'down'" class="w-2 h-2 border-b-2 border-r-2 border-red-500 transform rotate-45"></div>
            <div v-else class="w-2 h-2 rounded-full bg-gray-300"></div>
          </div>
          <div class="w-16 bg-gray-200 rounded-full h-1.5">
            <div 
              class="bg-red-500 h-1.5 rounded-full transition-all duration-300"
              :style="{ width: car.percentage + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PopularCarsChart',
  data() {
    return {
      popularCars: [
        { model: 'D-MAX Blue Power 1.9', count: 12, percentage: 35.3, trend: 'up' },
        { model: 'MU-X Blue Power 3.0', count: 8, percentage: 23.5, trend: 'up' },
        { model: 'D-MAX X-Series', count: 6, percentage: 17.6, trend: 'down' },
        { model: 'MU-X Supreme', count: 5, percentage: 14.7, trend: 'stable' },
        { model: 'D-MAX Prestige', count: 3, percentage: 8.8, trend: 'up' }
      ]
    }
  },
  methods: {
    getRankClasses(index) {
      const baseClasses = 'w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white'
      if (index === 0) return `${baseClasses} bg-yellow-500`
      if (index === 1) return `${baseClasses} bg-gray-400`
      return `${baseClasses} bg-orange-500`
    },
    getTrendIconClasses(trend) {
      return 'flex items-center justify-center w-4 h-4'
    }
  }
}
</script>
