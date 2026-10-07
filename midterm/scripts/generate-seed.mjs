import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const cityData = [
  {
    city: 'Almaty',
    districts: ['Bostandyk', 'Medeu', 'Almaly', 'Auezov'],
    streets: [
      'Abay Avenue',
      'Dostyk Avenue',
      'Satpayev Street',
      'Tole Bi Street',
    ],
  },
  {
    city: 'Astana',
    districts: ['Yesil', 'Almaty district', 'Saryarka', 'Baikonyr'],
    streets: [
      'Mangilik El Avenue',
      'Kabanbay Batyr Avenue',
      'Kenesary Street',
      'Saryarka Avenue',
    ],
  },
  {
    city: 'Qyzylorda',
    districts: ['City center', 'Syrdarya riverside', 'Aray', 'Shugyla'],
    streets: [
      'Korkyt Ata Street',
      'Aiteke Bi Street',
      'Abay Avenue',
      'Zheltoksan Street',
    ],
  },
]
const templates = [
  {
    category: 'Library',
    names: [
      'The Reading Room',
      'Paper & Light',
      'Chapter House',
      'The Quiet Shelf',
      'Northside Library',
      'The Book Garden',
      'Open Pages',
      'The Study Archive',
      'Lighthouse Library',
      'The Willow Room',
    ],
    description:
      'Settle into a light-filled reading room with individual desks, generous tables, and shelves of books. The quiet atmosphere makes it a comfortable setting for focused reading, exam preparation, and a few uninterrupted hours of deep work.',
  },
  {
    category: 'Café',
    names: [
      'Sunday Coffee',
      'Little Window',
      'Ground & Gather',
      'The Corner Cup',
      'Morning Ritual',
      'Juniper Café',
      'The Slow Pour',
      'Common Ground',
      'Oak & Oat',
      'The Warm Table',
    ],
    description:
      'A relaxed neighborhood café with warm light, comfortable tables, and a steady hum of conversation. Bring a notebook or a laptop for a creative afternoon. The illustrative visit price represents a small order rather than a separate entry fee.',
  },
  {
    category: 'Coworking',
    names: [
      'The Collective',
      'Workroom Studio',
      'The Launchpad',
      'Forma Space',
      'The Idea Loft',
      'Desk Society',
      'The Green Office',
      'Focus Foundry',
      'Gather Studio',
      'The Next Chapter',
    ],
    description:
      'A flexible workspace with shared desks, thoughtful lighting, and room for collaborative work. Choose a desk for your next project, practice a presentation with a friend, or work through a demanding assignment in a productive setting.',
  },
  {
    category: 'Campus room',
    names: [
      'Campus Commons',
      'The Learning Loft',
      'Student Studio',
      'The Science Hub',
      'West Wing Study',
      'The Design Room',
      'Room for Ideas',
      'The Project Lab',
      'The Seminar Corner',
      'The Campus Nook',
    ],
    description:
      'A welcoming campus study room with practical seating and space for individual or small-group work. It is designed for students who want a change of scenery between classes, a place to compare notes, or a comfortable corner for revision.',
  },
]
const records = cityData.flatMap((location, cityIndex) =>
  templates.flatMap((template, typeIndex) =>
    template.names.map((name, index) => {
      const order = cityIndex * 40 + typeIndex * 10 + index
      return {
        id: `spot-${String(order + 1).padStart(3, '0')}`,
        name,
        category: template.category,
        city: location.city,
        district: location.districts[index % 4],
        address: `${location.streets[index % 4]}, ${12 + index * 7 + typeIndex * 3}`,
        description: template.description,
        noise:
          typeIndex === 0
            ? 'Quiet'
            : typeIndex === 1
              ? index % 3 === 0
                ? 'Lively'
                : 'Moderate'
              : index % 2
                ? 'Moderate'
                : 'Quiet',
        price:
          typeIndex === 0 || typeIndex === 3
            ? 0
            : (typeIndex === 1 ? 1000 : 2500) + (index % 5) * 500,
        seats: 16 + (index % 6) * 8 + (typeIndex === 0 ? 24 : 0),
        opens: typeIndex === 1 ? '08:00' : '09:00',
        closes: typeIndex === 1 ? '22:00' : typeIndex === 2 ? '21:00' : '20:00',
        wifi: order % 9 !== 5,
        outlets: order % 7 !== 4,
        rating: Number((4.9 - ((order * 7) % 12) / 10).toFixed(1)),
        createdAt: new Date(
          Date.UTC(2026, 8, 1 + (order % 28), 9),
        ).toISOString(),
      }
    }),
  ),
)
const output = new URL('../src/data/places.json', import.meta.url)
await mkdir(fileURLToPath(new URL('../src/data/', import.meta.url)), {
  recursive: true,
})
await writeFile(output, `${JSON.stringify(records, null, 2)}\n`)
console.log(`Created ${records.length} simulated study places.`)
