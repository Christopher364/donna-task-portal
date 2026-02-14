export default function TaskCard({ task, onUpdateStatus }) {
  const priorityColors = {
    urgent: 'bg-red-100 text-red-800 border-red-300',
    high: 'bg-orange-100 text-orange-800 border-orange-300',
    medium: 'bg-blue-100 text-blue-800 border-blue-300',
    low: 'bg-gray-100 text-gray-800 border-gray-300',
  }

  const priorityEmoji = {
    urgent: '🔴',
    high: '🟠',
    medium: '🔵',
    low: '⚪',
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date'
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`
    } else if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
    } else if (diffDays === 1) {
      return 'Tomorrow'
    } else if (diffDays < 7) {
      return `In ${diffDays} days`
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
  }

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done'

  return (
    <div className={`bg-white rounded-lg shadow p-4 border-l-4 ${
      isOverdue ? 'border-red-500' : 'border-gray-300'
    }`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs font-semibold border ${
            priorityColors[task.priority] || priorityColors.medium
          }`}>
            {priorityEmoji[task.priority] || priorityEmoji.medium} {task.priority?.toUpperCase() || 'MEDIUM'}
          </span>
          {task.category && (
            <span className="px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">
              {task.category}
            </span>
          )}
        </div>
        <div className={`text-sm ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
          📅 {formatDate(task.due_date)}
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2">{task.title}</h3>

      {task.description && (
        <p className="text-gray-700 mb-3">{task.description}</p>
      )}

      {task.instructions && (
        <details className="mb-3">
          <summary className="cursor-pointer text-sm text-blue-600 font-semibold">
            📋 Instructions from Donna
          </summary>
          <div className="mt-2 p-3 bg-blue-50 rounded text-sm">
            {task.instructions}
          </div>
        </details>
      )}

      {task.status !== 'done' && (
        <div className="flex gap-2 mt-4">
          {task.status === 'pending' && (
            <>
              <button
                onClick={() => onUpdateStatus(task.id, 'in_progress')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Start Working
              </button>
              <button
                onClick={() => onUpdateStatus(task.id, 'done')}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Mark Complete
              </button>
            </>
          )}
          {task.status === 'in_progress' && (
            <>
              <button
                onClick={() => onUpdateStatus(task.id, 'done')}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Mark Complete
              </button>
              <button
                onClick={() => onUpdateStatus(task.id, 'blocked')}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
              >
                Need Help
              </button>
            </>
          )}
          {task.status === 'blocked' && (
            <div className="text-yellow-700 font-semibold">
              ⚠️ Blocked - Waiting for help
            </div>
          )}
        </div>
      )}

      {task.status === 'done' && (
        <div className="text-green-600 font-semibold">
          ✅ Completed {task.completed_at && `on ${new Date(task.completed_at).toLocaleDateString()}`}
        </div>
      )}
    </div>
  )
}
