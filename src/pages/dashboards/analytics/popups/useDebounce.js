import { useState, useEffect } from 'react'

export default function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (value) {
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)

      return () => {
        clearTimeout(handler)
      }
    }
    setDebouncedValue('')
  }, [value, delay])

  return debouncedValue
}
