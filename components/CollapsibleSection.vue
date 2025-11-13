<template>
  <div class="collapsible-section">
    <!-- Section Header -->
    <button
      @click="toggle"
      class="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors group"
      :class="{ 'bg-gray-50': isOpen }"
    >
      <div class="flex items-center space-x-2">
        <!-- Icon -->
        <Icon
          v-if="icon"
          :name="icon"
          :icon-class="`w-4 h-4 ${iconColor || 'text-gray-600'}`"
        />
        <!-- Title -->
        <span
          v-if="!collapsed"
          class="text-xs font-semibold uppercase tracking-wider"
          :class="titleColor || 'text-gray-500'"
        >
          {{ title }}
        </span>
      </div>
      <!-- Chevron -->
      <svg
        v-if="!collapsed"
        class="w-4 h-4 text-gray-400 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Section Content -->
    <transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-screen"
      leave-from-class="opacity-100 max-h-screen"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-show="isOpen" class="space-y-1 mt-1 overflow-hidden">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'CollapsibleSection',
  props: {
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: null
    },
    iconColor: {
      type: String,
      default: null
    },
    titleColor: {
      type: String,
      default: null
    },
    collapsed: {
      type: Boolean,
      default: false
    },
    defaultOpen: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isOpen: this.defaultOpen
    }
  },
  methods: {
    toggle() {
      if (!this.collapsed) {
        this.isOpen = !this.isOpen
      }
    }
  },
  watch: {
    collapsed(newVal) {
      if (!newVal) {
        this.isOpen = this.defaultOpen
      }
    }
  }
}
</script>

<style scoped>
.max-h-0 {
  max-height: 0;
}

.max-h-screen {
  max-height: 100vh;
}
</style>
