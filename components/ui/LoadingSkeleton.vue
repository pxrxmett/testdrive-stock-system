<template>
  <div :class="containerClasses">
    <div v-for="i in count" :key="i" class="animate-pulse">
      <div v-if="variant === 'card'" class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div class="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>

      <div v-else-if="variant === 'table'" class="bg-white">
        <div class="h-12 bg-gray-100 rounded mb-2"></div>
        <div v-for="j in 5" :key="j" class="h-16 bg-gray-50 rounded mb-1"></div>
      </div>

      <div v-else-if="variant === 'list'" class="bg-white p-4 rounded-lg border border-gray-200">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
          <div class="flex-1">
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <div v-else-if="variant === 'text'" class="space-y-3">
        <div class="h-4 bg-gray-200 rounded w-full"></div>
        <div class="h-4 bg-gray-200 rounded w-5/6"></div>
        <div class="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>

      <div v-else class="h-full bg-gray-200 rounded"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingSkeleton',
  props: {
    variant: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'card', 'table', 'list', 'text'].includes(value)
    },
    count: {
      type: Number,
      default: 1
    },
    grid: {
      type: Boolean,
      default: false
    },
    cols: {
      type: Number,
      default: 1
    }
  },
  computed: {
    containerClasses() {
      const base = []

      if (this.grid) {
        base.push('grid gap-4')
        if (this.cols === 2) {
          base.push('grid-cols-1 md:grid-cols-2')
        } else if (this.cols === 3) {
          base.push('grid-cols-1 md:grid-cols-2 lg:grid-cols-3')
        } else if (this.cols === 4) {
          base.push('grid-cols-1 md:grid-cols-2 lg:grid-cols-4')
        }
      } else {
        base.push('space-y-4')
      }

      return base
    }
  }
}
</script>
