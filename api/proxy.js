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
      console.log(response)
    }).catch((error)=> console.log(error))

   
  } catch (error) {
   
  }
}
