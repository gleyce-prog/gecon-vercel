export default async function handler(req, res) {
  const base = req.url.includes('/api/proxy') ? req.url.replace('/api/proxy/', '') : req.url;

  console.log("Endpoint: " + base);
  console.log("Headers: ", req.headers);

  try {
    const response = await fetch(base, {
      method: req.method,
      headers: {
        ...req.headers,
        // Adicione cabeçalhos adicionais, se necessário, como Authorization
      },
      body: req.method === 'POST' || req.method === 'PUT' ? JSON.stringify(req.body) : undefined,
    });

    // Se a resposta não for bem-sucedida, trata os erros
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro na requisição:', errorData); // Exibe a mensagem de erro da resposta
      return res.status(response.status).json({ error: errorData.message || 'Erro desconhecido' });
    }

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Erro na requisição:', error);
    res.status(500).json({ error: error.message || 'Erro interno do servidor' });
  }
}
