import { reactive } from 'vue'

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

const applyFilter = () => {
  filterActive.speaker = filter.speaker
  filterActive.location = filter.location
  filterActive.date = filter.date
}

export {
  filter,
  filterActive,
  applyFilter
}