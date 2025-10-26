'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface Resource {
  id: string
  type: string
  title: string
  description: string
  url?: string
  goalId: string
  goalName: string
  addedBy: string
  addedAt: string
  cost?: string
  estimatedHours?: number
}

interface ResourcesData {
  resources: Resource[]
  resourcesByGoal: Record<string, number>
}

export default function ResourcesPage() {
  const { data: session } = useSession()
  const [data, setData] = useState<ResourcesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [filterGoal, setFilterGoal] = useState<string>('all')

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/mock/resources')
        const result = await response.json()

        if (result.success) {
          setData(result.data)
        } else {
          setError('Failed to load resources')
        }
      } catch (err) {
        console.error('Error fetching resources:', err)
        setError('Failed to load resources')
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [])

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'course':
        return '📚'
      case 'book':
        return '📖'
      case 'video':
        return '🎥'
      case 'app':
        return '📱'
      case 'community':
        return '👥'
      default:
        return '🔗'
    }
  }

  const filteredResources = data?.resources.filter(
    (r) => filterGoal === 'all' || r.goalId === filterGoal
  )

  const uniqueGoals = Array.from(
    new Set(data?.resources.map((r) => ({ id: r.goalId, name: r.goalName })).map((g) => JSON.stringify(g)))
  ).map((str: string) => JSON.parse(str))

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error || 'No data available'}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resources</h1>
          <p className="text-gray-600 mt-1">Learning materials and tools for your goals</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <span>+</span>
          Add Resource
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Filter by goal:</label>
        <select
          value={filterGoal}
          onChange={(e) => setFilterGoal(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Goals ({data.resources.length})</option>
          {uniqueGoals.map((goal) => (
            <option key={goal.id} value={goal.id}>
              {goal.name} ({data.resourcesByGoal[goal.id] || 0})
            </option>
          ))}
        </select>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources?.map((resource) => (
          <div
            key={resource.id}
            className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{getResourceIcon(resource.type)}</span>
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase">
                    {resource.type}
                  </span>
                </div>
              </div>
              {resource.cost && (
                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                  {resource.cost}
                </span>
              )}
            </div>

            <h3 className="font-semibold text-gray-900 mb-2">{resource.title}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{resource.description}</p>

            <div className="border-t border-gray-100 pt-3 mb-3">
              <p className="text-xs text-gray-500 mb-1">Linked to:</p>
              <p className="text-sm font-medium text-gray-700">{resource.goalName}</p>
            </div>

            {resource.estimatedHours ? (
              <p className="text-xs text-gray-500 mb-3">
                ⏱️ ~{resource.estimatedHours} hours
              </p>
            ) : null}

            <div className="flex items-center gap-2">
              {resource.url && (
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors text-center"
                >
                  Open →
                </a>
              )}
              <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                ⋯
              </button>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Added {new Date(resource.addedAt).toLocaleDateString()} by{' '}
                {resource.addedBy === 'system' ? 'AI Assistant' : 'You'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredResources?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No resources found for this filter.</p>
        </div>
      )}

      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add New Resource</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resource Type
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="course">Course</option>
                  <option value="book">Book</option>
                  <option value="video">Video</option>
                  <option value="app">App</option>
                  <option value="community">Community</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g., React Complete Guide"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief description of this resource..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link to Goal
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  {uniqueGoals.map((goal) => (
                    <option key={goal.id} value={goal.id}>
                      {goal.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={(e) => {
                    e.preventDefault()
                    alert('Resource would be added here (API integration pending)')
                    setShowAddModal(false)
                  }}
                >
                  Add Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
