import React, { useEffect, useState } from 'react';
import ModalDynamic from '../../Components/Modal';
import { api } from '../../lib/Axios';
const Editar = ({ show, onHide, item }) => {
  const [formData, setFormData] = useState({});
  const [profiles, setProfiles] = useState();
  useEffect(() => {
    setFormData(item);
    if (item) {
      api(true).get(`/grupoAcesso/getByUuidUsuario/${item.uuid}`)
        .then(response => response.data)
        .then(data => setProfiles(data))
        .catch(error => console.error('Erro:', error));
    }
    }, [item]);

  const fields = [
    { name: 'nome', label: 'Nome', type: 'text', defaultValue: formData?.nome, placeholder: formData?.nome, step: 1 },
    { name: 'email', label: 'Email', type: 'email', defaultValue: formData?.email, placeholder: formData?.email, step: 1 },
    { name: 'cpf', label: 'CPF', type: 'text', value: formData?.cpf, disabled: true, step: 1 },
    {
      name: 'perfil', label: 'Perfil', type: 'multi-select', placeholder: 'Selecione', step: 1, checkeds: profiles?.map((profile)=> {return profile.id})
    },
  ];


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