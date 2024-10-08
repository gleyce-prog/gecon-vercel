import Swal from 'sweetalert2';
const HandleLogout = () =>{
    Swal.fire({
        title: 'Tem certeza que deseja sair?',
        text: 'Você será deslogado do sistema.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, sair!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.pathname = '/';
            localStorage.clear();
        }
    });
};



export default HandleLogout;