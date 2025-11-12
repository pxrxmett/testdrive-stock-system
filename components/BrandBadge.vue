<template>
  <span :class="badgeClasses">
    {{ displayName }}
  </span>
</template>

<script>
import { getBrandDisplayName, getBrandBadgeClasses } from '~/utils/brand'

export default {
  name: 'BrandBadge',
  props: {
    brandCode: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    variant: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'solid'].includes(value)
    }
  },
  computed: {
    displayName() {
      return getBrandDisplayName(this.brandCode)
    },
    badgeClasses() {
      const baseClasses = [
        'inline-flex items-center font-semibold rounded-full border',
        'transition-colors duration-150'
      ]

      // Size classes
      const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base'
      }
      baseClasses.push(sizeClasses[this.size])

      // Brand color classes
      const colorClasses = getBrandBadgeClasses(this.brandCode)
      baseClasses.push(colorClasses)

      // Variant classes
      if (this.variant === 'solid') {
        // Solid variant - darker background
        baseClasses.push('font-bold')
      }

      return baseClasses.join(' ')
    }
  }
}
</script>
