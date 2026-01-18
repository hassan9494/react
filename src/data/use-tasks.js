// src/views/task-manager/useTasks.js (Updated with optimistic updates)
import { useState, useEffect } from 'react'
import { taskService } from '../services/taskService'

export const useTasks = () => {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    completed: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await taskService.getBoardData()

      if (response.success) {
        setTasks(response.data)
      } else {
        setError(response.message || 'Failed to load tasks')
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to load tasks. Please try again.'
      setError(errorMessage)
      console.error('Error loading tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  // Optimistic update function
  const updateTaskLocal = (taskId, updates) => {
    setTasks(prevTasks => {
      const newTasks = { ...prevTasks }
      
      // Find and update the task in all columns
      Object.keys(newTasks).forEach(status => {
        newTasks[status] = newTasks[status].map(task => (task.id === taskId ? { ...task, ...updates } : task)
        )
      })
      
      return newTasks
    })
  }

  const addTask = async (taskData) => {
    try {
      const response = await taskService.createTask(taskData)
      if (response.success) {
        // Add the new task to the local state
        setTasks(prevTasks => ({
          ...prevTasks,
          [taskData.status]: [...prevTasks[taskData.status], response.data.task]
        }))
        return response
      } else {
        throw new Error(response.message || 'Failed to create task')
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create task'
      console.error('Error adding task:', err)
      throw new Error(errorMessage)
    }
  }

  const updateTask = async (id, updates) => {
    try {
      console.log('🔹 useTasks.updateTask - ID:', id, 'Updates:', updates)
      
      // Optimistic update - update local state immediately
      updateTaskLocal(id, updates)
      
      const response = await taskService.updateTask(id, updates)
      if (response.success) {
        // If the API call succeeds, ensure local state is correct
        updateTaskLocal(id, response.data.task)
        return response
      } else {
        // If API fails, revert the optimistic update
        await loadTasks() // Reload to get correct state
        throw new Error(response.message || 'Failed to update task')
      }
    } catch (err) {
      // Revert by reloading correct data
      await loadTasks()
      const errorMessage = err.response?.data?.message || 'Failed to update task'
      console.error('Error updating task:', err)
      throw new Error(errorMessage)
    }
  }

  const deleteTask = async (id) => {
    try {
      // Optimistic update - remove from local state immediately
      setTasks(prevTasks => {
        const newTasks = { ...prevTasks }
        Object.keys(newTasks).forEach(status => {
          newTasks[status] = newTasks[status].filter(task => task.id !== id)
        })
        return newTasks
      })

      const response = await taskService.deleteTask(id)
      if (response.success) {
        return response
      } else {
        // If API fails, revert by reloading
        await loadTasks()
        throw new Error(response.message || 'Failed to delete task')
      }
    } catch (err) {
      await loadTasks()
      const errorMessage = err.response?.data?.message || 'Failed to delete task'
      console.error('Error deleting task:', err)
      throw new Error(errorMessage)
    }
  }

  // New function to update task without affecting the modal
  const updateTaskSilently = async (id, updates) => {
    try {
      console.log('🔹 Silent update - ID:', id, 'Updates:', updates)
      
      // Only update locally for silent operations
      updateTaskLocal(id, updates)
      
      // Make API call in background without waiting for response
      taskService.updateTask(id, updates).then(response => {
        if (!response.success) {
          console.error('Silent update failed:', response.message)
          // Reload to sync with server
          loadTasks()
        }
      }).catch(error => {
        console.error('Silent update error:', error)
        loadTasks()
      })
      
      return { success: true }
    } catch (err) {
      console.error('Error in silent update:', err)
      return { success: false, error: err.message }
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    updateTaskSilently, // New function for silent updates
    refreshTasks: loadTasks
  }
}