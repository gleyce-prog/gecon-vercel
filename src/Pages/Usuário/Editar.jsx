import React, { useEffect, useState } from 'react';
import ModalDynamic from '../../Components/Modal';

const Editar = ({ show, onHide, item }) => {
  const [formData, setFormData] = useState({});
  const fields = [
    { name: 'uuid', label: 'UUID', type: 'text', value: formData?.uuid, disabled: true, step: 1 },
    { name: 'cpf', label: 'CPF', type: 'text', value: formData?.cpf, disabled: true , step: 1},
    { name: 'nome', label: 'Nome', type: 'text', defaultValue: formData?.nome , step: 1},
    { name: 'email', label: 'Email', type: 'email', defaultValue: formData?.email, step: 1 },
    { name: 'perfil', label: 'Perfil', type: 'multi-select', placeholder: 'Selecione', defaultValue: formData?.grupos?.map((grupo) => grupo.id), step: 1 },
  ];

  useEffect(() => {
    setFormData(item);
  }, [item]);

  return formData && Object.keys(formData).length > 0 && (
    <ModalDynamic
      title={'Editar Usuário'}
      show={show}
      onHide={onHide}
      fields={fields}
      post={'usuario'}
      formData={formData}
    />
  );
};

export default Editar;