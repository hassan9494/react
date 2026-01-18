// src/views/task-manager/TaskCard.js
import React, { useState } from 'react'
import { Card, CardBody, Badge } from 'reactstrap'
import { Flag, Calendar, User } from 'react-feather'
import TaskModal from './TaskModal'

const TaskCard = ({ task, onUpdate }) => {
  const [modalOpen, setModalOpen] = useState(false)

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 2: return 'danger'
      case 1: return 'warning'
      default: return 'secondary'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <>
      <Card 
        className="task-card mb-2 cursor-pointer"
        onClick={() => setModalOpen(true)}
        style={{ cursor: 'pointer' }}
      >
        <CardBody className="p-2">
          <div className="d-flex justify-content-between align-items-start mb-1">
            <h6 className="mb-0 flex-grow-1">{task.title}</h6>
            <Badge color={getPriorityColor(task.priority)} size="sm">
              <Flag size={10} />
            </Badge>
          </div>
          
          {task.description && (
            <p className="small text-muted mb-1">{task.description.substring(0, 100)}...</p>
          )}
          
          <div className="d-flex justify-content-between align-items-center">
            {task.due_date && (
              <small className="text-muted d-flex align-items-center">
                <Calendar size={12} className="me-1" />
                {formatDate(task.due_date)}
              </small>
            )}
            
            {task.assignees && task.assignees.length > 0 && (
              <small className="text-muted d-flex align-items-center">
                <User size={12} className="me-1" />
                {task.assignees.length}
              </small>
            )}
          </div>
        </CardBody>
      </Card>

      <TaskModal
        isOpen={modalOpen}
        toggle={() => setModalOpen(false)}
        task={task}
        onUpdate={onUpdate}
      />
    </>
  )
}

export default TaskCard