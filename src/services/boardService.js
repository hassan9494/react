// src/services/boardService.js

import axios from 'axios'

class BoardService {
  constructor() {
    this.api = axios.create({
      baseURL: `${process.env.REACT_APP_ADMIN_API}/boards`,
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

        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        
        return config
      },
      (error) => Promise.reject(error)
    )
  }

  async getBoards() {
    try {
      // console.log('🔹 Fetching boards...')
      const response = await this.api.get('')
      // console.log('🔹 Boards response:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching boards:', error)
      throw error
    }
  }

  async getTrashedBoards() {
    try {
      // console.log('🔹 Fetching trashed boards...')
      const response = await this.api.get('/trashed')
      // console.log('🔹 Trashed boards response:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching trashed boards:', error)
      throw error
    }
  }

  async getBoardStats() {
    try {
      const response = await this.api.get('/stats')
      return response.data
    } catch (error) {
      console.error('❌ Error fetching board stats:', error)
      throw error
    }
  }

  async createBoard(boardData) {
    try {
      const response = await this.api.post('/', boardData)
      return response.data
    } catch (error) {
      console.error('❌ Error creating board:', error)
      throw error
    }
  }

  async updateBoard(id, updates) {
    try {
      const response = await this.api.put(`/${id}`, updates)
      return response.data
    } catch (error) {
      console.error('❌ Error updating board:', error)
      throw error
    }
  }

  async deleteBoard(id) {
    try {
      const response = await this.api.delete(`/${id}`)
      return response.data
    } catch (error) {
      console.error('❌ Error deleting board:', error)
      throw error
    }
  }

  async restoreBoard(id) {
    try {
      const response = await this.api.post(`/${id}/restore`)
      return response.data
    } catch (error) {
      console.error('❌ Error restoring board:', error)
      throw error
    }
  }

  async forceDeleteBoard(id) {
    try {
      const response = await this.api.delete(`/${id}/force-delete`)
      return response.data
    } catch (error) {
      console.error('❌ Error force deleting board:', error)
      throw error
    }
  }

  async reorderBoards(boards) {
    try {
      const response = await this.api.post('/reorder', { boards })
      return response.data
    } catch (error) {
      console.error('❌ Error reordering boards:', error)
      throw error
    }
  }
}

export const boardService = new BoardService()