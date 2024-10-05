import axios from 'axios'
import { proxy, token } from '../config/Globals'

export const api = (withAuth = false) => axios.create({
  baseURL: `https://painel-ativa.vercel.app/api/proxy`, 
  headers: withAuth ? {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  } : {
    'Content-Type': 'application/json'
  },
  data: {}
})