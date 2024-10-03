import axios from 'axios'
import { API_URL, TOKEN } from '../config/Globals'
export const api = (withAuth = false) => axios.create({
  baseURL: `${API_URL}`,
  headers: withAuth ? {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TOKEN}`
  } : {
    'Content-Type': 'application/json'
  },
  data: {}
})
