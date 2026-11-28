import React from 'react'

// Diagram of the break. The bright line links the desk, study time and class.
export default function RouteMap({minutes, walk}){
 const end = Math.min(200, 125 + walk*2)
 return <svg className="route-map" viewBox="0 0 370 210" aria-hidden="true">
 <defs><pattern id="grid" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".85" fill="white" opacity=".27"/></pattern></defs>
 <rect width="370" height="210" fill="url(#grid)"/>
 <g fill="none" stroke="#7181ec" strokeWidth="5" opacity=".7"><path d="M-25 132h70l38-38h84l38-38h173"/><path d="M-22 176h92l35-35h150l42-42h93"/><path d="M117 -18v43l54 54v166"/><path d="M250 -15v37l-31 31v40l89 89v46"/></g>
 <g stroke="white" fill="#2e42c7" strokeWidth="2"><circle cx="77" cy="100" r="4"/><circle cx="229" cy="56" r="4"/><circle cx="171" cy="141" r="4"/><circle cx="289" cy="107" r="4"/></g>
 <path d={'M18 157h57l55-55h62l'+(end-95)+' -'+(end-95)+'h76'} stroke="#e7fe73" strokeWidth="8" fill="none" strokeLinejoin="round"/>
 <g fill="#263bc0" stroke="#edff8a" strokeWidth="4"><circle cx="18" cy="157" r="8"/><circle cx="130" cy="102" r="7"/><circle cx={192+end-95+76} cy={102-end+95} r="9"/></g>
 <g fontFamily="monospace" fontSize="10" fontWeight="bold" fill="#f4f6ff"><text x="13" y="185">СТАРТ</text><text x="130" y="124">{minutes-walk} МИН</text><text x={Math.min(309,192+end-95+55)} y={102-end+72}>ПАРА</text></g>
 </svg>
}
