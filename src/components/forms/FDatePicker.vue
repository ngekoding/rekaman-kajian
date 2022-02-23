<script setup>
import { ref, reactive, computed, watch, useSlots, onMounted, onBeforeUpdate, nextTick } from 'vue'
import { onClickOutside, useScroll } from '@vueuse/core'
import dayjs, { dateIndo } from '@/composables/datetime'

const props = defineProps({
  modelValue: {
    type: [String, Date],
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Tanggal'
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
  return props.modelValue ? dateIndo(props.modelValue) : ''
})

const pickerRef = ref(null)
const showPicker = ref(false)

const changeValue = (value) => {
  emits('update:modelValue', value)
  showPicker.value = false
}

const togglePicker = () => {
  showPicker.value = !showPicker.value
}

onClickOutside(pickerRef, () => showPicker.value = false)

watch(showPicker, (visible) => {
  // Activating view for selected month year
  if (visible && props.modelValue) {
    const selectedDate = dayjs(props.modelValue)
    if (!selectedDate.isSame(currentMonthYear.value, 'month')) {
      currentMonthYear.value = dayjs().year(selectedDate.year()).month(selectedDate.month())
      generateCalendar()
    }
  }
})

const calendar = ref([])
const currentMonthYear = ref(dayjs())

const daysShort = ['A', 'S', 'S', 'R', 'K', 'J', 'S']
const daysInWeek = computed(() => {
  return [0, 1, 2, 3, 4, 5, 6].map(i => daysShort[i])
})

const generateCalendar = () => {
  calendar.value = []

  const firstDayIndex = currentMonthYear.value.date(1).day()
  const lastDayInMonth = currentMonthYear.value.daysInMonth()

  for (let i = 0; i < firstDayIndex; i++) {
    calendar.value.push({ isToday: false, date: null })
  }

  const today = dayjs()
  for (let i = 1; i <= lastDayInMonth; i++) {
    const day = {
      isToday: currentMonthYear.value.date(i).isSame(today, 'day'),
      date: currentMonthYear.value.date(i),
    }
    calendar.value.push(day)
  }
}

onMounted(() => {
  currentMonthYear.value = dayjs()
  generateCalendar()
})

const prev = () => {
  currentMonthYear.value = currentMonthYear.value.subtract(1, 'month')
  generateCalendar()
}

const next = () => {
  currentMonthYear.value = currentMonthYear.value.add(1, 'month')
  generateCalendar()
}

const today = () => {
  currentMonthYear.value = dayjs()
  generateCalendar()
}

const changeCurrentMonthYear = ({ month, year }) => {
  if (month !== undefined) currentMonthYear.value = currentMonthYear.value.month(month)
  if (year !== undefined) currentMonthYear.value = currentMonthYear.value.year(year)

  generateCalendar()
}

const monthList = dayjs.months().map((m, i) => {
  return {
    key: i,
    name: m
  }
})

const showMonthYearPicker = ref(false)
const yearList = ref([])
const yearListRef = ref(null)
const yearListItemsRef = ref([])

onMounted(() => {
  yearList.value = []
  const year = dayjs().year()
  for (let i = year - 5; i <= year + 5; i++) {
    yearList.value.push(i)
  }
})

onBeforeUpdate(() => yearListItemsRef.value = [])

watch(showMonthYearPicker, (visible) => {
  // Focus to current selected year
  if (visible) {
    const year = currentMonthYear.value.year()
    const yearIndex = yearList.value.findIndex(y => y == year)
    nextTick(() => {
      yearListRef.value.scrollTop = yearListItemsRef.value[yearIndex].offsetTop - 50
    })
  }
})

const yearListState = reactive(useScroll(
  yearListRef, {
    offset: { top: 30, bottom: 25 }
  }
))

watch(
  () => yearListState.arrivedState,
  (state) => {
    if (state.top) {
      const lowest = yearList.value[0]
      for (let i = 1; i <= 5; i++) {
        yearList.value.unshift(lowest - i)
      }
    } else if (state.bottom) {
      const largest = yearList.value[yearList.value.length - 1]
      for (let i = 1; i <= 5; i++) {
        yearList.value.push(largest + i)
      }
    }
  },
  { deep: true }
)
</script>

<template>
  <div 
    ref="pickerRef" 
    class="bg-slate-200 h-10 flex items-center justify-between rounded-md relative cursor-pointer min-w-[150px] max-w-full">
    <div v-if="hasIcon" class="px-3 bg-slate-300 self-stretch flex items-center rounded-l-md">
      <slot name="icon"></slot>
    </div>
    <div 
      class="self-stretch flex items-center pl-3 flex-grow whitespace-nowrap overflow-hidden text-ellipsis"
      :class="{'text-gray-600': selectedLabel, 'text-gray-400': !selectedLabel}"
      @click="togglePicker()">
      <template v-if="selectedLabel">{{ selectedLabel }}</template>
      <template v-else-if="props.placeholder">{{ props.placeholder }}</template>
    </div>
    <div class="mx-2 flex gap-1.5 text-sm text-gray-500">
      <i-heroicons-outline-x-circle
        v-if="props.clearable && props.modelValue"
        class="flex-shrink-0"
        @click="changeValue('')" />
    </div>
    <!-- Picker -->
    <div 
      v-if="showPicker" 
      class="absolute z-10 top-full w-full sm:min-w-[250px] p-4 bg-white rounded-md shadow-md">
      <div class="flex items-center justify-between mb-4">
        <div class="whitespace-nowrap hover:underline hover:underline-offset-4 hover:decoration-2 hover:decoration-gray-200" @click="showMonthYearPicker = true">
          {{ currentMonthYear.format("MMM YYYY") }}
        </div>
        <div class="flex divide-x">
          <button @click="prev()" class="px-1 rounded-l-md bg-gray-100 hover:bg-gray-200">
            <i-heroicons-outline-chevron-left class="text-sm" />
          </button>
          <button @click="today()" class="text-sm py-1 px-1.5 bg-gray-100 hover:bg-gray-200">
            Hari ini
          </button>
          <button @click="next()" class="px-1 rounded-r-md bg-gray-100 hover:bg-gray-200">
            <i-heroicons-outline-chevron-right class="text-sm" />
          </button>
        </div>
      </div>
      <div class="grid grid-cols-7">
        <div 
          v-for="day in daysInWeek"
          :key="'day-' + day"
          class="text-center uppercase text-sm text-gray-500 pb-2 cursor-default">
          {{ day }}
        </div>
        <div
          v-for="(day, index) in calendar"
          :key="'date-' + index" 
          class="text-sm">
          <div
            v-if="day.date"
            class="aspect-square flex items-center justify-center rounded-sm hover:bg-primary/10"
            :class="{
              'border border-gray-500': day.isToday,
              'bg-primary text-white': props.modelValue && day.date.isSame(props.modelValue, 'day')
            }"
            @click="changeValue(day.date.format('YYYY-MM-DD'))">
            <span v-if="day.date" v-html="day.date.format('D')"></span>
          </div>
        </div>
      </div>
      <!-- Month year picker -->
      <div 
        v-if="showMonthYearPicker" 
        class="absolute bg-black/50 top-0 bottom-0 left-0 right-0 rounded-md p-4">
        <div class="flex flex-col h-full divide-y">
          <div class="bg-white text-center font-bold py-1 rounded-t-md">
            {{ currentMonthYear.format("MMMM YYYY") }}
          </div>
          <div class="flex-1 flex divide-x bg-white overflow-hidden">
            <ul class="flex-1 divide-y overflow-y-auto">
              <li
                v-for="month in monthList"
                :key="'month-' + month.key"
                class="px-3 py-1"
                @click="changeCurrentMonthYear({month: month.key})">{{ month.name }}</li>
            </ul>
            <ul ref="yearListRef" class="flex-1 divide-y overflow-y-auto">
              <li
                v-for="(year, index) in yearList"
                :key="'year-' + year"
                :ref="el => { yearListItemsRef[index] = el }"
                class="px-3 py-1 text-center"
                @click="changeCurrentMonthYear({year: year})">{{ year }}</li>
            </ul>
          </div>
          <div
            class="py-1 bg-gray-100 hover:bg-gray-300 rounded-b-md text-center"
            @click="showMonthYearPicker = false">
            Selesai
          </div>
        </div>
      </div>
    </div>
  </div>
</template>