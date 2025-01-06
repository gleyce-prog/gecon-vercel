import React from 'react';
import TableComponent from '../../Components/Listar';
import Cadastrar from './Cadastrar';
import Editar from './Editar';
import clientesJson from '../json/clientes.json'
export default function Listar_Cliente() {
  const columns = [
    { value: 'id', label: 'ID' },
    { value: 'cnpj', label: 'CNPJ' },
    { value: 'nome', label: 'Nome' },
    { value: 'email', label: 'Email' },
    { value: 'status', label: 'Status' },
    { value: 'ações', label: 'Ações' }
  ];
  const route = '/cliente';
  const title = 'Cliente';
  const buttons = ['/cliente-cadastrar', 'Editar'];
  return (
    <TableComponent
      // apiUrl={"cliente"}
      columns={columns}
      route={route}
      title={title}
      button={buttons}
      dados={clientesJson}
    />
  );
};
