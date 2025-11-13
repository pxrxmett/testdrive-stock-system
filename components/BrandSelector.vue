<template>
  <div>
    <label v-if="showLabel" :for="inputId" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
      <span v-if="required" class="text-[#D52B1E]">*</span>
    </label>
    <select
      :id="inputId"
      :value="value"
      @input="handleInput"
      :disabled="disabled"
      :required="required"
      :class="selectClasses"
    >
      <option value="" disabled>{{ placeholder }}</option>
      <option
        v-for="brand in brands"
        :key="brand.code"
        :value="brand.code"
      >
        {{ brand.name }} - {{ brand.fullName }}
      </option>
    </select>
    <p v-if="hint" class="mt-1 text-xs text-gray-500">
      {{ hint }}
    </p>
    <p v-if="error" class="mt-1 text-xs text-[#D52B1E]">
      {{ error }}
    </p>
  </div>
</template>

<script>
import { getAllBrandCodes, getBrandDisplayName } from '~/utils/brand'
import { BRANDS } from '~/config/brands'

export default {
  name: 'BrandSelector',
  props: {
    value: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: 'แบรนด์'
    },
    placeholder: {
      type: String,
      default: '-- เลือกแบรนด์ --'
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    hint: {
      type: String,
      default: ''
    },
    error: {
      type: String,
      default: ''
    },
    inputId: {
      type: String,
      default: () => `brand-selector-${Math.random().toString(36).substr(2, 9)}`
    }
  },
  computed: {
    brands() {
      return getAllBrandCodes().map(code => {
        const brandKey = code.toUpperCase()
        const brand = BRANDS[brandKey]
        return {
          code,
          name: brand.name,
          fullName: brand.fullName
        }
      })
    },
    selectClasses() {
      const classes = [
        'w-full px-4 py-3 rounded-lg border',
        'focus:outline-none focus:ring-2 transition-all duration-150',
        'text-gray-900 font-medium'
      ]

      if (this.error) {
        classes.push('border-red-300 focus:ring-[#D52B1E] focus:border-[#D52B1E]')
      } else if (this.value) {
        // Apply brand color when selected
        const brandClasses = {
          isuzu: 'border-red-300 focus:ring-[#D52B1E] focus:border-[#D52B1E]',
          byd: 'border-blue-300 focus:ring-[#D52B1E] focus:border-[#D52B1E]'
        }
        classes.push(brandClasses[this.value] || 'border-gray-300 focus:ring-gray-500 focus:border-gray-500')
      } else {
        classes.push('border-gray-300 focus:ring-gray-500 focus:border-gray-500')
      }

      if (this.disabled) {
        classes.push('bg-gray-100 cursor-not-allowed opacity-60')
      } else {
        classes.push('bg-white')
      }

      return classes.join(' ')
    }
  },
  methods: {
    handleInput(event) {
      const value = event.target.value
      this.$emit('input', value)
      this.$emit('change', value)
    }
  }
}
</script>
