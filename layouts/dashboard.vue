<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <Sidebar 
      :collapsed="sidebarCollapsed"
      :current-view="currentView"
      @toggle="toggleSidebar"
      @navigate="handleNavigation"
    />

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Bar -->
      <TopBar 
        :current-view="currentView"
        :sidebar-collapsed="sidebarCollapsed"
        @toggle-sidebar="toggleSidebar"
      />
      
      <!-- Page Content -->
      <main class="flex-1 overflow-auto p-4">
        <nuxt />
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardLayout',
  data() {
    return {
      sidebarCollapsed: false,
      currentView: 'queue'
    }
  },
  mounted() {
    this.updateCurrentView()
  },
  watch: {
    '$route'() {
      this.updateCurrentView()
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
    handleNavigation(view) {
      // Sidebar already handles navigation via $router.push
      // Just update the view name for display purposes
      this.currentView = view
    },
    updateCurrentView() {
      const route = this.$route.name
      if (route && route.includes('queue')) this.currentView = 'queue'
      else if (route && route.includes('analytics')) this.currentView = 'analytics'
      else if (route && route.includes('calendar')) this.currentView = 'calendar'
    }
  }
}
</script>
