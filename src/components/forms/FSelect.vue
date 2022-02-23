<script setup>
import { ref, computed, useSlots } from 'vue'
import { onClickOutside } from '@vueuse/core'

const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Pilih'
  },
  divider: {
    type: Boolean,
    default: false
  },
  closeOptionsAfterSelect: {
    type: Boolean,
    default: true
  },
  filterable: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: false
  },
})

const emits = defineEmits(['update:modelValue'])
const slots = useSlots()

const hasIcon = slots['icon']

const selectedLabel = computed(() => {
  return props.options.find(o => o.value == props.modelValue)?.label ?? ''
})

const selectRef = ref(null)
const showOptions = ref(false)

const changeValue = (value) => {
  emits('update:modelValue', value)
  if (props.closeOptionsAfterSelect) {
    showOptions.value = false
  }
}

const toggleOptions = () => {
  showOptions.value = !showOptions.value
}

onClickOutside(selectRef, () => showOptions.value = false)

const keyword = ref('')
const filteredOptions = computed(() => {
  if (!keyword.value) return props.options
  return props.options.filter(o => o.label.toLowerCase().includes(keyword.value.toLowerCase()))
})
</script>

<template>
  <div 
    ref="selectRef" 
    class="bg-slate-200 h-10 flex items-center justify-between rounded-md relative cursor-pointer min-w-[150px] max-w-full">
    <div v-if="hasIcon" class="px-3 bg-slate-300 self-stretch flex items-center rounded-l-md">
      <slot name="icon"></slot>
    </div>
    <div 
      class="pl-3 flex-grow whitespace-nowrap overflow-hidden text-ellipsis"
      :class="{'text-gray-600': selectedLabel, 'text-gray-400': !selectedLabel}"
      @click="toggleOptions()">
      <template v-if="selectedLabel">{{ selectedLabel }}</template>
      <template v-else-if="props.placeholder">{{ props.placeholder }}</template>
    </div>
    <div class="mx-2 flex gap-1.5 text-sm text-gray-500">
      <i-heroicons-outline-x-circle
        v-if="props.clearable && props.modelValue"
        class="flex-shrink-0"
        @click="changeValue('')" />
      <i-heroicons-outline-chevron-down 
        class="flex-shrink-0"
        @click="toggleOptions()" />
    </div>
    <!-- Options -->
    <div v-if="showOptions" class="absolute z-10 top-full w-full py-2 bg-white rounded-md shadow-md">
      <div v-if="props.filterable" class="mx-4 my-2">
        <input type="search" v-model="keyword" class="form-input text-sm w-full px-2 py-1 bg-slate-200 rounded-md border-transparent focus:border-slate-300 focus:ring-0" placeholder="Cari..." />
      </div>
      <ul class="max-h-[250px] overflow-y-auto" :class="{'divide-y': props.divider}">
        <li 
          v-for="(option, index) in filteredOptions" 
          :key="'option-' + index"
          @click.stop="changeValue(option.value)"
          class="px-4 py-1.5 hover:bg-slate-100 leading-5 text-gray-700"
          :class="{'py-2.5 first:pt-1.5 last:pb-1.5': props.divider}">
          {{ option.label }}
        </li>
      </ul>
      <p v-if="filteredOptions.length == 0" class="py-3 text-xs text-center text-gray-300">Tidak tersedia.</p>
    </div>
  </div>
</template>