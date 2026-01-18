// src/views/task-manager/DeletedTasks.js
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
import { Trash2, RefreshCw, Eye, Calendar, User, Shield } from 'react-feather'
import { taskService } from './../../services/taskService'

const DeletedTasks = () => {
  const [deletedTasks, setDeletedTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [restoreModal, setRestoreModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  const loadDeletedTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await taskService.getDeletedTasks()

      if (response.success) {
        setDeletedTasks(response.data.tasks || [])
      } else {
        setError(response.message || 'Failed to load deleted tasks')
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to load deleted tasks. Please try again.'
      setError(errorMessage)
      console.error('Error loading deleted tasks:', err)
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

  const handleRestore = async (task) => {
    setSelectedTask(task)
    setRestoreModal(true)
  }

  const confirmRestore = async () => {
    if (!selectedTask) return

    try {
      setActionLoading(true)
      const response = await taskService.restoreTask(selectedTask.id)

      if (response.success) {
        setSuccess('Task restored successfully!')
        setDeletedTasks(prev => prev.filter(task => task.id !== selectedTask.id))
        setRestoreModal(false)
        setSelectedTask(null)
        clearMessages()
      } else {
        setError(response.message || 'Failed to restore task')
        clearMessages()
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to restore task'
      setError(errorMessage)
      clearMessages()
    } finally {
      setActionLoading(false)
    }
  }

  const handleForceDelete = async (task) => {
    setSelectedTask(task)
    setDeleteModal(true)
  }

  const confirmForceDelete = async () => {
    if (!selectedTask) return

    try {
      setActionLoading(true)
      const response = await taskService.forceDeleteTask(selectedTask.id)

      if (response.success) {
        setSuccess('Task permanently deleted!')
        setDeletedTasks(prev => prev.filter(task => task.id !== selectedTask.id))
        setDeleteModal(false)
        setSelectedTask(null)
        clearMessages()
      } else {
        setError(response.message || 'Failed to delete task')
        clearMessages()
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete task'
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

  const getStatusBadge = (status) => {
    const colors = {
      todo: 'secondary',
      inProgress: 'warning',
      completed: 'success'
    }
    return colors[status] || 'secondary'
  }

  useEffect(() => {
    loadDeletedTasks()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardBody className="text-center">
          <Spinner color="primary" />
          <div className="mt-2">Loading deleted tasks...</div>
        </CardBody>
      </Card>
    )
  }

  return (
    <div className="deleted-tasks">
      <Card>
        <CardHeader className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-0">Deleted Tasks</h4>
            <small className="text-muted">Only visible to Super Admins</small>
          </div>
          <div className="d-flex align-items-center">
            <Badge color="dark" className="me-2">
              {deletedTasks.length} deleted task{deletedTasks.length !== 1 ? 's' : ''}
            </Badge>
            <Button color="primary" size="sm" onClick={loadDeletedTasks} disabled={loading}>
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

          {deletedTasks.length === 0 ? (
            <div className="text-center py-5">
              <Trash2 size={48} className="text-muted mb-3" />
              <h5>No deleted tasks found</h5>
              <p className="text-muted">There are no tasks in the trash.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Creator</th>
                    <th>Deleted At</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deletedTasks.map((task) => (
                    <tr key={task.id}>
                      <td>
                        <div>
                          <strong>{task.title}</strong>
                          {task.description && (
                            <div className="text-muted small mt-1">
                              {task.description.substring(0, 100)}...
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <Badge color={getStatusBadge(task.status)}>
                          {task.status}
                        </Badge>
                      </td>
                      <td>
                        {task.user ? (
                          <div>
                            <div className="fw-bold">{task.user.name}</div>
                            <div className="small text-muted">{task.user.email}</div>
                          </div>
                        ) : (
                          <span className="text-muted">Unknown</span>
                        )}
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Calendar size={14} className="me-1 text-danger" />
                          {formatDate(task.deleted_at)}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Calendar size={14} className="me-1 text-muted" />
                          {formatDate(task.created_at)}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex">
                          <Button
                            color="success"
                            size="sm"
                            className="me-1"
                            onClick={() => handleRestore(task)}
                            disabled={actionLoading}
                          >
                            <RefreshCw size={14} />
                          </Button>
                          <Button
                            color="primary"
                            size="sm"
                            onClick={() => handleForceDelete(task)}
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
          Restore Task
        </ModalHeader>
        <ModalBody>
          {selectedTask && (
            <div>
              <p>Are you sure you want to restore this task?</p>
              <div className="alert alert-info">
                <strong>{selectedTask.title}</strong>
                {selectedTask.description && (
                  <div className="mt-1">{selectedTask.description.substring(0, 200)}...</div>
                )}
              </div>
              <div className="small text-muted">
                <div>Status: <Badge color={getStatusBadge(selectedTask.status)}>{selectedTask.status}</Badge></div>
                <div>Deleted: {formatDate(selectedTask.deleted_at)}</div>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => setRestoreModal(false)} disabled={actionLoading}>
            Cancel
          </Button>
          <Button color="success" onClick={confirmRestore} disabled={actionLoading}>
            {actionLoading ? <Spinner size="sm" /> : 'Restore Task'}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Permanent Delete Confirmation Modal */}
      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)}>
        <ModalHeader toggle={() => setDeleteModal(false)}>
          Permanently Delete Task
        </ModalHeader>
        <ModalBody>
          {selectedTask && (
            <div>
              <Alert color="primary">
                <h5 className="alert-heading">Warning!</h5>
                <p className="mb-0">
                  This action cannot be undone. The task will be permanently deleted from the system.
                </p>
              </Alert>
              <p>Are you sure you want to permanently delete this task?</p>
              <div className="alert alert-warning">
                <strong>{selectedTask.title}</strong>
                {selectedTask.description && (
                  <div className="mt-1">{selectedTask.description.substring(0, 200)}...</div>
                )}
              </div>
              <div className="small text-muted">
                <div>Status: <Badge color={getStatusBadge(selectedTask.status)}>{selectedTask.status}</Badge></div>
                <div>Creator: {selectedTask.user?.name || 'Unknown'}</div>
                <div>Deleted: {formatDate(selectedTask.deleted_at)}</div>
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

      <style jsx>{`
        .spinning {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default DeletedTasks