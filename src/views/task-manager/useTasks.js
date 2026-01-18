// src/views/task-manager/useTasks.js
import { useState, useEffect, useCallback } from 'react'

import { taskService } from './../../services/taskService'

export const useTasks = () => {
    const [tasks, setTasks] = useState({
        todo: [],
        inProgress: [],
        completed: []
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // 🔹 Load tasks from API - Remove useCallback to avoid dependency issues
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
            if (err.response?.status === 401) {
                setError('Authentication required. Please log in.')
            } else if (err.response?.status === 403) {
                setError('You do not have permission to access tasks.')
            } else {
                setError('Failed to load tasks. Please try again.')
            }
            console.error('Error loading tasks:', err)
        } finally {
            setLoading(false)
        }
    }

    // 🔹 Task actions - Simplify without useCallback
    const addTask = async (taskData) => {
        try {
            const response = await taskService.createTask(taskData)
            await loadTasks()
            return response
        } catch (err) {
            setError('Failed to create task')
            throw err
        }
    }

    const updateTask = async (id, taskData) => {
        try {
            const response = await taskService.updateTask(id, taskData)
            await loadTasks()
            return response
        } catch (err) {
            setError('Failed to update task')
            throw err
        }
    }

    const deleteTask = async (id) => {
        try {
            await taskService.deleteTask(id)
            await loadTasks()
        } catch (err) {
            setError('Failed to delete task')
            throw err
        }
    }

    const moveTask = async (id, status, position) => {
        try {
            await taskService.moveTask(id, status, position)
            await loadTasks()
        } catch (err) {
            setError('Failed to move task')
            throw err
        }
    }

    const completeTask = async (id) => {
        try {
            await taskService.completeTask(id)
            await loadTasks()
        } catch (err) {
            setError('Failed to complete task')
            throw err
        }
    }

    const reopenTask = async (id) => {
        try {
            await taskService.reopenTask(id)
            await loadTasks()
        } catch (err) {
            setError('Failed to reopen task')
            throw err
        }
    }

    // 🔹 Load tasks on mount - Fix the useEffect dependency
    useEffect(() => {
        loadTasks()
    }, []) // Empty dependency array to run only once on mount

    return {
        tasks,
        loading,
        error,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
        completeTask,
        reopenTask,
        refreshTasks: loadTasks
    }
}
