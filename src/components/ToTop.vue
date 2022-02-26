<script setup>
import { computed } from 'vue'
import { useWindowScroll } from '@vueuse/core'
import jump from 'jump.js'

const props = defineProps({
  offset: {
    type: Number,
    default: 1000
  }
})

const { y } = useWindowScroll()

const show = computed(() => {
  return y.value > props.offset
})

const toTop = () => {
  jump('body')
}
</script>

<template>
  <transition
    enter-from-class="opacity-0 scale-75"
    enter-active-class="transition duration-75 ease-out-quad"
    enter-to-class="opacity-100 scale-100"
    leave-from-class="opacity-100 scale-100"
    leave-active-class="transition duration-150 ease-in-quad"
    leave-to-class="opacity-0 scale-75">
    <button
      v-if="show"
      class="transform bg-primary hover:bg-primary/90 text-white h-12 w-12 flex items-center justify-center rounded-full shadow-md"
      @click="toTop()">
      <i-heroicons-outline-arrow-sm-up />
    </button>
  </transition>
</template>