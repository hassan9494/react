// src/services/filterService.js - Updated with multi-user and role filtering

class FilterService {
  constructor() {
    this.defaultFilters = {
      users: [], // Array of user IDs for multi-select
      userRole: 'both', // 'creator', 'assignee', 'both'
      priority: null,
      createdDateFrom: null,
      createdDateTo: null,
      dueDateFrom: null,
      dueDateTo: null,
      searchTerm: '',
      status: null,
      hasAttachments: null,
      isPublic: null
    }
  }

  // Check if user is super admin
  isSuperAdmin(currentUser) {
    return currentUser?.email === 'super@admin.com' || 
           currentUser?.roles?.includes('super') || 
           currentUser?.permissions?.includes('all')
  }

  // Check if user is admin or has elevated privileges
  isAdmin(currentUser) {
    return this.isSuperAdmin(currentUser) || 
           currentUser?.roles?.includes('admin') ||
           currentUser?.roles?.includes('Manager')
  }

  // Enhanced filter logic for multi-user and role-based filtering
  applyFilters(tasks, filters, availableUsers = [], currentUser = null) {
    if (!tasks || !Array.isArray(tasks)) return []

    return tasks.filter(task => {
      // Search term filter (title and description)
      if (filters.searchTerm && filters.searchTerm.trim() !== '') {
        const searchTerm = filters.searchTerm.toLowerCase()
        const titleMatch = task.title?.toLowerCase().includes(searchTerm) || false
        const descMatch = task.description?.toLowerCase().includes(searchTerm) || false
        if (!titleMatch && !descMatch) return false
      }

      // Enhanced User Filter - Multi-user with role support
      if (filters.users && filters.users.length > 0 && this.isSuperAdmin(currentUser)) {
        const hasMatchingUser = filters.users.some(userId => {
          const userIdNum = parseInt(userId)
          
          switch (filters.userRole) {
            case 'creator':
              // Filter by task creator only
              return task.user_id === userIdNum
            
            case 'assignee':
              // Filter by assignees only
              return task.assignees && task.assignees.includes(userIdNum)
            
            case 'both':
            default:
              // Filter by either creator or assignee
              return task.user_id === userIdNum || 
                     (task.assignees && task.assignees.includes(userIdNum))
          }
        })
        
        if (!hasMatchingUser) return false
      }

      // Priority filter
      if (filters.priority !== null && filters.priority !== '') {
        if (task.priority !== parseInt(filters.priority)) return false
      }

      // Status filter
      if (filters.status && filters.status !== 'all') {
        if (task.status !== filters.status) return false
      }

      // Created date range filter
      if (filters.createdDateFrom) {
        const taskCreated = new Date(task.created_at)
        const filterFrom = new Date(filters.createdDateFrom)
        if (taskCreated < filterFrom) return false
      }

      if (filters.createdDateTo) {
        const taskCreated = new Date(task.created_at)
        const filterTo = new Date(filters.createdDateTo)
        filterTo.setHours(23, 59, 59, 999) // End of day
        if (taskCreated > filterTo) return false
      }

      // Due date range filter
      if (task.due_date) {
        if (filters.dueDateFrom) {
          const taskDue = new Date(task.due_date)
          const filterFrom = new Date(filters.dueDateFrom)
          if (taskDue < filterFrom) return false
        }

        if (filters.dueDateTo) {
          const taskDue = new Date(task.due_date)
          const filterTo = new Date(filters.dueDateTo)
          filterTo.setHours(23, 59, 59, 999) // End of day
          if (taskDue > filterTo) return false
        }
      } else if (filters.dueDateFrom || filters.dueDateTo) {
        // If task has no due date but filters are set, exclude it
        return false
      }

      // Attachment filter
      if (filters.hasAttachments !== null) {
        const hasAttachments = (task.attachments_count || 0) > 0
        if (filters.hasAttachments !== hasAttachments) return false
      }

      // Public/Private filter
      if (filters.isPublic !== null) {
        if (task.is_public !== filters.isPublic) return false
      }

      return true
    })
  }

  // Get filter summary text with enhanced user info
  getFilterSummary(filters, availableUsers = [], currentUser = null) {
    const activeFilters = []

    if (filters.searchTerm) {
      activeFilters.push(`Search: "${filters.searchTerm}"`)
    }

    if (filters.users && filters.users.length > 0 && this.isSuperAdmin(currentUser)) {
      const selectedUsers = availableUsers.filter(u => filters.users.includes(u.id.toString())
      )
      
      if (selectedUsers.length > 0) {
        let userText = 'Users: '
        if (selectedUsers.length <= 2) {
          userText += selectedUsers.map(u => u.name).join(', ')
        } else {
          userText += `${selectedUsers.length} users`
        }
        
        // Add role information
        const roleText = this.getUserRoleText(filters.userRole)
        userText += ` (${roleText})`
        
        activeFilters.push(userText)
      }
    }

    if (filters.priority !== null && filters.priority !== '') {
      const priorityLabels = { 0: 'Low', 1: 'Medium', 2: 'High' }
      activeFilters.push(`Priority: ${priorityLabels[filters.priority]}`)
    }

    if (filters.status && filters.status !== 'all') {
      activeFilters.push(`Status: ${filters.status}`)
    }

    if (filters.createdDateFrom || filters.createdDateTo) {
      let dateText = 'Created: '
      if (filters.createdDateFrom && filters.createdDateTo) {
        dateText += `${this.formatDate(filters.createdDateFrom)} to ${this.formatDate(filters.createdDateTo)}`
      } else if (filters.createdDateFrom) {
        dateText += `from ${this.formatDate(filters.createdDateFrom)}`
      } else if (filters.createdDateTo) {
        dateText += `until ${this.formatDate(filters.createdDateTo)}`
      }
      activeFilters.push(dateText)
    }

    if (filters.dueDateFrom || filters.dueDateTo) {
      let dateText = 'Due: '
      if (filters.dueDateFrom && filters.dueDateTo) {
        dateText += `${this.formatDate(filters.dueDateFrom)} to ${this.formatDate(filters.dueDateTo)}`
      } else if (filters.dueDateFrom) {
        dateText += `from ${this.formatDate(filters.dueDateFrom)}`
      } else if (filters.dueDateTo) {
        dateText += `until ${this.formatDate(filters.dueDateTo)}`
      }
      activeFilters.push(dateText)
    }

    if (filters.hasAttachments !== null) {
      activeFilters.push(`Attachments: ${filters.hasAttachments ? 'Has Files' : 'No Files'}`)
    }

    if (filters.isPublic !== null) {
      activeFilters.push(`Visibility: ${filters.isPublic ? 'Public' : 'Private'}`)
    }

    return activeFilters
  }

  // Helper to get user role display text
  getUserRoleText(userRole) {
    switch (userRole) {
      case 'creator':
        return 'Creator Only'
      case 'assignee':
        return 'Assignee Only'
      case 'both':
        return 'Creator or Assignee'
      default:
        return 'Any Role'
    }
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Reset filters to default
  resetFilters() {
    return { ...this.defaultFilters }
  }

  // Check if any filter is active
  hasActiveFilters(filters) {
    return Object.keys(filters).some(key => {
      if (key === 'searchTerm') return filters[key] !== ''
      if (key === 'users') return filters[key] && filters[key].length > 0
      return filters[key] !== null && filters[key] !== ''
    })
  }

  // Get available status options based on boards
  getStatusOptions(boards = []) {
    const baseStatuses = [
      { value: 'all', label: 'All Statuses' },
      { value: 'todo', label: 'To Do' },
      { value: 'inProgress', label: 'In Progress' },
      { value: 'completed', label: 'Completed' }
    ]

    // Add custom board statuses
    const customStatuses = boards
      .filter(board => !['todo', 'inProgress', 'completed'].includes(board.name))
      .map(board => ({
        value: board.name,
        label: board.name.charAt(0).toUpperCase() + board.name.slice(1)
      }))

    return [...baseStatuses, ...customStatuses]
  }

  // Get user role options for filtering
  getUserRoleOptions() {
    return [
      { value: 'both', label: 'Creator or Assignee' },
      { value: 'creator', label: 'Creator Only' },
      { value: 'assignee', label: 'Assignee Only' }
    ]
  }
}

export const filterService = new FilterService()