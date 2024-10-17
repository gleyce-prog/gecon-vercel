export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { url, data } = req;

  if (!url) {
    return res.status(400).json({ error: 'URL não fornecida' });
  }

  try {
    console.log("Fazendo requisição para:", url);

    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        // Adicione outros cabeçalhos, se necessário
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    console.log("Resposta do servidor:", responseData);

    if (!response.ok) {
      console.error("Erro na requisição:", responseData);
      return res.status(response.status).json({ error: responseData.message || 'Erro desconhecido' });
    }

    res.status(response.status).json(responseData);
  } catch (error) {
    console.error('Erro ao fazer a requisição:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
