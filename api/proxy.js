// api/proxy.js
import axios from 'axios';

export default async function handler(req, res) {
  // Verifica se a requisição é POST
  if (req.method === 'POST') {
    const { path } = req.body; // Pega o caminho da API externa enviado pelo front-end

    try {
      // Faz a requisição para a API HTTP externa usando Axios
      const response = await axios.get(`http://api-http-externa.com/${path}`);
      
      // Retorna os dados recebidos da API externa para o front-end
      res.status(200).json(response.data);
    } catch (error) {
      // Trata erros da API externa
      console.error(error);
      res.status(500).json({ error: 'Erro ao consultar a API externa' });
    }
  } else {
    // Responde com erro se o método não for POST
    res.status(405).json({ error: 'Método não permitido' });
  }
}
