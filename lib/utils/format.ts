export const formatDateFull = (value) => {
  if (!value) return ''
  const date = new Date(value)
  const year = date.getFullYear()
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  const hours = ('0' + date.getHours()).slice(-2)
  const minutes = ('0' + date.getMinutes()).slice(-2)
  const seconds = ('0' + date.getSeconds()).slice(-2)
  const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM'
  const formattedHours = parseInt(hours) % 12 || 12
  const string = `${year}-${month}-${day} @ ${formattedHours}:${minutes}:${seconds} ${ampm}`
  return string.replace(':00 ', ' ')
}

export const formatDateShort = (value) => {
  if (!value) return ''
  const date = new Date(value)
  return date.toISOString().substring(0, 10)
}

export const formatTime = (value) => {
  if (!value) return ''
  const date = new Date(value)
  const hours = date.getUTCHours().toString().padStart(2, '0')
  const minutes = date.getUTCMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}` // Returns in HH:mm format
}

export const formatDateRelative = (d1, d2 = new Date()) => {
  if (!d1) return ''
  d1 = new Date(d1)

  // in miliseconds
  const units = {
    year: 24 * 60 * 60 * 1000 * 365,
    month: (24 * 60 * 60 * 1000 * 365) / 12,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000,
    second: 1000,
  }

  // @ts-ignore: js
  const elapsed = d1 - d2

  // "Math.abs" accounts for both "past" & "future" scenarios
  for (const u in units) {
    if (Math.abs(elapsed) > units[u] || u == 'second') {
      const value = Math.round(elapsed / units[u])
      const unit = u
      const prefix = elapsed > 0 ? 'in ' : ''
      const suffix = elapsed > 0 ? '' : ' ago'
      return (prefix + Math.abs(value) + ' ' + unit + suffix)
        .slice(0, -4)
        .replace(' ', '')
        .replace('year', 'yr')
        .replace('month', 'mo')
        .replace('day', 'd')
        .replace('hour', 'h')
        .replace('minute', 'm')
        .replace('second', 's')
    }
  }
}

export const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function formatJSON(json: any) {
  return JSON.stringify(json, null, 2)
}

export const trimString = (string, length) => {
  if (!string || string.length <= length) return string
  return string.substring(0, length) + '...'
}

export const shorten = (string, start, end) => {
  return string.substring(0, start) + '…' + string.substring(string.length - end)
}

export const formatAddress = (address) => {
  if (!address) return ''
  if (address.length < 20) return address
  return shorten(address, 6, 4)
}

export const formatNumber = (value) => {
  if (value == null) return ''
  if (value === 0) return '0'
  if (value < 1) return parseFloat(value).toFixed(2)
  const suffixes = ['', 'K', 'M', 'B', 'T']
  const suffixIndex = Math.floor(Math.log10(value) / 3)
  const shortValue = value / Math.pow(10, suffixIndex * 3)
  return (shortValue.toFixed(1) + suffixes[suffixIndex]).replace('.0', '')
}

export const formatNumberFull = (value) => {
  return new Intl.NumberFormat('en-US', { notation: 'standard', maximumFractionDigits: 2 }).format(value)
}
