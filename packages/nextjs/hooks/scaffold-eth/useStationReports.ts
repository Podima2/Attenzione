import { useState, useEffect } from 'react'
import { useReadContract } from 'wagmi'
import { useStationContract } from "/Users/agustinschiariti/Desktop/safewatch/packages/nextjs/hooks/scaffold-eth/useENS"

interface CrimeReport {
  stationId: string
  severity: number
  description: string
  timestamp: number
  cid: string
}

const STATION_ABI = [
  {
    name: 'getReportCIDs',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'string[]' }],
  },
  {
    name: 'aiSafetyScore',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
] as const

export function useStationReports(stationId: string | undefined) {
  console.log("🔍 useStationReports called with:", stationId)  // 👈 Add this

  const [reports, setReports] = useState<CrimeReport[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { stationAddress } = useStationContract(stationId || '')

  // Get CIDs from Station contract
  const { data: reportCIDs } = useReadContract({
    address: stationAddress as `0x${string}`,
    abi: STATION_ABI,
    functionName: 'getReportCIDs',
  })

  // Get safety score
  const { data: safetyScore } = useReadContract({
    address: stationAddress as `0x${string}`,
    abi: STATION_ABI,
    functionName: 'aiSafetyScore',
  })

  useEffect(() => {
    if (!reportCIDs || !Array.isArray(reportCIDs) || reportCIDs.length === 0) {
      setReports([])
      return
    }

    const fetchReports = async () => {
      setLoading(true)
      setError(null)

      try {
        const fetchedReports: CrimeReport[] = []

        for (const cid of reportCIDs as string[]) {
          try {
            const response = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`)
            if (response.ok) {
              const data = await response.json()
              fetchedReports.push({
                ...data,
                cid,
              })
            }
          } catch (err) {
            console.error(`Failed to fetch CID ${cid}:`, err)
          }
        }

        // Sort by timestamp (newest first)
        fetchedReports.sort((a, b) => b.timestamp - a.timestamp)
        setReports(fetchedReports)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch reports')
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [reportCIDs])

  // Filter helpers
  const getLatestReport = () => reports[0] || null
  
  const getLast7Days = () => {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    return reports.filter(r => r.timestamp >= sevenDaysAgo)
  }

  const getAllTimeReports = () => reports

  return {
    reports,
    loading,
    error,
    safetyScore: safetyScore ? Number(safetyScore) : null,
    stationAddress,
    // Filtered data
    latestReport: getLatestReport(),
    last7DaysReports: getLast7Days(),
    allTimeReports: getAllTimeReports(),
  }
}