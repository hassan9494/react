// src/views/task-manager/TaskFilter.js - Updated with board visibility logic
import React, { useState, useEffect, useMemo } from 'react'
import {
  Card,
  CardBody,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
  Badge,
  Collapse,
  InputGroup
} from 'reactstrap'
import {
  Filter,
  Search,
  User,
  Users,
  Flag,
  Calendar,
  X,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Paperclip,
  Eye,
  EyeOff,
  Info
} from 'react-feather'
import Select from 'react-select'
import { filterService } from '../../services/filterService'

const TaskFilter = ({
                      filters,
                      onFiltersChange,
                      availableUsers = [],
                      currentUser,
                      totalTasks = 0,
                      filteredTasks = 0,
                      boards = [],
                      allTasks = [] // NEW: Receive all tasks to determine board visibility
                    }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [localFilters, setLocalFilters] = useState(filters)

  const isSuperAdmin = filterService.isSuperAdmin(currentUser)
  const hasActiveFilters = filterService.hasActiveFilters(filters)
  const filterSummary = filterService.getFilterSummary(filters, availableUsers, currentUser)
  const userRoleOptions = filterService.getUserRoleOptions()

  // Default board names that should always be visible
  const defaultBoardNames = ['todo', 'inProgress', 'completed']

  // Filter boards based on user permissions and task assignments - EXACT SAME LOGIC AS TASK MODAL
  const getUserAccessibleBoards = () => {
    if (!boards.length) return []

    return boards.filter(board => {
      // Always show default boards for all users
      if (defaultBoardNames.includes(board.name)) {
        return true
      }

      // Super admins see all boards
      if (isSuperAdmin) {
        return true
      }

      // For non-super admin users, only show boards that have their tasks
      const boardTasks = allTasks.filter(task => task.board_id === board.id)
      const hasUserTasks = boardTasks.some(task => {
        // User can see the task if:
        // 1. They created it
        // 2. They are assigned to it
        // 3. The task is public
        return task.user_id === currentUser?.id ||
            (task.assignees && task.assignees.includes(currentUser?.id)) ||
            task.is_public
      })

      return hasUserTasks
    })
  }

  // Get status options from accessible boards only
  const getStatusOptions = () => {
    const accessibleBoards = getUserAccessibleBoards()
    const baseStatuses = [
      { value: 'all', label: 'All Statuses' },
      { value: 'todo', label: 'To Do' },
      { value: 'inProgress', label: 'In Progress' },
      { value: 'completed', label: 'Completed' }
    ]

    // Add custom board statuses from accessible boards only
    const customStatuses = accessibleBoards
        .filter(board => !['todo', 'inProgress', 'completed'].includes(board.name))
        .map(board => ({
          value: board.name,
          label: board.name.charAt(0).toUpperCase() + board.name.slice(1),
          board
        }))

    return [...baseStatuses, ...customStatuses]
  }

  const statusOptions = getStatusOptions()

  // Prepare users for react-select
  const userOptions = availableUsers.map(user => ({
    value: user.id.toString(),
    label: `${user.name} (${user.email})`,
    user
  }))

  // Get currently selected users for display
  const selectedUsers = localFilters.users ? userOptions.filter(option => localFilters.users.includes(option.value)) : []

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
  }

  const handleUsersChange = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : []
    handleFilterChange('users', selectedValues)
  }

  const handleApplyFilters = () => {
    onFiltersChange(localFilters)
  }

  const handleResetFilters = () => {
    const resetFilters = filterService.resetFilters()
    setLocalFilters(resetFilters)
    onFiltersChange(resetFilters)
  }

  const handleClearFilter = (filterKey) => {
    const newFilters = { ...localFilters, [filterKey]: filterService.defaultFilters[filterKey] }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleClearUsersFilter = () => {
    handleClearFilter('users')
    handleClearFilter('userRole')
  }

  const handleQuickFilter = (filterType, value) => {
    const newFilters = { ...localFilters }

    switch (filterType) {
      case 'myTasks':
        newFilters.users = [currentUser.id.toString()]
        newFilters.userRole = 'both'
        newFilters.isPublic = null
        break
      case 'publicTasks':
        newFilters.users = []
        newFilters.userRole = 'both'
        newFilters.isPublic = true
        break
      case 'privateTasks':
        newFilters.users = []
        newFilters.userRole = 'both'
        newFilters.isPublic = false
        break
      case 'withAttachments':
        newFilters.hasAttachments = true
        break
      case 'highPriority':
        newFilters.priority = 2
        break
      case 'dueThisWeek':
        const today = new Date()
        const nextWeek = new Date(today)
        nextWeek.setDate(today.getDate() + 7)
        newFilters.dueDateFrom = today.toISOString().split('T')[0]
        newFilters.dueDateTo = nextWeek.toISOString().split('T')[0]
        break
      case 'recent':
        const lastWeek = new Date()
        lastWeek.setDate(lastWeek.getDate() - 7)
        newFilters.createdDateFrom = lastWeek.toISOString().split('T')[0]
        newFilters.createdDateTo = new Date().toISOString().split('T')[0]
        break
      default:
        break
    }

    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const getPriorityLabel = (priority) => {
    const labels = { 0: 'Low', 1: 'Medium', 2: 'High' }
    return labels[priority] || 'All'
  }

  // Custom styles for react-select
  const selectStyles = {
    control: (base) => ({
      ...base,
      minHeight: '38px',
      fontSize: '0.875rem'
    }),
    menu: (base) => ({
      ...base,
      fontSize: '0.875rem'
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: '#e9ecef',
      borderRadius: '4px'
    }),
    multiValueLabel: (base) => ({
      ...base,
      fontSize: '0.8rem',
      padding: '2px 6px'
    })
  }

  // Get accessible boards count for info display
  const accessibleBoards = getUserAccessibleBoards()
  const totalBoardsCount = boards.length
  const accessibleBoardsCount = accessibleBoards.length

  return (
      <Card className="mb-1">
        <CardBody className="p-1">
          {/* Filter Header */}
          <div
              className="d-flex justify-content-between align-items-center cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="d-flex align-items-center">
              <Filter size={18} className="text-primary me-2" />
              <h6 className="mb-0 me-2 pr-1">Task Filters</h6>
              {hasActiveFilters && (
                  <Badge color="primary" pill className="me-2 mr-1">
                    {filterSummary.length} active filters
                  </Badge>
              )}
              <Badge color="secondary" pill>
                {filteredTasks} of {totalTasks} tasks
              </Badge>
            </div>
            <div className="d-flex align-items-center">
              {hasActiveFilters && (
                  <Button
                      color="link"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleResetFilters()
                      }}
                      className="text-danger px-1 me-2"
                      title="Reset all filters"
                  >
                    <RefreshCw size={14} />
                  </Button>
              )}
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </div>

          {/* Quick Filters */}
          <div className="mt-1">
            <div className="d-flex flex-wrap gap-1 mb-1 ">
              <Button
                  color="outline-success"
                  size="sm"
                  onClick={() => handleQuickFilter('publicTasks')}
                  className="flex-shrink-0 mr-1"
              >
                <Users size={12} className="me-1" />
                Public Tasks
              </Button>
              <Button
                  color="outline-secondary"
                  size="sm"
                  onClick={() => handleQuickFilter('privateTasks')}
                  className="flex-shrink-0 mr-1"
              >
                <EyeOff size={12} className="me-1" />
                Private Tasks
              </Button>
              <Button
                  color="outline-info"
                  size="sm"
                  onClick={() => handleQuickFilter('withAttachments')}
                  className="flex-shrink-0 mr-1"
              >
                <Paperclip size={12} className="me-1" />
                With Files
              </Button>
              <Button
                  color="outline-danger"
                  size="sm"
                  onClick={() => handleQuickFilter('highPriority')}
                  className="flex-shrink-0 mr-1"
              >
                <Flag size={12} className="me-1" />
                High Priority
              </Button>
              <Button
                  color="outline-warning"
                  size="sm"
                  onClick={() => handleQuickFilter('dueThisWeek')}
                  className="flex-shrink-0 mr-1"
              >
                <Calendar size={12} className="me-1" />
                Due This Week
              </Button>
              <Button
                  color="outline-dark"
                  size="sm"
                  onClick={() => handleQuickFilter('recent')}
                  className="flex-shrink-0 mr-1"
              >
                <Calendar size={12} className="me-1" />
                Recent (Last 7 days)
              </Button>
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && filterSummary.length > 0 && (
              <div className="mt-0">
                <div className="d-flex flex-wrap gap-1">
                  {filterSummary.map((filter, index) => {
                    // Check if this is a user filter to handle clearing both users and userRole
                    const isUserFilter = filter.startsWith('Users:')

                    return (
                        <Badge
                            key={index}
                            color="primary"
                            className="d-flex align-items-center border cursor-pointer"
                            style={{
                              fontSize: '0.7rem'
                            }}
                            onClick={() => {
                              if (isUserFilter) {
                                handleClearUsersFilter()
                              } else if (filter.startsWith('Search:')) {
                                handleClearFilter('searchTerm')
                              } else if (filter.startsWith('Priority:')) {
                                handleClearFilter('priority')
                              } else if (filter.startsWith('Status:')) {
                                handleClearFilter('status')
                              } else if (filter.startsWith('Created:')) {
                                handleClearFilter('createdDateFrom')
                                handleClearFilter('createdDateTo')
                              } else if (filter.startsWith('Due:')) {
                                handleClearFilter('dueDateFrom')
                                handleClearFilter('dueDateTo')
                              } else if (filter.startsWith('Attachments:')) {
                                handleClearFilter('hasAttachments')
                              } else if (filter.startsWith('Visibility:')) {
                                handleClearFilter('isPublic')
                              }
                            }}
                        >
                          {filter}
                          <X
                              size={12}
                              className="ms-1"
                          />
                        </Badge>
                    )
                  })}
                </div>
              </div>
          )}

          {/* Filter Controls */}
          <Collapse isOpen={isExpanded}>
            <div className="mt-1 pt-1 border-top">
              <Row>
                {/* Search Term */}
                <Col md={5} className="mb-1">
                  <FormGroup>
                    <Label for="searchTerm" className="small fw-bold">
                      <Search size={14} className="me-1" />
                      Search Tasks
                    </Label>
                    <Input
                        id="searchTerm"
                        type="text"
                        placeholder="Search in title or description..."
                        value={localFilters.searchTerm || ''}
                        onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleApplyFilters()
                        }}
                    />
                  </FormGroup>
                </Col>

                {/* Multi-User Filter (Super Admin Only) */}
                {isSuperAdmin && (
                    <>
                      <Col md={5} className="mb-1">
                        <FormGroup>
                          <Label className="small fw-bold">
                            <Users size={14} className="me-1" />
                            Filter by Users
                          </Label>
                          <Select
                              isMulti
                              options={userOptions}
                              value={selectedUsers}
                              onChange={handleUsersChange}
                              placeholder="Select users..."
                              styles={selectStyles}
                              isSearchable
                              isClearable
                          />
                        </FormGroup>
                      </Col>

                      {/* User Role Filter */}
                      <Col md={2} className="mb-1">
                        <FormGroup>
                          <Label for="userRoleFilter" className="small fw-bold">
                            User Role
                          </Label>
                          <Input
                              id="userRoleFilter"
                              type="select"
                              value={localFilters.userRole || 'both'}
                              onChange={(e) => handleFilterChange('userRole', e.target.value)}
                              disabled={!localFilters.users || localFilters.users.length === 0}
                          >
                            {userRoleOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                    </>
                )}

                {/* Status Filter - UPDATED WITH BOARD VISIBILITY LOGIC */}
                <Col md={4} className="mb-1">
                  <FormGroup>
                    <Label for="statusFilter" className="small fw-bold">
                      Status
                    </Label>
                    <Input
                        id="statusFilter"
                        type="select"
                        value={localFilters.status || 'all'}
                        onChange={(e) => handleFilterChange('status', e.target.value === 'all' ? null : e.target.value)}
                        className="modern-select"
                    >
                      {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                            {option.board && !option.board.is_default && ' (Custom)'}
                          </option>
                      ))}
                    </Input>

                    {/* Information about board visibility */}
                    {/* {!isSuperAdmin && totalBoardsCount > accessibleBoardsCount && (
                    <div className="small text-info mt-1 d-flex align-items-center">
                      <Info size={12} className="me-1" />
                      Showing {accessibleBoardsCount} of {totalBoardsCount} boards (only boards with your tasks)
                    </div>
                  )} */}

                    {/* {isSuperAdmin && (
                    <div className="small text-muted mt-1">
                      <Info size={12} className="me-1" />
                      Super Admin: All {totalBoardsCount} boards visible
                    </div>
                  )} */}
                  </FormGroup>
                </Col>

                {/* Priority Filter */}
                <Col md={3} className="mb-1">
                  <FormGroup>
                    <Label for="priorityFilter" className="small fw-bold">
                      <Flag size={14} className="me-1" />
                      Priority
                    </Label>
                    <Input
                        id="priorityFilter"
                        type="select"
                        value={localFilters.priority ?? ''}
                        onChange={(e) => handleFilterChange('priority', e.target.value === '' ? null : parseInt(e.target.value))}
                    >
                      <option value="">All Priorities</option>
                      <option value="0">Low</option>
                      <option value="1">Medium</option>
                      <option value="2">High</option>
                    </Input>
                  </FormGroup>
                </Col>

                {/* Attachment Filter */}
                <Col md={2} className="mb-1">
                  <FormGroup>
                    <Label for="attachmentFilter" className="small fw-bold">
                      <Paperclip size={14} className="me-1" />
                      Attachments
                    </Label>
                    <Input
                        id="attachmentFilter"
                        type="select"
                        value={localFilters.hasAttachments ?? ''}
                        onChange={(e) => handleFilterChange('hasAttachments', e.target.value === '' ? null : e.target.value === 'true')}
                    >
                      <option value="">All Tasks</option>
                      <option value="true">Has Attachments</option>
                      <option value="false">No Attachments</option>
                    </Input>
                  </FormGroup>
                </Col>

                {/* Visibility Filter */}
                <Col md={2} className="mb-1">
                  <FormGroup>
                    <Label for="visibilityFilter" className="small fw-bold">
                      <Eye size={14} className="me-1" />
                      Visibility
                    </Label>
                    <Input
                        id="visibilityFilter"
                        type="select"
                        value={localFilters.isPublic ?? ''}
                        onChange={(e) => handleFilterChange('isPublic', e.target.value === '' ? null : e.target.value === 'true')}
                    >
                      <option value="">All Tasks</option>
                      <option value="true">Public Tasks</option>
                      <option value="false">Private Tasks</option>
                    </Input>
                  </FormGroup>
                </Col>

                {/* Created Date Range */}
                <Col md={4} className="mb-1">
                  <FormGroup>
                    <Label className="small fw-bold d-block">
                      <Calendar size={14} className="me-1" />
                      Created Date
                    </Label>
                    <Row>
                      <Col>
                        <Input
                            type="date"
                            placeholder="From"
                            value={localFilters.createdDateFrom || ''}
                            onChange={(e) => handleFilterChange('createdDateFrom', e.target.value)}
                        />
                      </Col>
                      <Col>
                        <Input
                            type="date"
                            placeholder="To"
                            value={localFilters.createdDateTo || ''}
                            onChange={(e) => handleFilterChange('createdDateTo', e.target.value)}
                        />
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>

                {/* Due Date Range */}
                <Col md={4} className="mb-1">
                  <FormGroup>
                    <Label className="small fw-bold d-block">
                      Due Date
                    </Label>
                    <Row>
                      <Col >
                        <Input
                            type="date"
                            placeholder="From"
                            value={localFilters.dueDateFrom || ''}
                            onChange={(e) => handleFilterChange('dueDateFrom', e.target.value)}
                        />
                      </Col>
                      <Col >
                        <Input
                            type="date"
                            placeholder="To"
                            value={localFilters.dueDateTo || ''}
                            onChange={(e) => handleFilterChange('dueDateTo', e.target.value)}
                        />
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>

                {/* Action Buttons (Same Row) */}
                <Col xs="12" className="d-flex justify-content-end mt-0 gap-1">
                  <Button
                      color="secondary"
                      size="sm"
                      onClick={handleResetFilters}
                      disabled={!hasActiveFilters}
                  >
                    <RefreshCw size={14} className="me-1" />
                    Reset
                  </Button>
                  <Button
                      color="primary"
                      size="sm"
                      onClick={handleApplyFilters}
                  >
                    <Filter size={14} className="me-1" />
                    Apply
                  </Button>
                </Col>
              </Row>
            </div>
          </Collapse>
        </CardBody>
      </Card>
  )
}

export default TaskFilter