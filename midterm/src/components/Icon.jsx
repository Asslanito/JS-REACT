const paths = {
  atlas: 'M3 5l6-2 6 2 6-2v16l-6 2-6-2-6 2V5zm6-2v16m6-14v16',
  search: 'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  heart:
    'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8',
  pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0zm-5 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  plus: 'M12 5v14M5 12h14',
  close: 'M6 6l12 12M6 18 18 6',
  wifi: 'M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0M8 16a6 6 0 0 1 8 0M12 20h.01',
  plug: 'M8 2v5m8-5v5M6 7h12v4a6 6 0 0 1-12 0V7zm6 10v5',
  clock: 'M12 8v5l3 2m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
  people:
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.9M16 3a4 4 0 0 1 0 8m-3-4a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  star: 'm12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3',
  book: 'M12 5C9 2 5 3 2 4v15c3-1 7-2 10 1 3-3 7-2 10-1V4c-3-1-7-2-10 1zm0 0v15',
  coffee:
    'M3 8h14v7a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8zm14 0h1a4 4 0 0 1 0 8h-1M6 2v2m4-2v2m4-2v2M2 23h18',
  work: 'M3 7h18v14H3V7zm5 0V3h8v4M3 12h18m-11 0v3h4v-3',
  campus: 'M2 9l10-6 10 6-10 6L2 9zm4 3v6c4 3 8 3 12 0v-6m4-3v10',
  check: 'M5 12l4 4L19 6',
  filter: 'M3 6h18M6 12h12M9 18h6',
  back: 'M19 12H5m6-6-6 6 6 6',
}

export default function Icon({ name, size = 20, filled = false, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name] ?? paths.pin} />
    </svg>
  )
}
