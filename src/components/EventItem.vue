<script setup>
import { dateIndo } from '@/composables/datetime'

const props = defineProps({
   speaker: String,
   title: String,
   location: String,
   date: String,
   time: String,
   url: String
})
</script>

<template>
  <div class="bg-white p-5 pb-[70px] rounded-xl shadow-sm relative">
    <div class="flex flex-wrap items-center text-sm text-primary uppercase">
      <span>{{ dateIndo(date) }}</span>
      <span class="inline-block w-1 h-1 bg-primary rounded-full mx-2"></span>
      <span>{{ time }}</span>
    </div>
    <h2 class="text-2xl leading-6 text-gray-700 font-extrabold">{{ title }}</h2>
    <div class="flex items-center text-gray-500 mt-2">
      <i-heroicons-outline-user-circle class="text-lg" />
      <span class="ml-2 text-sm">{{ speaker }}</span>
    </div>
    <a class="btn-primary absolute bottom-5" :href="url" target="_blank">
      <i-heroicons-outline-play class="text-md" />
      <span class="ml-1.5 text-sm">Buka Rekaman</span>
    </a>
  </div>
</template>
