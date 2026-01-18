// src/views/task-manager/TaskColumn.js - Updated sorting
import React from 'react'
import { Card, CardBody, CardHeader, Badge } from 'reactstrap'
import AddTaskButton from './AddTaskButton'
import TaskItem from './TaskItem'

const TaskColumn = ({ 
  board, 
  tasks = [], 
  onAddTask, 
  onUpdateTask, 
  onDeleteTask, 
  onTaskClick,
  availableUsers,
  currentUser,
  superAdminIds
}) => {
  const handleAddTask = (taskData) => {
    if (onAddTask && board) {
      // console.log('🔹 TaskColumn: Adding task to board:', board.id, taskData)
      onAddTask({ 
        ...taskData, 
        board_id: board.id,
        status: board.name 
      })
    } else {
      console.error('🔹 TaskColumn: Missing onAddTask or board', { onAddTask, board })
    }
  }

  const handleUpdateTask = (taskId, updates) => {
    if (onUpdateTask) {
      onUpdateTask(taskId, updates)
    }
  }

  const handleDeleteTask = (taskId) => {
    if (onDeleteTask) {
      onDeleteTask(taskId)
    }
  }

  const handleTaskClick = (task) => {
    if (onTaskClick) {
      onTaskClick(task)
    }
  }

  // Sort tasks by creation date - newest first (on top), oldest last (on bottom)
  const sortedTasks = Array.isArray(tasks) ? [...tasks].sort((a, b) => {
     const dateA = a.created_at ? new Date(a.created_at) : new Date(a.id || 0)
        const dateB = b.created_at ? new Date(b.created_at) : new Date(b.id || 0)
                return dateB - dateA
      }) : []

  // console.log(`🔹 TaskColumn [${board.name}]:`, sortedTasks.length, 'tasks', sortedTasks)

  return (
    <Card className="task-column h-100">
      <CardHeader 
        className="d-flex justify-content-between align-items-center py-2"
        style={{ 
          borderLeft: `4px solid ${board.color}`,
          backgroundColor: `${board.color}15`
        }}
      >
        <div className="column-title d-flex align-items-center">
          <div 
            className="color-indicator me-2"
            style={{
              backgroundColor: board.color,
              width: '12px',
              height: '12px',
              borderRadius: '50%'
            }}
          ></div>
          <h6 className="mb-0 me-2 text-capitalize">{board.name}</h6>
          <Badge color="secondary" pill>{sortedTasks.length}</Badge>
        </div>
        <AddTaskButton 
          onAddTask={handleAddTask} 
          board={board}
          availableUsers={availableUsers}
          currentUser={currentUser}
          superAdminIds={superAdminIds}
        />
      </CardHeader>
      
      <CardBody className="p-2" style={{ 
        height: '500px', 
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div className="task-list flex-grow-1">
          {sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
              onClick={handleTaskClick}
              availableUsers={availableUsers}
              currentUser={currentUser}
              superAdminIds={superAdminIds}
            />
          ))}
          
          {sortedTasks.length === 0 && (
            <div className="text-center text-muted py-3">
              <small>No tasks yet</small>
              <div className="mt-1">
                <small>Click the + button to add a task</small>
              </div>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  )
}

export default TaskColumn