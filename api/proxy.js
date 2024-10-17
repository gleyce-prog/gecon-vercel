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
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((response)=>{
      console.log(response)
    }).catch((error)=> console.log(error))

   
  } catch (error) {
   
  }
}
