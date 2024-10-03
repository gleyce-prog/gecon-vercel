import React from 'react';
import TableComponent from '../../Components/Listar';
import Cadastrar from './Cadastrar';
import Editar from './Editar';

export default function Listar_Usuario() {
  const columns = [
    { value: 'id', label: 'ID' },
    { value: 'cpf', label: 'CPF' },
    { value: 'nome', label: 'Nome' },
    { value: 'email', label: 'Email' },
    { value: 'perfil', label: 'Perfil' },
    { value: 'ativo', label: 'Status' },
    { value: 'ações', label: 'Ações' }
  ];
  const route = '/usuario';
  const title = 'Usuário';
  const modal = [Cadastrar, Editar];
  return (
    <TableComponent
      apiUrl={"usuario"}
      columns={columns}
      route={route}
      title={title}
      ModalComponents={modal}
    />
  );
};
