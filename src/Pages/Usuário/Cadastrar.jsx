import React from 'react';
import ModalDynamic from '../../Components/Modal';

const Cadastrar = ({ show, onHide }) => {

  const fields = [
    { name: 'nome', label: 'Nome', type: 'text', placeholder: 'Nome', step: 1, required: true, },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Email', step: 1, required: true, },
    {
      name: 'senha',
      label: 'Senha',
      type: 'password',
      placeholder: 'Senha',
      title: "A senha deve conter pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número, 1 caractere especial e ter pelo menos 8 caracteres.",
      pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};:"|,.<>/?]).{8,}$',
      step: 1,
      required: true,
    },
    { name: 'cpf', label: 'CPF', type: 'mask', step: 1, mask: '999.999.999-99', required: true },
    { name: 'perfil', label: 'Perfil', type: 'multi-select', placeholder: 'Selecione', step: 1, required: true }
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