import React from 'react';

export default function Voltar_login({ rota }) {

    const handleSkipLogin = () => {
        window.location.pathname= rota;
    };


    return (
        <a className="btn-link text-primary" onClick={handleSkipLogin} style={{ cursor: 'pointer' }}><i className="fa-solid fa-angle-left" /> Voltar para Login </a>
    );
}
