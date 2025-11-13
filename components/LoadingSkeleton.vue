<template>
  <div class="animate-pulse space-y-4">
    <div v-for="i in count" :key="i" :class="variantClass">
      <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingSkeleton',
  props: {
    variant: {
      type: String,
      default: 'card'
    },
    count: {
      type: Number,
      default: 3
    },
    grid: Boolean,
    cols: Number
  },
  computed: {
    variantClass() {
      if (this.variant === 'card') {
        return 'p-6 bg-white rounded-lg border border-gray-200'
      }
      if (this.variant === 'table') {
        return 'p-4 bg-white border-b border-gray-200'
      }
      return 'p-4'
    }
  }
}
</script>
