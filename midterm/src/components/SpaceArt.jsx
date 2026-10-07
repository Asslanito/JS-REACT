export default function SpaceArt({ category, variant = 0, large = false }) {
  const palettes = {
    Library: ['#dbe6da', '#486853', '#a3b29a', '#faf5e5'],
    Café: ['#f0dfcc', '#a56d44', '#ccb190', '#fff5e7'],
    Coworking: ['#e0e3ef', '#626a91', '#abaecb', '#f6f1fc'],
    'Campus room': ['#dbe8eb', '#4c7982', '#9dbbc3', '#eff8f7'],
  }
  const [bg, ink, mid, light] = palettes[category] ?? palettes.Library
  const shift = variant % 3
  return (
    <svg
      className={`space-art ${large ? 'large' : ''}`}
      viewBox="0 0 440 220"
      role="img"
      aria-label={`Illustration of a ${category.toLowerCase()}`}
    >
      <rect width="440" height="220" fill={bg} />
      <path d="M0 179h440v41H0z" fill={mid} opacity=".35" />
      <rect x="267" y="25" width="114" height="127" rx="55" fill={light} />
      <path d="M324 25v127m-57-66h114" stroke={mid} strokeWidth="5" />
      <path
        d="M271 137c22-49 31-40 47-10 24-59 38-50 59 10"
        fill={mid}
        opacity=".35"
      />
      {category === 'Library' ? (
        <g>
          <rect x="44" y="39" width="137" height="137" rx="3" fill={ink} />
          {[53, 91, 129].map((y, row) => (
            <g key={y}>
              {[0, 1, 2, 3, 4, 5, 6, 7].map((book) => (
                <rect
                  key={book}
                  x={55 + book * 15}
                  y={y + ((book + shift) % 3) * 3}
                  width="10"
                  height={28 - ((book + shift) % 3) * 3}
                  rx="1"
                  fill={(book + row) % 2 ? light : mid}
                />
              ))}
              <path d={`M49 ${y + 31}h127`} stroke={bg} strokeWidth="3" />
            </g>
          ))}
        </g>
      ) : category === 'Café' ? (
        <g>
          <path d="M46 57h139v15H46zM54 72h123v99H54z" fill={ink} />
          <rect
            x="70"
            y="86"
            width="92"
            height="67"
            rx="3"
            fill={bg}
            opacity=".45"
          />
          <path d="M72 57V28h57v29" fill={mid} />
          <path d="M81 37h21v13H81z" fill={light} />
          <path d="M146 49h17v8h-17z" fill={light} />
          <path
            d="M48 30c17 0 17-13 34-13"
            stroke={ink}
            strokeWidth="2"
            fill="none"
          />
        </g>
      ) : (
        <g>
          <rect x="42" y="40" width="149" height="87" rx="4" fill={ink} />
          <rect x="49" y="47" width="135" height="73" rx="2" fill={light} />
          <path
            d="M67 67h58m-58 13h98m-98 13h44"
            stroke={mid}
            strokeWidth="5"
          />
          <circle cx="151" cy="71" r="12" fill={mid} />
        </g>
      )}
      <path d="M201 156h160v9H201z" fill={ink} />
      <path d="M215 165v43m133-43v43" stroke={ink} strokeWidth="7" />
      <path d="M253 123h43v27h-43z" fill={ink} />
      <path d="M250 150h49" stroke={ink} strokeWidth="4" />
      <path d="M314 148h14v8h-14z" fill={light} />
      <path
        d="M177 163v-25c0-7 8-7 8 0v41h40v29m-47-29v29"
        fill="none"
        stroke={ink}
        strokeWidth="6"
      />
      <path d="M398 157v-38" stroke={ink} strokeWidth="3" />
      <ellipse
        cx="386"
        cy="130"
        rx="8"
        ry="20"
        transform="rotate(-35 386 130)"
        fill={ink}
      />
      <ellipse
        cx="409"
        cy="119"
        rx="8"
        ry="24"
        transform="rotate(30 409 119)"
        fill={ink}
      />
      <path d="M383 157h31l-6 29h-19z" fill={ink} />
      <path
        d="M221 0v40m-20 0h40l9 19h-58z"
        fill={ink}
        stroke={ink}
        strokeWidth="2"
      />
      <circle cx="63" cy="204" r="30" fill={light} opacity=".35" />
    </svg>
  )
}
