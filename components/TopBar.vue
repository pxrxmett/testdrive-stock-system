<template>
  <div class="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <button
          @click="$emit('toggle-sidebar')"
          class="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <Icon name="menu" icon-class="w-5 h-5 text-gray-600" />
        </button>

        <div>
          <h2 class="text-lg font-semibold text-gray-900">
            {{ pageTitle }}
          </h2>
        </div>
      </div>

      <div class="flex items-center space-x-3">
        <!-- User Menu -->
        <div class="relative">
          <button class="flex items-center space-x-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors">
            <div class="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
              <span class="text-white font-medium text-xs">A</span>
            </div>
            <span class="hidden md:block text-sm text-gray-700">Admin</span>
          </button>
        </div>

        <!-- Notifications -->
        <button class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded relative transition-colors">
          <Icon name="bell" icon-class="w-4 h-4" />
          <div class="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full"></div>
        </button>

        <!-- Settings -->
        <button class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors">
          <Icon name="settings" icon-class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopBar',
  props: {
    currentView: {
      type: String,
      default: 'queue'
    },
    sidebarCollapsed: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    pageTitle() {
      const titles = {
        queue: 'จัดการคิวทดลองขับ',
        analytics: 'รายงานและสถิติ',
        calendar: 'ปฏิทินนัดหมาย'
      }
      return titles[this.currentView] || 'แดชบอร์ด'
    }
  }
}
</script>
