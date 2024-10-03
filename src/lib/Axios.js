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

export default async function handler(req, res) {
  const apiUrl = 'http://195.35.40.77:8080' + req.url;
  try {
    const response = await fetch(apiUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : null
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer requisição para a API.' });
  }
}
