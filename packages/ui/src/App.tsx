import { useState, useEffect } from 'react'
import Dashboard from './screens/Dashboard'
import ApprovalQueue from './screens/ApprovalQueue'

type Screen = 'dashboard' | 'approvals'

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard')
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Check connection to relay server
    fetch('http://localhost:3000/health')
      .then(res => res.json())
      .then(() => setIsConnected(true))
      .catch(() => setIsConnected(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">AgentOps</h1>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs text-gray-600">{isConnected ? 'Connected' : 'Offline'}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto p-4 pb-20">
        {currentScreen === 'dashboard' ? (
          <Dashboard />
        ) : (
          <ApprovalQueue />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t fixed bottom-0 left-0 right-0">
        <div className="max-w-lg mx-auto flex">
          <NavButton
            icon="📊"
            label="Dashboard"
            isActive={currentScreen === 'dashboard'}
            onClick={() => setCurrentScreen('dashboard')}
          />
          <NavButton
            icon="🔔"
            label="Approvals"
            isActive={currentScreen === 'approvals'}
            onClick={() => setCurrentScreen('approvals')}
          />
        </div>
      </nav>
    </div>
  )
}

interface NavButtonProps {
  icon: string
  label: string
  isActive: boolean
  onClick: () => void
}

function NavButton({ icon, label, isActive, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 flex flex-col items-center gap-1 ${
        isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}

export default App
