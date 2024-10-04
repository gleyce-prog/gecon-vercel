import React, { useState } from 'react';
import DynamicModal from '../../Components/Modal';
import Listar from '../../Components/Listar';
import CadastrarSocio from '../Socio/Cadastrar';
import EditarSocio from '../Socio/Editar';
const Cadastrar = ({ show, onHide }) => {
  const [data, setData] = useState({});
  const [qsaOptions, setQsaOptions] = useState([]);


  const onSubmit = (data) => {
    if (data.status === 'ERROR') {
      alert(data.message);
    } else {
      setData(data);

      setQsaOptions(data?.qsa.map(socio => ({
        label: `${socio?.nome} - ${socio?.qual}`,
        nome: socio?.nome,
        qual: socio?.qual,
      })));

    }
  };
  const columns = [
    { value: 'nome', label: 'Nome' },
    { value: 'qual', label: 'Qualificação' },
    { value: 'ações', label: 'Ações' }
  ];

  const modal = [CadastrarSocio, EditarSocio];
  const fields = [
    { name: 'cnpj', label: 'CNPJ', type: 'text', placeholder: "00.000.0000000-00", pattern: "[0-9]{2}\\.[0-9]{3}\\.[0-9]{3}/[0-9]{4}-[0-9]{2}", request: true, step: 1 },
    { name: 'nome', label: 'Nome', type: 'text', value: data?.nome, step: 1 },
    { name: 'logradouro', label: 'Logradouro', type: 'text', value: data?.logradouro, step: 1 },
    { name: 'numero', label: 'Número', type: 'text', value: data?.numero, step: 1 },
    { name: 'municipio', label: 'Município', type: 'text', value: data?.municipio, step: 1 },
    { name: 'bairro', label: 'Bairro', type: 'text', value: data?.bairro, step: 1 },
    { name: 'uf', label: 'UF', type: 'text', value: data?.uf, step: 1 },
    { name: 'cep', label: 'CEP', type: 'text', value: data?.cep, step: 1 },
    { name: 'email', label: 'Email', type: 'email', value: data?.email, step: 1 },
    { name: 'telefone', label: 'Telefone', type: 'text', value: data?.telefone, step: 1 },
    {
      name: 'qsa',
      label: 'Quadro de Sócios e Administradores',
      type: 'custom',
      customComponent: <Listar dados={qsaOptions} columns={columns} showHeader={false} showPagination={false} title={'Sócio'} ModalComponents={modal}/>,
      required: true,
      step: 2
    },
  ];

  return (
    <DynamicModal
      title="Cadastro de Cliente"
      show={show}
      onHide={onHide}
      fields={fields}
      post=""
      onSubmit={onSubmit}
      get="https://cors-anywhere.herokuapp.com/https://receitaws.com.br/v1/cnpj/"
    />
  );
};

export default Cadastrar;
