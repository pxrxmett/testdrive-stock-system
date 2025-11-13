<template>
  <div class="card p-4">
    <div class="flex items-center justify-between mb-3">
      <div :class="iconContainerClasses">
        <Icon :name="iconName" :class="iconClasses" />
      </div>
      <div class="text-right">
        <p class="text-xl font-bold text-gray-900">{{ value }}</p>
        <p class="text-sm text-gray-600">{{ title }}</p>
      </div>
    </div>
    <div class="flex items-center justify-between">
      <div :class="changeClasses">
        <span>{{ change }}</span>
      </div>
      <p class="text-xs text-gray-500">{{ description }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MetricCard',
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    change: {
      type: String,
      required: true
    },
    trend: {
      type: String,
      default: 'up'
    },
    color: {
      type: String,
      default: 'gray'
    },
    description: {
      type: String,
      default: ''
    }
  },
  computed: {
    iconContainerClasses() {
      const colorMap = {
        green: 'bg-green-100',
        blue: 'bg-blue-100',
        purple: 'bg-purple-100',
        red: 'bg-red-100',
        gray: 'bg-gray-100'
      }
      return `w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[this.color]}`
    },
    iconClasses() {
      const colorMap = {
        green: 'text-green-600',
        blue: 'text-[#D52B1E]',
        purple: 'text-purple-600',
        red: 'text-[#D52B1E]',
        gray: 'text-gray-600'
      }
      return `w-5 h-5 ${colorMap[this.color]}`
    },
    iconName() {
      const iconMap = {
        green: 'check',
        blue: 'chart',
        purple: 'users',
        red: 'chart'
      }
      return iconMap[this.color] || 'chart'
    },
    changeClasses() {
      const trendClasses = this.trend === 'up' 
        ? 'text-green-600' 
        : this.trend === 'down' 
          ? 'text-[#D52B1E]' 
          : 'text-gray-600'
      return `flex items-center space-x-1 text-sm ${trendClasses}`
    }
  }
}
</script>
