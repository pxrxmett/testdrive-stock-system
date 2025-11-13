<template>
  <component
    :is="to ? 'nuxt-link' : 'button'"
    :to="to"
    :type="!to ? type : undefined"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="handleClick"
  >
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4"
      :class="iconColorClass"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <slot></slot>
  </component>
</template>

<script>
export default {
  name: 'Button',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'danger', 'ghost', 'success', 'warning'].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    type: {
      type: String,
      default: 'button'
    },
    to: {
      type: [String, Object],
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    buttonClasses() {
      const base = [
        'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed'
      ]

      // Size
      if (this.size === 'sm') {
        base.push('px-3 py-1.5 text-sm')
      } else if (this.size === 'lg') {
        base.push('px-6 py-3 text-base')
      } else {
        base.push('px-4 py-2 text-sm')
      }

      // Variant
      if (this.variant === 'primary') {
        base.push('bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500')
      } else if (this.variant === 'secondary') {
        base.push('bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500')
      } else if (this.variant === 'danger') {
        base.push('bg-red-600 text-white hover:bg-red-700 focus:ring-red-500')
      } else if (this.variant === 'ghost') {
        base.push('bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500')
      } else if (this.variant === 'success') {
        base.push('bg-green-600 text-white hover:bg-green-700 focus:ring-green-500')
      } else if (this.variant === 'warning') {
        base.push('bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500')
      }

      // Block
      if (this.block) {
        base.push('w-full')
      }

      return base
    },
    iconColorClass() {
      if (this.variant === 'secondary' || this.variant === 'ghost') {
        return 'text-gray-700'
      }
      return 'text-white'
    }
  },
  methods: {
    handleClick(event) {
      if (!this.disabled && !this.loading) {
        this.$emit('click', event)
      }
    }
  }
}
</script>
