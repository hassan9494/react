// src/data/use-tasks-fixed.js - Updated version
import { useState, useEffect, useCallback } from 'react'
import { taskService } from '../services/taskService'

export const useTasksFixed = () => {
  const [tasks, setTasks] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      // console.log('🔹 Loading tasks from board data...')
      
      const response = await taskService.getBoardData()
      // console.log('🔹 Tasks response:', response)

      if (response.success) {
        // The response data should be an object with board IDs as keys
        // console.log('🔹 Setting tasks data:', response.data)
        setTasks(response.data || {})
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
  }, [])

  const addTask = useCallback(async (taskData) => {
    try {
      // console.log('🔹 Adding task:', taskData)
      const response = await taskService.createTask(taskData)
      
      if (response.success) {
        // console.log('🔹 Task created successfully, reloading tasks...')
        // Reload tasks to get the updated list
        await loadTasks()
        return response.data.task
      } else {
        throw new Error(response.message || 'Failed to create task')
      }
    } catch (error) {
      console.error('Error adding task:', error)
      throw error
    }
  }, [loadTasks])

  const updateTask = useCallback(async (taskId, updates) => {
    try {
      // console.log('🔹 Updating task:', taskId, updates)
      const response = await taskService.updateTask(taskId, updates)
      
      if (response.success) {
        // console.log('🔹 Task updated successfully, reloading tasks...')
        // Reload tasks to get the updated list
        await loadTasks()
        return response.data.task
      } else {
        throw new Error(response.message || 'Failed to update task')
      }
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  }, [loadTasks])

  const deleteTask = useCallback(async (taskId) => {
    try {
      // console.log('🔹 Deleting task:', taskId)
      const response = await taskService.deleteTask(taskId)
      
      if (response.success) {
        // console.log('🔹 Task deleted successfully, reloading tasks...')
        // Reload tasks to get the updated list
        await loadTasks()
      } else {
        throw new Error(response.message || 'Failed to delete task')
      }
    } catch (error) {
      console.error('Error deleting task:', error)
      throw error
    }
  }, [loadTasks])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    refreshTasks: loadTasks
  }
}