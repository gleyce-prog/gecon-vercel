import React, { useEffect, useState } from 'react';
import ModalDynamic from '../../Components/Modal';

const Editar = ({ show, onHide, item }) => {
  const [formData, setFormData] = useState({});
  const fields = [
    { name: 'nome', label: 'Nome', type: 'text', placeholder: 'Nome Completo', required: true, pattern: '^([A-Za-zà-úÀ-Ú]+(?: [A-Za-zà-úÀ-Ú]+)*)$', step: 1 },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Email', required: true, step: 1 },
    {
      name: 'qualificacao',
      label: 'Qualificação',
      type: 'text',
      required: true,
      step: 1
    }
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