import React from 'react';
import Button from 'react-bootstrap/Button';
import { Permission } from '../../config/Rotas_protegidas';
import { mostrarAlertaConfirmacao } from '../../lib/swal';
import { api } from '../../lib/Axios';
export default function Buttons({ dado, type, rota, title, onClick }) {
    if (!Permission(rota))
        return null;

    const inativarUsuario = () => {
        mostrarAlertaConfirmacao(
            'Confirmação necessária',
            'Tem certeza que deseja inativar o usuário?',
            () => {
            return api(true).put(`usuario/disable/${dado.uuid}`)
            },
            200
        );
    };

    const ativarUsuario = () => {
        mostrarAlertaConfirmacao(
            'Confirmação necessária',
            'Tem certeza que deseja aivar o usuário?',
            () => {
            return api(true).put(`usuario/enable/${dado.uuid}`)
            },
            200
        );
    };

    if (type === 'cadastrar') {
        return (
            <div onClick={onClick}>
               <a className="btn btn-primary btn-sm" role="button">Adicionar Novo {title}</a>
             </div>
        );
    } else if (type === 'pesquisar') {
        return (
            <div onClick={onClick}>
                <Button href="#" className="btn btn-primary shadow btn-xs sharp me-1">
                    <i className="fas fa-pencil-alt"></i>
                </Button>
            </div>
        );
    } else if (type === 'inativar') {
        return (
            <div onClick={inativarUsuario}>
                <Button variant="danger" className="shadow btn-xs sharp">
                    <i className="fa-solid fa-ban"></i>
                </Button>
            </div>
        );
    }
    else if (type === 'ativar') {
        return (
            <div onClick={ativarUsuario}>
                <Button variant="success" className="shadow btn-xs sharp">
                <i className="fa-regular fa-circle-check"></i>
                </Button>
            </div>
        );
    }
}

