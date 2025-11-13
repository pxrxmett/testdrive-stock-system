<template>
  <div :class="cardClass" @click="handleClick">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    hover: Boolean,
    padding: {
      type: String,
      default: 'md'
    }
  },
  computed: {
    cardClass() {
      const classes = ['bg-white rounded-lg border border-gray-200']

      if (this.hover) {
        classes.push('hover:shadow-md transition-shadow cursor-pointer')
      }

      if (this.padding === 'sm') {
        classes.push('p-4')
      } else if (this.padding === 'lg') {
        classes.push('p-6')
      } else {
        classes.push('p-6')
      }

      return classes.join(' ')
    }
  },
  methods: {
    handleClick() {
      if (this.hover) {
        this.$emit('click')
      }
    }
  }
}
</script>
