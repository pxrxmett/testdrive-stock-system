<template>
  <div class="relative" v-click-outside="close">
    <!-- Trigger -->
    <div @click="toggle">
      <slot name="trigger" :isOpen="isOpen"></slot>
    </div>

    <!-- Dropdown Menu -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        :class="[
          'absolute z-50 mt-2 rounded-lg shadow-lg bg-white border border-gray-200',
          widthClass,
          positionClass
        ]"
      >
        <div class="py-1">
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Dropdown',
  props: {
    width: {
      type: String,
      default: 'w-56',
      validator: (value) => ['w-48', 'w-56', 'w-64', 'w-72', 'w-80'].includes(value)
    },
    align: {
      type: String,
      default: 'right',
      validator: (value) => ['left', 'right'].includes(value)
    }
  },
  data() {
    return {
      isOpen: false
    }
  },
  computed: {
    widthClass() {
      return this.width
    },
    positionClass() {
      return this.align === 'left' ? 'left-0' : 'right-0'
    }
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen
    },
    close() {
      this.isOpen = false
    },
    open() {
      this.isOpen = true
    }
  },
  directives: {
    'click-outside': {
      bind(el, binding, vnode) {
        el.clickOutsideEvent = function (event) {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value()
          }
        }
        document.body.addEventListener('click', el.clickOutsideEvent)
      },
      unbind(el) {
        document.body.removeEventListener('click', el.clickOutsideEvent)
      }
    }
  }
}
</script>
