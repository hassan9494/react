// src/views/task-manager/TaskItem.js (Updated with cleaner design)
import React, { useState } from 'react'
import { FormGroup, Input, Button, Badge, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { Circle, CheckCircle, Trash2, Edit3, Check, X, Users, User, Flag, Calendar, MessageSquare, Paperclip  } from 'react-feather'

const TaskItem = ({ task, onUpdate, onDelete, onClick, availableUsers = [], currentUser }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title)

    const attachmentCount = task.attachments_count || 0

  // Get creator info
  const getCreatorInfo = () => {
    if (task.user && task.user.name) {
      return task.user
    }
    
    if (task.creator_name) {
      return {
        name: task.creator_name,
        email: task.creator_email
      }
    }
    
    const creator = availableUsers.find(user => user.id === task.user_id)
    if (creator) {
      return creator
    }
    
    return {
      name: `User #${task.user_id}`,
      email: ''
    }
  }

  const creatorInfo = getCreatorInfo()

  // Check if current user is the creator
  const isCurrentUserCreator = currentUser && task.user_id === currentUser.id

  // Check if current user is an assignee
  const isCurrentUserAssignee = currentUser && task.assignees && task.assignees.includes(currentUser.id)

  const handleCompleteToggle = async (e) => {
    e.stopPropagation()
    const newStatus = task.status === 'completed' ? 'todo' : 'completed'
    if (onUpdate) {
      try {
        await onUpdate(task.id, { status: newStatus })
      } catch (error) {
        console.log('Toggle failed due to permissions')
      }
    }
  }

  const handleEdit = (e) => {
    e.stopPropagation()
    setIsEditing(true)
    setEditedTitle(task.title)
  }

  const handleSave = async (e) => {
    if (e) e.stopPropagation()
    if (editedTitle.trim() && onUpdate) {
      try {
        await onUpdate(task.id, { title: editedTitle.trim() })
        setIsEditing(false)
      } catch (error) {
        setIsEditing(false)
        setEditedTitle(task.title)
      }
    } else {
      setIsEditing(false)
    }
  }

  const handleCancel = (e) => {
    if (e) e.stopPropagation()
    setEditedTitle(task.title)
    setIsEditing(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave(e)
    } else if (e.key === 'Escape') {
      handleCancel(e)
    }
  }

  const handleDeleteClick = (e) => {
    e.stopPropagation()
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = async (e) => {
    if (e) e.stopPropagation()
    setShowDeleteConfirm(false)
    if (onDelete) {
      try {
        await onDelete(task.id)
      } catch (error) {
        console.log('Delete failed due to permissions')
      }
    }
  }

  const handleCancelDelete = (e) => {
    if (e) e.stopPropagation()
    setShowDeleteConfirm(false)
  }

  const handleInputClick = (e) => {
    e.stopPropagation()
  }

  const handleTaskClick = (e) => {
    if (!isEditing && !e.target.closest('button') && !showDeleteConfirm) {
      if (onClick) {
        onClick(task)
      }
    }
  }

  const isCompleted = task.status === 'completed'

  // Get priority color and icon
  const getPriorityInfo = (priority) => {
    switch (priority) {
      case 2: 
        return { color: 'danger', label: 'High' }
      case 1: 
        return { color: 'warning', label: 'Medium' }
      default: 
        return { color: 'secondary', label: 'Low' }
    }
  }

  const priorityInfo = getPriorityInfo(task.priority)

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    
    if (isToday) {
      return 'Today'
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  // Count comments if available
  const commentCount = task.comments ? task.comments.length : 0

  return (
    <>
      <div 
        className={`task-item p-2 mb-2 border rounded ${isCompleted ? 'bg-light' : 'bg-white'}`}
        style={{ 
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          borderLeft: `3px solid ${
            task.status === 'completed' ? '#28a745' : task.status === 'inProgress' ? '#ffc107' : '#6c757d'
          } !important`
        }}
        onClick={handleTaskClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)'
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        {/* Top Row: Title and Actions */}
        <div className="d-flex align-items-start justify-content-between mb-0">
          <div className="flex-grow-1 me-2" style={{ minWidth: 0 }}>
            {isEditing ? (
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyPress={handleKeyPress}
                onBlur={handleSave}
                onClick={handleInputClick}
                autoFocus
                size="sm"
                className="mb-1"
              />
            ) : (
              <h6 className={`mb-1 task-title ${isCompleted ? 'text-muted text-decoration-line-through' : ''}`}
                  style={{ 
                    fontSize: '0.9rem',
                    lineHeight: '1.3',
                    fontWeight: 500
                  }}>
                {task.title}
              </h6>
            )}
          </div>

          {!isEditing && (
            <div className="d-flex align-items-center flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              <Button
                color="link"
                size="sm"
                onClick={handleEdit}
                className="text-secondary p-0 me-1"
                style={{ width: '20px', height: '20px' }}
                title="Edit task"
              >
                <Edit3 size={12} />
              </Button>
              <Button
                color="link"
                size="sm"
                onClick={handleDeleteClick}
                className="text-danger p-0"
                style={{ width: '20px', height: '20px' }}
                title="Delete task"
              >
                <Trash2 size={12} />
              </Button>
            </div>
          )}
        </div>


         {/* Metadata Row - UPDATED WITH ATTACHMENT COUNT */}
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center flex-wrap gap-1">
            {/* Priority Badge */}
            <Badge 
              color={priorityInfo.color} 
              className="d-flex align-items-center me-1"
              style={{ 
                fontSize: '0.6rem',
                padding: '2px 6px',
                fontWeight: 500
              }}
            >
              <Flag size={8} className="me-1" />
              {priorityInfo.label}
            </Badge>

            {/* Public Badge */}
            {task.is_public && (
              <Badge color="success" className="d-flex align-items-center me-1"
                     style={{ fontSize: '0.6rem', padding: '2px 6px' }}>
                <Users size={8} className="me-1" />
                Public
              </Badge>
            )}

            {/* Due Date */}
            {task.due_date && (
              <Badge color="outline-secondary" className="d-flex align-items-center me-1 text-muted border"
                     style={{ 
                       fontSize: '0.6rem', 
                       padding: '2px 6px',
                       backgroundColor: 'transparent'
                     }}>
                <Calendar size={8} className="me-1" />
                {formatDate(task.due_date)}
              </Badge>
            )}

            {/* Comments Count */}
            {commentCount > 0 && (
              <Badge color="outline-secondary" className="d-flex align-items-center me-1 text-muted border"
                     style={{ 
                       fontSize: '0.6rem', 
                       padding: '2px 6px',
                       backgroundColor: 'transparent'
                     }}>
                <MessageSquare size={8} className="me-1" />
                {commentCount}
              </Badge>
            )}

            {/* ATTACHMENT COUNT - NEW BADGE */}
            {attachmentCount > 0 && (
              <Badge color="outline-info" className="d-flex align-items-center me-1 text-info border"
                     style={{ 
                       fontSize: '0.6rem', 
                       padding: '2px 6px',
                       backgroundColor: 'transparent'
                     }}>
                <Paperclip size={8} className="me-1" />
                {attachmentCount}
              </Badge>
            )}
          </div>

          {/* Assignee Info */}
          <div className="flex-shrink-0">
            {task.is_public ? (
              <Badge color="outline-success" className="text-success border"
                     style={{ 
                       fontSize: '0.6rem', 
                       padding: '2px 6px',
                       backgroundColor: 'transparent'
                     }}>
                All Users
              </Badge>
            ) : task.assignees && task.assignees.length > 0 ? (
              <div className="d-flex align-items-center">
                <User size={10} className="text-muted me-1" />
                <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                  {task.assignees.length}
                </small>
              </div>
            ) : null}
          </div>
        </div>

        {/* Creator Info - Only show on hover or for very compact view */}
        <div className="mt-1">
          <small className="text-muted d-flex align-items-center" style={{ fontSize: '0.65rem' }}>
            By: {creatorInfo.name}
            {isCurrentUserCreator && <span className="text-primary fw-bold ms-1">(me)</span>}
          </small>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteConfirm} toggle={handleCancelDelete} size="sm">
        <ModalHeader toggle={handleCancelDelete}>
          <Trash2 size={16} className="me-2 text-danger" />
          Delete Task
        </ModalHeader>
        <ModalBody>
          <div className="text-center">
            <p className="mb-3">Are you sure you want to delete this task?</p>
            <div className="alert alert-warning p-2 mb-3">
              <strong>{task.title}</strong>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="justify-content-center">
          <Button color="secondary" onClick={handleCancelDelete} className="px-4">
            Cancel
          </Button>
          <Button color="primary" onClick={handleConfirmDelete} className="px-4">
            <Trash2 size={14} className="me-1" />
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default TaskItem