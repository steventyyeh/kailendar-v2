'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface Resource {
  id: string
  type: string
  title: string
  description: string
  url?: string
  goalId?: string
  addedBy: string
  addedAt: string
  cost?: string
  estimatedHours?: number
}

interface Goal {
  id: string
  specificity: string
}

export default function ResourcesPage() {
  const { data: session } = useSession()
  const [resources, setResources] = useState<Resource[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const [filterGoal, setFilterGoal] = useState<string>('all')
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    type: 'course',
    title: '',
    url: '',
    description: '',
    goalId: '',
    cost: '',
    estimatedHours: '',
  })

  useEffect(() => {
    fetchResources()
    fetchGoals()
  }, [])

  const fetchResources = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/resources')
      const result = await response.json()

      if (result.success) {
        setResources(result.data.resources)
      } else {
        setError(result.error?.message || 'Failed to load resources')
      }
    } catch (err) {
      console.error('Error fetching resources:', err)
      setError('Failed to load resources')
    } finally {
      setLoading(false)
    }
  }

  const fetchGoals = async () => {
    try {
      const response = await fetch('/api/goals')
      const result = await response.json()

      if (result.success) {
        setGoals(result.data.goals)
        if (result.data.goals.length > 0 && !formData.goalId) {
          setFormData(prev => ({ ...prev, goalId: result.data.goals[0].id }))
        }
      }
    } catch (err) {
      console.error('Error fetching goals:', err)
    }
  }

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const payload = {
        type: formData.type,
        title: formData.title,
        description: formData.description,
        ...(formData.url && { url: formData.url }),
        ...(formData.goalId && { goalId: formData.goalId }),
        ...(formData.cost && { cost: formData.cost }),
        ...(formData.estimatedHours && { estimatedHours: Number(formData.estimatedHours) }),
      }

      const response = await fetch('/api/resources/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (result.success) {
        setShowAddModal(false)
        resetForm()
        fetchResources() // Refresh list
      } else {
        alert(result.error?.message || 'Failed to add resource')
      }
    } catch (err) {
      console.error('Error adding resource:', err)
      alert('Failed to add resource')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditResource = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingResource) return

    setSubmitting(true)

    try {
      const payload = {
        type: formData.type,
        title: formData.title,
        description: formData.description,
        ...(formData.url && { url: formData.url }),
        ...(formData.goalId && { goalId: formData.goalId }),
        ...(formData.cost && { cost: formData.cost }),
        ...(formData.estimatedHours && { estimatedHours: Number(formData.estimatedHours) }),
      }

      const response = await fetch(`/api/resources/${editingResource.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (result.success) {
        setShowEditModal(false)
        setEditingResource(null)
        resetForm()
        fetchResources() // Refresh list
      } else {
        alert(result.error?.message || 'Failed to update resource')
      }
    } catch (err) {
      console.error('Error updating resource:', err)
      alert('Failed to update resource')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteResource = async (resourceId: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return

    try {
      const response = await fetch(`/api/resources/${resourceId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        fetchResources() // Refresh list
      } else {
        alert(result.error?.message || 'Failed to delete resource')
      }
    } catch (err) {
      console.error('Error deleting resource:', err)
      alert('Failed to delete resource')
    }
  }

  const openEditModal = (resource: Resource) => {
    setEditingResource(resource)
    setFormData({
      type: resource.type,
      title: resource.title,
      url: resource.url || '',
      description: resource.description,
      goalId: resource.goalId || '',
      cost: resource.cost || '',
      estimatedHours: resource.estimatedHours?.toString() || '',
    })
    setShowEditModal(true)
  }

  const resetForm = () => {
    setFormData({
      type: 'course',
      title: '',
      url: '',
      description: '',
      goalId: goals.length > 0 ? goals[0].id : '',
      cost: '',
      estimatedHours: '',
    })
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'course':
        return '📚'
      case 'book':
        return '📖'
      case 'video':
        return '🎥'
      case 'tool':
        return '🔧'
      case 'community':
        return '👥'
      default:
        return '🔗'
    }
  }

  const filteredResources = resources.filter(
    (r) => filterGoal === 'all' || r.goalId === filterGoal
  )

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

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
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
          onClick={() => {
            resetForm()
            setShowAddModal(true)
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <span>+</span>
          Add Resource
        </button>
      </div>

      {/* Filter */}
      {goals.length > 0 && (
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filter by goal:</label>
          <select
            value={filterGoal}
            onChange={(e) => setFilterGoal(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Goals ({resources.length})</option>
            {goals.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.specificity} ({resources.filter(r => r.goalId === goal.id).length})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600 mb-4">
            {filterGoal === 'all'
              ? 'No resources yet. Add your first learning resource!'
              : 'No resources found for this goal.'}
          </p>
          {filterGoal === 'all' && (
            <button
              onClick={() => {
                resetForm()
                setShowAddModal(true)
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Add Resource
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => {
            const goal = goals.find(g => g.id === resource.goalId)
            return (
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

                {goal && (
                  <div className="border-t border-gray-100 pt-3 mb-3">
                    <p className="text-xs text-gray-500 mb-1">Linked to:</p>
                    <p className="text-sm font-medium text-gray-700">{goal.specificity}</p>
                  </div>
                )}

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
                  <button
                    onClick={() => openEditModal(resource)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteResource(resource.id)}
                    className="px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    Added {new Date(resource.addedAt).toLocaleDateString()} by{' '}
                    {resource.addedBy === 'system' ? 'AI Assistant' : 'You'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add/Edit Resource Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {showEditModal ? 'Edit Resource' : 'Add New Resource'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setShowEditModal(false)
                  setEditingResource(null)
                  resetForm()
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={showEditModal ? handleEditResource : handleAddResource} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resource Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="course">Course</option>
                  <option value="book">Book</option>
                  <option value="video">Video</option>
                  <option value="tool">Tool</option>
                  <option value="community">Community</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., React Complete Guide"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Brief description of this resource..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  required
                />
              </div>

              {goals.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link to Goal
                  </label>
                  <select
                    value={formData.goalId}
                    onChange={(e) => setFormData({ ...formData, goalId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">No specific goal</option>
                    {goals.map((goal) => (
                      <option key={goal.id} value={goal.id}>
                        {goal.specificity}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
                  <input
                    type="text"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    placeholder="e.g., $49"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hours
                  </label>
                  <input
                    type="number"
                    value={formData.estimatedHours}
                    onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                    placeholder="e.g., 10"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setShowEditModal(false)
                    setEditingResource(null)
                    resetForm()
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : (showEditModal ? 'Update' : 'Add Resource')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
