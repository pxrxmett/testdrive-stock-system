// store/stock.js
export const state = () => ({
  vehicles: [],
  testDrives: [],
  staffs: [],
  loading: false,
  uploadProgress: 0,
  filters: {
    search: '',
    category: 'ทั้งหมด',
    type: 'ทั้งหมด',
    status: 'ทั้งหมด',
    eventStatus: 'ทั้งหมด'
  },
  selectedVehicle: null,
  showAddModal: false,
  showEditModal: false,
  showUploadModal: false,
  showPreviewModal: false,
  showEventModal: false,
  showReturnModal: false,
  previewData: []
})

export const mutations = {
  SET_VEHICLES(state, vehicles) {
    state.vehicles = vehicles
  },

  SET_TEST_DRIVES(state, testDrives) {
    state.testDrives = testDrives
  },

  SET_STAFFS(state, staffs) {
    state.staffs = staffs
  },

  SET_LOADING(state, loading) {
    state.loading = loading
  },

  SET_UPLOAD_PROGRESS(state, progress) {
    state.uploadProgress = progress
  },

  SET_FILTERS(state, filters) {
    state.filters = { ...state.filters, ...filters }
  },

  SET_SELECTED_VEHICLE(state, vehicle) {
    state.selectedVehicle = vehicle
  },

  SET_MODAL_STATE(state, { modal, show }) {
    state[modal] = show
  },

  SET_PREVIEW_DATA(state, data) {
    state.previewData = data
  },

  ADD_VEHICLE(state, vehicle) {
    state.vehicles.push(vehicle)
  },

  UPDATE_VEHICLE(state, updatedVehicle) {
    const index = state.vehicles.findIndex(v => v.id === updatedVehicle.id)
    if (index !== -1) {
      state.vehicles.splice(index, 1, updatedVehicle)
    }
  },

  REMOVE_VEHICLE(state, vehicleId) {
    state.vehicles = state.vehicles.filter(v => v.id !== vehicleId)
  },

  LOCK_VEHICLE_FOR_EVENT(state, { vehicleId, eventData }) {
    const vehicle = state.vehicles.find(v => v.id === vehicleId)
    if (vehicle) {
      vehicle.previousStatus = vehicle.status
      vehicle.status = 'ล็อกสำหรับอีเวนต์'
      vehicle.eventStatus = 'เตรียมอีเวนต์'
      vehicle.eventDetails = eventData
      vehicle.location = 'พื้นที่อีเวนต์'
    }
  },

  RETURN_VEHICLE_FROM_EVENT(state, vehicleId) {
    const vehicle = state.vehicles.find(v => v.id === vehicleId)
    if (vehicle) {
      vehicle.status = vehicle.previousStatus || 'พร้อมใช้'
      vehicle.eventStatus = null
      vehicle.eventDetails = null
      vehicle.previousStatus = null
      vehicle.location = 'โชว์รูม A' // หรือตำแหน่งเดิม
    }
  },

  UPDATE_VEHICLE_STATUS(state, { vehicleId, status, eventStatus }) {
    const vehicle = state.vehicles.find(v => v.id === vehicleId)
    if (vehicle) {
      vehicle.status = status
      if (eventStatus !== undefined) {
        vehicle.eventStatus = eventStatus
      }
    }
  }
}

export const actions = {
  async fetchVehicles({ commit, state }) {
    commit('SET_LOADING', true)
    try {
      const vehicles = await this.$stockAPI.getAllVehicles(state.filters)
      commit('SET_VEHICLES', vehicles)
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchTestDrives({ commit }) {
    commit('SET_LOADING', true)
    try {
      const testDrives = await this.$stockAPI.getAllTestDrives()
      commit('SET_TEST_DRIVES', testDrives)
    } catch (error) {
      console.error('Error fetching test drives:', error)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchStaffs({ commit }) {
    try {
      const staffs = await this.$stockAPI.getAllStaffs()
      commit('SET_STAFFS', staffs)
    } catch (error) {
      console.error('Error fetching staffs:', error)
    }
  },

  async createVehicle({ commit }, vehicleData) {
    try {
      const newVehicle = await this.$stockAPI.createVehicle(vehicleData)
      commit('ADD_VEHICLE', newVehicle)
      commit('SET_MODAL_STATE', { modal: 'showAddModal', show: false })
      return newVehicle
    } catch (error) {
      throw error
    }
  },

  async updateVehicleStatus({ commit }, { id, statusData }) {
    try {
      const updatedVehicle = await this.$stockAPI.updateVehicleStatus(id, statusData)
      commit('UPDATE_VEHICLE', updatedVehicle)
      return updatedVehicle
    } catch (error) {
      throw error
    }
  },

  async deleteVehicle({ commit }, vehicleId) {
    try {
      await this.$stockAPI.deleteVehicle(vehicleId)
      commit('REMOVE_VEHICLE', vehicleId)
    } catch (error) {
      throw error
    }
  },

  async uploadExcelFile({ commit }, file) {
    try {
      commit('SET_UPLOAD_PROGRESS', 0)
      const result = await this.$stockAPI.uploadExcelFile(file)
      
      if (result.previewData) {
        commit('SET_PREVIEW_DATA', result.previewData)
        commit('SET_MODAL_STATE', { modal: 'showUploadModal', show: false })
        commit('SET_MODAL_STATE', { modal: 'showPreviewModal', show: true })
      }
      
      return result
    } catch (error) {
      commit('SET_UPLOAD_PROGRESS', 0)
      throw error
    }
  },

  async lockVehicleForEvent({ commit }, { vehicleId, eventData }) {
    try {
      const statusData = {
        status: 'ล็อกสำหรับอีเวนต์',
        eventStatus: 'เตรียมอีเวนต์',
        eventDetails: eventData
      }
      
      await this.$stockAPI.updateVehicleStatus(vehicleId, statusData)
      commit('LOCK_VEHICLE_FOR_EVENT', { vehicleId, eventData })
      commit('SET_MODAL_STATE', { modal: 'showEventModal', show: false })
    } catch (error) {
      throw error
    }
  },

  async returnVehicleFromEvent({ commit, state }, vehicleId) {
    try {
      const vehicle = state.vehicles.find(v => v.id === vehicleId)
      const statusData = {
        status: vehicle.previousStatus || 'พร้อมใช้',
        eventStatus: null,
        eventDetails: null
      }
      
      await this.$stockAPI.updateVehicleStatus(vehicleId, statusData)
      commit('RETURN_VEHICLE_FROM_EVENT', vehicleId)
      commit('SET_MODAL_STATE', { modal: 'showReturnModal', show: false })
    } catch (error) {
      throw error
    }
  },

  updateFilters({ commit, dispatch }, filters) {
    commit('SET_FILTERS', filters)
    dispatch('fetchVehicles')
  },

  openModal({ commit }, modalName) {
    commit('SET_MODAL_STATE', { modal: modalName, show: true })
  },

  closeModal({ commit }, modalName) {
    commit('SET_MODAL_STATE', { modal: modalName, show: false })
  },

  selectVehicle({ commit }, vehicle) {
    commit('SET_SELECTED_VEHICLE', vehicle)
  }
}

export const getters = {
  filteredVehicles: (state) => {
    let filtered = state.vehicles

    // Search filter
    if (state.filters.search) {
      const search = state.filters.search.toLowerCase()
      filtered = filtered.filter(vehicle =>
        vehicle.model?.toLowerCase().includes(search) ||
        vehicle.id?.toLowerCase().includes(search) ||
        vehicle.vin?.toLowerCase().includes(search) ||
        vehicle.plateNumber?.toLowerCase().includes(search) ||
        vehicle.chassisNumber?.toLowerCase().includes(search)
      )
    }

    // Category filter
    if (state.filters.category !== 'ทั้งหมด') {
      filtered = filtered.filter(vehicle => vehicle.category === state.filters.category)
    }

    // Type filter
    if (state.filters.type !== 'ทั้งหมด') {
      filtered = filtered.filter(vehicle => vehicle.type === state.filters.type)
    }

    // Status filter
    if (state.filters.status !== 'ทั้งหมด') {
      filtered = filtered.filter(vehicle => vehicle.status === state.filters.status)
    }

    // Event status filter
    if (state.filters.eventStatus !== 'ทั้งหมด') {
      if (state.filters.eventStatus === 'ไม่มีอีเวนต์') {
        filtered = filtered.filter(vehicle => !vehicle.eventStatus)
      } else {
        filtered = filtered.filter(vehicle => vehicle.eventStatus === state.filters.eventStatus)
      }
    }

    return filtered
  },

  vehicleStats: (state) => {
    const total = state.vehicles.length
    const available = state.vehicles.filter(v => v.status === 'พร้อมใช้').length
    const inUse = state.vehicles.filter(v => v.status === 'ใช้งาน').length
    const eventLocked = state.vehicles.filter(v => v.status === 'ล็อกสำหรับอีเวนต์').length
    const maintenance = state.vehicles.filter(v => v.status === 'บำรุงรักษา').length

    return {
      total,
      available,
      inUse,
      eventLocked,
      maintenance
    }
  },

  vehicleCategories: (state) => {
    const categories = [...new Set(state.vehicles.map(v => v.category))]
    return ['ทั้งหมด', ...categories]
  },

  vehicleTypes: (state) => {
    const types = [...new Set(state.vehicles.map(v => v.type))]
    return ['ทั้งหมด', ...types]
  }
}