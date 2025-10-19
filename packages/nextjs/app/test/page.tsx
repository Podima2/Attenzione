'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useIPFS } from "/Users/agustinschiariti/Desktop/safewatch/packages/nextjs/hooks/scaffold-eth/useIPFS"
import { useScaffoldWriteContract } from '~~/hooks/scaffold-eth'
import { useStationContract } from "/Users/agustinschiariti/Desktop/safewatch/packages/nextjs/hooks/scaffold-eth/useENS"
import StationReportsOverlay from '~~/components/StationReportsOverlay'
import StationSearch from "/Users/agustinschiariti/Desktop/safewatch/packages/nextjs/components/StationSearch"


export default function TestScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const countsRef = useRef<Record<string, number>>({})
  const [selectedStation, setSelectedStation] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)
  const [countsByStation, setCountsByStation] = useState<Record<string, number>>({})
  const [formData, setFormData] = useState({
    severity: '5',
    description: '',
  })

  useEffect(() => {
    console.log("🔍 selectedStation changed to:", selectedStation?.id)
  }, [selectedStation])

  const [submitting, setSubmitting] = useState(false)
  const { uploadReport, loading: ipfsLoading } = useIPFS()
  const { writeContractAsync: writeCrimeRegistry } = useScaffoldWriteContract('CrimeRegistry')
  const { writeContractAsync: writeStationFactory } = useScaffoldWriteContract('StationFactory')
  
  // Resolve ENS for selected station
  const { stationAddress, ensName } = useStationContract(selectedStation?.id || '')

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1a1a2e)

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    containerRef.current.appendChild(renderer.domElement)

    const stations = [
      { id: 'termini', name: 'Termini', position: [-2, 0, 0], color: 0xff0000 },
      { id: 'colosseo', name: 'Colosseo', position: [0, 0, 0], color: 0x00ff00 },
      { id: 'san-giovanni', name: 'San Giovanni', position: [2, 0, 0], color: 0x0000ff },
    ]

    const stationMeshes: THREE.Mesh[] = []
    const labels: HTMLDivElement[] = []

    stations.forEach((station) => {
      const geometry = new THREE.SphereGeometry(0.3, 16, 16)
      const material = new THREE.MeshBasicMaterial({ color: station.color })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(...(station.position as [number, number, number]))
      ;(mesh.userData as any) = station
      scene.add(mesh)
      stationMeshes.push(mesh)

      const label = document.createElement('div')
      label.style.position = 'absolute'
      label.style.color = '#fff'
      label.style.fontSize = '12px'
      label.style.transform = 'translate(-50%, 4px)'
      label.style.pointerEvents = 'none'
      label.style.whiteSpace = 'nowrap'
      label.dataset.stationId = station.id
      label.textContent = '0'
      overlayRef.current?.appendChild(label)
      labels.push(label)
    })

    const light = new THREE.PointLight(0xffffff, 1, 100)
    light.position.set(5, 5, 5)
    scene.add(light)

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onMouseClick = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(stationMeshes)

      if (intersects.length > 0) {
        const clicked = intersects[0].object as THREE.Mesh
        const station = clicked.userData as any
        
        setSelectedStation(station)
        setShowOverlay(true)
      }
    }

    window.addEventListener('click', onMouseClick)

    const animate = () => {
      requestAnimationFrame(animate)
      // REMOVED: sphere rotation animations

      if (overlayRef.current && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        stationMeshes.forEach((mesh, idx) => {
          const label = labels[idx]
          const v = mesh.position.clone().project(camera)
          const x = ((v.x + 1) / 2) * rect.width
          const y = ((-v.y + 1) / 2) * rect.height
          label.style.left = `${x}px`
          label.style.top = `${y + 14}px`
          const stationId = (mesh.userData as any).id as string
          const count = countsRef.current[stationId] ?? 0
          if (label.textContent !== `${count}`) {
            label.textContent = `${count}`
          }
        })
      }

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      window.removeEventListener('click', onMouseClick)
      renderer.dispose()
      containerRef.current?.removeChild(renderer.domElement)
      labels.forEach(l => overlayRef.current?.removeChild(l))
    }
  }, [countsByStation])

  useEffect(() => {
    let stop = false
    const endpoint = 'http://localhost:8000/subgraphs/name/scaffold-eth/your-contract'

    const fetchCounts = async () => {
      try {
        const query = `{ 
          stations { 
            stationId 
            reportCount 
          } 
        }`
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        })
        const json = await res.json()
        if (stop) return
        const next: Record<string, number> = {}
        const testStations = ['termini', 'colosseo', 'san-giovanni']
        for (const s of json.data?.stations ?? []) {
          if (testStations.includes(s.stationId)) {
            next[s.stationId] = parseInt(s.reportCount ?? '0', 10)
          }
        }
        countsRef.current = next
        setCountsByStation(next)
      } catch (e) {
        // Silent fail
      }
    }

    fetchCounts()
    const id = setInterval(fetchCounts, 30000) // Reduced frequency: 30s instead of 10s
    return () => {
      stop = true
      clearInterval(id)
    }
  }, [])

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStation) return

    setSubmitting(true)

    const report = {
      stationId: selectedStation.id,
      severity: parseInt(formData.severity),
      description: formData.description,
      timestamp: Date.now(),
    }

    try {
      const cid = await uploadReport(report)

      if (!cid) {
        alert('❌ Failed to upload to IPFS')
        setSubmitting(false)
        return
      }

      const crimeRegistryTx = await writeCrimeRegistry({
        functionName: 'submitVerifiedReport',
        args: [selectedStation.id, parseInt(formData.severity), formData.description, cid],
      })

      const stationFactoryTx = await writeStationFactory({
        functionName: 'addReportToStation',
        args: [selectedStation.id, cid],
      })

      alert(`✅ Report submitted!\nCID: ${cid}\nENS: ${ensName}\nStation: ${stationAddress}`)
      
      setFormData({ severity: '5', description: '' })
      setShowForm(false)
      setShowOverlay(true) // Go back to overlay after submit
    } catch (err) {
      console.error('Error submitting report:', err)
      alert('❌ Failed to submit report')
    }

    setSubmitting(false)
  }

  return (
    <div className="w-full h-screen flex">
      <div className="flex-1 relative">
        <div ref={containerRef} className="absolute inset-0" />
        <div ref={overlayRef} className="absolute inset-0" />
      </div>

      {/* Station Search */}
      <StationSearch 
        onStationSelect={(id: string, name: string) => {
          setSelectedStation({ id, name })
          setShowOverlay(true)
        }}
      />

      {/* Reports Overlay */}
      {showOverlay && selectedStation && selectedStation.id && !showForm && (
        <StationReportsOverlay
          stationId={selectedStation.id}
          stationName={selectedStation.name}
          onClose={() => {
            setShowOverlay(false)
            setSelectedStation(null)
          }}
          onSubmitReport={() => {
            setShowOverlay(false)
            setShowForm(true)
          }}
        />
      )}

      {/* Submit Form */}
      {showForm && selectedStation && (
        <div className="absolute bottom-8 right-8 bg-gray-900 p-6 rounded-lg shadow-2xl w-96 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">{selectedStation.name}</h2>
          {ensName && <p className="text-xs text-gray-400 mb-2">ENS: {ensName}</p>}
          {stationAddress && <p className="text-xs text-gray-400 mb-4">Contract: {stationAddress?.slice(0, 10)}...</p>}

          <form onSubmit={handleSubmitReport} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Severity (0-10)</label>
              <input
                type="range"
                min="0"
                max="10"
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full"
              />
              <span className="text-lg font-bold text-red-500">{formData.severity}</span>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the incident..."
                className="w-full bg-gray-800 text-white p-3 rounded border border-gray-600 focus:border-blue-500 outline-none"
                rows={4}
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting || ipfsLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-2 rounded transition"
              >
                {submitting || ipfsLoading ? 'Uploading...' : 'Submit Report'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setShowOverlay(true)
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {!showForm && !showOverlay && (
        <div className="absolute top-8 left-8 bg-gray-900 p-4 rounded text-white text-sm border border-gray-700">
          <p className="font-bold mb-2">Click on a station to view reports</p>
          <p>Red: Termini | Green: Colosseo | Blue: San Giovanni</p>
        </div>
      )}
    </div>
  )
}