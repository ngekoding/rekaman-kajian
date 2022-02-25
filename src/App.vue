<script setup>
import { onMounted, computed, ref } from 'vue'
import EventItem from '@/components/EventItem.vue'
import EmptyState from '@/components/EmptyState.vue'
import LoadingState from '@/components/LoadingState.vue'
import ToTop from '@/components/ToTop.vue'
import FSelect from '@/components/forms/FSelect.vue'
import FDatePicker from '@/components/forms/FDatePicker.vue'

import { dateIndoFull } from '@/composables/datetime'
import {
  loading,
  fetchEvents,
  events,
  speakers,
  locations,
  pagination,
  filter,
  filterActive,
  applyFilter
} from '@/composables/event'

onMounted(() => fetchEvents())

const filterSpeakerActive = computed(() => {
  return speakers.value.find(s => s == filterActive.speaker) ?? 'Semua Pemateri';
})

const filterLocationActive = computed(() => {
  return locations.value.find(l => l == filterActive.location) ?? 'Semua Lokasi';
})

const filterDateActive = computed(() => {
  const date = filterActive.date;
  if (date) return dateIndoFull(date);
  return false;
})

const speakerOptions = computed(() => {
  const options = speakers.value.map(speaker => {
    return {
      value: speaker,
      label: speaker
    }
  })
  options.unshift({
    value: '',
    label: 'Semua Pemateri'
  })
  return options
})

const locationOptions = computed(() => {
  const options = locations.value.map(location => {
    return {
      value: location,
      label: location
    }
  })
  options.unshift({
    value: '',
    label: 'Semua Lokasi'
  })
  return options
})

const showLoadMore = computed(() => {
  return pagination.page < pagination.lastPage
})

const onLoadMore = () => {
  fetchEvents(pagination.page + 1)
}
</script>

<template>
  <!-- To Top -->
  <to-top class="fixed bottom-4 right-4 z-50" />

  <header class="py-10 px-4">
    <i-heroicons-outline-microphone class="mx-auto text-4xl text-primary" />
    <h1 class="text-center font-extrabold text-4xl text-primary">Rekaman Kajian</h1>
    <p class="text-center text-sm text-primary/70">Repositori rekaman kajian islam</p>
  </header>

  <!-- Filter form -->
  <section class="container flex flex-wrap gap-3 justify-center">
    <f-select 
      v-model="filter.speaker"
      :options="speakerOptions"
      placeholder="Pemateri..."
      class="flex-grow md:flex-grow-0 md:w-[250px] max-w-full"
      divider
      filterable
      clearable>
      <template #icon>
        <i-heroicons-outline-user-circle class="text-gray-600" />
      </template>
    </f-select>
    <f-select 
      v-model="filter.location"
      :options="locationOptions"
      placeholder="Lokasi..."
      class="flex-grow md:flex-grow-0 md:w-[250px] max-w-full"
      divider
      filterable
      clearable>
      <template #icon>
        <i-heroicons-outline-location-marker class="text-gray-600" />
      </template>
    </f-select>
    <f-date-picker
      v-model="filter.date"
      class="w-full flex-grow md:flex-grow-0 md:w-[200px] max-w-full"
      clearable>
      <template #icon>
        <i-heroicons-outline-calendar class="text-gray-600" />
      </template>
    </f-date-picker>
    <button class="btn-primary flex-grow md:flex-grow-0" @click="applyFilter()">Filter</button>
  </section>

  <!-- Active filter information -->
  <section class="container mt-8">
    <p class="text-md text-slate-500 text-center">
      Menampilkan rekaman kajian oleh 
      <span class="text-primary">{{ filterSpeakerActive }}</span> 
      yang berlokasi di 
      <span class="text-primary">{{ filterLocationActive }}</span><span v-if="!filterDateActive">.</span>
      <template v-if="filterDateActive">
        pada tanggal <span class="text-primary">{{ filterDateActive }}.</span>
      </template>
    </p>
  </section>

  <section class="container mt-10">
    <div class="grid gap-5 grid-cols-1 md:grid-cols-3">
      <event-item
        v-for="(event, index) in events"
        :key="'event-' + index"
        :speaker="event.speaker"
        :title="event.title"
        :location="event.location"
        :date="event.date"
        :time="event.time"
        :url="event.url" />
    </div>
  </section>

  <div v-if="!loading && showLoadMore" class="flex justify-center mt-10">
    <button class="btn-primary rounded-full" @click="onLoadMore()">
      Tampilkan Lebih Banyak
    </button>
  </div>

  <p v-if="!loading && !showLoadMore && events.length != 0" class="text-center text-gray-400 mt-8">
    Semua data sudah ditampilkan.
  </p>

  <loading-state v-if="loading" />
  <empty-state v-else-if="events.length == 0" />

  <footer class="text-center text-sm text-gray-400 px-5 py-10">
    <p class="text-primary">&copy; Rekaman Kajian.</p>
    <p>Situs ini dikelola oleh <a class="text-gray-500 hover:underline" href="https://ngekoding.github.io" target="_blank" title="Kenalan yuk!">Nur Muhammad, S.Kom</a>.</p>
    <p class="mt-4">Mari ikut berkontribusi dengan memberikan saran, kritik atau menambah data rekaman kajian.<br>Silakan hubungi pengelola melalui tautan <a class="text-gray-500 hover:underline" href="https://ngekoding.github.io" target="_blank" title="Buka tautan">ngekoding.github.io</a></p>
  </footer>

</template>
