import { useState, useEffect, useRef } from 'react'

interface Props {
  onStationSelect: (stationId: string, stationName: string) => void
}

// All Rome metro stations
const ALL_STATIONS = [
  { id: 'battistini', name: 'Battistini' },
  { id: 'cornelia', name: 'Cornelia' },
  { id: 'baldo-degli-ubaldi', name: 'Baldo Degli Ubaldi' },
  { id: 'valle-aurelia', name: 'Valle Aurelia' },
  { id: 'cipro', name: 'Cipro' },
  { id: 'ottaviano', name: 'Ottaviano-San Pietro-Musei Vaticani' },
  { id: 'lepanto', name: 'Lepanto' },
  { id: 'flaminio', name: 'Flaminio-Piazza del Popolo' },
  { id: 'spagna', name: 'Spagna' },
  { id: 'barberini', name: 'Barberini-Fontana di Trevi' },
  { id: 'repubblica', name: 'Repubblica-Teatro dell\'Opera' },
  { id: 'termini', name: 'Termini' },
  { id: 'vittorio-emanuele', name: 'Vittorio Emanuele' },
  { id: 'manzoni', name: 'Manzoni-Museo della Liberazione' },
  { id: 'san-giovanni', name: 'San Giovanni' },
  { id: 're-di-roma', name: 'Re di Roma' },
  { id: 'ponte-lungo', name: 'Ponte Lungo' },
  { id: 'furio-camillo', name: 'Furio Camillo' },
  { id: 'colli-albani', name: 'Colli Albani' },
  { id: 'arco-di-travertino', name: 'Arco di Travertino' },
  { id: 'porta-furba', name: 'Porta Furba-Quadraro' },
  { id: 'numidio-quadrato', name: 'Numidio Quadrato' },
  { id: 'lucio-sestio', name: 'Lucio Sestio' },
  { id: 'giulio-agricola', name: 'Giulio Agricola' },
  { id: 'subaugusta', name: 'Subaugusta' },
  { id: 'cinecitt', name: 'Cinecittà' },
  { id: 'anagnina', name: 'Anagnina' },
  { id: 'laurentina', name: 'Laurentina' },
  { id: 'eur-fermi', name: 'EUR Fermi' },
  { id: 'eur-palasport', name: 'EUR Palasport' },
  { id: 'eur-magliana', name: 'EUR Magliana' },
  { id: 'marconi', name: 'Marconi' },
  { id: 'basilica-s-paolo', name: 'Basilica S. Paolo' },
  { id: 'garbatella', name: 'Garbatella' },
  { id: 'piramide', name: 'Piramide' },
  { id: 'circo-massimo', name: 'Circo Massimo' },
  { id: 'colosseo', name: 'Colosseo' },
  { id: 'cavour', name: 'Cavour' },
  { id: 'castro-pretorio', name: 'Castro Pretorio' },
  { id: 'policlinico', name: 'Policlinico' },
  { id: 'bologna', name: 'Bologna' },
  { id: 'tiburtina', name: 'Tiburtina' },
  { id: 'quintiliani', name: 'Quintiliani' },
  { id: 'monti-tiburtini', name: 'Monti Tiburtini' },
  { id: 'pietralata', name: 'Pietralata' },
  { id: 'santa-maria-soccorso', name: 'Santa Maria del Soccorso' },
  { id: 'ponte-mammolo', name: 'Ponte Mammolo' },
  { id: 'rebibbia', name: 'Rebibbia' },
  { id: 'sant-agnese', name: 'Sant\'Agnese/Annibaliano' },
  { id: 'libia', name: 'Libia' },
  { id: 'conca-d-oro', name: 'Conca d\'Oro' },
  { id: 'jonio', name: 'Jonio' },
  { id: 'lodi', name: 'Lodi' },
  { id: 'pigneto', name: 'Pigneto' },
  { id: 'malatesta', name: 'Malatesta' },
  { id: 'teano', name: 'Teano' },
  { id: 'gardenie', name: 'Gardenie' },
  { id: 'mirti', name: 'Mirti' },
  { id: 'parco-centocelle', name: 'Parco di Centocelle' },
  { id: 'alessandrino', name: 'Alessandrino' },
  { id: 'torre-spaccata', name: 'Torre Spaccata' },
  { id: 'torre-maura', name: 'Torre Maura' },
  { id: 'giardinetti', name: 'Giardinetti' },
  { id: 'torrenova', name: 'Torrenova' },
  { id: 'torre-angela', name: 'Torre Angela' },
  { id: 'torre-gaia', name: 'Torre Gaia' },
  { id: 'grotte-celoni', name: 'Grotte Celoni' },
  { id: 'due-leoni', name: 'Due Leoni – Fontana Candida' },
  { id: 'borghesiana', name: 'Borghesiana' },
  { id: 'bolognetta', name: 'Bolognetta' },
  { id: 'graniti', name: 'Graniti' },
  { id: 'finocchio', name: 'Finocchio' },
  { id: 'monte-compatri', name: 'Monte Compatri-Pantano' }
]

export default function StationSearch({ onStationSelect }: Props) {
  const [searchInput, setSearchInput] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter stations based on search
  const filteredStations = searchInput
    ? ALL_STATIONS.filter(station =>
        station.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        station.id.toLowerCase().includes(searchInput.toLowerCase())
      )
    : []

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (station: typeof ALL_STATIONS[0]) => {
    onStationSelect(station.id, station.name)
    setSearchInput('')
    setShowDropdown(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Only allow exact matches
    const exactMatch = ALL_STATIONS.find(
      s => s.id.toLowerCase() === searchInput.toLowerCase() ||
           s.name.toLowerCase() === searchInput.toLowerCase()
    )
    
    if (exactMatch) {
      handleSelect(exactMatch)
    } else if (filteredStations.length === 1) {
      // Auto-select if only one match
      handleSelect(filteredStations[0])
    }
  }

  return (
    <div className="absolute top-8 right-8 bg-gray-900 p-4 rounded-lg border border-gray-700 w-80" ref={dropdownRef}>
      <h3 className="text-white font-bold mb-3">Quick Station Lookup</h3>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value)
            setShowDropdown(e.target.value.length > 0)
          }}
          onFocus={() => searchInput && setShowDropdown(true)}
          placeholder="Search by name or ID..."
          className="w-full bg-gray-800 text-white px-3 py-2 rounded text-sm border border-gray-600 focus:border-blue-500 outline-none"
        />
        
        {/* Dropdown */}
        {showDropdown && filteredStations.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded max-h-60 overflow-y-auto z-50">
            {filteredStations.map(station => (
              <button
                key={station.id}
                type="button"
                onClick={() => handleSelect(station)}
                className="w-full text-left px-3 py-2 text-white hover:bg-gray-700 text-sm"
              >
                <div className="font-semibold">{station.name}</div>
                <div className="text-xs text-gray-400">{station.id}</div>
              </button>
            ))}
          </div>
        )}
        
        {/* No results */}
        {showDropdown && searchInput && filteredStations.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded p-3 text-gray-400 text-sm z-50">
            No stations found
          </div>
        )}
      </form>
      <p className="text-xs text-gray-400 mt-2">
        Try: termini, colosseo, san-giovanni
      </p>
    </div>
  )
}