<template>
  <component
    :is="to ? 'nuxt-link' : 'div'"
    :to="to"
    :class="cardClasses"
  >
    <slot></slot>
  </component>
</template>

<script>
export default {
  name: 'Card',
  props: {
    variant: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'bordered', 'gradient'].includes(value)
    },
    padding: {
      type: String,
      default: 'md',
      validator: (value) => ['none', 'sm', 'md', 'lg'].includes(value)
    },
    hover: {
      type: Boolean,
      default: false
    },
    to: {
      type: [String, Object],
      default: null
    }
  },
  computed: {
    cardClasses() {
      const base = ['rounded-lg transition-all duration-150']

      // Variant
      if (this.variant === 'default') {
        base.push('bg-white shadow-sm')
      } else if (this.variant === 'bordered') {
        base.push('bg-white border border-gray-200')
      } else if (this.variant === 'gradient') {
        base.push('bg-gradient-to-br from-red-50 to-red-50 border border-red-100')
      }

      // Padding
      if (this.padding === 'sm') {
        base.push('p-3')
      } else if (this.padding === 'md') {
        base.push('p-4')
      } else if (this.padding === 'lg') {
        base.push('p-6')
      }

      // Hover
      if (this.hover || this.to) {
        base.push('hover:shadow-md cursor-pointer')
      }

      return base
    }
  }
}
</script>
