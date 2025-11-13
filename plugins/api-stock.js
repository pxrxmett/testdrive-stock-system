// plugins/api-stock.js
export default function ({ $axios, store, $toast }, inject) {
  const stockAPI = {
    // Stock/Vehicle Management
    async getAllVehicles(filters = {}) {
      try {
        const { data } = await $axios.get('/stock/vehicles', { params: filters })
        return data
      } catch (error) {
        console.error('Error fetching vehicles:', error)
        $toast.error('ไม่สามารถโหลดข้อมูลรถยนต์ได้')
        throw error
      }
    },

    async getVehicleById(id) {
      try {
        const { data } = await $axios.get(`/stock/${id}`)
        return data
      } catch (error) {
        console.error('Error fetching vehicle:', error)
        $toast.error('ไม่สามารถโหลดข้อมูลรถยนต์ได้')
        throw error
      }
    },

    async createVehicle(vehicleData) {
      try {
        const { data } = await $axios.post('/stock', vehicleData)
        $toast.success('เพิ่มรถยนต์เรียบร้อยแล้ว')
        return data
      } catch (error) {
        console.error('Error creating vehicle:', error)
        $toast.error('ไม่สามารถเพิ่มรถยนต์ได้')
        throw error
      }
    },

    async updateVehicleStatus(id, statusData) {
      try {
        const { data } = await $axios.patch(`/stock/vehicles/${id}/status`, statusData)
        $toast.success('อัพเดทสถานะเรียบร้อยแล้ว')
        return data
      } catch (error) {
        console.error('Error updating vehicle status:', error)
        $toast.error('ไม่สามารถอัพเดทสถานะได้')
        throw error
      }
    },

    async deleteVehicle(id) {
      try {
        const { data } = await $axios.delete(`/stock/vehicles/${id}`)
        $toast.success('ลบรถยนต์เรียบร้อยแล้ว')
        return data
      } catch (error) {
        console.error('Error deleting vehicle:', error)
        $toast.error('ไม่สามารถลบรถยนต์ได้')
        throw error
      }
    },

    async uploadExcelFile(file) {
      try {
        const formData = new FormData()
        formData.append('file', file)

        const { data } = await $axios.post('/stock/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            store.commit('stock/SET_UPLOAD_PROGRESS', percentCompleted)
          }
        })

        $toast.success('อัพโหลดไฟล์เรียบร้อยแล้ว')
        return data
      } catch (error) {
        console.error('Error uploading file:', error)
        $toast.error('ไม่สามารถอัพโหลดไฟล์ได้')
        throw error
      }
    },

    // Test Drive Management
    async getAllTestDrives(filters = {}) {
      try {
        const { data } = await $axios.get('/test-drives', { params: filters })
        return data
      } catch (error) {
        console.error('Error fetching test drives:', error)
        $toast.error('ไม่สามารถโหลดข้อมูลการทดลองขับได้')
        throw error
      }
    },

    async createTestDrive(testDriveData) {
      try {
        const { data } = await $axios.post('/test-drives', testDriveData)
        $toast.success('สร้างการจองทดลองขับเรียบร้อยแล้ว')
        return data
      } catch (error) {
        console.error('Error creating test drive:', error)
        $toast.error('ไม่สามารถสร้างการจองทดลองขับได้')
        throw error
      }
    },

    async updateTestDrive(id, updateData) {
      try {
        const { data } = await $axios.patch(`/test-drives/${id}`, updateData)
        $toast.success('แก้ไขการทดลองขับเรียบร้อยแล้ว')
        return data
      } catch (error) {
        console.error('Error updating test drive:', error)
        $toast.error('ไม่สามารถแก้ไขการทดลองขับได้')
        throw error
      }
    },

    async deleteTestDrive(id) {
      try {
        const { data } = await $axios.delete(`/test-drives/${id}`)
        $toast.success('ยกเลิกการทดลองขับเรียบร้อยแล้ว')
        return data
      } catch (error) {
        console.error('Error deleting test drive:', error)
        $toast.error('ไม่สามารถยกเลิกการทดลองขับได้')
        throw error
      }
    },

    // Staff Management
    async getAllStaffs() {
      try {
        const { data } = await $axios.get('/staffs')
        return data
      } catch (error) {
        console.error('Error fetching staffs:', error)
        $toast.error('ไม่สามารถโหลดข้อมูลพนักงานได้')
        throw error
      }
    },

    async createStaff(staffData) {
      try {
        const { data } = await $axios.post('/staffs', staffData)
        $toast.success('สร้างข้อมูลพนักงานเรียบร้อยแล้ว')
        return data
      } catch (error) {
        console.error('Error creating staff:', error)
        $toast.error('ไม่สามารถสร้างข้อมูลพนักงานได้')
        throw error
      }
    }
  }

  // Inject API into context
  inject('stockAPI', stockAPI)
}
