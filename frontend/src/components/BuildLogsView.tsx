import type React from "react"

import { useState, useEffect, useRef } from "react"

interface BuildLogsViewProps {
  projectId: number
  onComplete: (projectId: number, success: boolean) => void
  onBack: () => void
}

const BuildLogsView: React.FC<BuildLogsViewProps> = ({ projectId, onComplete, onBack }) => {
  const [logs, setLogs] = useState<Array<{ id: number; message: string; timestamp: string }>>([])
  const [isBuilding, setIsBuilding] = useState(true)
  const [buildSuccess, setBuildSuccess] = useState(false)
  const logsEndRef = useRef<HTMLDivElement>(null)

  const buildLogs = [
    "🔄 Cloning repository...",
    "✅ Repository cloned successfully",
    "📦 Installing dependencies...",
    "⬇️  npm install",
    "📦 Installing react@18.2.0",
    "📦 Installing react-dom@18.2.0",
    "📦 Installing next@14.0.0",
    "✅ Dependencies installed",
    "🔨 Building application...",
    "⚡ Creating optimized production build",
    "📊 Analyzing bundle size...",
    "✅ Build completed successfully",
    "🚀 Deploying to production...",
    "🌐 Configuring CDN...",
    "✅ Deployment successful!",
    "🎉 Your application is now live!",
  ]

  useEffect(() => {
    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex < buildLogs.length) {
        setLogs((prev) => [
          ...prev,
          {
            id: currentIndex,
            message: buildLogs[currentIndex],
            timestamp: new Date().toLocaleTimeString(),
          },
        ])
        currentIndex++
      } else {
        setIsBuilding(false)
        setBuildSuccess(true)
        clearInterval(interval)
      }
    }, 800)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [logs])

  const handleComplete = () => {
    onComplete(projectId, buildSuccess)
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 space-x-4">
            <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Dashboard</span>
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">VC</span>
              </div>
              <div>
                <h1 className="text-white font-medium">Deployment Logs</h1>
                <p className="text-gray-400 text-sm">Project #{projectId}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
          {/* Build Status */}
          <div className="px-6 py-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {isBuilding ? (
                  <>
                    <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-yellow-400 font-medium">Building...</span>
                  </>
                ) : buildSuccess ? (
                  <>
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-green-400 font-medium">Build Successful</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-red-400 font-medium">Build Failed</span>
                  </>
                )}
              </div>

              {!isBuilding && buildSuccess && (
                <button
                  onClick={handleComplete}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Visit Site
                </button>
              )}
            </div>
          </div>

          {/* Logs Container */}
          <div className="h-96 overflow-y-auto bg-black p-4 font-mono text-sm">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start space-x-3 mb-2">
                <span className="text-gray-500 text-xs mt-0.5 w-20 flex-shrink-0">{log.timestamp}</span>
                <span className="text-gray-300">{log.message}</span>
              </div>
            ))}

            {isBuilding && (
              <div className="flex items-center space-x-2 text-gray-400">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <span>Processing...</span>
              </div>
            )}

            <div ref={logsEndRef} />
          </div>
        </div>

        {!isBuilding && buildSuccess && (
          <div className="mt-6 bg-green-900 border border-green-700 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="text-green-400 font-medium text-lg">Deployment Successful!</h3>
            </div>
            <p className="text-green-300 mb-4">Your application has been successfully deployed and is now live.</p>
            <div className="flex space-x-3">
              <button
                onClick={handleComplete}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Visit Site
              </button>
              <button
                onClick={onBack}
                className="border border-green-600 text-green-400 px-4 py-2 rounded-md hover:bg-green-600 hover:text-white transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default BuildLogsView
