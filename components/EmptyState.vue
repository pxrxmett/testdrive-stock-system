<template>
  <div class="flex flex-col items-center justify-center py-12 px-4">
    <slot name="icon">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
    </slot>

    <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ title || 'ไม่มีข้อมูล' }}</h3>
    <p class="text-sm text-gray-600 text-center max-w-md mb-6">{{ description }}</p>

    <Button
      v-if="actionLabel"
      :variant="actionVariant || 'primary'"
      @click="$emit('action')"
    >
      {{ actionLabel }}
    </Button>
  </div>
</template>

<script>
export default {
  name: 'EmptyState',
  props: {
    icon: String,
    title: String,
    description: String,
    actionLabel: String,
    actionVariant: String
  }
}
</script>
