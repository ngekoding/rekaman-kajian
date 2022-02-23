import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import 'dayjs/locale/id'

dayjs.extend(localeData)
dayjs.locale('id')

export function dateIndo(date) {
  return dayjs(date).format('D MMM YYYY')
}

export function dateIndoFull(date) {
  return dayjs(date).format('D MMMM YYYY')
}

export default dayjs