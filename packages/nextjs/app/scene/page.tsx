'use client'

import { useState, useEffect, useRef } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three' // 👈 Needed for Vector3 in CameraController
import dynamic from 'next/dynamic'
import StationReportsOverlay from '~~/components/StationReportsOverlay'
import StationSearch from '~~/components/StationSearch'
import { MetroStop, metroStops } from '../../data/metroData' // 👈 Import metroStops for CameraController logic
import { useIPFS } from '~~/hooks/scaffold-eth/useIPFS'
import { useScaffoldWriteContract } from '~~/hooks/scaffold-eth'
import { useStationContract } from '~~/hooks/scaffold-eth/useENS'

const CrimeDensityMap = dynamic(() => import('~~/components/three/CrimeDensityMap'), { ssr: false })
const MetroStopAppearance = dynamic(() => import('~~/components/three/MetroStopAppearance'), { ssr: false })

// 👇 Add this component inside Scene.tsx before the return
function CameraController({ targetStation }: { targetStation: MetroStop | null }) {
    const { camera, controls } = useThree()
    const targetRef = useRef<THREE.Vector3 | null>(null)
  
    useEffect(() => {
      if (!targetStation) return
  
      const lats = metroStops.map(s => s.lat)
      const lngs = metroStops.map(s => s.lng)
      const minLat = Math.min(...lats)
      const maxLat = Math.max(...lats)
      const minLng = Math.min(...lngs)
      const maxLng = Math.max(...lngs)
      const PLANE_SIZE = 1000
  
      const x = ((targetStation.lng - minLng) / (maxLng - minLng) - 0.5) * PLANE_SIZE
      const z = -(0.5 - (targetStation.lat - minLat) / (maxLat - minLat)) * PLANE_SIZE
  
      targetRef.current = new THREE.Vector3(x, 150, z)
    }, [targetStation])
  
    useFrame(() => {
      if (!targetRef.current || !controls) return
  
      // Fix: Cast controls to proper type
      const orbitControls = controls as any
      if (!orbitControls.target) return
  
      const currentTarget = orbitControls.target
      currentTarget.lerp(targetRef.current, 0.05)
      orbitControls.update()
  
      const idealCameraPos = new THREE.Vector3(
        targetRef.current.x + 200,
        targetRef.current.y + 300,
        targetRef.current.z + 200
      )
      camera.position.lerp(idealCameraPos, 0.05)
  
      if (camera.position.distanceTo(idealCameraPos) < 10) {
        targetRef.current = null
      }
    })
  
    return null
  }

export default function Scene() {
  const [selectedStation, setSelectedStation] = useState<MetroStop | null>(null)
  const [cameraTarget, setCameraTarget] = useState<MetroStop | null>(null) // 👈 Added state for camera targeting
  const [showOverlay, setShowOverlay] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [reportCounts, setReportCounts] = useState<Record<string, number>>({})
  useEffect(() => {
    console.log("📊 Report counts updated:", reportCounts)
  }, [reportCounts])


  const [formData, setFormData] = useState({
    severity: '5',
    description: '',
  })
  const [submitting, setSubmitting] = useState(false)

  
  

  const { uploadReport, loading: ipfsLoading } = useIPFS()
  const { writeContractAsync: writeCrimeRegistry } = useScaffoldWriteContract('CrimeRegistry')
  const { writeContractAsync: writeStationFactory } = useScaffoldWriteContract('StationFactory')
  
  const { stationAddress, ensName } = useStationContract(selectedStation?.id || '')

  

  // Fetch report counts from subgraph
  useEffect(() => {
    let stop = false
    const endpoint = 'https://api.studio.thegraph.com/query/1685646/attenzione/version/latest'

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
        
        const counts: Record<string, number> = {}
        for (const s of json.data?.stations ?? []) {
          counts[s.stationId] = parseInt(s.reportCount ?? '0', 10)
        }
        setReportCounts(counts)
      } catch (e) {
        console.error('Failed to fetch counts:', e)
      }
    }

    fetchCounts()
    const id = setInterval(fetchCounts, 30000)
    return () => {
      stop = true
      clearInterval(id)
    }
  }, [])

  const handleStationClick = (station: MetroStop) => {
    setSelectedStation(station)
    setCameraTarget(station) // 👈 Trigger camera movement on click too
    setShowOverlay(true)
  }
  
  // 👇 Updated handler for search
  const handleStationSearch = (stationId: string, stationName: string) => {
    // Dynamically import to ensure fresh data, though we'll use the imported one in CameraController
    import('../../data/metroData').then(({ metroStops: allStops }) => {
      const station = allStops.find(s => s.id === stationId)
      if (station) {
        setSelectedStation(station)
        setCameraTarget(station) // 👈 Trigger camera movement
        setShowOverlay(true)
      } else {
        // Fallback for an unknown station (e.g., if we only have the ID/Name from search)
        const fakeStation: MetroStop = { id: stationId, name: stationName, line: 'A', lat: 0, lng: 0, order: 0 }
        setSelectedStation(fakeStation)
        setCameraTarget(null) // Don't move camera for an unknown location
        setShowOverlay(true)
      }
    })
  }

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

      await writeCrimeRegistry({
        functionName: 'submitVerifiedReport',
        args: [selectedStation.id, parseInt(formData.severity), formData.description, cid],
      })

      await writeStationFactory({
        functionName: 'addReportToStation',
        args: [selectedStation.id, cid],
      })

      alert(`✅ Report submitted!\nCID: ${cid}\nENS: ${ensName}\nStation: ${stationAddress}`)
      
      setFormData({ severity: '5', description: '' })
      setShowForm(false)
      setShowOverlay(true)
    } catch (err) {
      console.error('Error submitting report:', err)
      alert('❌ Failed to submit report')
    }

    setSubmitting(false)
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* 3D Scene */}
      <Canvas camera={{ position: [0, 1000, 0], fov: 60, near: 0.1, far: 5000 }}>
        <color attach="background" args={['#0a0a0a']} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[50, 150, 50]} intensity={1.2} />
        <group scale={[1, 1, -1]}>
          <CrimeDensityMap reportCounts={reportCounts} />
          <MetroStopAppearance onStationClick={handleStationClick} reportCounts={reportCounts} />
        </group>
        <OrbitControls
          enableDamping
          dampingFactor={0.1}
          zoomSpeed={1.2}
          rotateSpeed={0.7}
          target={[0, 0, 0]}
        />
        <CameraController targetStation={cameraTarget} /> {/* 👈 Camera Controller added */}
      </Canvas>

      {/* 👇 Add Station Search */}
      <div className="absolute top-8 right-8 z-40">
        <StationSearch onStationSelect={handleStationSearch} />
      </div>

      {/* Reports Overlay */}
      {showOverlay && selectedStation && !showForm && (
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
        <div className="absolute bottom-8 right-8 bg-gray-900 p-6 rounded-lg shadow-2xl w-96 border border-gray-700 z-50">
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
    </div>
  )
}