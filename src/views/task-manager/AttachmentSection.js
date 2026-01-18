// src/views/task-manager/AttachmentSection.js (Updated with time display)
import React, { useState, useEffect, useRef } from 'react'
import {
  Card,
  CardBody,
  Button,
  ListGroup,
  ListGroupItem,
  Badge,
  Alert,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap'
import {
  Paperclip,
  Download,
  Trash2,
  Image,
  Video,
  FileText,
  File,
  Upload,
  X
} from 'react-feather'
import { taskService } from './../../services/taskService'

const AttachmentSection = ({ task, currentUser, onUpdate, onAttachmentsCountChange }) => {
  const [attachments, setAttachments] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedAttachment, setSelectedAttachment] = useState(null)
  const fileInputRef = useRef(null)

  // Add useEffect to notify parent about attachments count changes
  useEffect(() => {
    if (onAttachmentsCountChange) {
      onAttachmentsCountChange(attachments.length)
    }
  }, [attachments.length, onAttachmentsCountChange])

  // Add this function to format the date with time
  const formatAttachmentDate = (dateString) => {
    if (!dateString) return 'Unknown date'
    
    const date = new Date(dateString)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString()
    
    if (isToday) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    } else if (isYesterday) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    } else {
      return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    }
  }

  const loadAttachments = async () => {
    if (!task) return
    
    try {
      setLoading(true)
      setError(null)
      const response = await taskService.getAttachments(task.id)
      
      if (response.success) {
        const attachmentsData = response.data.attachments || []
        setAttachments(attachmentsData)
        // Notify parent about the initial count
        if (onAttachmentsCountChange) {
          onAttachmentsCountChange(attachmentsData.length)
        }
      } else {
        setError(response.message || 'Failed to load attachments')
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to load attachments'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (attachment) => {
    try {
      setLoading(true)
      const response = await taskService.downloadAttachment(task.id, attachment.id)
      
      // Create blob from response
      const blob = new Blob([response.data], { 
        type: attachment.mime_type 
      })
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = attachment.original_name
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Download failed:', error)
      setError('Failed to download file')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (file) => {
    if (!task) return
    
    // Validate file size (100MB)
    if (file.size > 100 * 1024 * 1024) {
      setError('File size must be less than 100MB')
      return
    }

    try {
      setUploading(true)
      setError(null)
      const response = await taskService.uploadAttachment(task.id, file)
      
      if (response.success) {
        const updatedAttachments = [response.data.attachment, ...attachments]
        setAttachments(updatedAttachments)
        setSuccess('File uploaded successfully!')
        onUpdate?.(task)
        // Notify parent about the new count
        if (onAttachmentsCountChange) {
          onAttachmentsCountChange(updatedAttachments.length)
        }
      } else {
        setError(response.message || 'Failed to upload file')
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to upload file'
      setError(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteClick = (attachment) => {
    setSelectedAttachment(attachment)
    setDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedAttachment || !task) return
    
    try {
      const response = await taskService.deleteAttachment(task.id, selectedAttachment.id)
      
      if (response.success) {
        const updatedAttachments = attachments.filter(att => att.id !== selectedAttachment.id)
        setAttachments(updatedAttachments)
        setSuccess('File deleted successfully!')
        setDeleteModal(false)
        setSelectedAttachment(null)
        onUpdate?.(task)
        // Notify parent about the new count
        if (onAttachmentsCountChange) {
          onAttachmentsCountChange(updatedAttachments.length)
        }
      } else {
        setError(response.message || 'Failed to delete file')
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete file'
      setError(errorMessage)
    }
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      handleFileUpload(file)
    }
    // Reset file input
    event.target.value = ''
  }

  const getFileIcon = (attachment) => {
    const iconProps = { size: 16, className: 'me-2' }
    
    switch (attachment.file_icon) {
      case 'image':
        return <Image {...iconProps} className="text-success" />
      case 'video':
        return <Video {...iconProps} className="text-danger" />
      case 'pdf':
        return <FileText {...iconProps} className="text-danger" />
      case 'word':
        return <FileText {...iconProps} className="text-primary" />
      case 'excel':
        return <FileText {...iconProps} className="text-success" />
      case 'powerpoint':
        return <FileText {...iconProps} className="text-warning" />
      case 'document':
        return <FileText {...iconProps} className="text-info" />
      default:
        return <File {...iconProps} className="text-secondary" />
    }
  }

  // Check if current user uploaded the attachment
  const isMyAttachment = (attachment) => {
    return currentUser && attachment.user_id === currentUser.id
  }

  const canDeleteAttachment = (attachment) => {
    return currentUser?.id === attachment.user_id || currentUser?.roles?.includes('super')
  }

  const clearMessages = () => {
    setTimeout(() => {
      setError(null)
      setSuccess(null)
    }, 5000)
  }

  useEffect(() => {
    if (error || success) {
      clearMessages()
    }
  }, [error, success])

  useEffect(() => {
    if (task && task.id) {
      loadAttachments()
    }
  }, [task])

  if (!task) return null

  return (
    <div className="attachment-section ">
      <Card>
        {/* Always expanded content */}
        <CardBody>
          {error && (
            <Alert color="primary" className="py-2">
              <small>{error}</small>
            </Alert>
          )}

          {success && (
            <Alert color="success" className="py-2">
              <small>{success}</small>
            </Alert>
          )}

          {/* File Upload Area */}
          <div className="mb-3 p-3 border rounded bg-light">
            <div className="text-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                accept="*/*"
              />
              <Button
                color="primary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="d-flex align-items-center mx-auto"
              >
                {uploading ? (
                  <Spinner size="sm" className="me-2" />
                ) : (
                  <Upload size={14} className="me-2" />
                )}
                {uploading ? 'Uploading...' : 'Upload File'}
              </Button>
              <small className="text-muted d-block mt-1">
                Max file size: 100MB
              </small>
            </div>
          </div>

          {/* Attachments List */}
          {loading ? (
            <div className="text-center py-3">
              <Spinner size="sm" />
              <div className="mt-2">
                <small className="text-muted">Loading attachments...</small>
              </div>
            </div>
          ) : attachments.length > 0 ? (
            <ListGroup flush>
              {attachments.map((attachment) => (
                <ListGroupItem key={attachment.id} className="px-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center flex-grow-1">
                      {getFileIcon(attachment)}
                      <div className="flex-grow-1">
                        <div className="fw-bold small">{attachment.original_name}</div>
                        <div className="d-flex text-muted small">
                          <span className="me-2">{attachment.formatted_size}</span>
                          <span>•</span>
                          {/* Updated date display to show time */}
                          <span className="mx-2">
                            {formatAttachmentDate(attachment.created_at)}
                          </span>
                          <span>•</span>
                          <span className="ms-2">
                            {attachment.user?.name || 'Unknown'}
                            {isMyAttachment(attachment) && (
                              <span className=" fw-bold" style={{color: '#fe5e00'}}> (me)</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="d-flex">
                      <Button
                        color="link"
                        size="sm"
                        onClick={() => handleDownload(attachment)}
                        className="text-primary p-1"
                        title="Download"
                        disabled={loading}
                      >
                        <Download size={14} />
                      </Button>
                      
                      {canDeleteAttachment(attachment) && (
                        <Button
                          color="link"
                          size="sm"
                          onClick={() => handleDeleteClick(attachment)}
                          className="text-danger p-1"
                          title={isMyAttachment(attachment) ? "Delete my file" : "Delete file"}
                        >
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                  </div>
                </ListGroupItem>
              ))}
            </ListGroup>
          ) : (
            <div className="text-center py-4 text-muted">
              <Paperclip size={32} className="mb-2" />
              <div>
                <small>No attachments yet</small>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)} size="sm">
        <ModalHeader toggle={() => setDeleteModal(false)}>
          Delete Attachment
        </ModalHeader>
        <ModalBody>
          {selectedAttachment && (
            <div>
              <p>Are you sure you want to delete this file?</p>
              <div className="alert alert-warning p-2">
                <strong>{selectedAttachment.original_name}</strong>
                <div className="small text-muted">
                  {selectedAttachment.formatted_size} • {selectedAttachment.mime_type}
                </div>
                {/* Updated date display in modal to show time */}
                <div className="small text-muted">
                  Uploaded: {formatAttachmentDate(selectedAttachment.created_at)}
                </div>
                {isMyAttachment(selectedAttachment) && (
                  <div className="small text-primary fw-bold mt-1">
                    This is your file
                  </div>
                )}
              </div>
              <p className="small text-muted mb-0">
                This action cannot be undone.
              </p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setDeleteModal(false)}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default AttachmentSection