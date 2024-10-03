import React from 'react';
import TableComponent from '../../Components/Listar';
import Cadastrar from './Cadastrar';
import Editar from './Editar';

export default function Listar_Cliente() {
  const columns = [
    { value: 'id', label: 'ID' },
    { value: 'cnpj', label: 'CNPJ' },
    { value: 'nome', label: 'Nome' },
    { value: 'email', label: 'Email' },
    { value: 'grupos', label: 'Grupos' },
    { value: 'status', label: 'Status' },
    { value: 'ações', label: 'Ações' }
  ];
  const route = '/cliente';
  const title = 'Cliente';
  const modal = [Cadastrar, Editar];
  return (
    <TableComponent
      apiUrl={"cliente"}
      columns={columns}
      route={route}
      title={title}
      ModalComponents={modal}
    />
  );
};
