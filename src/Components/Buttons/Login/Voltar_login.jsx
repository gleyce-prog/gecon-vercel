import React from 'react';
import { useNavigate } from 'react-router-dom';
export default function Voltar_login({ rota }) {

    const handleSkipLogin = () => {
        window.location.pathname=rota;
    };


    return (
        <a href="" className="btn-link text-primary" onClick={handleSkipLogin} style={{ cursor: 'pointer' }}><i class="fa-solid fa-angle-left" /> Voltar para Login </a>
    );
}
