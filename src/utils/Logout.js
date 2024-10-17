import Swal from 'sweetalert2';
const HandleLogout = () =>{
    Swal.fire({
        title: 'Tem certeza que deseja sair?',
        text: 'Você será deslogado do sistema.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#135131',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, sair!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear();
            window.location.pathname = '/login';
        }
    });
};



export default HandleLogout;