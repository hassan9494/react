// Replace the entire WeeklyGroupedTaskColumn component with this:
import React, { useState, useEffect, useMemo } from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  Collapse,
  Button,
  Badge,
  Spinner,
  Alert
} from 'reactstrap'
import { ChevronDown, ChevronUp, Calendar, CheckCircle } from 'react-feather'
import TaskItem from './TaskItem'

const WeeklyGroupedTaskColumn = ({
                                   board,
                                   tasks = [],
                                   onUpdateTask,
                                   onDeleteTask,
                                   onTaskClick,
                                   availableUsers,
                                   currentUser,
                                   superAdminIds,
                                   useExternalTasks = false // New prop to control data source
                                 }) => {
  const [weeks, setWeeks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [expandedWeeks, setExpandedWeeks] = useState(new Set())

  const getWeekLabel = (startDate, endDate) => {
    const start = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const end = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

    const now = new Date()
    if (startDate <= now && endDate >= now) {
      return `This Week (${start} - ${end})`
    }

    const lastWeek = new Date(now)
    lastWeek.setDate(now.getDate() - 7)
    if (startDate <= lastWeek && endDate >= lastWeek) {
      return `Last Week (${start} - ${end})`
    }

    return `Week of ${start} - ${end}`
  }
  // Group tasks by week using useMemo for performance
  const groupedWeeks = useMemo(() => {
    if (!tasks || !Array.isArray(tasks)) return []

    const weeksMap = {}

    tasks.forEach((task) => {
      if (!task.completed_at) return

      const completedDate = new Date(task.completed_at)
      const weekStart = new Date(completedDate)
      weekStart.setDate(completedDate.getDate() - completedDate.getDay()) // Start of week (Sunday)

      const weekKey = weekStart.toISOString().split('T')[0]

      if (!weeksMap[weekKey]) {
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6) // End of week (Saturday)

        weeksMap[weekKey] = {
          week_start: weekKey,
          week_end: weekEnd.toISOString().split('T')[0],
          week_label: getWeekLabel(weekStart, weekEnd),
          tasks: [],
          task_count: 0
        }
      }

      weeksMap[weekKey].tasks.push(task)
      weeksMap[weekKey].task_count++
    })
    // Convert to array and sort by week_start (descending)
    const weeksArray = Object.values(weeksMap).sort((a, b) => new Date(b.week_start) - new Date(a.week_start))

    // NEW: Sort tasks within each week by completed_at (newest first)
    weeksArray.forEach(week => {
      week.tasks.sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))
    })

    return weeksArray
  }, [tasks])


  // Initialize expanded weeks
  useEffect(() => {
    if (groupedWeeks.length > 0 && expandedWeeks.size === 0) {
      // Auto-expand the first week (most recent)
      setExpandedWeeks(new Set([groupedWeeks[0].week_start]))
    }
  }, [groupedWeeks])

  const toggleWeek = (weekStart) => {
    setExpandedWeeks(prev => {
      const newSet = new Set(prev)
      if (newSet.has(weekStart)) {
        newSet.delete(weekStart)
      } else {
        newSet.add(weekStart)
      }
      return newSet
    })
  }

  const isWeekExpanded = (weekStart) => {
    return expandedWeeks.has(weekStart)
  }

  const expandAll = () => {
    const allWeekStarts = groupedWeeks.map(week => week.week_start)
    setExpandedWeeks(new Set(allWeekStarts))
  }

  const collapseAll = () => {
    setExpandedWeeks(new Set())
  }

  const handleTaskUpdate = async (taskId, updates) => {
    if (onUpdateTask) {
      await onUpdateTask(taskId, updates)
    }
  }

  const handleTaskDelete = async (taskId) => {
    if (onDeleteTask) {
      await onDeleteTask(taskId)
    }
  }

  const handleTaskClick = (task) => {
    if (onTaskClick) {
      onTaskClick(task)
    }
  }

  // Calculate total tasks count
  const totalTasks = groupedWeeks.reduce((total, week) => total + week.task_count, 0)

  return (
      <Card className="task-column h-100 weekly-grouped-column">
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
            <Badge color="secondary" pill>{totalTasks}</Badge>
          </div>
          <div className="d-flex align-items-center">
            <Button
                color="link"
                size="sm"
                onClick={expandAll}
                title="Expand all weeks"
                className="p-1 me-1 text-secondary"
                disabled={groupedWeeks.length === 0}
            >
              <ChevronDown size={14} />
            </Button>
            <Button
                color="link"
                size="sm"
                onClick={collapseAll}
                title="Collapse all weeks"
                className="p-1 text-secondary"
                disabled={groupedWeeks.length === 0}
            >
              <ChevronUp size={14} />
            </Button>
          </div>
        </CardHeader>

        <CardBody className="p-2 d-flex flex-column" style={{ height: '500px' }}>
          {groupedWeeks.length === 0 ? (
              <div className="text-center text-muted py-3 flex-grow-1 d-flex align-items-center justify-content-center">
                <div>
                  <CheckCircle size={24} className="mb-2" />
                  <div>No completed tasks found</div>
                  {tasks.length > 0 && (
                      <small className="text-muted mt-1">
                        {tasks.length} task(s) don't have completion dates
                      </small>
                  )}
                </div>
              </div>
          ) : (
              <div
                  className="weeks-list flex-grow-1"
                  style={{
                    overflowY: 'auto',
                    minHeight: 0
                  }}
              >
                {groupedWeeks.map((week) => (
                    <div key={week.week_start} className="week-group mb-3">
                      <div
                          className="week-header d-flex justify-content-between align-items-center p-2 border rounded cursor-pointer"
                          onClick={() => toggleWeek(week.week_start)}
                          style={{
                            cursor: 'pointer',
                            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
                          }}
                      >
                        <div className="d-flex align-items-center">
                          <Calendar size={14} className="me-2 text-primary" />
                          <small className="fw-bold me-2">{week.week_label}</small>
                          <Badge color="primary" pill className="fs-12">
                            {week.task_count}
                          </Badge>
                        </div>
                        <Button color="link" className="p-0 text-secondary" size="sm">
                          {isWeekExpanded(week.week_start) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </Button>
                      </div>

                      <Collapse isOpen={isWeekExpanded(week.week_start)}>
                        <div className="week-tasks mt-2">
                          {week.tasks.map((task) => (
                              <TaskItem
                                  key={task.id}
                                  task={task}
                                  onUpdate={handleTaskUpdate}
                                  onDelete={handleTaskDelete}
                                  onClick={handleTaskClick}
                                  availableUsers={availableUsers}
                                  currentUser={currentUser}
                                  superAdminIds={superAdminIds}
                              />
                          ))}
                        </div>
                      </Collapse>
                    </div>
                ))}
              </div>
          )}
        </CardBody>
      </Card>
  )
}

export default WeeklyGroupedTaskColumn