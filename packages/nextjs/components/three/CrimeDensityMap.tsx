import { useMemo } from 'react'
import * as THREE from 'three'
import chroma from 'chroma-js'
import { metroStops } from '../../data/metroData'

const GRID_SIZE = 100
const BASE_HEIGHT = 0 // 👈 Flat base
const PLANE_SIZE = 1000
const DEPTH_MULTIPLIER = 1.7
const REPORT_HEIGHT_MULTIPLIER = 100 // 👈 Updated multiplier
const MAX_HEIGHT_CAP = 300 // 👈 Maximum height cap
const BUFFER = 0.2

interface Props {
  reportCounts: Record<string, number>
}

// 👇 Added function for logarithmic and capped height calculation
function calculateHeight(reportCount: number): number {
  if (reportCount === 0) return 0
  
  // Logarithmic scaling: log(x+1) grows fast initially, then slows
  // Multiply by multiplier and cap at max
  const rawHeight = Math.log(reportCount + 1) * REPORT_HEIGHT_MULTIPLIER
  return Math.min(rawHeight, MAX_HEIGHT_CAP)
}

function generateFlatGrid(size: number): number[] {
  const grid: number[] = []
  for (let i = 0; i < size * size; i++) {
    grid.push(BASE_HEIGHT) // 👈 All zeros
  }
  return grid
}

function smoothGrid(grid: number[], size: number, iterations = 2): number[] {
  let smoothed = [...grid]
  for (let it = 0; it < iterations; it++) {
    const newGrid = [...smoothed]
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        let sum = 0
        let count = 0
        for (let di = -1; di <= 1; di++) {
          for (let dj = -1; dj <= 1; dj++) {
            const ni = i + di
            const nj = j + dj
            if (ni >= 0 && ni < size && nj >= 0 && nj < size) {
              sum += smoothed[ni * size + nj]
              count++
            }
          }
        }
        newGrid[i * size + j] = sum / count
      }
    }
    smoothed = newGrid
  }
  return smoothed
}

const lats = metroStops.map(s => s.lat)
const lngs = metroStops.map(s => s.lng)
const minLat = Math.min(...lats)
const maxLat = Math.max(...lats)
const minLng = Math.min(...lngs)
const maxLng = Math.max(...lngs)

const latRange = maxLat - minLat
const lngRange = maxLng - minLng
const bufferedMinLat = minLat - latRange * BUFFER
const bufferedMaxLat = maxLat + latRange * BUFFER
const bufferedMinLng = minLng - lngRange * BUFFER
const bufferedMaxLng = maxLng + lngRange * BUFFER

function latLngToGrid(lat: number, lng: number): { i: number; j: number } {
  const xNorm = (lng - bufferedMinLng) / (bufferedMaxLng - bufferedMinLng)
  const zNorm = (lat - bufferedMinLat) / (bufferedMaxLat - bufferedMinLat)
  const i = Math.floor(zNorm * (GRID_SIZE - 1))
  const j = Math.floor(xNorm * (GRID_SIZE - 1))
  return { i, j }
}

export default function CrimeDensityMap({ reportCounts }: Props) {
  const mesh = useMemo(() => {
    console.log('🗺️ CrimeDensityMap rebuilding with reportCounts:', reportCounts) // 👈 Debug

    // Flat base terrain
    const rawGrid = generateFlatGrid(GRID_SIZE)

    // Add peaks based on report counts
    let peaksAdded = 0
    for (const stop of metroStops) {
      const reportCount = reportCounts[stop.id] || 0
      if (reportCount === 0) continue

      const { i, j } = latLngToGrid(stop.lat, stop.lng)
      const idx = i * GRID_SIZE + j
      
      if (idx >= 0 && idx < rawGrid.length) {
        const heightIncrease = calculateHeight(reportCount) // 👈 Use logarithmic function
        rawGrid[idx] += heightIncrease
        peaksAdded++
        // Log updated to use toFixed(1) for cleaner output, as requested in instruction
        console.log(`  📍 ${stop.id}: ${reportCount} reports → +${heightIncrease.toFixed(1)} height`)
      }
    }

    console.log(`  ✅ Added ${peaksAdded} peaks`) // 👈 Debug

    // Smooth the grid
    const heightGrid = smoothGrid(rawGrid, GRID_SIZE, 2)

    // Find max height for color scaling
    const maxHeight = Math.max(...heightGrid, 1) // Minimum 1 to avoid divide by zero

    console.log(`  📊 Max height: ${maxHeight}`) // 👈 Debug

    const colorScale = chroma
      .scale(['#000000', '#1a0033', '#4B0082', '#FF1493', '#FF4500', '#FFFF00'])
      .domain([0, maxHeight])

    // Create geometry
    const geometry = new THREE.PlaneGeometry(
      PLANE_SIZE * (1 + BUFFER * 2),
      PLANE_SIZE * (1 + BUFFER * 2),
      GRID_SIZE - 1,
      GRID_SIZE - 1
    )
    geometry.rotateX(-Math.PI / 2)

    // Apply heights
    for (let i = 0; i < geometry.attributes.position.count; i++) {
      geometry.attributes.position.setY(i, heightGrid[i] * DEPTH_MULTIPLIER)
    }
    geometry.computeVertexNormals()

    // Apply colors
    const colors: number[] = []
    for (let i = 0; i < geometry.attributes.position.count; i++) {
      const y = geometry.attributes.position.getY(i)
      const c = new THREE.Color(colorScale(y / DEPTH_MULTIPLIER).hex())
      colors.push(c.r, c.g, c.b)
    }
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
      flatShading: false
    })

    const planeMesh = new THREE.Mesh(geometry, material)

    const wireframe = new THREE.LineSegments(
      new THREE.WireframeGeometry(geometry),
      new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.15, transparent: true })
    )

    const group = new THREE.Group()
    group.add(planeMesh)
    group.add(wireframe)

    return group
  }, [reportCounts])

  return <primitive object={mesh} />
}