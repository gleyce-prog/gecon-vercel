export default async function handler(req, res) {
  const { url, data } = req; // Use req.body para obter os dados

  // Verifique se a URL foi fornecida
  if (!url) {
    return res.status(400).json({ error: 'URL não fornecida' });
  }

  try {
    console.log("Fazendo requisição para:", url);

    // Faça a requisição para a URL fornecida
    const response = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "nome": "teste",
        "email": "teste@gmail.com",
        "senha": "123",
        "perfil": []
      }), // Use os dados fornecidos
    });

    // Obtenha os dados da resposta
    const responseData = await response.json();

    // Retorne a resposta ao cliente
    if (!response.ok) {
      // Se a resposta não for ok, retorne um erro
      return res.status(response.status).json({ error: responseData.error || 'Erro desconhecido' });
    }

    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    console.error('Erro ao fazer a requisição:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
