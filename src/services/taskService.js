// src/services/taskService.js (Updated with togglePublic)
import axios from 'axios'

class TaskService {

  constructor() {
    this.api = axios.create({
      baseURL: `${process.env.REACT_APP_ADMIN_API}/tasks`,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })

    this.api.interceptors.request.use(
      (config) => {
        const authData = localStorage.getItem('auth')
        let token = null
        
        if (authData) {
          try {
            const auth = JSON.parse(authData)
            token = auth.token || auth.accessToken
          } catch (e) {
            console.error('Error parsing auth data:', e)
          }
        }
        
        if (!token) {
          token = localStorage.getItem('token') || localStorage.getItem('accessToken')
        }

        // console.log('🔹 Token found:', !!token)
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        
        return config
      },
      (error) => Promise.reject(error)
    )

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth')
          localStorage.removeItem('token')
          localStorage.removeItem('accessToken')
          console.warn('🔹 Unauthorized. Tokens cleared.')
        }
        return Promise.reject(error)
      }
    )
  }
  
  async getAvailableUsers() {
    try {
      // console.log('🔹 Fetching available users...')
      const response = await this.api.get('/available-users')
      // console.log('🔹 Available users response:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching available users:', error)
      console.error('❌ Error details:', error.response?.data)
      throw error
    }
  }

   async getDeletedTasks() {
    try {
      // console.log('🔹 Fetching deleted tasks...')
      const response = await this.api.get('/deleted')
      // console.log('🔹 Deleted tasks response:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching deleted tasks:', error)
      console.error('❌ Error details:', error.response?.data)
      throw error
    }
  }

  async restoreTask(id) {
    const taskId = this.extractTaskId(id)
    const response = await this.api.post(`/${taskId}/restore`)
    return response.data
  }

  async forceDeleteTask(id) {
    const taskId = this.extractTaskId(id)
    const response = await this.api.delete(`/${taskId}/force-delete`)
    return response.data
  }


  async getBoardData() {
    try {
      // console.log('🔹 Fetching board data from:', `${this.api.defaults.baseURL}/board`)
      const response = await this.api.get('/board')
      // console.log('🔹 Board data response:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching board data:', error)
      console.error('❌ Error details:', error.response?.data)
      throw error
    }
  }

// src/services/taskService.js - Update createTask method
async createTask(task) {
  try {
    // console.log('🔹 Creating task:', task)
    const response = await this.api.post('/', task)
    // console.log('🔹 Task creation response:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Task creation failed:', error)
    console.error('❌ Error details:', error.response?.data)
    
    // Provide more user-friendly error messages
    if (error.response?.data?.error?.includes('Data truncated for column')) {
      throw new Error('Database configuration error. Please contact administrator.')
    }
    
    throw new Error(error.response?.data?.message || 'Failed to create task')
  }
}

async updateTask(id, updates) {
  const taskId = this.extractTaskId(id)
  // console.log('🔹 Update task - Final ID:', taskId, 'Type:', typeof taskId, 'Updates:', updates)
  
  try {
    const response = await this.api.put(`/${taskId}`, updates)
    // console.log('🔹 Update task response:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Update task error:', error)
    console.error('❌ Error response:', error.response?.data)
    throw error
  }
}

  async deleteTask(id) {
    const taskId = this.extractTaskId(id)
    // console.log('🔹 Delete task - Final ID:', taskId, 'Type:', typeof taskId)
    const response = await this.api.delete(`/${taskId}`)
    return response.data
  }

async getTask(id) {
  const taskId = this.extractTaskId(id)
  // console.log('🔹 Get task - Final ID:', taskId, 'Type:', typeof taskId)
  
  try {
    const response = await this.api.get(`/${taskId}`)
    // console.log('🔹 Get task response:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Get task error:', error)
    console.error('❌ Error response:', error.response?.data)
    throw error
  }
}

async getCompletedTasksGroupedByWeek() {
    try {
        // console.log('🔹 Fetching completed tasks grouped by week...')
        const response = await this.api.get('/completed-grouped-by-week')
        // console.log('🔹 Completed tasks grouped by week response:', response.data)
        return response.data
    } catch (error) {
        console.error('❌ Error fetching completed tasks grouped by week:', error)
        console.error('❌ Error details:', error.response?.data)
        throw error
    }
}

  async togglePublic(id, data) {
    const taskId = this.extractTaskId(id)
    const response = await this.api.post(`/${taskId}/toggle-public`, data)
    return response.data
  }

// Update the completeTask method
async completeTask(id) {
    const taskId = this.extractTaskId(id)
    const response = await this.api.post(`/${taskId}/complete`)
    return response.data
}

// Update the reopenTask method  
async reopenTask(id) {
    const taskId = this.extractTaskId(id)
    const response = await this.api.post(`/${taskId}/reopen`)
    return response.data
}

async updateComment(taskId, commentId, content) {
  const cleanTaskId = this.extractTaskId(taskId)
  // console.log('🔹 Update comment - Task ID:', cleanTaskId, 'Comment ID:', commentId, 'Content:', content)
  
  try {
    const response = await this.api.post(`/${cleanTaskId}/comments/${commentId}`, { content })
    // console.log('🔹 Update comment response:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Update comment error:', error)
    console.error('❌ Error response:', error.response?.data)
    throw error
  }
}

async deleteComment(taskId, commentId) {
  const cleanTaskId = this.extractTaskId(taskId)
  // console.log('🔹 Delete comment - Task ID:', cleanTaskId, 'Comment ID:', commentId)
  
  try {
    const response = await this.api.delete(`/${cleanTaskId}/comments/${commentId}`)
    // console.log('🔹 Delete comment response:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Delete comment error:', error)
    console.error('❌ Error response:', error.response?.data)
    throw error
  }
}
  // Helper method to extract task ID from various formats
  extractTaskId(id) {
    // console.log('🔹 extractTaskId input:', id, 'Type:', typeof id)
    
    if (typeof id === 'number') {
      return id
    }
    
    if (typeof id === 'string') {
      const numId = parseInt(id, 10)
      if (!isNaN(numId)) {
        return numId
      }
      return id
    }
    
    if (typeof id === 'object' && id !== null) {
      if (id.id !== undefined) {
        return this.extractTaskId(id.id)
      }
      const keys = Object.keys(id)
      const numericKey = keys.find(key => !isNaN(parseInt(key, 10)))
      if (numericKey) {
        return parseInt(numericKey, 10)
      }
    }
    
    console.warn('🔹 Could not extract proper task ID from:', id)
    return id
  }

  async addComment(taskId, content) {
    const cleanId = this.extractTaskId(taskId)
    const response = await this.api.post(`/${cleanId}/comments`, { content })
    return response.data
  }

  async addAssignee(taskId, userId) {
    const cleanId = this.extractTaskId(taskId)
    const response = await this.api.post(`/${cleanId}/assignees`, { user_id: userId })
    return response.data
  }

  async removeAssignee(taskId, userId) {
    const cleanId = this.extractTaskId(taskId)
    const response = await this.api.delete(`/${cleanId}/assignees`, { 
      data: { user_id: userId } 
    })
    return response.data
  }
  async getAttachments(taskId) {
    const cleanId = this.extractTaskId(taskId)
    const response = await this.api.get(`/${cleanId}/attachments`)
    return response.data
  }

  async uploadAttachment(taskId, file) {
    const cleanId = this.extractTaskId(taskId)
    const formData = new FormData()
    formData.append('file', file)

    const response = await this.api.post(`/${cleanId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }

  async deleteAttachment(taskId, attachmentId) {
    const cleanId = this.extractTaskId(taskId)
    const response = await this.api.delete(`/${cleanId}/attachments/${attachmentId}`)
    return response.data
  }

  getDownloadUrl(taskId, attachmentId) {
    const cleanId = this.extractTaskId(taskId)
    return `${this.api.defaults.baseURL}/${cleanId}/attachments/${attachmentId}/download`
  }
  
async downloadAttachment(taskId, attachmentId) {
  const cleanId = this.extractTaskId(taskId)
  
  const response = await this.api.get(`/${cleanId}/attachments/${attachmentId}/download`, {
    responseType: 'blob' // Important for file downloads
  })
  return response
}
}

export const taskService = new TaskService()