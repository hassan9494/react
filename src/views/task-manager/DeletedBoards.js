// src/views/task-manager/DeletedBoards.js

import React, { useState, useEffect } from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  Table,
  Button,
  Badge,
  Alert,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap'
import { Trash2, RefreshCw, RotateCcw, Calendar, User, AlertCircle } from 'react-feather'
import { boardService } from './../../services/boardService'

const DeletedBoards = () => {
  const [deletedBoards, setDeletedBoards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [restoreModal, setRestoreModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedBoard, setSelectedBoard] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  const loadDeletedBoards = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await boardService.getTrashedBoards()

      if (response.success) {
        setDeletedBoards(response.data.boards || [])
      } else {
        setError(response.message || 'Failed to load deleted boards')
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to load deleted boards. Please try again.'
      setError(errorMessage)
      console.error('Error loading deleted boards:', err)
    } finally {
      setLoading(false)
    }
  }

  const clearMessages = () => {
    setTimeout(() => {
      setError(null)
      setSuccess(null)
    }, 5000)
  }

  const handleRestore = async (board) => {
    setSelectedBoard(board)
    setRestoreModal(true)
  }

  const confirmRestore = async () => {
    if (!selectedBoard) return

    try {
      setActionLoading(true)
      const response = await boardService.restoreBoard(selectedBoard.id)

      if (response.success) {
        setSuccess('Board restored successfully!')
        setDeletedBoards(prev => prev.filter(board => board.id !== selectedBoard.id))
        setRestoreModal(false)
        setSelectedBoard(null)
        clearMessages()
      } else {
        setError(response.message || 'Failed to restore board')
        clearMessages()
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to restore board'
      setError(errorMessage)
      clearMessages()
    } finally {
      setActionLoading(false)
    }
  }

  const handleForceDelete = async (board) => {
    setSelectedBoard(board)
    setDeleteModal(true)
  }

  const confirmForceDelete = async () => {
    if (!selectedBoard) return

    try {
      setActionLoading(true)
      const response = await boardService.forceDeleteBoard(selectedBoard.id)

      if (response.success) {
        setSuccess('Board permanently deleted!')
        setDeletedBoards(prev => prev.filter(board => board.id !== selectedBoard.id))
        setDeleteModal(false)
        setSelectedBoard(null)
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString()
  }

  useEffect(() => {
    loadDeletedBoards()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardBody className="text-center">
          <Spinner color="primary" />
          <div className="mt-2">Loading deleted boards...</div>
        </CardBody>
      </Card>
    )
  }

  return (
    <div className="deleted-boards">
      <Card>
        <CardHeader className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-0">Deleted Boards</h4>
            <small className="text-muted">Only visible to Super Admins</small>
          </div>
          <div className="d-flex align-items-center">
            <Badge color="dark" className="me-2">
              {deletedBoards.length} deleted board{deletedBoards.length !== 1 ? 's' : ''}
            </Badge>
            <Button color="primary" size="sm" onClick={loadDeletedBoards} disabled={loading}>
              <RefreshCw size={14} className={loading ? 'spinning' : ''} />
            </Button>
          </div>
        </CardHeader>

        <CardBody>
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

          {deletedBoards.length === 0 ? (
            <div className="text-center py-5">
              <Trash2 size={48} className="text-muted mb-3" />
              <h5>No deleted boards found</h5>
              <p className="text-muted">There are no boards in the trash.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    {/* <th>Color</th> */}
                    <th>Tasks</th>
                    <th>Deleted At</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deletedBoards.map((board) => (
                    <tr key={board.id}>
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
                        <Badge color="secondary" pill>
                          {board.tasks_count || 0} tasks
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Calendar size={14} className="me-1 text-danger" />
                          {formatDate(board.deleted_at)}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Calendar size={14} className="me-1 text-muted" />
                          {formatDate(board.created_at)}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex">
                          <Button
                            color="success"
                            size="sm"
                            className="me-1"
                            onClick={() => handleRestore(board)}
                            disabled={actionLoading}
                          >
                            <RotateCcw size={14} />
                          </Button>
                          <Button
                            color="primary"
                            size="sm"
                            onClick={() => handleForceDelete(board)}
                            disabled={actionLoading}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Restore Confirmation Modal */}
      <Modal isOpen={restoreModal} toggle={() => setRestoreModal(false)}>
        <ModalHeader toggle={() => setRestoreModal(false)}>
          Restore Board
        </ModalHeader>
        <ModalBody>
          {selectedBoard && (
            <div>
              <p>Are you sure you want to restore this board?</p>
              <div className="alert alert-info">
                <div className="d-flex align-items-center">
                  <div 
                    className="color-indicator me-2"
                    style={{
                      backgroundColor: selectedBoard.color,
                      width: '20px',
                      height: '20px',
                      borderRadius: '4px'
                    }}
                  ></div>
                  <strong>{selectedBoard.name}</strong>
                </div>
              </div>
              <div className="small text-muted">
                <div>Color: <code>{selectedBoard.color}</code></div>
                <div>Tasks: {selectedBoard.tasks_count || 0}</div>
                <div>Deleted: {formatDate(selectedBoard.deleted_at)}</div>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => setRestoreModal(false)} disabled={actionLoading}>
            Cancel
          </Button>
          <Button color="success" onClick={confirmRestore} disabled={actionLoading}>
            {actionLoading ? <Spinner size="sm" /> : 'Restore Board'}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Permanent Delete Confirmation Modal */}
      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)}>
        <ModalHeader toggle={() => setDeleteModal(false)}>
          Permanently Delete Board
        </ModalHeader>
        <ModalBody>
          {selectedBoard && (
            <div>
              <Alert color="primary">
                <h5 className="alert-heading">Warning!</h5>
                <p className="mb-0">
                  This action cannot be undone. The board will be permanently deleted from the system and cannot be restored.
                </p>
              </Alert>
              <p>Are you sure you want to permanently delete this board?</p>
              <div className="alert alert-warning">
                <div className="d-flex align-items-center">
                  <div 
                    className="color-indicator me-2"
                    style={{
                      backgroundColor: selectedBoard.color,
                      width: '20px',
                      height: '20px',
                      borderRadius: '4px'
                    }}
                  ></div>
                  <strong>{selectedBoard.name}</strong>
                </div>
              </div>
              <div className="small text-muted">
                <div>Color: <code>{selectedBoard.color}</code></div>
                <div>Tasks: {selectedBoard.tasks_count || 0}</div>
                <div>Deleted: {formatDate(selectedBoard.deleted_at)}</div>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setDeleteModal(false)} disabled={actionLoading}>
            Cancel
          </Button>
          <Button color="primary" onClick={confirmForceDelete} disabled={actionLoading}>
            {actionLoading ? <Spinner size="sm" /> : 'Permanently Delete'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default DeletedBoards