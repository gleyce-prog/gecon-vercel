import React from 'react';
import ModalDynamic from '../../Components/Modal';

const Cadastrar = ({ show, onHide }) => {
  const fields = [
    { name: 'nome', label: 'Nome', type: 'text', placeholder: 'Nome Completo', required: true, pattern: '^([A-Za-zà-úÀ-Ú]+(?: [A-Za-zà-úÀ-Ú]+)*)$', step: 1 },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Email', required: true, step: 1 },
    {
      name: 'senha',
      label: 'Senha',
      type: 'password',
      placeholder: 'Senha',
      title: "A senha deve conter pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número, 1 caractere especial e ter pelo menos 8 caracteres.",
      required: true,
      pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=[\\]{};:"|,.<>/?]).{8,}$',
      step: 1
    },
    { name: 'cpf', label: 'CPF', type: 'text', placeholder: 'XXX.XXX.XXX-XX', pattern: '\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}', step: 1 },
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
