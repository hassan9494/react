// src/views/task-manager/BoardManager.js - Complete version

import React, { useState, useEffect } from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  Table,
  Button,
  Input,
  FormGroup,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Badge,
  Alert,
  Spinner,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from 'reactstrap'
import { Plus, Edit, Trash2, Save, X, MoreVertical, Image, Trash, RefreshCw  } from 'react-feather'
import { boardService } from './../../services/boardService'
import DeletedBoards from './DeletedBoards'
import classnames from 'classnames'

const BoardManager = () => {
  const [boards, setBoards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [editingBoard, setEditingBoard] = useState(null)
  const [formData, setFormData] = useState({ name: '', color: '#6c757d' })
  const [actionLoading, setActionLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('1')

  const defaultColors = [
    '#6c757d', '#007bff', '#28a745', '#dc3545', '#ffc107',
    '#17a2b8', '#6f42c1', '#e83e8c', '#fd7e14', '#20c997'
  ]

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }

  const clearMessages = () => {
    setTimeout(() => {
      setError(null)
      setSuccess(null)
    }, 5000)
  }

  const loadBoards = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await boardService.getBoards()

      if (response.success) {
        setBoards(response.data.boards || [])
      } else {
        setError(response.message || 'Failed to load boards')
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to load boards. Please try again.'
      setError(errorMessage)
      console.error('Error loading boards:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingBoard(null)
    setFormData({ name: '', color: '#6c757d' })
    setModalOpen(true)
  }

  const handleEdit = (board) => {
    if (board.is_default) {
      setError('Cannot edit default boards')
      clearMessages()
      return
    }
    setEditingBoard(board)
    setFormData({ name: board.name, color: board.color })
    setModalOpen(true)
  }

  const handleDelete = (board) => {
    if (board.is_default) {
      setError('Cannot delete default boards')
      clearMessages()
      return
    }
    setEditingBoard(board)
    setDeleteModal(true)
  }

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError('Board name is required')
      clearMessages()
      return
    }

    try {
      setActionLoading(true)
      let response

      if (editingBoard) {
        response = await boardService.updateBoard(editingBoard.id, formData)
      } else {
        response = await boardService.createBoard(formData)
      }

      if (response.success) {
        setSuccess(editingBoard ? 'Board updated successfully!' : 'Board created successfully!')
        setModalOpen(false)
        setEditingBoard(null)
        setFormData({ name: '', color: '#6c757d' })
        loadBoards()
        clearMessages()
      } else {
        setError(response.message || 'Failed to save board')
        clearMessages()
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to save board'
      setError(errorMessage)
      clearMessages()
    } finally {
      setActionLoading(false)
    }
  }

  const confirmDelete = async () => {
    try {
      setActionLoading(true)
      const response = await boardService.deleteBoard(editingBoard.id)

      if (response.success) {
        setSuccess('Board deleted successfully!')
        setDeleteModal(false)
        setEditingBoard(null)
        loadBoards()
        clearMessages()
      } else {
        setError(response.message || 'Failed to delete board')
        clearMessages()
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete board'
      setError(errorMessage)
      clearMessages()
    } finally {
      setActionLoading(false)
    }
  }

  const handleColorSelect = (color) => {
    setFormData({ ...formData, color })
  }

  useEffect(() => {
    loadBoards()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardBody className="text-center">
          <Spinner color="primary" />
          <div className="mt-2">Loading boards...</div>
        </CardBody>
      </Card>
    )
  }

  return (
    <div className="board-manager">
      <Card>
        {/* <CardHeader>
          <h4 className="mb-0">Board Management</h4>
          <small className="text-muted">Only Super Admins can manage boards</small>
        </CardHeader> */}

        <CardBody className="p-0">
          <Nav tabs className="px-3 pt-1">
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '1' })}
                onClick={() => toggleTab('1')}
              >
                Active Boards
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '2' })}
                onClick={() => toggleTab('2')}
              >
                <Trash size={14} className="me-1" />
                Deleted Boards
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <div className="px-3 py-1">
          <div className="d-flex justify-content-between align-items-center mb-3">
  <div>
    <h5 className="mb-0">Active Boards</h5>
    <small className="text-muted">Manage your active boards</small>
  </div>
  <div>
    <Button 
      color="primary" 
      size="sm" 
      onClick={loadBoards} 
      disabled={loading}
      className="me-0"
    >
      <RefreshCw size={14} className="me-1" />
      
    </Button>
    <Button color="secondary" size="sm" onClick={handleCreate}>
      <Plus size={14} className="me-1" />
      New Board
    </Button>
  </div>
</div>

                {error && (
                  <Alert color="primary">
                    <h4 className="alert-heading">Error</h4>
                    <p className="mb-0">{error}</p>
                  </Alert>
                )}

                {success && (
                  <Alert color="success">
                    <strong>Success!</strong> {success}
                  </Alert>
                )}

                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th width="50"></th>
                        <th>Name</th>
                        {/* <th>Color</th> */}
                        <th>Type</th>
                        <th>Tasks</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {boards.map((board) => (
                        <tr key={board.id}>
                          <td>
                            <MoreVertical size={16} className="text-muted" />
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div 
                                className="color-indicator me-2"
                                style={{
                                  backgroundColor: board.color,
                                  width: '16px',
                                  height: '16px',
                                  borderRadius: '4px'
                                }}
                              ></div>
                              <strong>{board.name}</strong>
                            </div>
                          </td>
                          {/* <td>
                            <code>{board.color}</code>
                          </td> */}
                          <td>
                            {board.is_default ? (
                              <Badge color="secondary">Default</Badge>
                            ) : (
                              <Badge color="primary">Custom</Badge>
                            )}
                          </td>
                          <td>
                            <Badge color="secondary" pill>
                              {board.tasks_count || 0} tasks
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex">
                              {!board.is_default && (
                                <>
                                  <Button
                                    color="primary"
                                    size="sm"
                                    className="me-1"
                                    onClick={() => handleEdit(board)}
                                  >
                                    <Edit size={12} />
                                  </Button>
                                  <Button
                                    color="primary"
                                    size="sm"
                                    onClick={() => handleDelete(board)}
                                    disabled={board.tasks_count > 0}
                                    title={board.tasks_count > 0 ? 'Cannot delete board with tasks' : 'Delete board'}
                                  >
                                    <Trash2 size={12} />
                                  </Button>
                                </>
                              )}
                              {board.is_default && (
                                <span className="text-muted small">System Board</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                {boards.length === 0 && (
                  <div className="text-center py-5 text-muted">
                    <div className="mb-3">
                      <Image size={48} className="opacity-25" />
                    </div>
                    <h5>No boards found</h5>
                    <p>Create your first custom board to get started</p>
                  </div>
                )}
              </div>
            </TabPane>

            <TabPane tabId="2">
              <DeletedBoards />
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>

      {/* Create/Edit Modal */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)}>
        <ModalHeader toggle={() => setModalOpen(false)}>
          {editingBoard ? 'Edit Board' : 'Create New Board'}
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="board-name">Board Name</Label>
            <Input
              id="board-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter board name (e.g., 'Review', 'Testing', 'Backlog')"
            />
          </FormGroup>

          <FormGroup>
            <Label for="board-color">Board Color</Label>
            <div className="mb-3">
              <div className="d-flex flex-wrap gap-2 mb-2">
                {defaultColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`color-option ${formData.color === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelect(color)}
                    title={color}
                  ></button>
                ))}
              </div>
              <Input
                id="board-color"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
            </div>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleSubmit} disabled={actionLoading}>
            {actionLoading ? <Spinner size="sm" /> : editingBoard ? 'Update' : 'Create'}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)}>
        <ModalHeader toggle={() => setDeleteModal(false)}>
          Delete Board
        </ModalHeader>
        <ModalBody>
          {editingBoard && (
            <div>
              <Alert color="primary">
                <h5 className="alert-heading">Warning!</h5>
                <p className="mb-0">
                  This action cannot be undone. The board will be permanently deleted.
                </p>
              </Alert>
              <p>Are you sure you want to delete this board?</p>
              <div className="alert alert-warning p-3">
                <div className="d-flex align-items-center">
                  <div 
                    className="color-indicator me-2"
                    style={{
                      backgroundColor: editingBoard.color,
                      width: '20px',
                      height: '20px',
                      borderRadius: '4px'
                    }}
                  ></div>
                  <strong>{editingBoard.name}</strong>
                </div>
                {editingBoard.tasks_count > 0 && (
                  <div className="mt-2 text-danger">
                    <strong>Warning:</strong> This board contains {editingBoard.tasks_count} task(s). 
                    You must move or delete these tasks before deleting the board.
                  </div>
                )}
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setDeleteModal(false)} disabled={actionLoading}>
            Cancel
          </Button>
          <Button 
            color="primary" 
            onClick={confirmDelete} 
            disabled={actionLoading || editingBoard?.tasks_count > 0}
          >
            {actionLoading ? <Spinner size="sm" /> : 'Delete Board'}
          </Button>
        </ModalFooter>
      </Modal>

      <style jsx>{`
        .color-option {
          width: 30px;
          height: 30px;
          border: 2px solid transparent;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .color-option:hover {
          transform: scale(1.1);
        }
        .color-option.selected {
          border-color: #333;
          transform: scale(1.1);
        }
      `}</style>
    </div>
  )
}

export default BoardManager