import { useState } from 'react'
import { useStationReports } from "/Users/agustinschiariti/Desktop/safewatch/packages/nextjs/hooks/scaffold-eth/useStationReports"

interface Props {
  stationId: string
  stationName: string
  onClose: () => void
  onSubmitReport: () => void
}

type Tab = 'latest' | 'last7days' | 'alltime'

export default function StationReportsOverlay({ stationId, stationName, onClose, onSubmitReport }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('latest')
  console.log("🔍 Overlay rendered - stationId:", stationId, "tab:", activeTab)  // 👈 Add this


  const {
    loading,
    error,
    safetyScore,
    latestReport,
    last7DaysReports,
    allTimeReports,
    stationAddress,
  } = useStationReports(stationId)

  const getSafetyColor = (score: number | null) => {
    if (score === null) return 'gray'
    if (score >= 70) return 'green'
    if (score >= 40) return 'yellow'
    return 'red'
  }

  const safetyColor = getSafetyColor(safetyScore)

  const getActiveReports = () => {
    switch (activeTab) {
      case 'latest':
        return latestReport ? [latestReport] : []
      case 'last7days':
        return last7DaysReports
      case 'alltime':
        return allTimeReports
      default:
        return []
    }
  }

  const activeReports = getActiveReports()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-gray-700">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">{stationName}</h2>
              <p className="text-xs text-gray-400 mt-1">{stationId}.rome.crimenoviz.eth</p>
              {stationAddress && (
                <p className="text-xs text-gray-500 mt-1">
                  {stationAddress.slice(0, 10)}...{stationAddress.slice(-8)}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Safety Score Badge */}
          {safetyScore !== null && (
            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm text-gray-300">AI Safety Score:</span>
              <div
                className={`px-4 py-2 rounded-full font-bold ${
                  safetyColor === 'green'
                    ? 'bg-green-600 text-white'
                    : safetyColor === 'yellow'
                    ? 'bg-yellow-600 text-black'
                    : safetyColor === 'red'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-600 text-white'
                }`}
              >
                {safetyScore}/100
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('latest')}
            className={`flex-1 py-3 px-4 font-semibold ${
              activeTab === 'latest'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            Latest
          </button>
          <button
            onClick={(e) => {
                e.stopPropagation()
                setActiveTab('last7days')
            }}
            className={`flex-1 py-3 px-4 font-semibold ${
              activeTab === 'last7days'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            Last 7 Days ({last7DaysReports.length})
          </button>
          <button
            onClick={(e) => {
                e.stopPropagation()
                setActiveTab('alltime')
            }}
            className={`flex-1 py-3 px-4 font-semibold ${
              activeTab === 'alltime'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            All Time ({allTimeReports.length})
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading && (
            <div className="text-center text-gray-400 py-8">Loading reports...</div>
          )}

          {error && (
            <div className="text-center text-red-400 py-8">Error: {error}</div>
          )}

          {!loading && !error && activeReports.length === 0 && (
            <div className="text-center text-gray-400 py-8">No reports found</div>
          )}

          {!loading && !error && activeReports.length > 0 && (
            <div className="space-y-4">
              {activeReports.map((report) => (
                <div
                  key={report.cid}
                  className="bg-gray-800 p-4 rounded-lg border border-gray-700"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                          report.severity >= 7
                            ? 'bg-red-600 text-white'
                            : report.severity >= 4
                            ? 'bg-yellow-600 text-black'
                            : 'bg-green-600 text-white'
                        }`}
                      >
                        Severity: {report.severity}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(report.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{report.description}</p>
                  
                  <a
                    href={`https://gateway.pinata.cloud/ipfs/${report.cid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    View on IPFS ↗
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Report Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={onSubmitReport}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
          >
            + Submit New Report
          </button>
        </div>
      </div>
    </div>
  )
}