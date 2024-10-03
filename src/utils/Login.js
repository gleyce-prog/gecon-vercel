import { api } from '../lib/Axios';
import { JWT_TOKEN } from '../config/Globals';
const storage = localStorage;
const loginApi = (email, senha) => {
    return api().post('auth/login', {
        email: email,
        password: senha
    }).then((response) => {
        if (response.data.token) {
            storage.setItem("token", response.data.token);
        }
        return !!storage.getItem("token"); 
    }).catch((error) => {
        console.error(error);
        return false;
    });
}
const getWithExpiration = () => {
    if (JWT_TOKEN) {
        const exp = new Date(JWT_TOKEN?.exp * 1000);
        const now = new Date();
        if (now > exp) {
            alert("Token expirado!");
            setTimeout(() => {
                storage.removeItem('token');
            }, 4000);
        } else return true;

    }
    else return false;
};
export { getWithExpiration, loginApi };
