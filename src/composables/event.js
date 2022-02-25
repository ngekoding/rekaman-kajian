import { ref, reactive, watch } from 'vue'

const loading = ref(false)
const events = ref([])
const speakers = ref([])
const locations = ref([])

const pagination = reactive({
  perPage: 9,
  page: 1,
  lastPage: 0,
  nextUrl: null
})

const filter = reactive({
  speaker: '',
  location: '',
  date: ''
})

const filterActive = reactive({
  speaker: '',
  location: '',
  date: ''
})

const fetchEvents = (page) => {
  loading.value = true

  const baseUrl = 'https://script.google.com/macros/s/AKfycbyaRICwKCfsk1HvQgV_nmfQ0dPGiM98M58s72vQL6bAdxaMojnE7-4ok7UrJAk2S-CJ/exec'
  const params = new URLSearchParams({
    ...filterActive,
    perPage: pagination.perPage,
    page: page ?? pagination.page
  }).toString()

  const url = baseUrl + '?' + params

  fetch(url, { redirect: 'follow' })
    .then(res => res.json())
    .then(res => {
      if (res.pagination.page == 1) {
        events.value = res.data.events
      } else {
        events.value.push(...res.data.events)
      }

      speakers.value = res.data.speakers
      locations.value = res.data.locations

      pagination.perPage = res.pagination.perPage
      pagination.page = res.pagination.page
      pagination.lastPage = res.pagination.lastPage
      pagination.nextUrl = res.pagination.nextUrl

      loading.value = false
    }).catch(err => {
      console.log(err)
    })
}

const applyFilter = () => {
  filterActive.speaker = filter.speaker
  filterActive.location = filter.location
  filterActive.date = filter.date
}

watch(filterActive, () => {
  events.value = []
  fetchEvents()
})

export {
  events,
  fetchEvents,
  speakers,
  locations,
  loading,
  pagination,
  filter,
  filterActive,
  applyFilter
}