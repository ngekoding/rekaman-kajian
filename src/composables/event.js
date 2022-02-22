import { ref, computed } from 'vue'
import dayjs from './datetime'

const events = ref([])
const filteredEvents = ref([])

const loading = ref(false)

const fetchEvents = () => {
  loading.value = true
  events.value = []

  const key = 'AIzaSyAy8Kv-25605MUR9_vc335NH-V1izq7IIw'
  const url = new URL('https://sheets.googleapis.com/v4/spreadsheets/1h31fQUdkTUZ31SDr4Eg-OwyQKGh2yCjgT2hyPXWKCAs/values/Form Responses 1')

  fetch(`${url}?key=${key}`)
    .then(res => res.json())
    .then(data => data.values)
    .then(data => {
      for (let i = 1; i < data.length; i++) {
        const event = {};
        [
          event.timestamp,
          event.speaker,
          event.title,
          event.date,
          event.time,
          event.location,
          event.url
        ] = data[i]

        events.value.push(event)
      }

      // Show latest first
      events.value.sort((e1, e2) => dayjs(e2.date) - dayjs(e1.date))

      filteredEvents.value = events.value
      loading.value = false
    })
}

const filterEvent = (filters) => {
  const { speaker = '', location = '', date = '' } = filters
  if (
    !speaker && 
    !location && 
    !date
  ) {
    filteredEvents.value = events.value
    return
  }

  filteredEvents.value = events.value.filter(e => {
    const validSpeaker = speaker ? speaker == e.speaker : true;
    const validLocation = location ? location == e.location : true;
    const validDate = date ? dayjs(date).isSame(e.date) : true;
    return validSpeaker && validLocation && validDate;
  })
}

const speakers = computed(() => {
  const allSpeakers = events.value.map(event => event.speaker)
  const uniqueSpeakerSet = new Set(allSpeakers)
  return [...uniqueSpeakerSet]
})

const locations = computed(() => {
  const allLocations = events.value.map(event => event.location)
  const uniqueLocationSet = new Set(allLocations)
  return [...uniqueLocationSet]
})

export {
  events,
  fetchEvents,
  filterEvent,
  filteredEvents,
  speakers,
  locations,
  loading
}