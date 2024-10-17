import Swal from 'sweetalert2';
const backgroundConfirmButton = '#135131';

const mostrarAlertaSucesso = (titulo, mensagem, callback) => {
  Swal.fire({
    title: titulo,
    icon: 'success',
    confirmButtonColor: backgroundConfirmButton,
    confirmButtonText: 'OK',
  }).then((result) => {
    if (result.isConfirmed && callback) {
      callback();
    }
  });
};


const mostrarAlertaErro = (mensagem) => {
  Swal.fire({
    title: 'Erro',
    text: mensagem,
    icon: 'error',
    confirmButtonColor: backgroundConfirmButton,
    confirmButtonText: 'OK',
  });
};



const mostrarAlertaConfirmacao = (titulo, texto, acao, timeout = null) => {
  try {
    Swal.fire({
      title: titulo,
      text: texto,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: backgroundConfirmButton,
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed && acao) {
        acao().then((response) => {
          if (response.status === 200) {
            mostrarAlertaSucesso('Sucesso', 'Ação realizada com sucesso.',
              () => {
                setTimeout(() => {
                  window.location.reload();
                }, timeout)
              });
          }
        })
          .catch((error) => {
            mostrarAlertaErro('Houve um problema ao realizar a ação: ' + error.message);
          });
      }
    })
  } catch (error) {
    mostrarAlertaErro('Houve um problema ao realizar a ação: ' + error.message);
  }
};

export { mostrarAlertaErro, mostrarAlertaSucesso, mostrarAlertaConfirmacao };