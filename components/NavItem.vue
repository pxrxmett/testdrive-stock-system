<template>
  <button
    @click="$emit('click')"
    :class="buttonClasses"
    :title="collapsed ? label : ''"
  >
    <!-- Icon -->
    <div class="flex-shrink-0">
      <svg
        class="w-5 h-5"
        :class="iconClasses"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" :d="iconPath" />
      </svg>
    </div>

    <!-- Label -->
    <span
      v-if="!collapsed"
      class="text-sm font-medium truncate"
      :class="labelClasses"
    >
      {{ label }}
    </span>

    <!-- Badge (optional) -->
    <span
      v-if="badge && !collapsed"
      class="ml-auto flex-shrink-0 px-2 py-0.5 text-xs font-semibold rounded-full"
      :class="badgeClasses"
    >
      {{ badge }}
    </span>
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
    badge: {
      type: [String, Number],
      default: null
    },
    size: {
      type: String,
      default: 'md', // sm, md, lg
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    }
  },
  computed: {
    buttonClasses() {
      const baseClasses = [
        'w-full flex items-center rounded-lg transition-all duration-150 group relative',
        'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1'
      ]

      // Size variants
      if (this.size === 'sm') {
        baseClasses.push('px-2 py-1.5 text-xs')
      } else if (this.size === 'lg') {
        baseClasses.push('px-4 py-3 text-base')
      } else {
        baseClasses.push('px-3 py-2.5 text-sm')
      }

      if (this.active) {
        baseClasses.push('bg-blue-50 border-l-3 border-l-blue-600 shadow-sm')
      }

      if (this.collapsed) {
        baseClasses.push('justify-center')
      } else {
        baseClasses.push('space-x-3')
      }

      return baseClasses
    },

    iconClasses() {
      if (this.active) {
        return 'text-blue-600'
      }
      return 'text-gray-600 group-hover:text-gray-800 transition-colors duration-150'
    },

    labelClasses() {
      return this.active ? 'text-blue-700 font-semibold' : 'text-gray-700 group-hover:text-gray-900'
    },

    badgeClasses() {
      return 'bg-red-100 text-red-600'
    },

    iconPath() {
      const icons = {
        // Lucide Icons (20x20px, stroke-width: 2)
        home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
        car: "M14 16H9m10 0h3l-3.333-5.333M21 16v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1M3 16h3m0 0 3.333-5.333M6 16v5a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1m-3-5L10 3h4l3 8M6 11h12",
        clipboard: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z",
        users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
        link: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
        barChart: "M12 20V10 M18 20V4 M6 20v-4",
        settings: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
        user: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2 M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z",
        logOut: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
        package: "M16.5 9.4l-9-5.19 M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12",
        fileText: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
        calendar: "M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
        // New icons for redesigned sidebar
        briefcase: "M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16 M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2",
        truck: "M16 3h3a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-3 M1 16h12M1 16a2 2 0 1 0 4 0 2 2 0 0 0-4 0z M13 16h-2 M11 16a2 2 0 1 0 4 0 2 2 0 0 0-4 0z M1 16V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v11",
        zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
        trendingUp: "M23 6l-9.5 9.5-5-5L1 18 M23 6h-7 M23 6v7",
        shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
        database: "M12 8c4.97 0 9-1.343 9-3s-4.03-3-9-3-9 1.343-9 3 4.03 3 9 3z M21 12c0 1.66-4 3-9 3s-9-1.34-9-3 M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5",
        archive: "M21 8v13H3V8 M1 3h22v5H1z M10 12h4",
        plus: "M12 5v14 M5 12h14"
      }

      return icons[this.icon] || "M4 6h16M4 12h16M4 18h16"
    }
  }
}
</script>
