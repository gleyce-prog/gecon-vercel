export default async function handler(req, res) {
  const base = req.url.includes('/api/proxy') ? req.url.replace('/api/proxy/', '') : req.url;


  console.log("Endpoint: " + endpoint)
  console.log("Headers: "+ req.headers)

  try {
    const response = await fetch(req.url, {
      method: req.method,
      headers: req.headers,
      body: req.method === 'POST' || req.method === 'PUT' ? JSON.stringify(req.body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Erro na requisição:', error);
    res.status(error.status).json({ error: error.message  });
  }
}