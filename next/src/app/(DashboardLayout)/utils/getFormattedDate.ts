export const getFormattedDate = (dateString?: string | null) => {
  if (!dateString) {
    return ''
  }

  const date = new Date(dateString)

  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  const times = { day, month, year, hours, minutes, seconds }

  const formattedTimes = Object.entries(times).map(([key, value]) => [
    key,
    value.toString().length < 2 ? `0${value}` : value,
  ])

  return Object.fromEntries(formattedTimes)
}
