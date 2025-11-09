<template>
  <button
    @click="$emit('click')"
    :class="buttonClasses"
    :style="buttonStyle"
    :title="collapsed ? label : ''"
  >
    <!-- Icon -->
    <div class="flex-shrink-0">
      <svg
        class="w-5 h-5"
        :class="iconClasses"
        :style="iconStyle"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath" />
      </svg>
    </div>

    <!-- Label -->
    <span
      v-if="!collapsed"
      class="text-sm font-medium truncate transition-opacity duration-200"
      :class="labelClasses"
      :style="labelStyle"
    >
      {{ label }}
    </span>

    <!-- Active Indicator -->
    <div
      v-if="active && !collapsed"
      class="w-2 h-2 rounded-full ml-auto flex-shrink-0 animate-pulse"
      :style="{ backgroundColor: activeColor }"
    ></div>
  </button>
</template>

<script>
export default {
  name: 'NavItem',
  props: {
    icon: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    },
    collapsed: {
      type: Boolean,
      default: false
    },
    brandColor: {
      type: String,
      default: null
    }
  },
  computed: {
    activeColor() {
      return this.brandColor || '#E31E24' // Default to ISUZU red
    },

    lightBgColor() {
      if (!this.brandColor) return 'bg-red-50'

      // Convert hex to light background
      if (this.brandColor === '#E31E24') return 'bg-red-50'
      if (this.brandColor === '#00A651') return 'bg-green-50'
      return 'bg-gray-50'
    },

    buttonClasses() {
      const baseClasses = [
        'w-full flex items-center px-2 py-2.5 rounded-lg transition-all duration-200 group relative',
        'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-opacity-50'
      ]

      if (this.active) {
        baseClasses.push(this.lightBgColor)
        baseClasses.push('border-r-2 shadow-sm')
      }

      if (this.collapsed) {
        baseClasses.push('justify-center')
      } else {
        baseClasses.push('space-x-3')
      }

      return baseClasses
    },

    buttonStyle() {
      if (this.active && this.brandColor) {
        return {
          borderRightColor: this.brandColor
        }
      }
      return {}
    },

    iconClasses() {
      if (this.active) {
        return ''
      }
      return 'text-gray-500 group-hover:text-gray-700 transition-colors duration-200'
    },

    iconStyle() {
      if (this.active && this.brandColor) {
        return { color: this.brandColor }
      }
      return {}
    },

    labelClasses() {
      return this.active ? '' : 'text-gray-700'
    },

    labelStyle() {
      if (this.active && this.brandColor) {
        return { color: this.brandColor }
      }
      return {}
    },
    
    iconPath() {
      const icons = {
        queue: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z",
        chart: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
        calendar: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z",
        users: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z",
        stock: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
        settings: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
        document: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      }

      return icons[this.icon] || "M4 6h16M4 12h16M4 18h16"
    }
  }
}
</script>
