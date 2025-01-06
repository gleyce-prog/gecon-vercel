import React, { useState } from 'react';
import { Form, Input, Button, Upload, message, Tabs, Spin } from 'antd';
import InputMask from 'react-input-mask';
import { UploadOutlined } from '@ant-design/icons';
import TabsRender from "../../Components/Formulários/Tabs";

const CadastroCliente = () => {
  const [formValues, setFormValues] = useState({
    1: { cnpj: '', razaoSocial: '', email: '', password: '' },
    2: { name: '', phone: '' },
    3: { address: '', bairro: '', logradouro: '', numero: '', cep: '', municipio: '', uf: '' },
    4: { doc: null },
  });

  const [loadingCNPJ, setLoadingCNPJ] = useState(false);


  const items = [
    {
      label: 'Cadastro Básico',
      key: '1',
      children: (
        <Form>
          <Form.Item
            label="CNPJ"
            rules={[
              { required: true, message: 'CNPJ é obrigatório' },
              { pattern: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, message: 'Formato de CNPJ inválido' },
            ]}
          >
            <InputMask
              className={`form-control`}
              style={{ borderRadius: '0.25rem', padding: '0.375rem 0.75rem' }}
              mask="99.999.999/9999-99"
              value={formValues[1]?.cnpj}
              onChange={(e) => handleInputChange(e, 1, 'cnpj')}
              onBlur={(e) => onSearchCNPJ(e.target.value)} // Chamando a busca ao perder o foco
            />
            {loadingCNPJ && <Spin style={{ marginLeft: 10 }} />}
          </Form.Item>
          <Form.Item label="Razão Social" rules={[{ required: true, message: 'Razão social é obrigatória' }]}>
            <Input value={formValues[1]?.razaoSocial} onChange={(e) => handleInputChange(e, 1, 'razaoSocial')} />
          </Form.Item>
          <Form.Item label="Email" rules={[{ required: true, message: 'Email é obrigatório' }]}>
            <Input value={formValues[1]?.email} onChange={(e) => handleInputChange(e, 1, 'email')} />
          </Form.Item>
          <Form.Item label="Senha" rules={[{ required: true, message: 'Senha é obrigatória' }]}>
            <Input.Password value={formValues[1]?.password} onChange={(e) => handleInputChange(e, 1, 'password')} />
          </Form.Item>
        </Form>
      ),
      disabled: true
    },
    {
      label: 'Dados Pessoais',
      key: '2',
      children: (
        <Form>
          <Form.Item label="Nome" rules={[{ required: true, message: 'Nome é obrigatório' }]}>
            <Input value={formValues[2]?.name} onChange={(e) => handleInputChange(e, 2, 'name')} />
          </Form.Item>
          <Form.Item
            label="Telefone"
            rules={[
              { required: true, message: 'Telefone é obrigatório' },
              { pattern: /^\(\d{2}\)\s\d{4,5}-\d{4}$/, message: 'Formato de telefone inválido' },
            ]}
          >
            <InputMask
              className={`form-control`}
              style={{ borderRadius: '0.25rem', padding: '0.375rem 0.75rem' }}
              mask="(99) 99999-9999"
              value={formValues[2]?.phone}
              onChange={(e) => handleInputChange(e, 2, 'phone')}
            />
          </Form.Item>
        </Form>
      ),
      disabled: true
    },
    {
      label: 'Endereço',
      key: '3',
      children: (
        <Form>
          <Form.Item label="Endereço Completo" rules={[{ required: true, message: 'Endereço é obrigatório' }]}>
            <Input value={formValues[3]?.address} onChange={(e) => handleInputChange(e, 3, 'address')} />
          </Form.Item>
          <Form.Item label="CEP" rules={[{ required: true, message: 'CEP é obrigatório' }]}>
            <InputMask
              className={`form-control`}
              style={{ borderRadius: '0.25rem', padding: '0.375rem 0.75rem' }}
              mask="99999-999"
              value={formValues[3]?.cep}
              onChange={(e) => handleInputChange(e, 3, 'cep')}
            />
          </Form.Item>
        </Form>
      ),
      disabled: true
    },
    {
      label: 'Documentação e Cadastro Pessoa Física',
      key: '4',
      children: (
        <Form>
          <Form.Item label="Documentação">
            <Upload
              name="file"
              accept=".jpg,.jpeg,.png,.pdf"
              action="/upload"
              onChange={(info) => handleFileChange(info)}
            >
              <Button icon={<UploadOutlined />}>Clique para enviar os documentos</Button>
            </Upload>
          </Form.Item>
        </Form>
      ),
      disabled: true
    },
  ];

  const handleInputChange = (e, tab, field) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [tab]: {
        ...prevValues[tab],
        [field]: e.target.value,
      },
    }));
  };

  const handleFileChange = (info) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      4: { doc: info.file },
    }));
  };

  const onSearchCNPJ = async (cnpj) => {
    const cnpjSemMascara = cnpj.replace(/\D/g, '');
    setLoadingCNPJ(true);
    try {
      // const response = await fetch(`https://cors-anywhere.herokuapp.com/https://www.receitaws.com.br/v1/cnpj/${cnpjSemMascara}`);
      // const data = await response.json();
      // if (data && data.status === 'OK') {
      const simulatedResponse = {
        status: 'OK',
        cnpj: '12.345.678/0001-90',
        nome: 'Empresa Fictícia LTDA',
        email: 'contato@empresaficticia.com',
        logradouro: 'Rua Exemplo',
        numero: '123',
        bairro: 'Bairro Exemplo',
        municipio: 'Cidade Exemplo',
        uf: 'EX',
        cep: '12345-678',
      };
      const data = simulatedResponse;
      if (data) {
        setFormValues((prevValues) => ({
          ...prevValues,
          1: {
            cnpj: data.cnpj || '',
            razaoSocial: data.nome || '',
            email: data.email || '',
            password: '',
          },
          3: {
            address: `${data.logradouro || ''}, ${data.numero || ''}, ${data.bairro || ''}, ${data.municipio || ''} - ${data.uf || ''}, ${data.cep || ''}`,
            logradouro: data.logradouro || '',
            numero: data.numero || '',
            bairro: data.bairro || '',
            cep: data.cep || '',
            municipio: data.municipio || '',
            uf: data.uf || '',
          }
        }));
      } else {
        message.error('Não foi possível recuperar os dados da empresa.');
      }
    } catch (error) {
      message.error('Erro ao buscar dados do CNPJ.');
    } finally {
      setLoadingCNPJ(false);
    }
  };

  return (
    <TabsRender items={items} formValues={formValues}
      apiUrlPost={'teste'}
      onHide={() => window.location.href = 'socio-cadastrar'
      } />
  );
};

export default CadastroCliente;
