<template>
  <div class="text-center py-12 px-4">
    <!-- Icon -->
    <div class="mb-4">
      <div v-if="icon" class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" :d="iconPath" />
        </svg>
      </div>
      <slot name="icon" v-else>
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
      </slot>
    </div>

    <!-- Title -->
    <h3 class="text-lg font-semibold text-gray-900 mb-1">
      {{ title }}
    </h3>

    <!-- Description -->
    <p class="text-sm text-gray-500 max-w-sm mx-auto mb-6">
      {{ description }}
    </p>

    <!-- Action Button -->
    <slot name="action">
      <Button
        v-if="actionLabel"
        :variant="actionVariant"
        @click="$emit('action')"
      >
        {{ actionLabel }}
      </Button>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'EmptyState',
  props: {
    icon: {
      type: String,
      default: null
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    actionLabel: {
      type: String,
      default: null
    },
    actionVariant: {
      type: String,
      default: 'primary'
    }
  },
  computed: {
    iconPath() {
      const icons = {
        inbox: "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4",
        search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
        clipboard: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
        calendar: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
        users: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      }
      return icons[this.icon] || icons.inbox
    }
  }
}
</script>
