import Swal from 'sweetalert2';
const Senhas = (password_new, password_confirm) => {
    try {
        const result = (ComparePasswords(password_new, password_confirm) && sizePassword(password_new, password_confirm));
        if (result) {
            Swal.fire({
                icon: 'success',
                title: 'Senha salva com sucesso!',
                showConfirmButton: false
            }).then(() => {
                window.location.pathname = '/login';
            });
        }
    }
    catch (error) {
        console.log(error);
    }

}
const ComparePasswords = (password_new, password_confirm) => {
    if (password_confirm === password_new) {
        return true;
    } else { throw new Error('As senhas não coincidem') }
}

const sizePassword = (password_new, password_confirm) => {
    if (password_new.length < 7 || password_confirm.length < 7) {
        throw new Error('A senha deve ter pelo menos 7 caracteres');
    }
    return true;
};


export { ComparePasswords, sizePassword, Senhas };
