<script setup>
import { onMounted, computed } from 'vue'
import EventItem from '@/components/EventItem.vue'
import EmptyState from '@/components/EmptyState.vue'
import LoadingState from '@/components/LoadingState.vue'

import { dateIndoFull } from '@/composables/datetime'
import { loading, fetchEvents, filteredEvents, filterEvent, speakers, locations } from '@/composables/event'
import { filter, filterActive, applyFilter } from '@/composables/event-filter'

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

const onFilter = () => {
  applyFilter()
  filterEvent(filterActive)
}
</script>

<template>

  <header class="py-10 px-4">
    <i-heroicons-outline-microphone class="mx-auto text-4xl text-primary" />
    <h1 class="text-center font-extrabold text-4xl text-primary">Rekaman Kajian</h1>
    <p class="text-center text-sm text-primary/70">Repositori rekaman kajian islam</p>
  </header>

  <!-- Filter form -->
  <section class="container flex flex-wrap gap-3 justify-center">
    <div class="input-wrap-icon flex-grow md:flex-grow-0 md:w-[220px] max-w-full">
      <div class="icon-wrap">
        <i-heroicons-outline-user-circle />
      </div>
      <select v-model="filter.speaker" class="w-full">
        <option value="">Semua Pemateri</option>
        <option
          v-for="speaker in speakers"
          :key="'speaker-' + speaker">
          {{ speaker }}
        </option>
      </select>
    </div>
    <div class="input-wrap-icon flex-grow md:flex-grow-0 md:w-[220px] max-w-full">
      <div class="icon-wrap">
        <i-heroicons-outline-location-marker />
      </div>
      <select v-model="filter.location" class="w-full">
        <option value="">Semua Lokasi</option>
        <option
          v-for="location in locations"
          :key="'location-' + location">
          {{ location }}
        </option>
      </select>
    </div>
    <div class="input-wrap-icon w-full flex-grow md:flex-grow-0 md:w-[210px] max-w-full">
      <div class="icon-wrap">
        <i-heroicons-outline-calendar />
      </div>
      <input v-model="filter.date" type="date" class="w-full" />
    </div>
    <button class="btn-primary flex-grow md:flex-grow-0" @click="onFilter">Filter</button>
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
        v-for="(event, index) in filteredEvents"
        :key="'event-' + index"
        :speaker="event.speaker"
        :title="event.title"
        :location="event.location"
        :date="event.date"
        :time="event.time"
        :url="event.url" />
    </div>
  </section>

  <loading-state v-if="loading" />
  <empty-state v-else-if="filteredEvents.length == 0" />

  <footer class="text-center text-sm text-gray-400 px-5 py-10">
    <p class="text-primary">&copy; Rekaman Kajian.</p>
    <p>Situs ini dikelola oleh <a class="text-gray-500 hover:underline" href="https://ngekoding.github.io" target="_blank" title="Kenalan yuk!">Nur Muhammad, S.Kom</a>.</p>
    <p class="mt-4">Mari ikut berkontribusi dengan memberikan saran, kritik atau menambah data rekaman kajian.<br>Silakan hubungi pengelola melalui tautan <a class="text-gray-500 hover:underline" href="https://ngekoding.github.io" target="_blank" title="Buka tautan">ngekoding.github.io</a></p>
  </footer>

</template>
