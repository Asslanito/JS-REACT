import { useEffect, useState } from 'react'

function readRoute() {
  const route = window.location.hash.slice(1)
  return route.startsWith('/') ? route : '/'
}

export default function useRoute() {
  const [route, setRoute] = useState(readRoute)
  useEffect(() => {
    const handleRoute = () => setRoute(readRoute())
    window.addEventListener('hashchange', handleRoute)
    return () => window.removeEventListener('hashchange', handleRoute)
  }, [])
  return route
}
