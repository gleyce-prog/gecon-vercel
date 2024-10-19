export default async function handler(req, res) {
  const base = req.url.includes('/api/proxy') ? req.url.replace('/api/proxy/', '') : req.url;

  const endpoint = `http://195.35.40.77:8080/gecon/v1/${base}`;
  console.log("Endpoint: " + endpoint)
  console.log("Headers: " + req.headers)

  try {
    const response = await fetch(endpoint, {
      method: req.method,
      headers: req.headers,
      body: req.method === 'POST' || req.method === 'PUT' ? JSON.stringify(req.body) : undefined,
    });
    if (!response.ok) {
      const errorText = await response.text();
      try {
        const parsedError = JSON.parse(errorText);
        if (parsedError?.message) {
          return res.status(response.status).json({ error: parsedError.message });
        }
        else if (parsedError?.description) {
          return res.status(response.status).json({ error: parsedError.description });
        }
        else {
          return res.status(response.status).json({ error: parsedError.title });
        }
      } catch (parseError) {
        console.error('Erro ao fazer parse do erro:', parseError);
        return res.status(response.status).json({ error: 'Erro desconhecido' });
      }
    }

    const data = await response.json();

    if (!data) {
      return res.status(response.status).json({ error: data.Error });
    }

    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Erro na requisição:', error);
    res.status(error.status).json({ error: error.message });
  }
}