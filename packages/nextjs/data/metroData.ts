export type MetroLine = 'A' | 'B' | 'B1' | 'C'


export type MetroStop = {
  id: string
  name: string
  line: MetroLine
  lat: number
  lng: number
  order: number
}

export const metroStops: MetroStop[] = [
  // Line A (Battistini ↔ Anagnina)
  { id: 'battistini', name: 'Battistini', line: 'A', lat: 41.917179, lng: 12.411654, order: 0 },
  { id: 'cornelia', name: 'Cornelia', line: 'A', lat: 41.907936, lng: 12.415053, order: 1 },
  { id: 'baldo-degli-ubaldi', name: 'Baldo Degli Ubaldi', line: 'A', lat: 41.899859, lng: 12.423081, order: 2 },
  { id: 'valle-aurelia', name: 'Valle Aurelia', line: 'A', lat: 41.902319, lng: 12.434031, order: 3 },
  { id: 'cipro', name: 'Cipro', line: 'A', lat: 41.907575, lng: 12.451871, order: 4 },
  { id: 'ottaviano', name: 'Ottaviano-San Pietro-Musei Vaticani', line: 'A', lat: 41.907297, lng: 12.464525, order: 5 },
  { id: 'lepanto', name: 'Lepanto', line: 'A', lat: 41.908078, lng: 12.472718, order: 6 },
  { id: 'flaminio', name: 'Flaminio-Piazza del Popolo', line: 'A', lat: 41.91185, lng: 12.47604, order: 7 },
  { id: 'spagna', name: 'Spagna', line: 'A', lat: 41.904879, lng: 12.483984, order: 8 },
  { id: 'barberini', name: 'Barberini-Fontana di Trevi', line: 'A', lat: 41.902598, lng: 12.488331, order: 9 },
  { id: 'repubblica', name: 'Repubblica-Teatro dell’Opera', line: 'A', lat: 41.903498, lng: 12.496515, order: 10 },
  { id: 'termini', name: 'Termini', line: 'A', lat: 41.901596, lng: 12.50059, order: 11 },
  { id: 'vittorio-emanuele', name: 'Vittorio Emanuele', line: 'A', lat: 41.895311, lng: 12.506596, order: 12 },
  { id: 'manzoni', name: 'Manzoni-Museo della Liberazione', line: 'A', lat: 41.890695, lng: 12.512686, order: 13 },
  { id: 'san-giovanni', name: 'San Giovanni', line: 'A', lat: 41.88602, lng: 12.51865, order: 14 },
  { id: 're-di-roma', name: 'Re di Roma', line: 'A', lat: 41.884524, lng: 12.525287, order: 15 },
  { id: 'ponte-lungo', name: 'Ponte Lungo', line: 'A', lat: 41.882194, lng: 12.532347, order: 16 },
  { id: 'furio-camillo', name: 'Furio Camillo', line: 'A', lat: 41.879007, lng: 12.538555, order: 17 },
  { id: 'colli-albani', name: 'Colli Albani', line: 'A', lat: 41.868739, lng: 12.547113, order: 18 },
  { id: 'arco-di-travertino', name: 'Arco di Travertino', line: 'A', lat: 41.863118, lng: 12.551676, order: 19 },
  { id: 'porta-furba', name: 'Porta Furba-Quadraro', line: 'A', lat: 41.860155, lng: 12.558774, order: 20 },
  { id: 'numidio-quadrato', name: 'Numidio Quadrato', line: 'A', lat: 41.855909, lng: 12.564562, order: 21 },
  { id: 'lucio-sestio', name: 'Lucio Sestio', line: 'A', lat: 41.85246, lng: 12.568478, order: 22 },
  { id: 'giulio-agricola', name: 'Giulio Agricola', line: 'A', lat: 41.847146, lng: 12.576082, order: 23 },
  { id: 'subaugusta', name: 'Subaugusta', line: 'A', lat: 41.840742, lng: 12.585526, order: 24 },
  { id: 'cinecitt', name: 'Cinecittà', line: 'A', lat: 41.83355, lng: 12.592534, order: 25 },
  { id: 'anagnina', name: 'Anagnina', line: 'A', lat: 41.831862, lng: 12.597985, order: 26 },

  // Line B (Laurentina ↔ Rebibbia)
  { id: 'laurentina', name: 'Laurentina', line: 'B', lat: 41.815349, lng: 12.481232, order: 0 },
  { id: 'eur-fermi', name: 'EUR Fermi', line: 'B', lat: 41.828695, lng: 12.464972, order: 1 },
  { id: 'eur-palasport', name: 'EUR Palasport', line: 'B', lat: 41.833989, lng: 12.460114, order: 2 },
  { id: 'eur-magliana', name: 'EUR Magliana', line: 'B', lat: 41.842777, lng: 12.453987, order: 3 },
  { id: 'marconi', name: 'Marconi', line: 'B', lat: 41.854652, lng: 12.473523, order: 4 },
  { id: 'basilica-s-paolo', name: 'Basilica S. Paolo', line: 'B', lat: 41.864205, lng: 12.476906, order: 5 },
  { id: 'garbatella', name: 'Garbatella', line: 'B', lat: 41.870624, lng: 12.484931, order: 6 },
  { id: 'piramide', name: 'Piramide', line: 'B', lat: 41.87679, lng: 12.484218, order: 7 },
  { id: 'circo-massimo', name: 'Circo Massimo', line: 'B', lat: 41.884242, lng: 12.489112, order: 8 },
  { id: 'colosseo', name: 'Colosseo', line: 'B', lat: 41.890694, lng: 12.49258, order: 9 },
  { id: 'cavour', name: 'Cavour', line: 'B', lat: 41.896796, lng: 12.498427, order: 10 },
  { id: 'termini', name: 'Termini', line: 'B', lat: 41.901596, lng: 12.50059, order: 11 },
  { id: 'castro-pretorio', name: 'Castro Pretorio', line: 'B', lat: 41.906967, lng: 12.508544, order: 12 },
  { id: 'policlinico', name: 'Policlinico', line: 'B', lat: 41.908007, lng: 12.518608, order: 13 },
  { id: 'bologna', name: 'Bologna', line: 'B', lat: 41.91253, lng: 12.520443, order: 14 },
  { id: 'tiburtina', name: 'Tiburtina', line: 'B', lat: 41.906804, lng: 12.527393, order: 15 },
  { id: 'quintiliani', name: 'Quintiliani', line: 'B', lat: 41.91375, lng: 12.53488, order: 16 },
  { id: 'monti-tiburtini', name: 'Monti Tiburtini', line: 'B', lat: 41.921606, lng: 12.544111, order: 17 },
  { id: 'pietralata', name: 'Pietralata', line: 'B', lat: 41.925761, lng: 12.551936, order: 18 },
  { id: 'santa-maria-soccorso', name: 'Santa Maria del Soccorso', line: 'B', lat: 41.924843, lng: 12.562723, order: 19 },
  { id: 'ponte-mammolo', name: 'Ponte Mammolo', line: 'B', lat: 41.920556, lng: 12.565, order: 20 },
  { id: 'rebibbia', name: 'Rebibbia', line: 'B', lat: 41.91421, lng: 12.580456, order: 21 },

  // Line B1 (Bologna ↔ Jonio) – separate branch
  { id: 'bologna', name: 'Bologna', line: 'B1', lat: 41.91253, lng: 12.520443, order: 0 },
  { id: 'sant-agnese', name: 'Sant’Agnese/Annibaliano', line: 'B1', lat: 41.921389, lng: 12.517778, order: 1 },
  { id: 'libia', name: 'Libia', line: 'B1', lat: 41.928889, lng: 12.516111, order: 2 },
  { id: 'conca-d-oro', name: 'Conca d’Oro', line: 'B1', lat: 41.936389, lng: 12.512778, order: 3 },
  { id: 'jonio', name: 'Jonio', line: 'B1', lat: 41.942918, lng: 12.514652, order: 4 },

  // Line C (San Giovanni ↔ Monte Compatri/Pantano)
  { id: 'san-giovanni', name: 'San Giovanni', line: 'C', lat: 41.88602, lng: 12.51865, order: 0 },
  { id: 'lodi', name: 'Lodi', line: 'C', lat: 41.882416, lng: 12.527181, order: 1 },
  { id: 'pigneto', name: 'Pigneto', line: 'C', lat: 41.883713, lng: 12.543085, order: 2 },
  { id: 'malatesta', name: 'Malatesta', line: 'C', lat: 41.882939, lng: 12.556734, order: 3 },
  { id: 'teano', name: 'Teano', line: 'C', lat: 41.880461, lng: 12.563853, order: 4 },
  { id: 'gardenie', name: 'Gardenie', line: 'C', lat: 41.877801, lng: 12.571477, order: 5 },
  { id: 'mirti', name: 'Mirti', line: 'C', lat: 41.875691, lng: 12.579461, order: 6 },
  { id: 'parco-centocelle', name: 'Parco di Centocelle', line: 'C', lat: 41.870635, lng: 12.585724, order: 7 },
  { id: 'alessandrino', name: 'Alessandrino', line: 'C', lat: 41.872412, lng: 12.600171, order: 8 },
  { id: 'torre-spaccata', name: 'Torre Spaccata', line: 'C', lat: 41.867566, lng: 12.607421, order: 9 },
  { id: 'torre-maura', name: 'Torre Maura', line: 'C', lat: 41.868779, lng: 12.616335, order: 10 },
  { id: 'giardinetti', name: 'Giardinetti', line: 'C', lat: 41.866589, lng: 12.628864, order: 11 },
  { id: 'torrenova', name: 'Torrenova', line: 'C', lat: 41.864757, lng: 12.639733, order: 12 },
  { id: 'torre-angela', name: 'Torre Angela', line: 'C', lat: 41.865545, lng: 12.651717, order: 13 },
  { id: 'torre-gaia', name: 'Torre Gaia', line: 'C', lat: 41.864085, lng: 12.664446, order: 14 },
  { id: 'grotte-celoni', name: 'Grotte Celoni', line: 'C', lat: 41.859664, lng: 12.673852, order: 15 },
  { id: 'due-leoni', name: 'Due Leoni ‒ Fontana Candida', line: 'C', lat: 41.856942, lng: 12.686523, order: 16 },
  { id: 'borghesiana', name: 'Borghesiana', line: 'C', lat: 41.85501, lng: 12.698377, order: 17 },
  { id: 'bolognetta', name: 'Bolognetta', line: 'C', lat: 41.855497, lng: 12.711818, order: 18 },
  { id: 'graniti', name: 'Graniti', line: 'C', lat: 41.853018, lng: 12.721471, order: 19 },
  { id: 'finocchio', name: 'Finocchio', line: 'C', lat: 41.85098, lng: 12.730248, order: 20 },
  { id: 'monte-compatri', name: 'Monte Compatri-Pantano', line: 'C', lat: 41.85043, lng: 12.74868, order: 21 }
]