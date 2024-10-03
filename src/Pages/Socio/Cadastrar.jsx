import React from 'react';
import ModalDynamic from '../../Components/Modal';

const Cadastrar = ({ show, onHide }) => {
  const fields = [
    { name: 'nome', label: 'Nome', type: 'text', placeholder: 'Nome Completo', required: true, pattern: '^([A-Za-zà-úÀ-Ú]+(?: [A-Za-zà-úÀ-Ú]+)*)$', step: 1 },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Email', required: true, step: 1 },
    {
      name: 'qualificacao',
      label: 'Qualificação',
      type: 'text',
      required: true,
      step: 1
    },
  ];

  return (
    <ModalDynamic
      title="Cadastro de Sócio"
      show={show}
      onHide={onHide}
      fields={fields}
      post="usuario"
    />
  );
};

export default Cadastrar;
