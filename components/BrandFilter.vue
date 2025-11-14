<template>
  <div class="flex items-center space-x-2">
    <label v-if="showLabel" class="text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <div class="flex space-x-2">
      <button
        @click="selectBrand(null)"
        :class="filterButtonClasses(null)"
      >
        ทั้งหมด
      </button>
      <button
        v-for="brand in brands"
        :key="brand.code"
        @click="selectBrand(brand.code)"
        :class="filterButtonClasses(brand.code)"
      >
        {{ brand.name }}
      </button>
    </div>
  </div>
</template>

<script>
import { getAllBrandCodes, getBrandDisplayName, getBrandColors } from '~/utils/brand'
import { BRANDS } from '~/config/brands'

export default {
  name: 'BrandFilter',
  props: {
    value: {
      type: String,
      default: null
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    label: {
      type: String,
      default: 'แบรนด์'
    }
  },
  computed: {
    brands() {
      return getAllBrandCodes().map(code => ({
        code,
        name: getBrandDisplayName(code),
        colors: getBrandColors(code)
      }))
    }
  },
  methods: {
    selectBrand(brandCode) {
      this.$emit('input', brandCode)
      this.$emit('change', brandCode)
    },
    filterButtonClasses(brandCode) {
      const isActive = this.value === brandCode
      const baseClasses = [
        'px-4 py-2 text-sm font-medium rounded-lg',
        'transition-all duration-150',
        'border'
      ]

      if (isActive) {
        if (!brandCode) {
          // All filter
          baseClasses.push('bg-gray-800 text-white border-gray-800')
        } else {
          // Brand specific - normalize to lowercase for comparison
          const brandLower = brandCode.toLowerCase()
          const brandClasses = {
            isuzu: 'bg-[#D52B1E] text-white border-red-600',
            byd: 'bg-green-600 text-white border-green-700'
          }
          baseClasses.push(brandClasses[brandLower] || 'bg-gray-800 text-white border-gray-800')
        }
      } else {
        baseClasses.push('bg-white text-gray-700 border-gray-300 hover:bg-gray-50')
      }

      return baseClasses.join(' ')
    }
  }
}
</script>
