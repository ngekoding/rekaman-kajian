import dayjs from 'dayjs'
import 'dayjs/locale/id'
dayjs.locale('id')

export function dateIndo(date) {
  return dayjs(date).format('D MMM YYYY')
}

export function dateIndoFull(date) {
  return dayjs(date).format('D MMMM YYYY')
}

export default dayjs