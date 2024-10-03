import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
const HandleLogout = () =>{
    const navigate = useNavigate();
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
            navigate('/', { replace: true });
            localStorage.clear();
        }
    });
};



export default HandleLogout;