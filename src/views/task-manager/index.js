// src/views/task-manager/index.js (Updated with filters)

import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardBody, Alert, Spinner, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import { useTasksFixed as useTasks } from '../../data/use-tasks-fixed'
import TaskBoard from './TaskBoard'
import TaskModal from './TaskModal'
import DeletedTasks from './DeletedTasks'
import TaskFilter from './TaskFilter'
import useAuth from '../../data/use-auth'
import { api as userApi } from '../../data/use-user'
import { taskService } from '../../services/taskService'
import { filterService } from '../../services/filterService'
import { boardService } from '../../services/boardService'
import classnames from 'classnames'
import './taskManager.scss'
import BoardManager from './BoardManager'

const TaskManager = () => {
  const {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    updateTaskSilently,
    refreshTasks
  } = useTasks()

  const [selectedTask, setSelectedTask] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [actionError, setActionError] = useState(null)
  const [actionSuccess, setActionSuccess] = useState(null)
  const [availableUsers, setAvailableUsers] = useState([])
  const [superAdminIds, setSuperAdminIds] = useState([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [boards, setBoards] = useState([])
  const [boardsLoading, setBoardsLoading] = useState(true)

  // Filter state
  const [filters, setFilters] = useState({
    users: [],
    userRole: 'both',
    priority: null,
    createdDateFrom: null,
    createdDateTo: null,
    dueDateFrom: null,
    dueDateTo: null,
    searchTerm: '',
    status: null,
    hasAttachments: null,
    isPublic: null
  })

  const { user: currentUser, loading: authLoading, authenticated } = useAuth()

  const [activeTab, setActiveTab] = useState('1')

  // Check if user is super admin
  const isSuperAdmin = currentUser?.email === 'super@admin.com' ||
      currentUser?.roles?.includes('super') ||
      currentUser?.permissions?.includes('all')

  // Load boards
  const loadBoards = async () => {
    try {
      setBoardsLoading(true)
      const response = await boardService.getBoards()
      if (response.success) {
        setBoards(response.data.boards || [])
      }
    } catch (error) {
      console.error('Error loading boards:', error)
    } finally {
      setBoardsLoading(false)
    }
  }

  // Fetch available users
  const fetchAvailableUsers = async () => {
    try {
      setUsersLoading(true)
      // console.log('🔹 Fetching users with roles...')

      try {
        const response = await taskService.getAvailableUsers()
        // console.log('🔹 Users with roles from task service:', response.data)

        if (response.success && response.data.users) {
          setAvailableUsers(response.data.users)
          setSuperAdminIds(response.data.super_admins || [])
          return
        }
      } catch (taskServiceError) {
        console.warn('🔹 Task service users endpoint not available, trying user API...')
      }

      // Create fallback users
      const createFallbackUsers = () => {
        const fallbackUsers = [
          { id: 1, name: 'Super Admin', email: 'super@admin.com', roles: ['super'] },
          { id: 2, name: 'Admin User', email: 'admin@admin.com', roles: ['admin'] },
          { id: 3, name: 'Cashier User', email: 'cashier@admin.com', roles: ['cashier'] },
          { id: 4, name: 'Manager User', email: 'manager@admin.com', roles: ['manager'] },
          { id: 5, name: 'Product Manager', email: 'product@admin.com', roles: ['product_manager'] }
        ]

        if (currentUser && !fallbackUsers.find(u => u.id === currentUser.id)) {
          fallbackUsers.push({
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
            roles: currentUser.roles || []
          })
        }

        return fallbackUsers
      }
      // Fallback to existing user API
      // console.log('🔹 Falling back to user API...')
      const users = await userApi.autocomplete('')
      // console.log('🔹 Users from autocomplete API:', users)

      if (users && Array.isArray(users)) {
        const usersWithRoles = users.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          roles: user.roles || []
        }))
        setAvailableUsers(usersWithRoles)

        const superAdmins = usersWithRoles.filter(user => user.roles?.includes('super')
        ).map(user => user.id)
        setSuperAdminIds(superAdmins)
      } else {
        // console.warn('🔹 No users returned from API, using fallback')
        const fallbackUsers = createFallbackUsers()
        setAvailableUsers(fallbackUsers)
        const superAdmins = fallbackUsers.filter(user => user.roles?.includes('super')
        ).map(user => user.id)
        setSuperAdminIds(superAdmins)
      }

    } catch (error) {
      // console.error('🔹 Error fetching users from all sources:', error)
      const fallbackUsers = createFallbackUsers()
      setAvailableUsers(fallbackUsers)
      const superAdmins = fallbackUsers.filter(user => user.roles?.includes('super')
      ).map(user => user.id)
      setSuperAdminIds(superAdmins)
    } finally {
      setUsersLoading(false)
    }
  }


  // Flatten all tasks for filtering
  const allTasks = useMemo(() => {
    if (!tasks) return []

    const flattenedTasks = []
    Object.values(tasks).forEach(boardTasks => {
      if (Array.isArray(boardTasks)) {
        flattenedTasks.push(...boardTasks)
      }
    })

    return flattenedTasks
  }, [tasks])

  // Apply filters to tasks
  const filteredTasks = useMemo(() => {
    return filterService.applyFilters(allTasks, filters, availableUsers, currentUser)
  }, [allTasks, filters, availableUsers, currentUser])

  // Group filtered tasks by board for display
  const filteredTasksByBoard = useMemo(() => {
    const grouped = {}

    if (!tasks) return grouped

    // Initialize with board structure
    Object.keys(tasks).forEach(boardId => {
      grouped[boardId] = []
    })

    // Group filtered tasks by their board_id
    filteredTasks.forEach(task => {
      if (task.board_id && grouped[task.board_id]) {
        grouped[task.board_id].push(task)
      }
    })

    return grouped
  }, [filteredTasks, tasks])

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    // console.log('🔹 New filters applied:', newFilters)
    setFilters(newFilters)
  }

  const clearMessages = () => {
    setTimeout(() => {
      setActionError(null)
      setActionSuccess(null)
    }, 5000)
  }
  const getCurrentUserFromStorage = () => {
    try {
      const userData = localStorage.getItem('user')
      if (userData) {
        const parsed = JSON.parse(userData)
        return parsed.user || parsed
      }
      return null
    } catch (error) {
      console.error('Error getting user from storage:', error)
      return null
    }
  }
  const handleAddTask = async (taskData) => {
    // console.log('🔹 Adding task:', taskData)
    setActionError(null)
    setActionSuccess(null)

    try {
      const effectiveUser = currentUser || getCurrentUserFromStorage()

      if (!effectiveUser) {
        throw new Error('No user found. Please log in again.')
      }

      const taskWithCreator = {
        ...taskData,
        user_id: effectiveUser.id,
        creator_name: effectiveUser.name,
        creator_email: effectiveUser.email
      }

      await addTask(taskWithCreator)
      clearMessages()
    } catch (error) {
      const errorMessage = error.message || 'Failed to create task'
      setActionError(errorMessage)
      clearMessages()
    }
  }

  const handleUpdateTask = async (taskId, updates, isSilent = false) => {
    // console.log('🔹 Updating task - ID:', taskId, 'Updates:', updates, 'Silent:', isSilent)

    if (!taskId) {
      console.error('Cannot update task: taskId is null or undefined')
      return
    }

    if (!isSilent) {
      setActionError(null)
      setActionSuccess(null)
    }

    const cleanTaskId = typeof taskId === 'object' ? taskId.id : taskId

    try {
      if (isSilent) {
        await updateTaskSilently(cleanTaskId, updates)
      } else {
        await updateTask(cleanTaskId, updates)
        clearMessages()
      }
    } catch (error) {
      if (!isSilent) {
        let errorMessage = error.message || 'Failed to update task'

        if (errorMessage.includes('not the creator') || errorMessage.includes('access denied')) {
          errorMessage = "You don't have permission to modify this task."
        } else if (errorMessage.includes('not found')) {
          errorMessage = "Task not found. It may have been deleted."
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        }

        setActionError(errorMessage)
        clearMessages()
      }
      throw error
    }
  }

  const handleDeleteTask = async (taskId) => {
    // console.log('🔹 Deleting task - ID:', taskId)
    setActionError(null)
    setActionSuccess(null)

    if (!taskId) {
      console.error('Cannot delete task: taskId is null or undefined')
      return
    }

    const cleanTaskId = typeof taskId === 'object' ? taskId.id : taskId

    try {
      await deleteTask(cleanTaskId)
      setActionSuccess('Task deleted successfully!')
      clearMessages()

      if (selectedTask && selectedTask.id === cleanTaskId) {
        setIsModalOpen(false)
        setSelectedTask(null)
      }
    } catch (error) {
      let errorMessage = error.message || 'Failed to delete task'

      if (errorMessage.includes('not the creator') || errorMessage.includes('access denied')) {
        errorMessage = "You don't have permission to delete this task."
      } else if (errorMessage.includes('not found')) {
        errorMessage = "Task not found. It may have been already deleted."
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }

      setActionError(errorMessage)
      clearMessages()
    }
  }

  const handleTaskClick = (task) => {
    // console.log('🔹 Task clicked:', task)
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedTask(null)
  }

  const handleModalUpdate = async (taskId, updates, isSilent = false) => {
    if (updates === null) {
      await handleDeleteTask(taskId)
    } else {
      await handleUpdateTask(taskId, updates, isSilent)
    }
  }

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }

  const getUserAccessibleBoards = () => {
    if (!boards.length) return []

    return boards.filter(board => {
      // Always show default boards
      if (['todo', 'inProgress', 'completed'].includes(board.name)) {
        return true
      }

      // Super admins see all boards
      if (isSuperAdmin) {
        return true
      }

      // For non-super admin users, only show boards that have their tasks
      const boardTasks = tasks[board.id] || []
      const hasUserTasks = boardTasks.some(task => {
        // User can see the task if:
        // 1. They created it
        // 2. They are assigned to it
        // 3. The task is public
        return task.user_id === currentUser?.id ||
            (task.assignees && task.assignees.includes(currentUser?.id)) ||
            task.is_public
      })

      return hasUserTasks
    })
  }

  useEffect(() => {
    if (authenticated) {
      fetchAvailableUsers()
      loadBoards()
    }
  }, [authenticated])

  // Debug user data
  useEffect(() => {
    // console.log('🔹 Current User:', currentUser)
    // console.log('🔹 Authenticated:', authenticated)
    // console.log('🔹 Available Users:', availableUsers)
    // console.log('🔹 Super Admin IDs:', superAdminIds)
    // console.log('🔹 Active Filters:', filters)
    // console.log('🔹 Total Tasks:', allTasks.length)
    // console.log('🔹 Filtered Tasks:', filteredTasks.length)
  }, [currentUser, authenticated, availableUsers, superAdminIds, filters, allTasks.length, filteredTasks.length])

  if (authLoading || usersLoading || boardsLoading) {
    return (
        <Card>
          <CardBody className="text-center">
            <Spinner color="primary" />
            <div className="mt-2">Loading authentication and users...</div>
          </CardBody>
        </Card>
    )
  }

  const effectiveUser = currentUser || getCurrentUserFromStorage()

  if (!authenticated || !effectiveUser) {
    return (
        <Alert color="warning">
          <h4 className="alert-heading">Authentication Required</h4>
          <p className="mb-0">Please log in to access the task manager.</p>
        </Alert>
    )
  }

  return (
      <div className="task-manager">

        <Nav tabs className="mb-1">
          <NavItem>
            <NavLink
                className={classnames({ active: activeTab === '1' })}
                onClick={() => toggleTab('1')}
            >
              Active Tasks
            </NavLink>
          </NavItem>
          {isSuperAdmin && (
              <>
                <NavItem>
                  <NavLink
                      className={classnames({ active: activeTab === '2' })}
                      onClick={() => toggleTab('2')}
                  >
                    Deleted Tasks
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                      className={classnames({ active: activeTab === '3' })}
                      onClick={() => toggleTab('3')}
                  >
                    Board Management
                  </NavLink>
                </NavItem>
              </>
          )}
        </Nav>

        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            {/* Task Filter Component */}
            <TaskFilter
                filters={filters}
                onFiltersChange={handleFiltersChange}
                availableUsers={availableUsers}
                currentUser={effectiveUser}
                totalTasks={allTasks.length}
                filteredTasks={filteredTasks.length}
                boards={boards}
                allTasks={allTasks}
            />

            {error && (
                <Alert color="danger" className="mb-3">
                  <h4 className="alert-heading">Error Loading Tasks</h4>
                  <p className="mb-0">{error}</p>
                </Alert>
            )}

            {actionSuccess && (
                <Alert color="success" className="mb-3">
                  <strong>Success!</strong> {actionSuccess}
                </Alert>
            )}

            {actionError && (
                <Alert color="danger" className="mb-3">
                  <h4 className="alert-heading">Action Failed</h4>
                  <p className="mb-0">{actionError}</p>
                </Alert>
            )}

            {loading ? (
                <Card>
                  <CardBody className="text-center">
                    <Spinner color="primary" />
                    <div className="mt-2">Loading tasks...</div>
                  </CardBody>
                </Card>
            ) : (
                <TaskBoard
                    tasks={filteredTasksByBoard}
                    onAddTask={handleAddTask}
                    onUpdateTask={handleUpdateTask}
                    onDeleteTask={handleDeleteTask}
                    onTaskClick={handleTaskClick}
                    availableUsers={availableUsers}
                    currentUser={effectiveUser}
                    superAdminIds={superAdminIds}
                    onRefresh={refreshTasks}
                    loading={loading}
                />
            )}
          </TabPane>

          <TabPane tabId="2">
            {isSuperAdmin ? (
                <DeletedTasks />
            ) : (
                <Alert color="warning">
                  <h4 className="alert-heading">Access Denied</h4>
                  <p className="mb-0">Only Super Admins can view deleted tasks.</p>
                </Alert>
            )}
          </TabPane>
          <TabPane tabId="3">
            {isSuperAdmin ? (
                <BoardManager />
            ) : (
                <Alert color="warning">
                  <h4 className="alert-heading">Access Denied</h4>
                  <p className="mb-0">Only Super Admins can manage boards.</p>
                </Alert>
            )}
          </TabPane>
        </TabContent>

        <TaskModal
            isOpen={isModalOpen}
            toggle={handleModalClose}
            task={selectedTask}
            onUpdate={handleModalUpdate}
            availableUsers={availableUsers}
            currentUser={effectiveUser}
            superAdminIds={superAdminIds}
            userAccessibleBoards={getUserAccessibleBoards()} // NEW: Pass accessible boards

        />
      </div>
  )
}

export default TaskManager