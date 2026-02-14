import { Link } from 'react-router-dom'

const users = [
  { username: 'brittany', displayName: 'Brittani Hernandez', role: 'Sales' },
  { username: 'alison', displayName: 'Alison', role: 'VP' },
  { username: 'chris', displayName: 'Chris', role: 'Founder' },
  { username: 'dayana', displayName: 'Dayana', role: 'Operations' },
  { username: 'naldo', displayName: 'Naldo', role: 'Contractor' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white p-4">
        <h1 className="text-2xl font-bold">🏠 Donna Task Portal</h1>
      </header>
      <main className="container mx-auto p-4 max-w-4xl">
        <h2 className="text-xl font-semibold mb-4">Team Members</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <Link
              key={user.username}
              to={`/${user.username}`}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <div className="text-lg font-semibold">{user.displayName}</div>
              <div className="text-sm text-gray-600">{user.role}</div>
              <div className="mt-2 text-blue-600 text-sm">View Tasks →</div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
