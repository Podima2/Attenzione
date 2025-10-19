import { useState } from 'react'

interface CrimeReport {
  stationId: string
  severity: number
  description: string
  timestamp: number
  reporter?: string // optional, for verified reports
}

interface IPFSUploadResponse {
  IpfsHash: string
  PinSize: number
  Timestamp: string
}

export function useIPFS() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadReport = async (report: CrimeReport): Promise<string | null> => {
    setLoading(true)
    setError(null)

    try {
      const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY
      const pinataSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET

      if (!pinataApiKey || !pinataSecret) {
        throw new Error('Pinata API keys not configured')
      }

      // Create FormData for Pinata API
      const formData = new FormData()
      const blob = new Blob([JSON.stringify(report)], { type: 'application/json' })
      formData.append('file', blob, `report-${report.stationId}-${Date.now()}.json`)

      // Add metadata
      const metadata = {
        name: `Crime Report - ${report.stationId}`,
        keyvalues: {
          stationId: report.stationId,
          severity: report.severity.toString(),
          timestamp: report.timestamp.toString(),
        },
      }
      formData.append('pinataMetadata', JSON.stringify(metadata))

      // Upload to Pinata
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecret,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload to Pinata')
      }

      const data: IPFSUploadResponse = await response.json()
      const cid = data.IpfsHash

      console.log('Report uploaded to IPFS:', cid)
      setLoading(false)
      return cid
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      setLoading(false)
      console.error('IPFS upload error:', errorMessage)
      return null
    }
  }

  const fetchReport = async (cid: string): Promise<CrimeReport | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`)

      if (!response.ok) {
        throw new Error('Failed to fetch report from IPFS')
      }

      const report: CrimeReport = await response.json()
      setLoading(false)
      return report
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      setLoading(false)
      console.error('IPFS fetch error:', errorMessage)
      return null
    }
  }

  const fetchReportsByStation = async (stationId: string): Promise<CrimeReport[]> => {
    setLoading(true)
    setError(null)

    try {
      // Query Pinata for files with this stationId
      const response = await fetch('https://api.pinata.cloud/data/pinList?status=pinned', {
        headers: {
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY!,
          pinata_secret_api_key: process.env.PINATA_API_SECRET!,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch reports from Pinata')
      }

      const data = await response.json()
      const reports: CrimeReport[] = []

      // Filter by stationId in metadata
      for (const file of data.rows) {
        if (file.metadata?.keyvalues?.stationId === stationId) {
          const report = await fetchReport(file.ipfs_pin_hash)
          if (report) {
            reports.push(report)
          }
        }
      }

      setLoading(false)
      return reports.sort((a, b) => b.timestamp - a.timestamp) // Newest first
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      setLoading(false)
      console.error('Error fetching reports:', errorMessage)
      return []
    }
  }

  return {
    uploadReport,
    fetchReport,
    fetchReportsByStation,
    loading,
    error,
  }
}