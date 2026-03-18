import { useState, useEffect } from 'react'

interface Approval {
  id: string
  agent_id: string
  action_type: string
  action_details: any
  risk_level: string
  risk_reason: string
  status: string
  requested_at: string
}

export default function ApprovalQueue() {
  const [approvals, setApprovals] = useState<Approval[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPendingApprovals()
  }, [])

  const fetchPendingApprovals = () => {
    fetch('http://localhost:3000/approvals/pending')
      .then(res => res.json())
      .then(data => {
        setApprovals(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  const handleDecision = async (id: string, decision: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`http://localhost:3000/approvals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision,
          decision_reason: decision === 'approved' ? 'Approved via mobile dashboard' : 'Rejected via mobile dashboard',
          decidedBy: 'mobile-user'
        })
      })

      if (res.ok) {
        // Remove from list
        setApprovals(approvals.filter(a => a.id !== id))
      }
    } catch (error) {
      console.error('Failed to submit decision:', error)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">Loading approvals...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Approval Queue</h2>
      
      {approvals.length === 0 ? (
        <div className="bg-white border rounded-lg p-8 text-center">
          <div className="text-4xl mb-2">✅</div>
          <p className="text-gray-500">No pending approvals</p>
          <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {approvals.map(approval => (
            <div key={approval.id} className="bg-white border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-medium text-gray-900">{approval.action_type}</div>
                  <div className="text-xs text-gray-500">Agent: {approval.agent_id}</div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  approval.risk_level === 'critical' ? 'bg-red-100 text-red-800' :
                  approval.risk_level === 'high' ? 'bg-orange-100 text-orange-800' :
                  approval.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {approval.risk_level}
                </div>
              </div>
              
              {approval.risk_reason && (
                <div className="text-xs text-gray-600 mb-3 bg-gray-50 p-2 rounded">
                  {approval.risk_reason}
                </div>
              )}
              
              {approval.action_details && Object.keys(approval.action_details).length > 0 && (
                <div className="text-xs text-gray-500 mb-3">
                  <pre className="bg-gray-50 p-2 rounded overflow-auto">
                    {JSON.stringify(approval.action_details, null, 2)}
                  </pre>
                </div>
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleDecision(approval.id, 'approved')}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDecision(approval.id, 'rejected')}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
