import { useEffect, useState } from 'react'

export default function useAsync(request, dependencies) {
  const [result, setResult] = useState({
    key: null,
    status: 'loading',
    data: null,
    error: '',
  })
  const key = JSON.stringify(dependencies)

  useEffect(() => {
    const controller = new AbortController()
    request(controller.signal).then(
      (data) => {
        if (!controller.signal.aborted)
          setResult({ key, status: 'success', data, error: '' })
      },
      (error) => {
        if (!controller.signal.aborted)
          setResult({ key, status: 'error', data: null, error: error.message })
      },
    )
    return () => controller.abort()
  }, [key, request])

  return result.key === key
    ? result
    : { status: 'loading', data: null, error: '' }
}
