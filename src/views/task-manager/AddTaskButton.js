import React, { useState, useRef, useEffect } from 'react'
import { Button, Input, InputGroup, FormGroup, Label, Form } from 'reactstrap'
import { Plus, Check, X, Users } from 'react-feather'

const AddTaskButton = ({ onAddTask, board, availableUsers = [], currentUser }) => {
  const [isAdding, setIsAdding] = useState(false)
  const [taskTitle, setTaskTitle] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [selectedAssignees, setSelectedAssignees] = useState([])
  const inputRef = useRef(null)

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isAdding])

  const handleAddClick = (e) => {
    e.stopPropagation()
    setIsAdding(true)
  }

  const resetForm = () => {
    setTaskTitle('')
    setIsPublic(false)
    setSelectedAssignees([])
  }

  const handleConfirm = (e) => {
    if (e) e.stopPropagation()
    if (taskTitle.trim() && onAddTask && board) {
      const taskData = {
        title: taskTitle.trim(),
        board_id: board.id,
        status: board.name,
        description: '',
        priority: 0,
        is_public: isPublic,
        assignees: selectedAssignees
      }
      
      console.log('🔹 Creating task with data:', taskData)
      onAddTask(taskData)
      resetForm()
    } else {
      console.error('🔹 Missing required data for task creation:', {
        taskTitle: taskTitle.trim(),
        onAddTask: !!onAddTask,
        board: !!board
      })
    }
    setIsAdding(false)
  }

  const handleCancel = (e) => {
    if (e) e.stopPropagation()
    resetForm()
    setIsAdding(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleConfirm(e)
    } else if (e.key === 'Escape') {
      handleCancel(e)
    }
  }

  const handleInputClick = (e) => {
    e.stopPropagation()
  }

  const handlePublicToggle = (e) => {
    const publicStatus = e.target.checked
    setIsPublic(publicStatus)
    if (publicStatus) {
      setSelectedAssignees([])
    }
  }

  const handleAssigneeToggle = (userId) => {
    setSelectedAssignees(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId)
      } else {
        return [...prev, userId]
      }
    })
  }

  // Filter out current user from available users
  const filteredUsers = availableUsers.filter(user => user.id !== currentUser?.id)

  if (!isAdding) {
    return (
      <Button 
        color="primary" 
        size="sm" 
        onClick={handleAddClick}
        className="add-task-btn"
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0
        }}
      >
        <Plus size={16} />
      </Button>
    )
  }

  return (
    <div className="add-task-input mb-2 p-3 border rounded bg-light" onClick={handleInputClick}>
      <Form>
        <InputGroup size="sm" className="mb-2">
          <Input
            ref={inputRef}
            placeholder="Type the task title..."
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            onClick={handleInputClick}
            autoFocus
            style={{ fontSize: '0.875rem' }}
          />
        </InputGroup>

        {/* Public/Private Toggle */}
        <FormGroup check className="mb-2">
          <Input
            type="checkbox"
            checked={isPublic}
            onChange={handlePublicToggle}
            id="public-toggle"
          />
          <Label check for="public-toggle" className="small">
            <Users size={14} className="me-1" />
            Make this task public (all users will be assigned)
          </Label>
        </FormGroup>

        {/* Assignee Selection - Only show for private tasks */}
        {!isPublic && filteredUsers.length > 0 && (
          <FormGroup className="mb-2">
            <Label className="small fw-bold mb-1">Assign to specific users:</Label>
            <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
              {filteredUsers.map(user => (
                <FormGroup check key={user.id} className="mb-1">
                  <Input
                    type="checkbox"
                    checked={selectedAssignees.includes(user.id)}
                    onChange={() => handleAssigneeToggle(user.id)}
                    id={`assignee-${user.id}`}
                  />
                  <Label check for={`assignee-${user.id}`} className="small">
                    {user.name} ({user.email})
                  </Label>
                </FormGroup>
              ))}
            </div>
          </FormGroup>
        )}

        <div className="d-flex justify-content-end mt-2">
          <Button 
            color="success" 
            size="sm" 
            onClick={handleConfirm}
            disabled={!taskTitle.trim()}
            className="me-1"
            style={{ 
              borderRadius: '4px',
              padding: '4px 8px'
            }}
          >
            <Check size={14} />
          </Button>
          <Button 
            color="danger" 
            size="sm" 
            onClick={handleCancel}
            style={{ 
              borderRadius: '4px',
              padding: '4px 8px'
            }}
          >
            <X size={14} />
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default AddTaskButton