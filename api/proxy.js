export default async function handler(req, res) {


  const { url, data } = req;

  if (!url) {
    return res.status(400).json({ error: 'URL não fornecida' });
  }

  try {
    console.log("Fazendo requisição para:", url);

    fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "nome": "teste",
        "email": "teste@gmail.com",
        "senha": "123",
        "perfil": []
      }),
    }).then((response)=>{
      return res.status(200).json({ acerto: response.data})
    }).catch((error)=> {
      return res.status(400).json({ error: error})
    })

   
  } catch (error) {
   
  }
}
