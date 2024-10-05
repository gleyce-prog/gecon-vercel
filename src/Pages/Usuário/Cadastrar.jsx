import React from 'react';
import ModalDynamic from '../../Components/Modal';
import { api } from '../../lib/Axios';

const Cadastrar = ({ show, onHide }) => {

  const fields = [
    { name: 'nome', label: 'Nome', type: 'text', placeholder: 'Nome', required: true, step: 1},
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Email', required: true, step: 1},
    { name: 'cpf', label: 'CPF', type: 'text', placeholder: 'XXX.XXX.XXX-XX', pattern: '\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}', step: 1, text:'O CPF deve seguir esse padrão XXX.XXX.XXX-XX'},
    { name: 'perfil', label: 'Perfil', type: 'multi-select', required: true, placeholder: 'Selecione', step: 1 }
  ];

  return (
    <ModalDynamic
      title="Cadastro de Usuário"
      show={show}
      onHide={onHide}
      fields={fields}
      post="usuario"
    />
  );
};

export default Cadastrar;
