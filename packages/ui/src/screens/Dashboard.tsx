import { useState, useEffect } from 'react'

interface Agent {
  id: string
  name: string
  capabilities: string[]
  status: 'online' | 'offline'
  last_heartbeat: string
}

export default function Dashboard() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:3000/agents')
      .then(res => res.json())
      .then(data => {
        setAgents(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">Loading agents...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Registered Agents</h2>
      
      {agents.length === 0 ? (
        <div className="bg-white border rounded-lg p-8 text-center">
          <div className="text-4xl mb-2">🤖</div>
          <p className="text-gray-500">No agents registered yet</p>
          <p className="text-xs text-gray-400 mt-1">Agents will appear here when they register</p>
        </div>
      ) : (
        <div className="bg-white border rounded-lg divide-y">
          {agents.map(agent => (
            <div key={agent.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{agent.name}</div>
                  <div className="text-xs text-gray-500">ID: {agent.id}</div>
                  {agent.capabilities && agent.capabilities.length > 0 && (
                    <div className="text-xs text-gray-400 mt-1">
                      {agent.capabilities.join(', ')}
                    </div>
                  )}
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  agent.status === 'online' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {agent.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
