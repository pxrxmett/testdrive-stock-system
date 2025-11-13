<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
    <!-- Login Card -->
    <div class="w-full max-w-md">
      <!-- Logo & Title -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-[#D52B1E] rounded-full mb-4 shadow-lg">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900">Multi-Brand TestDrive System</h1>
        <p class="text-gray-600 mt-2">ระบบจัดการคิวและทดลองขับ ISUZU & BYD</p>
      </div>

      <!-- Login Form Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <!-- Error Alert -->
        <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-red-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 class="text-sm font-medium text-red-800">เข้าสู่ระบบไม่สำเร็จ</h3>
              <p class="text-sm text-red-700 mt-1">{{ error }}</p>
            </div>
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin">
          <!-- Username Field -->
          <div class="mb-5">
            <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
              ชื่อผู้ใช้
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                id="username"
                v-model="credentials.username"
                type="text"
                required
                autocomplete="username"
                class="block w-full h-10 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D52B1E] focus:border-[#D52B1E] transition-colors"
                placeholder="กรอกชื่อผู้ใช้"
                :disabled="loading"
              >
            </div>
          </div>

          <!-- Password Field -->
          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              รหัสผ่าน
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                v-model="credentials.password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                class="block w-full h-10 pl-10 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D52B1E] focus:border-[#D52B1E] transition-colors"
                placeholder="กรอกรหัสผ่าน"
                :disabled="loading"
              >
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                :disabled="loading"
              >
                <svg v-if="!showPassword" class="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Remember Me -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center">
              <input
                id="remember"
                v-model="rememberMe"
                type="checkbox"
                class="h-4 w-4 text-[#D52B1E] focus:ring-[#D52B1E] border-gray-300 rounded"
                :disabled="loading"
              >
              <label for="remember" class="ml-2 block text-sm text-gray-700">
                จำฉันไว้
              </label>
            </div>
            <a href="#" class="text-sm text-[#D52B1E] hover:text-[#B91C1C]">
              ลืมรหัสผ่าน?
            </a>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full h-12 flex items-center justify-center px-4 bg-[#D52B1E] text-white font-medium rounded-lg hover:bg-[#B91C1C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DC2626] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-if="loading">กำลังเข้าสู่ระบบ...</span>
            <span v-else>เข้าสู่ระบบ</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="mt-6 mb-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">หรือเข้าสู่ระบบด้วย</span>
            </div>
          </div>
        </div>

        <!-- LINE Login Button -->
        <button
          type="button"
          @click="loginWithLine"
          class="w-full h-12 flex items-center justify-center px-4 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D52B1E] transition-colors"
          :disabled="loading"
        >
          <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="#00B900">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.105.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
          </svg>
          <span>เข้าสู่ระบบด้วย LINE</span>
        </button>
      </div>

      <!-- Footer -->
      <p class="mt-8 text-center text-sm text-gray-600">
        ยังไม่มีบัญชี?
        <a href="#" class="text-[#D52B1E] hover:text-[#B91C1C] font-medium">ติดต่อผู้ดูแลระบบ</a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  layout: 'empty',

  data() {
    return {
      credentials: {
        username: '',
        password: ''
      },
      showPassword: false,
      rememberMe: false,
      error: null
    }
  },

  computed: {
    loading() {
      return this.$store.getters['auth/loading']
    }
  },

  mounted() {
    // Check if already logged in
    if (this.$store.getters['auth/isAuthenticated']) {
      this.$router.push('/dashboard')
    }
  },

  methods: {
    async handleLogin() {
      this.error = null

      const result = await this.$store.dispatch('auth/login', this.credentials)

      if (result.success) {
        // Show success message
        this.$toast?.success('เข้าสู่ระบบสำเร็จ')

        // Redirect to dashboard
        setTimeout(() => {
          this.$router.push('/dashboard')
        }, 500)
      } else {
        this.error = result.error
      }
    },

    async loginWithLine() {
      try {
        // Redirect to LINE login endpoint
        window.location.href = '/api/auth/line-login'
      } catch (error) {
        console.error('LINE login error:', error)
        this.error = 'ไม่สามารถเข้าสู่ระบบด้วย LINE ได้'
      }
    }
  },

  head() {
    return {
      title: 'เข้าสู่ระบบ - ISUZU Stock System'
    }
  }
}
</script>

<style scoped>
/* Input focus ring */
input:focus {
  outline: none;
}

/* Button hover effects */
button:hover:not(:disabled) {
  transform: translateY(-1px);
}

button:active:not(:disabled) {
  transform: translateY(0);
}

/* Smooth transitions */
input, button {
  transition: all 0.2s ease-in-out;
}
</style>
