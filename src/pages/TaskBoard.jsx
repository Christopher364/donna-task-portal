import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import TaskCard from '../components/TaskCard'

export default function TaskBoard() {
  const { username } = useParams()
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserAndTasks()
  }, [username])

  async function loadUserAndTasks() {
    setLoading(true)
    
    // Get user
    const { data: userData, error: userError } = await supabase
      .from('task_portal_users')
      .select('*')
      .eq('username', username)
      .single()

    if (userError) {
      console.error('Error loading user:', userError)
      setLoading(false)
      return
    }

    setUser(userData)

    // Get tasks
    const { data: tasksData, error: tasksError } = await supabase
      .from('task_portal_tasks')
      .select('*')
      .eq('user_id', userData.id)
      .order('due_date', { ascending: true })

    if (tasksError) {
      console.error('Error loading tasks:', tasksError)
    } else {
      setTasks(tasksData || [])
    }

    setLoading(false)
  }

  async function updateTaskStatus(taskId, newStatus) {
    const updates = { 
      status: newStatus,
      updated_at: new Date().toISOString()
    }
    
    if (newStatus === 'done') {
      updates.completed_at = new Date().toISOString()
      updates.completed_by = 'user'
    }

    const { error } = await supabase
      .from('task_portal_tasks')
      .update(updates)
      .eq('id', taskId)

    if (error) {
      console.error('Error updating task:', error)
    } else {
      loadUserAndTasks()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">User not found</div>
      </div>
    )
  }

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const todayEnd = new Date(todayStart)
  todayEnd.setDate(todayEnd.getDate() + 1)

  const overdueTasks = tasks.filter(
    (t) => t.status !== 'done' && t.due_date && new Date(t.due_date) < todayStart
  )
  const todayTasks = tasks.filter(
    (t) =>
      t.status !== 'done' &&
      t.due_date &&
      new Date(t.due_date) >= todayStart &&
      new Date(t.due_date) < todayEnd
  )
  const upcomingTasks = tasks.filter(
    (t) => t.status !== 'done' && t.due_date && new Date(t.due_date) >= todayEnd
  )
  const completedTasks = tasks.filter((t) => t.status === 'done')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white p-4">
        <div className="container mx-auto max-w-4xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-2xl">
              🏠
            </Link>
            <h1 className="text-2xl font-bold">Donna Task Portal</h1>
          </div>
          <div className="text-right">
            <div className="font-semibold">{user.display_name}</div>
            <div className="text-sm text-gray-400">{user.role}</div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="text-lg font-semibold">
            📋 My Tasks ({tasks.filter((t) => t.status !== 'done').length} pending)
          </div>
        </div>

        {overdueTasks.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-3 text-red-600">🔴 OVERDUE</h2>
            <div className="space-y-3">
              {overdueTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdateStatus={updateTaskStatus}
                />
              ))}
            </div>
          </section>
        )}

        {todayTasks.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-3 text-blue-600">📅 TODAY</h2>
            <div className="space-y-3">
              {todayTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdateStatus={updateTaskStatus}
                />
              ))}
            </div>
          </section>
        )}

        {upcomingTasks.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-3 text-green-600">📆 UPCOMING</h2>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdateStatus={updateTaskStatus}
                />
              ))}
            </div>
          </section>
        )}

        {completedTasks.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-3 text-gray-600">✅ COMPLETED</h2>
            <div className="space-y-3">
              {completedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdateStatus={updateTaskStatus}
                />
              ))}
            </div>
          </section>
        )}

        {tasks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No tasks yet. Enjoy your free time! 🎉
          </div>
        )}
      </main>
    </div>
  )
}
