<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <button 
          @click="$router.back()"
          class="p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <Icon name="chevron-left" icon-class="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">เพิ่มคิวทดลองขับใหม่</h1>
          <p class="text-gray-600">กรอกข้อมูลการจองทดลองขับรถยนต์</p>
        </div>
      </div>
      <div class="flex items-center space-x-3">
        <button 
          @click="saveDraft"
          class="btn-secondary"
        >
          บันทึกแบบร่าง
        </button>
        <button 
          @click="submitForm"
          :disabled="!isFormValid"
          :class="[
            'btn-primary flex items-center space-x-2',
            !isFormValid ? 'opacity-50 cursor-not-allowed' : ''
          ]"
        >
          <Icon name="check" icon-class="w-4 h-4" />
          <span>บันทึกคิว</span>
        </button>
      </div>
    </div>

    <!-- Form Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Form -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Customer Information -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">ข้อมูลลูกค้า</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                ชื่อ-นามสกุล <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.customerName"
                type="text"
                placeholder="กรอกชื่อ-นามสกุลลูกค้า"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500"
                :class="{ 'border-red-300 bg-red-50': errors.customerName }"
              />
              <p v-if="errors.customerName" class="text-red-500 text-xs mt-1">{{ errors.customerName }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                เบอร์โทรศัพท์ <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.phone"
                type="tel"
                placeholder="08X-XXX-XXXX"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500"
                :class="{ 'border-red-300 bg-red-50': errors.phone }"
              />
              <p v-if="errors.phone" class="text-red-500 text-xs mt-1">{{ errors.phone }}</p>
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
              <input
                v-model="form.email"
                type="email"
                placeholder="example@email.com"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500"
                :class="{ 'border-red-300 bg-red-50': errors.email }"
              />
              <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ประเภทลูกค้า</label>
              <select
                v-model="form.customerType"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">เลือกประเภทลูกค้า</option>
                <option value="บุคคล">บุคคลทั่วไป</option>
                <option value="ครอบครัว">ครอบครัว</option>
                <option value="ธุรกิจ">ธุรกิจ</option>
                <option value="VIP">VIP</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ที่มาของลูกค้า</label>
              <select
                v-model="form.leadSource"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">เลือกที่มาของลูกค้า</option>
                <option value="เว็บไซต์">เว็บไซต์</option>
                <option value="โซเชียลมีเดีย">โซเชียลมีเดีย</option>
                <option value="แนะนำ">แนะนำ</option>
                <option value="Walk-in">Walk-in</option>
                <option value="โทรศัพท์">โทรศัพท์</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Vehicle Selection -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">รถที่ต้องการทดสอบ</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                รุ่นรถ <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.carModel"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500"
                :class="{ 'border-red-300 bg-red-50': errors.carModel }"
              >
                <option value="">เลือกรุ่นรถ</option>
                <optgroup label="D-MAX Series">
                  <option value="D-MAX Blue Power 1.9 Ddi Z Hi-Lander">D-MAX Blue Power 1.9 Ddi Z Hi-Lander</option>
                  <option value="D-MAX Blue Power 1.9 Ddi Z Prestige">D-MAX Blue Power 1.9 Ddi Z Prestige</option>
                  <option value="D-MAX X-Series 1.9 Ddi Z 4x4">D-MAX X-Series 1.9 Ddi Z 4x4</option>
                </optgroup>
                <optgroup label="MU-X Series">
                  <option value="MU-X Blue Power 3.0 Ddi Supreme">MU-X Blue Power 3.0 Ddi Supreme</option>
                  <option value="MU-X Blue Power 3.0 Ddi Prestige">MU-X Blue Power 3.0 Ddi Prestige</option>
                </optgroup>
              </select>
              <p v-if="errors.carModel" class="text-red-500 text-xs mt-1">{{ errors.carModel }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ราคาประมาณ</label>
              <input
                v-model="form.expectedRevenue"
                type="number"
                placeholder="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500"
              />
              <p class="text-xs text-gray-500 mt-1">บาท (ประมาณการ)</p>
            </div>
          </div>
        </div>

        <!-- Appointment Details -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">รายละเอียดการนัดหมาย</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                วันที่ <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.date"
                type="date"
                :min="minDate"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500"
                :class="{ 'border-red-300 bg-red-50': errors.date }"
              />
              <p v-if="errors.date" class="text-red-500 text-xs mt-1">{{ errors.date }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                เวลา <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.timeSlot"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500"
                :class="{ 'border-red-300 bg-red-50': errors.timeSlot }"
              >
                <option value="">เลือกเวลา</option>
                <option v-for="time in availableTimeSlots" :key="time" :value="time">
                  {{ time }}
                </option>
              </select>
              <p v-if="errors.timeSlot" class="text-red-500 text-xs mt-1">{{ errors.timeSlot }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ระยะเวลา (นาที)</label>
              <select
                v-model="form.duration"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500"
              >
                <option value="30">30 นาที</option>
                <option value="60" selected>60 นาที</option>
                <option value="90">90 นาที</option>
                <option value="120">120 นาที</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                สาขา <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.location"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500"
                :class="{ 'border-red-300 bg-red-50': errors.location }"
              >
                <option value="">เลือกสาขา</option>
                <option value="สาขาเซ็นทรัล บางนา">สาขาเซ็นทรัล บางนา</option>
                <option value="สาขาอีสท์วิลล์">สาขาอีสท์วิลล์</option>
                <option value="สาขาเวสต์เกต">สาขาเวสต์เกต</option>
                <option value="สาขาเมกาบางนา">สาขาเมกาบางนา</option>
              </select>
              <p v-if="errors.location" class="text-red-500 text-xs mt-1">{{ errors.location }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">เซลส์ผู้ดูแล</label>
              <select
                v-model="form.salesRep"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">เลือกเซลส์</option>
                <option value="คุณจิรายุ ธนาสมบัติ">คุณจิรายุ ธนาสมบัติ</option>
                <option value="คุณสุดา กิตติขุน">คุณสุดา กิตติขุน</option>
                <option value="คุณประจักษ์ วงศา">คุณประจักษ์ วงศา</option>
                <option value="คุณมาลี สุวรรณ">คุณมาลี สุวรรณ</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ลำดับความสำคัญ</label>
              <select
                v-model="form.priority"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500"
              >
                <option value="low">ต่ำ</option>
                <option value="medium" selected>ปานกลาง</option>
                <option value="high">สูง</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Additional Notes -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">หมายเหตุเพิ่มเติม</h3>
          <textarea
            v-model="form.notes"
            rows="4"
            placeholder="กรอกข้อมูลเพิ่มเติม, ความต้องการพิเศษ, หรือหมายเหตุอื่นๆ"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500"
          ></textarea>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Preview Card -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">ตัวอย่างคิว</h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">รหัสคิว:</span>
              <span class="text-sm font-medium">{{ generateQueueId() }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">ลูกค้า:</span>
              <span class="text-sm font-medium">{{ form.customerName || '-' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">รถยนต์:</span>
              <span class="text-sm font-medium">{{ form.carModel || '-' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">วันที่:</span>
              <span class="text-sm font-medium">{{ formatDate(form.date) || '-' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">เวลา:</span>
              <span class="text-sm font-medium">{{ form.timeSlot || '-' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">สาขา:</span>
              <span class="text-sm font-medium">{{ form.location || '-' }}</span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">การดำเนินการ</h3>
          <div class="space-y-3">
            <button 
              @click="fillSampleData"
              class="w-full btn-secondary text-left flex items-center space-x-2"
            >
              <Icon name="refresh" icon-class="w-4 h-4" />
              <span>กรอกข้อมูลตัวอย่าง</span>
            </button>
            <button 
              @click="clearForm"
              class="w-full btn-secondary text-left flex items-center space-x-2"
            >
              <Icon name="trash" icon-class="w-4 h-4" />
              <span>ล้างข้อมูลทั้งหมด</span>
            </button>
            <nuxt-link 
              to="/dashboard/queue"
              class="w-full btn-secondary text-left flex items-center space-x-2 justify-center"
            >
              <Icon name="list" icon-class="w-4 h-4" />
              <span>ดูคิวทั้งหมด</span>
            </nuxt-link>
          </div>
        </div>

        <!-- Tips -->
        <div class="card p-6 bg-blue-50 border-blue-200">
          <h3 class="text-sm font-semibold text-blue-900 mb-2">เคล็ดลับ</h3>
          <ul class="text-xs text-blue-800 space-y-1">
            <li>• ตรวจสอบความพร้อมของรถก่อนจองคิว</li>
            <li>• ยืนยันเบอร์โทรศัพท์ลูกค้าให้ถูกต้อง</li>
            <li>• แจ้งข้อมูลสาขาและเวลาให้ชัดเจน</li>
            <li>• บันทึกความต้องการพิเศษในหมายเหตุ</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddQueue',
  layout: 'dashboard',
  data() {
    return {
      form: {
        customerName: '',
        phone: '',
        email: '',
        customerType: '',
        leadSource: '',
        carModel: '',
        expectedRevenue: '',
        date: '',
        timeSlot: '',
        duration: 60,
        location: '',
        salesRep: '',
        priority: 'medium',
        notes: ''
      },
      errors: {},
      availableTimeSlots: [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
        '16:00', '16:30', '17:00'
      ]
    }
  },
  computed: {
    minDate() {
      return new Date().toISOString().split('T')[0]
    },
    isFormValid() {
      return this.form.customerName && 
             this.form.phone && 
             this.form.carModel && 
             this.form.date && 
             this.form.timeSlot && 
             this.form.location
    }
  },
  methods: {
    validateForm() {
      this.errors = {}
      
      if (!this.form.customerName) {
        this.errors.customerName = 'กรุณากรอกชื่อ-นามสกุล'
      }
      
      if (!this.form.phone) {
        this.errors.phone = 'กรุณากรอกเบอร์โทรศัพท์'
      } else if (!/^[0-9]{10}$/.test(this.form.phone.replace(/[-\s]/g, ''))) {
        this.errors.phone = 'รูปแบบเบอร์โทรไม่ถูกต้อง'
      }
      
      if (this.form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
        this.errors.email = 'รูปแบบอีเมลไม่ถูกต้อง'
      }
      
      if (!this.form.carModel) {
        this.errors.carModel = 'กรุณาเลือกรุ่นรถ'
      }
      
      if (!this.form.date) {
        this.errors.date = 'กรุณาเลือกวันที่'
      }
      
      if (!this.form.timeSlot) {
        this.errors.timeSlot = 'กรุณาเลือกเวลา'
      }
      
      if (!this.form.location) {
        this.errors.location = 'กรุณาเลือกสาขา'
      }
      
      return Object.keys(this.errors).length === 0
    },
    
    async submitForm() {
      if (!this.validateForm()) {
        return
      }
      
      try {
        const newQueue = {
          id: this.generateQueueId(),
          ...this.form,
          status: 'scheduled',
          createdAt: new Date().toISOString()
        }
        
        // เพิ่มเข้า store
        this.$store.commit('dashboard/addQueue', newQueue)
        
        // แจ้งเตือนสำเร็จ
        alert('เพิ่มคิวทดลองขับสำเร็จ!')
        
        // กลับไปหน้ารายการ
        this.$router.push('/dashboard/queue')
        
      } catch (error) {
        console.error('Error creating queue:', error)
        alert('เกิดข้อผิดพลาดในการเพิ่มคิว')
      }
    },
    
    saveDraft() {
      localStorage.setItem('queueDraft', JSON.stringify(this.form))
      alert('บันทึกแบบร่างเรียบร้อย')
    },
    
    loadDraft() {
      const draft = localStorage.getItem('queueDraft')
      if (draft) {
        this.form = { ...this.form, ...JSON.parse(draft) }
      }
    },
    
    fillSampleData() {
      this.form = {
        customerName: 'คุณทดสอบ ระบบ',
        phone: '081-234-5678',
        email: 'test@example.com',
        customerType: 'บุคคล',
        leadSource: 'เว็บไซต์',
        carModel: 'D-MAX Blue Power 1.9 Ddi Z Hi-Lander',
        expectedRevenue: '850000',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        timeSlot: '10:00',
        duration: 60,
        location: 'สาขาเซ็นทรัล บางนา',
        salesRep: 'คุณจิรายุ ธนาสมบัติ',
        priority: 'medium',
        notes: 'ลูกค้าต้องการทดสอบขับในสนามทดสอบ'
      }
    },
    
    clearForm() {
      if (confirm('คุณต้องการล้างข้อมูลทั้งหมดหรือไม่?')) {
        this.form = {
          customerName: '',
          phone: '',
          email: '',
          customerType: '',
          leadSource: '',
          carModel: '',
          expectedRevenue: '',
          date: '',
          timeSlot: '',
          duration: 60,
          location: '',
          salesRep: '',
          priority: 'medium',
          notes: ''
        }
        this.errors = {}
      }
    },
    
    generateQueueId() {
      const today = new Date()
      const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '')
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
      return `TD${dateStr}${randomNum}`
    },
    
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  },
  
  mounted() {
    this.loadDraft()
  }
}
</script>
