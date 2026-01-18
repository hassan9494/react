// src/views/task-manager/TaskBoard.js (Updated with board visibility logic)
import React, { useState, useEffect } from 'react'
import { Button, Spinner, Alert, Row, Col, Badge } from 'reactstrap'
import { RefreshCw } from 'react-feather'
import TaskColumn from './TaskColumn'
import WeeklyGroupedTaskColumn from './WeeklyGroupedTaskColumn'
import { boardService } from './../../services/boardService'

const TaskBoard = ({
                     tasks,
                     onAddTask,
                     onUpdateTask,
                     onDeleteTask,
                     onTaskClick,
                     availableUsers,
                     currentUser,
                     superAdminIds,
                     onRefresh,
                     loading
                   }) => {
  const [boards, setBoards] = useState([])
  const [boardsLoading, setBoardsLoading] = useState(true)
  const [boardsError, setBoardsError] = useState(null)
  const [boardTasks, setBoardTasks] = useState({})

  // Check if user is super admin
  const isSuperAdmin = currentUser?.email === 'super@admin.com' ||
      currentUser?.roles?.includes('super') ||
      currentUser?.permissions?.includes('all')

  // Default board names that should always be visible
  const defaultBoardNames = ['todo', 'inProgress', 'completed']

  // Check if a board should be visible for non-super admin users
  const shouldShowBoard = (board, boardData) => {
    // Always show default boards for all users
    if (defaultBoardNames.includes(board.name)) {
      return true
    }

    // Super admins see all boards
    if (isSuperAdmin) {
      return true
    }

    // For non-super admin users, only show custom boards that have tasks
    const hasTasks = boardData && boardData.tasks && boardData.tasks.length > 0
    return hasTasks
  }

  const loadBoards = async () => {
    try {
      setBoardsLoading(true)
      setBoardsError(null)
      // console.log('🔹 Loading boards...')
      const response = await boardService.getBoards()

      if (response.success) {
        const boardsData = response.data.boards || []
        // console.log('🔹 Loaded boards:', boardsData)
        setBoards(boardsData)

        // Initialize board tasks structure
        const boardTasksMap = {}
        boardsData.forEach(board => {
          boardTasksMap[board.id] = {
            board,
            tasks: []
          }
        })
        setBoardTasks(boardTasksMap)
      } else {
        setBoardsError(response.message || 'Failed to load boards')
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to load boards. Please try again.'
      setBoardsError(errorMessage)
      console.error('Error loading boards:', err)
    } finally {
      setBoardsLoading(false)
    }
  }

  // Update board tasks when tasks prop changes
  useEffect(() => {
    if (boards.length > 0 && tasks) {
      // console.log('🔹 Raw tasks data received:', tasks)

      const updatedBoardTasks = { ...boardTasks }

      // Reset all board tasks first
      boards.forEach(board => {
        updatedBoardTasks[board.id] = {
          board,
          tasks: []
        }
      })

      // Handle different task data structures
      if (typeof tasks === 'object' && !Array.isArray(tasks)) {
        // New structure: tasks is an object with board IDs as keys
        Object.keys(tasks).forEach(boardId => {
          if (updatedBoardTasks[boardId]) {
            const boardData = tasks[boardId]
            // Handle both array format and object with tasks property
            if (Array.isArray(boardData)) {
              updatedBoardTasks[boardId].tasks = boardData
            } else if (boardData && boardData.tasks) {
              updatedBoardTasks[boardId].tasks = boardData.tasks
            } else {
              console.warn(`🔹 Unexpected data format for board ${boardId}:`, boardData)
              updatedBoardTasks[boardId].tasks = []
            }
          }
        })
      } else if (Array.isArray(tasks)) {
        // Fallback: group tasks by board_id
        // console.log('🔹 Grouping tasks by board_id from array')
        tasks.forEach(task => {
          if (task.board_id && updatedBoardTasks[task.board_id]) {
            updatedBoardTasks[task.board_id].tasks.push(task)
          } else {
            console.warn('🔹 Task missing board_id or board not found:', task)
          }
        })
      } else {
        console.warn('🔹 Unexpected tasks format:', typeof tasks, tasks)
      }

      // console.log('🔹 Final organized board tasks:', updatedBoardTasks)
      setBoardTasks(updatedBoardTasks)
    }
  }, [tasks, boards])

  useEffect(() => {
    loadBoards()
  }, [])

  // Filter boards based on user permissions and task assignments
  const getVisibleBoards = () => {
    if (!boards.length) return []

    return boards.filter(board => {
      const boardData = boardTasks[board.id]
      return shouldShowBoard(board, boardData)
    })
  }

  // Separate completed board from other boards
  const visibleBoards = getVisibleBoards()
  // const completedBoard = visibleBoards.find(board => board.name === 'completed')
  // const otherBoards = visibleBoards.filter(board => board.name !== 'completed')

  if (boardsLoading) {
    return (
        <div className="text-center py-5">
          <Spinner color="primary" />
          <div className="mt-2">Loading boards...</div>
        </div>
    )
  }

  if (boardsError) {
    return (
        <Alert color="danger">
          <h4 className="alert-heading">Error Loading Boards</h4>
          <p className="mb-0">{boardsError}</p>
          <Button color="primary" size="sm" className="mt-2" onClick={loadBoards}>
            Retry
          </Button>
        </Alert>
    )
  }

  if (visibleBoards.length === 0) {
    return (
        <Alert color="warning">
          <h4 className="alert-heading">No Boards Found</h4>
          <p className="mb-0">No boards are available for your account.</p>
        </Alert>
    )
  }

  return (
      <>
        <div className="d-flex justify-content-between align-items-center mb-1">
          <div className="d-flex align-items-center">
          </div>
          <Button
              color="primary"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
              className="d-flex align-items-center"
          >
            <RefreshCw size={14} className={loading ? 'spinning' : ''} />
            <span className="ms-1">Refresh</span>
          </Button>
        </div>

        <div className="task-board">
          <Row>
            {visibleBoards.map(board => {
              const boardData = boardTasks[board.id]
              const boardTasksList = boardData ? boardData.tasks : []

              // Use WeeklyGroupedTaskColumn only for completed board
              if (board.name === 'completed') {
                return (
                    <Col key={board.id} lg={4} md={6} className="mb-4">
                      <WeeklyGroupedTaskColumn
                          board={board}
                          tasks={boardTasksList}
                          onUpdateTask={onUpdateTask}
                          onDeleteTask={onDeleteTask}
                          onTaskClick={onTaskClick}
                          availableUsers={availableUsers}
                          currentUser={currentUser}
                          superAdminIds={superAdminIds}
                          useExternalTasks={true}
                      />
                    </Col>
                )
              } else {
                return (
                    <Col key={board.id} lg={4} md={6} className="mb-4">
                      <TaskColumn
                          board={board}
                          tasks={boardTasksList}
                          onAddTask={onAddTask}
                          onUpdateTask={onUpdateTask}
                          onDeleteTask={onDeleteTask}
                          onTaskClick={onTaskClick}
                          availableUsers={availableUsers}
                          currentUser={currentUser}
                          superAdminIds={superAdminIds}
                      />
                    </Col>
                )
              }
            })}
          </Row>
        </div>
      </>
  )
}

export default TaskBoard