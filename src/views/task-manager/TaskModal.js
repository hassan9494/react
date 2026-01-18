// src/views/task-manager/TaskModal.js (COMPLETE FIXED VERSION)
import React, { useState, useEffect, useRef } from 'react'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Badge,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Card,
  CardBody
} from 'reactstrap'
import {
  X, Plus, MessageSquare, User, Calendar, Flag, MoreVertical,
  Users, Trash2, Edit, Check, X as XIcon,
  Paperclip, Eye, EyeOff, AlertCircle, Zap, TrendingUp, Activity,
  Send, Info
} from 'react-feather'
import { taskService } from './../../services/taskService'
import { boardService } from './../../services/boardService'
import AttachmentSection from './AttachmentSection'
import Linkify from './Linkify'

const TaskModal = ({
                     isOpen,
                     toggle,
                     task,
                     onUpdate,
                     availableUsers = [],
                     currentUser,
                     superAdminIds = [],
                     userAccessibleBoards = [] // NEW: Receive accessible boards from parent
                   }) => {
  const [taskData, setTaskData] = useState(null)
  const [boards, setBoards] = useState([])
  const [visibleBoards, setVisibleBoards] = useState([])
  const [users, setUsers] = useState([])
  const [assigneeDropdownOpen, setAssigneeDropdownOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [activeTab, setActiveTab] = useState('details')
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [attachmentsCount, setAttachmentsCount] = useState(0)
  const [commentToDelete, setCommentToDelete] = useState(null)
  const [taskDeleteModal, setTaskDeleteModal] = useState(false)
  const [editingComment, setEditingComment] = useState(null)
  const [editedCommentContent, setEditedCommentContent] = useState('')

  // Refs
  const commentsListRef = useRef(null)
  const mainContentRef = useRef(null)
  const sidebarRef = useRef(null)

  // Check if user is super admin
  const isSuperAdmin = currentUser?.email === 'super@admin.com' ||
      currentUser?.roles?.includes('super') ||
      currentUser?.permissions?.includes('all')

  // Default board names that should always be visible
  const defaultBoardNames = ['todo', 'inProgress', 'completed']

  // Priority options
  const priorityOptions = [
    { value: 0, label: 'Low', color: 'success', icon: Flag },
    { value: 1, label: 'Medium', color: 'warning', icon: TrendingUp },
    { value: 2, label: 'High', color: 'danger', icon: Zap }
  ]

  // Load boards and filter based on user permissions
  const loadBoards = async () => {
    try {
      const response = await boardService.getBoards()
      if (response.success) {
        const allBoards = response.data.boards || []
        setBoards(allBoards)

        // If we have userAccessibleBoards from parent, use them
        // Otherwise, filter boards locally
        if (userAccessibleBoards && userAccessibleBoards.length > 0) {
          setVisibleBoards(userAccessibleBoards)
        } else {
          // Fallback: filter boards based on current user
          const filteredBoards = allBoards.filter(board => {
            // Always show default boards
            if (defaultBoardNames.includes(board.name)) {
              return true
            }
            // Super admins see all boards
            if (isSuperAdmin) {
              return true
            }
            // For non-super admin, we can't determine access without task data
            // So we'll show a limited set or all boards as fallback
            return true
          })
          setVisibleBoards(filteredBoards)
        }
      }
    } catch (error) {
      console.error('Error loading boards:', error)
    }
  }

  // Update visible boards when userAccessibleBoards changes
  useEffect(() => {
    if (userAccessibleBoards && userAccessibleBoards.length > 0) {
      setVisibleBoards(userAccessibleBoards)
    }
  }, [userAccessibleBoards])

  // Helper functions
  const getStatusDisplayName = (status) => {
    if (!status) return 'Unknown'
    if (status === 'inProgress') return 'In Progress'
    if (status === 'todo') return 'To Do'
    return status.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
  }

  const getStatusColor = (status, boardId) => {
    if (boardId) {
      const board = boards.find(b => b.id === boardId)
      if (board && board.color) {
        return board.color
      }
    }
    switch (status) {
      case 'completed': return '#28a745'
      case 'inProgress': return '#ffc107'
      case 'todo': return '#6c757d'
      default: return '#6c757d'
    }
  }
  const handleAttachmentsCountChange = (count) => {
    setAttachmentsCount(count)
  }

  const formatTaskDate = (dateString) => {
    if (!dateString) return 'No date set'
    const date = new Date(dateString)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    return isToday ? `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }

  const formatCommentDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    const diffDays = Math.ceil(Math.abs(now - date) / (1000 * 60 * 60 * 24))

    if (isToday) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    } else if (diffDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    } else if (diffDays <= 7) {
      return `${date.toLocaleDateString('en-US', { weekday: 'long' })} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    } else {
      return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    }
  }

  const formatDueDate = (dateString) => {
    if (!dateString) return 'No due date'
    const date = new Date(dateString)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    const isTomorrow = new Date(now.setDate(now.getDate() + 1)).toDateString() === date.toDateString()

    if (isToday) return 'Today'
    if (isTomorrow) return 'Tomorrow'
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const scrollToBottom = () => {
    if (commentsListRef.current) {
      commentsListRef.current.scrollTop = commentsListRef.current.scrollHeight
    }
  }

  const canRemoveAssignee = (assigneeId) => {
    if (!taskData || !currentUser) return false
    if (currentUser.roles?.includes('super')) return true
    if (currentUser.id === taskData.user_id) return !superAdminIds.includes(assigneeId)
    return false
  }

  const canAddAssignees = () => {
    if (!taskData || !currentUser) return false
    return currentUser.id === taskData.user_id || currentUser.roles?.includes('super')
  }

  const getCreatorInfo = () => {
    if (!taskData) return null
    if (taskData.user && taskData.user.name) return taskData.user
    if (taskData.creator_name) {
      return { name: taskData.creator_name, email: taskData.creator_email }
    }
    const creator = availableUsers.find(user => user.id === taskData.user_id)
    return creator || { name: `User #${taskData.user_id}`, email: '' }
  }

  const isCurrentUserCreator = currentUser && taskData && taskData.user_id === currentUser.id
  const isCurrentUserAssignee = currentUser && taskData && taskData.assignees && taskData.assignees.includes(currentUser.id)

  // Comment handlers
  const handleUpdateComment = async (commentId, content) => {
    if (!content.trim()) return
    try {
      const response = await taskService.updateComment(task.id, commentId, content)
      if (response.success) {
        setTaskData(response.data.task)
        setEditingComment(null)
        setEditedCommentContent('')
        onUpdate(response.data.task)
      }
    } catch (error) {
      console.error('Error updating comment:', error)
    }
  }

  const confirmDeleteComment = async () => {
    if (!commentToDelete) return
    try {
      const response = await taskService.deleteComment(task.id, commentToDelete)
      if (response.success) {
        setTaskData(response.data.task)
        onUpdate(response.data.task)
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
    } finally {
      setDeleteModal(false)
      setCommentToDelete(null)
    }
  }

  const handleDeleteComment = async (commentId) => {
    setDeleteModal(true)
    setCommentToDelete(commentId)
  }

  const startEditingComment = (comment) => {
    setEditingComment(comment.id)
    setEditedCommentContent(comment.content)
  }

  const cancelEditingComment = () => {
    setEditingComment(null)
    setEditedCommentContent('')
  }

  const loadTaskDetails = async () => {
    try {
      setLoading(true)
      const response = await taskService.getTask(task.id)
      if (response.success) {
        setTaskData(response.data.task)
        setAttachmentsCount(response.data.task.attachments_count || 0)
        setUsers(availableUsers)
      }
    } catch (error) {
      console.error('Error loading task details:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (task && isOpen) {
      loadTaskDetails()
      loadBoards()
    }
  }, [task, isOpen])

  useEffect(() => {
    if (isOpen && taskData?.comments) {
      setTimeout(() => scrollToBottom(), 100)
    }
  }, [taskData?.comments, isOpen])

  useEffect(() => {
    if (taskData?.comments && commentsListRef.current) {
      scrollToBottom()
    }
  }, [taskData?.comments?.length])

  // Main action handlers
  const handleTogglePublic = async () => {
    if (!taskData) return
    try {
      const response = await taskService.togglePublic(task.id, { is_public: !taskData.is_public })
      if (response.success) {
        setTaskData(response.data.task)
        onUpdate(response.data.task)
      }
    } catch (error) {
      console.error('Error toggling public status:', error)
    }
  }

  const handleAddAssignee = async (userId) => {
    try {
      const response = await taskService.addAssignee(task.id, userId)
      if (response.success) {
        setTaskData(response.data.task)
        onUpdate(response.data.task)
      }
    } catch (error) {
      console.error('Error adding assignee:', error)
    }
  }

  const handleRemoveAssignee = async (userId) => {
    try {
      const response = await taskService.removeAssignee(task.id, userId)
      if (response.success) {
        setTaskData(response.data.task)
        onUpdate(response.data.task)
      }
    } catch (error) {
      console.error('Error removing assignee:', error)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    try {
      const response = await taskService.addComment(task.id, newComment)
      if (response.success) {
        setTaskData(response.data.task)
        setNewComment('')
        onUpdate(response.data.task)
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const handleStatusChange = async (newStatus) => {
    try {
      const selectedBoard = boards.find(board => board.name === newStatus)
      if (!selectedBoard) {
        console.error('No board found for status:', newStatus)
        return
      }

      let response
      const isDefaultCompletedBoard = selectedBoard.name === 'completed' && selectedBoard.is_default

      if (isDefaultCompletedBoard && taskData.status !== 'completed') {
        response = await taskService.completeTask(task.id)
      } else if (!isDefaultCompletedBoard && taskData.status === 'completed') {
        response = await taskService.reopenTask(task.id)
        if (response.success) {
          response = await taskService.updateTask(task.id, {
            status: newStatus,
            board_id: selectedBoard.id
          })
        }
      } else {
        response = await taskService.updateTask(task.id, {
          status: newStatus,
          board_id: selectedBoard.id
        })
      }

      if (response.success) {
        setTaskData(response.data.task)
        onUpdate(response.data.task)
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handlePriorityChange = async (newPriority) => {
    try {
      const response = await taskService.updateTask(task.id, { priority: parseInt(newPriority) })
      if (response.success) {
        setTaskData(response.data.task)
        onUpdate(response.data.task)
      }
    } catch (error) {
      console.error('Error updating priority:', error)
    }
  }

  const handleDeleteTask = async () => {
    setTaskDeleteModal(true)
  }

  const confirmDeleteTask = async () => {
    try {
      const response = await taskService.deleteTask(task.id)
      if (response.success) {
        onUpdate(null)
        toggle()
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    } finally {
      setTaskDeleteModal(false)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 2: return 'danger'
      case 1: return 'warning'
      default: return 'success'
    }
  }

  const getPriorityText = (priority) => {
    switch (priority) {
      case 2: return 'High'
      case 1: return 'Medium'
      default: return 'Low'
    }
  }

  const getCurrentPriorityOption = () => {
    return priorityOptions.find(option => option.value === taskData?.priority) || priorityOptions[0]
  }

  const getCurrentBoard = () => {
    if (!taskData || !boards.length) return null
    return boards.find(board => board.id === taskData.board_id) || boards.find(board => board.name === taskData.status)
  }

  const handleTaskUpdate = (updatedTask) => {
    if (onUpdate) {
      onUpdate(task.id, updatedTask)
    }
  }

  if (!taskData) return null

  const currentPriority = getCurrentPriorityOption()
  const currentBoard = getCurrentBoard()
  const creatorInfo = getCreatorInfo()

  return (
      <>
        <Modal
            isOpen={isOpen}
            toggle={toggle}
            size="lg"
            className="task-modal modern-modal fixed-modal"
            centered
            style={{ maxWidth: '1200px', width: '95%', height: '90vh' }}
        >
          <ModalHeader className="modern-modal-header fixed-modal-header">
            <div className="d-flex align-items-start w-100 justify-content-between">
              <div className="task-title-section flex-grow-1 me-3">
                <div className="d-flex align-items-center mb-2">
                  <Input
                      type="text"
                      value={taskData.title}
                      onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                      onBlur={() => taskService.updateTask(task.id, { title: taskData.title })}
                      className="modern-task-title border-0 p-0 me-3"
                      placeholder="Task title..."
                      style={{ fontSize: '1.5rem', fontWeight: '600' }}
                  />
                </div>

                <div className="task-meta-info">
                  <div className="d-flex flex-wrap align-items-center gap-3 text-muted small">
                    <div className="d-flex align-items-center">
                      <Calendar size={14} className="me-1" />
                      <span>Created {formatTaskDate(taskData.created_at)}</span>
                    </div>

                    {taskData.updated_at && taskData.updated_at !== taskData.created_at && (
                        <div className="d-flex align-items-center">
                          <span>• Updated {formatTaskDate(taskData.updated_at)}</span>
                        </div>
                    )}

                    {taskData.due_date && (
                        <div className="d-flex align-items-center text-warning fw-medium">
                          <span>• Due {formatDueDate(taskData.due_date)}</span>
                        </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="menu-section flex-shrink-0">
                <div className="task-header-badges d-flex align-items-center gap-2">
                  <Badge
                      color={getPriorityColor(taskData.priority)}
                      className="priority-badge d-flex align-items-center"
                  >
                    <currentPriority.icon size={14} className="me-1" />
                    {getPriorityText(taskData.priority)}
                  </Badge>

                  <Badge
                      color="custom"
                      style={{
                        backgroundColor: getStatusColor(taskData.status, taskData.board_id),
                        color: 'white'
                      }}
                      className="status-badge text-capitalize"
                  >
                    {getStatusDisplayName(taskData.status)}
                  </Badge>

                  <Dropdown isOpen={menuOpen} toggle={() => setMenuOpen(!menuOpen)}>
                    <DropdownToggle tag="span" className="cursor-pointer modern-menu-toggle">
                      <MoreVertical size={18} />
                    </DropdownToggle>
                    <DropdownMenu end>
                      <DropdownItem onClick={handleDeleteTask}>
                        <Trash2 size={14} className="me-2" />
                        Delete Task
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>

                  <Button
                      color="link"
                      onClick={toggle}
                      className="p-0 modern-close-btn"
                      style={{ lineHeight: 1 }}
                  >
                    <X size={20} />
                  </Button>
                </div>
              </div>
            </div>
          </ModalHeader>

          <ModalBody className="modern-modal-body fixed-modal-body p-0">
            <div className="modal-tabs border-bottom bg-white px-3 pt-1">
              <div className="d-flex">
                <Button
                    color="link"
                    className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
                    onClick={() => setActiveTab('details')}
                >
                  Details
                </Button>
                <Button
                    color="link"
                    className={`tab-button ${activeTab === 'comments' ? 'active' : ''}`}
                    onClick={() => setActiveTab('comments')}
                >
                  <MessageSquare size={16} className="me-1" />
                  Comments ({taskData.comments?.length || 0})
                </Button>
                <Button
                    color="link"
                    className={`tab-button ${activeTab === 'attachments' ? 'active' : ''}`}
                    onClick={() => setActiveTab('attachments')}
                >
                  <Paperclip size={16} className="me-1" />
                  Attachments ({attachmentsCount})
                </Button>
              </div>
            </div>

            <Row className="h-100 m-0">
              <Col lg={8} className="main-content h-100 p-0">
                <div
                    ref={mainContentRef}
                    className="scrollable-content h-100 p-1"
                    style={{ overflowY: 'auto', minHeight: '400px' }}
                >
                  {activeTab === 'details' && (
                      <>
                        <Card className="mb-3 modern-card">
                          <CardBody>
                            <Label className="fw-semibold text-muted mb-2 d-block">Description</Label>
                            {isEditingDescription ? (
                                <Input
                                    type="textarea"
                                    rows={4}
                                    value={taskData.description || ''}
                                    onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                                    onBlur={() => {
                                      taskService.updateTask(task.id, { description: taskData.description })
                                      setIsEditingDescription(false)
                                    }}
                                    placeholder="Add a description for this task..."
                                    className="modern-textarea border-0 bg-light"
                                    autoFocus
                                />
                            ) : (
                                <div
                                    className="description-view bg-light p-2 rounded"
                                    style={{ whiteSpace: 'pre-line', minHeight: '100px', cursor: 'pointer' }}
                                    onClick={() => setIsEditingDescription(true)}
                                >
                                  {taskData.description ? (
                                      <Linkify text={taskData.description} />
                                  ) : (
                                      <span className="text-muted">Click to add a description...</span>
                                  )}
                                </div>
                            )}
                          </CardBody>
                        </Card>

                        <Card className="mb-3 modern-card priority-section">
                          <CardBody>
                            <Label className="fw-semibold text-muted mb-2 d-block">
                              <Activity size={16} className="me-2" />
                              Priority
                            </Label>
                            <div className="d-flex gap-2 flex-wrap">
                              {priorityOptions.map((option) => (
                                  <Button
                                      key={option.value}
                                      color={taskData.priority === option.value ? option.color : 'outline-secondary'}
                                      size="sm"
                                      onClick={() => handlePriorityChange(option.value)}
                                      className="d-flex align-items-center"
                                  >
                                    <option.icon size={14} className="me-1" />
                                    {option.label}
                                  </Button>
                              ))}
                            </div>
                          </CardBody>
                        </Card>

                        <Card className="mb-3 modern-card">
                          <CardBody>
                            <Label className="fw-semibold text-muted mb-2 d-block">Quick Actions</Label>
                            <div className="d-flex flex-wrap gap-3">
                              {/* UPDATED: Status dropdown with properly filtered boards */}
                              <div className="action-item">
                                <Label className="small text-muted mb-1">Status</Label>
                                <Input
                                    type="select"
                                    value={taskData.status}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    className="modern-select"
                                >
                                  {visibleBoards.map((board) => (
                                      <option key={board.id} value={board.name}>
                                        {getStatusDisplayName(board.name)}
                                        {board.is_default ? ' (Default)' : ' (Custom)'}
                                      </option>
                                  ))}
                                </Input>
                                {currentBoard && (
                                    <div className="small text-muted mt-1 d-flex align-items-center">
                                      <div
                                          className="color-indicator me-2"
                                          style={{
                                            backgroundColor: currentBoard.color,
                                            width: '12px',
                                            height: '12px',
                                            borderRadius: '2px'
                                          }}
                                      ></div>
                                      <span>
                                  {currentBoard.is_default ? 'Default Board' : 'Custom Board'} • {currentBoard.tasks_count || 0} tasks
                                </span>
                                    </div>
                                )}
                                {!isSuperAdmin && (
                                    <small className="text-info mt-1 d-block">
                                      <Info size={12} className="me-1" />
                                      Only showing boards with your tasks
                                    </small>
                                )}
                              </div>

                              <div className="action-item">
                                <Label className="small text-muted mb-1">Due Date</Label>
                                <Input
                                    type="date"
                                    value={taskData.due_date ? taskData.due_date.split('T')[0] : ''}
                                    onChange={(e) => {
                                      const newDate = e.target.value ? new Date(e.target.value).toISOString() : null
                                      setTaskData({ ...taskData, due_date: newDate })
                                      taskService.updateTask(task.id, { due_date: newDate })
                                    }}
                                    className="modern-select"
                                />
                                {taskData.due_date && (
                                    <div className="small text-muted mt-1">
                                      <Calendar size={12} className="me-1" />
                                      {formatDueDate(taskData.due_date)}
                                    </div>
                                )}
                              </div>

                              <div className="action-item">
                                <Label className="small text-muted mb-1">Visibility</Label>
                                <div className="d-flex align-items-center">
                                  <Button
                                      color={taskData.is_public ? "success" : "secondary"}
                                      size="sm"
                                      onClick={handleTogglePublic}
                                      className="d-flex align-items-center modern-toggle-btn"
                                  >
                                    {taskData.is_public ? (
                                        <>
                                          <Eye size={14} className="me-1" />
                                          Public
                                        </>
                                    ) : (
                                        <>
                                          <EyeOff size={14} className="me-1" />
                                          Private
                                        </>
                                    )}
                                  </Button>
                                </div>
                                <small className="text-muted mt-1 d-block">
                                  {taskData.is_public ? "Visible to all users" : "Only assigned users"}
                                </small>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      </>
                  )}

                  {activeTab === 'comments' && (
                      <div className="comments-container h-100 d-flex flex-column">
                        <div
                            ref={commentsListRef}
                            className="comments-list flex-grow-1 p-1"
                            style={{ overflowY: 'auto', minHeight: '200px' }}
                        >
                          {taskData.comments?.map((comment, index) => (
                              <div key={index} className="comment-item mb-1">
                                <div className="d-flex align-items-start">
                                  <div className="comment-avatar me-3 flex-shrink-0">
                                    <div className="avatar-circle bg-primary text-white d-flex align-items-center justify-content-center">
                                      {comment.user_name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                  </div>

                                  <div className="comment-content flex-grow-1">
                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                      <div className="d-flex align-items-center">
                                        <strong className="comment-author me-2 ml-1">
                                          {comment.user_name}
                                          {currentUser && comment.user_id === currentUser.id && (
                                              <span className="text-primary ms-1">(me)</span>
                                          )}
                                        </strong>
                                        <small className="text-muted comment-time ml-1">
                                          {formatCommentDate(comment.created_at)}
                                          {comment.edited && <span className="ms-1 text-muted">• edited</span>}
                                        </small>
                                      </div>

                                      {currentUser && comment.user_id === currentUser.id && (
                                          <div className="d-flex">
                                            {editingComment === comment.id ? (
                                                <>
                                                  <Button
                                                      color="primary"
                                                      size="sm"
                                                      className="me-1 action-btn"
                                                      onClick={() => handleUpdateComment(comment.id, editedCommentContent)}
                                                  >
                                                    <Check size={12} />
                                                  </Button>
                                                  <Button
                                                      color="secondary"
                                                      size="sm"
                                                      onClick={cancelEditingComment}
                                                      className="action-btn"
                                                  >
                                                    <XIcon size={12} />
                                                  </Button>
                                                </>
                                            ) : (
                                                <>
                                                  <Button
                                                      color="link"
                                                      size="sm"
                                                      className="text-secondary p-1 me-1"
                                                      onClick={() => startEditingComment(comment)}
                                                  >
                                                    <Edit size={12} />
                                                  </Button>
                                                  <Button
                                                      color="link"
                                                      size="sm"
                                                      className="p-1"
                                                      onClick={() => handleDeleteComment(comment.id)}
                                                  >
                                                    <Trash2 size={12} />
                                                  </Button>
                                                </>
                                            )}
                                          </div>
                                      )}
                                    </div>

                                    {editingComment === comment.id ? (
                                        <div className="editing-comment">
                                          <Input
                                              type="textarea"
                                              rows={3}
                                              value={editedCommentContent}
                                              onChange={(e) => setEditedCommentContent(e.target.value)}
                                              className="modern-textarea mb-1"
                                              autoFocus
                                          />
                                        </div>
                                    ) : (
                                        <div className="comment-text bg-light p-1 rounded" style={{ whiteSpace: 'pre-line' }}>
                                          <Linkify text={comment.content} />
                                        </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                          ))}

                          {(!taskData.comments || taskData.comments.length === 0) && (
                              <div className="text-center text-muted py-5">
                                <MessageSquare size={48} className="mb-3 opacity-25" />
                                <h6 className="text-muted">No comments yet</h6>
                                <p className="small mb-0">Be the first to add a comment</p>
                              </div>
                          )}
                        </div>

                        <div className="add-comment-section border-top bg-white p-1">
                          <div className="comment-input-container">
                            <div className="d-flex align-items-start gap-2">
                              <div className="flex-grow-1">
                                <Input
                                    type="textarea"
                                    rows={3}
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Type your comment here..."
                                    className="modern-textarea"
                                    style={{ resize: 'none' }}
                                />
                              </div>
                              <Button
                                  color="primary"
                                  onClick={handleAddComment}
                                  disabled={!newComment.trim()}
                                  className="comment-submit-btn align-self-end"
                                  style={{ borderRadius: '8px', padding: '0.75rem 1.5rem' }}
                              >
                                <Send size={16} className="me-1" />
                                Send
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                  )}

                  {activeTab === 'attachments' && (
                      <div className="attachments-tab-content" style={{ minHeight: '400px' }}>
                        <AttachmentSection
                            task={taskData}
                            currentUser={currentUser}
                            onUpdate={handleTaskUpdate}
                            onAttachmentsCountChange={handleAttachmentsCountChange}
                        />
                      </div>
                  )}
                </div>
              </Col>

              <Col lg={4} className="sidebar h-100 p-0 border-start">
                <div
                    ref={sidebarRef}
                    className="scrollable-content h-100 p-3"
                    style={{ overflowY: 'auto' }}
                >
                  <div className="sticky-sidebar">
                    <Card className="modern-card mb-1">
                      <CardBody>
                        <h6 className="sidebar-title mb-1">Task Information</h6>

                        <div className="info-item mb-2">
                          <Label className="small text-muted mb-1">Created By</Label>
                          <div className="creator-info d-flex align-items-center p-2 bg-light rounded">
                            <Badge color="primary" className="user-avatar me-2">
                              {creatorInfo?.name?.charAt(0) || 'U'}
                            </Badge>
                            <div>
                              <div className="fw-medium">
                                {creatorInfo?.name || 'Unknown'}
                                {isCurrentUserCreator && <span className="text-primary"> (me)</span>}
                              </div>
                              {creatorInfo?.email && (
                                  <div className="small text-muted">{creatorInfo.email}</div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="info-item">
                          <Label className="small text-muted mb-1 d-flex justify-content-between align-items-center">
                            <span>Assignees</span>
                            {canAddAssignees() && !taskData.is_public && (
                                <Dropdown
                                    isOpen={assigneeDropdownOpen}
                                    toggle={() => setAssigneeDropdownOpen(!assigneeDropdownOpen)}
                                    direction="start"
                                >
                                  <DropdownToggle color="link" size="sm" className="text-primary p-0">
                                    <Plus size={14} />
                                  </DropdownToggle>
                                  <DropdownMenu
                                      style={{
                                        position: 'fixed',
                                        top: 'auto',
                                        bottom: '90px',
                                        right: '90px',
                                        left: 'auto',
                                        maxHeight: '300px',
                                        overflowY: 'auto',
                                        zIndex: 9999
                                      }}
                                  >
                                    {users
                                        .filter(user => user.id !== taskData.user_id)
                                        .map(user => (
                                            <DropdownItem
                                                key={user.id}
                                                onClick={() => handleAddAssignee(user.id)}
                                                disabled={taskData.assignees?.includes(user.id)}
                                            >
                                              <div className="d-flex align-items-center">
                                                <Badge color="secondary" className="me-2 small-avatar">
                                                  {user.name?.charAt(0)}
                                                </Badge>
                                                <div>
                                                  <div>{user.name}</div>
                                                  <small className="text-muted">{user.email}</small>
                                                </div>
                                              </div>
                                            </DropdownItem>
                                        ))}
                                  </DropdownMenu>
                                </Dropdown>
                            )}
                          </Label>

                          <div className="assignees-list">
                            {taskData.is_public ? (
                                <div className="public-assignees text-center p-0 bg-opacity-10 rounded border">
                                  <Users size={20} className="text-success mb-0" />
                                  <div className="small fw-medium text-success">Public Task</div>
                                  <div className="small text-muted text-center">All users can access</div>
                                </div>
                            ) : (
                                <div className="private-assignees">
                                  {taskData.assignees && taskData.assignees.length > 0 ? (
                                      taskData.assignees.map(assigneeId => {
                                        const user = users.find(u => u.id === assigneeId)
                                        if (!user) return null
                                        const isMe = currentUser && user.id === currentUser.id
                                        const isSuperAdmin = superAdminIds.includes(user.id)
                                        return (
                                            <div
                                                key={assigneeId}
                                                className={`assignee-item d-flex align-items-center justify-content-between p-2 mb-2 bg-light rounded ${isSuperAdmin ? 'super-admin' : ''}`}
                                            >
                                              <div className="d-flex align-items-center">
                                                <div className={`avatar me-2 ${isSuperAdmin ? 'super-admin-avatar' : 'regular-avatar'}`}>
                                                  {user.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                  <div className="small fw-medium">
                                                    {user.name}
                                                    {isMe && <span className="text-primary"> (me)</span>}
                                                  </div>
                                                  <div className="small text-muted">{user.email}</div>
                                                </div>
                                              </div>
                                              {canRemoveAssignee(assigneeId) && (
                                                  <Button
                                                      color="link"
                                                      size="sm"
                                                      className="text-danger p-0"
                                                      onClick={() => handleRemoveAssignee(assigneeId)}
                                                  >
                                                    <X size={14} />
                                                  </Button>
                                              )}
                                            </div>
                                        )
                                      })
                                  ) : (
                                      <div className="text-center text-muted p-3 bg-light rounded border">
                                        <User size={20} className="mb-2 opacity-50" />
                                        <div className="small">No assignees</div>
                                      </div>
                                  )}
                                </div>
                            )}
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </div>
              </Col>
            </Row>
          </ModalBody>
        </Modal>

        {/* Delete Comment Modal */}
        <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)} size="sm" className="modern-modal">
          <ModalHeader toggle={() => setDeleteModal(false)} className="modern-modal-header">
            <Trash2 size={16} className="me-2" color='primary' />
            Delete Comment
          </ModalHeader>
          <ModalBody>
            <div className="text-center">
              <AlertCircle size={32} className="r mb-1" />
              <p className="mb-1">Are you sure you want to delete this comment?</p>
              <p className="small text-muted">This action cannot be undone.</p>
            </div>
          </ModalBody>
          <ModalFooter className="justify-content-center">
            <Button color="secondary" onClick={() => setDeleteModal(false)} className="modern-btn">Cancel</Button>
            <Button color="primary" onClick={confirmDeleteComment} className="modern-btn">
              <Trash2 size={14} className="me-1" />Delete
            </Button>
          </ModalFooter>
        </Modal>

        {/* Delete Task Modal */}
        <Modal isOpen={taskDeleteModal} toggle={() => setTaskDeleteModal(false)} className="modern-modal">
          <ModalHeader toggle={() => setTaskDeleteModal(false)} className="modern-modal-header">
            <Trash2 size={16} className="me-2" color='primary' />
            Delete Task
          </ModalHeader>
          <ModalBody>
            <div className="text-center">
              <AlertCircle size={32} className="mb-0" color='primary'/>
              <p className="mb-1">Are you sure you want to delete this task?</p>
              <div className="alert alert-warning p-1 mb-1 text-start">
                <strong>{taskData.title}</strong>
                {taskData.description && (
                    <div className="mt-0 small">{taskData.description.substring(0, 100)}...</div>
                )}
                <div className="mt-1 small text-muted">
                  Created: {taskData.created_at ? formatTaskDate(taskData.created_at) : 'Unknown'}
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="justify-content-center">
            <Button color="secondary" onClick={() => setTaskDeleteModal(false)} className="modern-btn">Cancel</Button>
            <Button color="primary" onClick={confirmDeleteTask} className="modern-btn">
              <Trash2 size={14} className="me-1" />Delete Task
            </Button>
          </ModalFooter>
        </Modal>
      </>
  )
}

export default TaskModal