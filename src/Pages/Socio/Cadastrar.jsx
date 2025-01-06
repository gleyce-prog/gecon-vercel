import React, { useState } from 'react';
import { Form, Input, Button, Table, message, Modal, Drawer, Space, Select, Upload, ConfigProvider } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UnorderedListOutlined } from '@ant-design/icons';
import TabsRender from "../../Components/Formulários/TabsRender2";
import InputMask from 'react-input-mask';
import moment from 'moment';
import ptBR from 'antd/lib/locale/pt_BR';

const CadastroSocio = () => {
  const [formValues, setFormValues] = useState({
    1: { nome: '', telefone: '', cpf: '', dependentes: [] },
  });

  const [loading, setLoading] = useState(false);
  const [socios, setSocios] = useState([]);
  const [isTabsVisible, setIsTabsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [dependentFormValues, setDependentFormValues] = useState({
    nome: '',
    telefone: '',
    cpf: '',
    relacionamento: '',
    dataNascimento: null,
    fileList: [],
  });
  const [editingDependentIndex, setEditingDependentIndex] = useState(null);

  const validateName = (name) => {
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+\s[A-Za-zÀ-ÖØ-öø-ÿ]+(\s[A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
    return nameRegex.test(name);
  };

  const validateCPF = (cpf) => {
    if (!cpf || cpf.trim() === '') return true;
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(10))) return false;

    return true;
  };

  const handleAddSocio = () => {
    setFormValues({ 1: { nome: '', telefone: '', cpf: '', dependentes: [] } });
    setIsEditing(false);
    setIsTabsVisible(true);
  };

  const saveSocio = () => {
    const currentSocio = formValues[1];

    if (!validateName(currentSocio.nome)) {
      message.error('Por favor, insira nome completo (pelo menos dois nomes)');
      return;
    }

    if (!validateCPF(currentSocio.cpf)) {
      message.error('CPF inválido');
      return;
    }

    const newSocio = {
      id: isEditing ? editingId : Date.now(),
      nome: currentSocio.nome,
      telefone: currentSocio.telefone,
      cpf: currentSocio.cpf,
      dependentes: currentSocio.dependentes
    };

    if (isEditing) {
      setSocios(prevSocios => prevSocios.map(socio => socio.id === editingId ? newSocio : socio));
      message.success('Sócio atualizado com sucesso!');
    } else {
      setSocios(prevSocios => [...prevSocios, newSocio]);
      message.success('Sócio adicionado com sucesso!');
    }

    setIsTabsVisible(false);
    setIsEditing(false);
    setEditingId(null);
    setFormValues({ 1: { nome: '', telefone: '', cpf: '', dependentes: [] } });
  };

  const handleEditSocio = (record) => {
    setFormValues({
      1: {
        nome: record.nome,
        telefone: record.telefone,
        cpf: record.cpf,
        dependentes: record.dependentes || []
      }
    });
    setIsEditing(true);
    setEditingId(record.id);
    setIsTabsVisible(true);
  };

  const handleRemoveSocio = (id) => {
    Modal.confirm({
      title: 'Tem certeza que deseja remover este sócio?',
      onOk() {
        setSocios(prevSocios => prevSocios.filter(socio => socio.id !== id));
        message.success('Sócio removido com sucesso!');
      },
    });
  };

  const addDependent = () => {
    const { nome, telefone, cpf, relacionamento, dataNascimento, fileList } = dependentFormValues;

    if (!validateName(nome)) {
      message.error('Nome do dependente inválido (pelo menos dois nomes)');
      return;
    }

    if (cpf && !validateCPF(cpf)) {
      message.error('CPF do dependente inválido');
      return;
    }

    const newDependent = {
      ...dependentFormValues,
      id: Date.now(),
      dataNascimento: dataNascimento ? moment(dataNascimento).format('YYYY-MM-DD') : null,
    };

    if (editingDependentIndex !== null) {
      setFormValues(prev => {
        const updatedDependents = [...prev[1].dependentes];
        updatedDependents[editingDependentIndex] = newDependent;
        return { ...prev, 1: { ...prev[1], dependentes: updatedDependents } };
      });
      setEditingDependentIndex(null);
      message.success('Dependente editado com sucesso');
    } else {
      setFormValues(prev => ({
        ...prev,
        1: {
          ...prev[1],
          dependentes: [...(prev[1].dependentes || []), newDependent],
        }
      }));
      message.success('Dependente adicionado com sucesso');
    }

    setDependentFormValues({ nome: '', telefone: '', cpf: '', relacionamento: '', dataNascimento: null, fileList: [] });
    setModalVisible(false);
  };

  const handleEditDependent = (index) => {
    const dependent = formValues[1].dependentes[index];
    setDependentFormValues(dependent);
    setEditingDependentIndex(index);
    setModalVisible(true);
  };

  const handleRemoveDependent = (index) => {
    const dependents = [...formValues[1].dependentes];
    dependents.splice(index, 1);
    setFormValues(prev => ({
      ...prev,
      1: {
        ...prev[1],
        dependentes: dependents
      }
    }));
    message.success('Dependente removido com sucesso');
  };

  const items = [
    {
      label: 'Dados Pessoais',
      key: '1',
      children: (
        <Form layout="vertical">
          <Form.Item label="Nome" required>
            <Input
              value={formValues[1].nome}
              onChange={(e) => setFormValues(prev => ({ ...prev, 1: { ...prev[1], nome: e.target.value } }))}
              placeholder="Digite o nome completo"
            />
          </Form.Item>
          <Form.Item label="Telefone" required>
            <InputMask
              mask="(99) 99999-9999"
              maskChar=""
              value={formValues[1].telefone}
              onChange={(e) => setFormValues(prev => ({ ...prev, 1: { ...prev[1], telefone: e.target.value } }))}
            >
              {() => (
                <Input
                  placeholder="Digite o telefone"
                />
              )}
            </InputMask>
          </Form.Item>
          <Form.Item label="CPF" required>
            <InputMask
              mask="999.999.999-99"
              maskChar=""
              value={formValues[1].cpf}
              onChange={(e) => setFormValues(prev => ({ ...prev, 1: { ...prev[1], cpf: e.target.value } }))}
            >
              {() => (
                <Input
                  placeholder="Digite o CPF"
                />
              )}
            </InputMask>
          </Form.Item>
        </Form>
      ),
      disabled: true
    },
    {
      label: 'Dependentes',
      key: '2',
      children: (
        <Form>
          <Form.Item label="Dependentes">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type="dashed" onClick={() => setModalVisible(true)} icon={<PlusOutlined />} style={{ width: '100%', padding: '10px 0' }}>
                Adicionar Dependente
              </Button>
              <Modal
                title="Adicionar Dependente"
                visible={modalVisible}
                onOk={addDependent}
                onCancel={() => setModalVisible(false)}
                confirm Loading={loading}
                okText="Salvar"
                cancelText="Cancelar"
              >
                <Form layout="vertical">
                  <Form.Item label="Nome" required>
                    <Input value={dependentFormValues.nome} onChange={(e) => setDependentFormValues({ ...dependentFormValues, nome: e.target.value })} placeholder="Nome completo do dependente" />
                  </Form.Item>
                  <Form.Item label="Telefone">
                    <InputMask
                      mask="(99) 99999-9999"
                      maskChar=""
                      value={dependentFormValues.telefone}
                      onChange={(e) => setDependentFormValues({ ...dependentFormValues, telefone: e.target.value })}
                    >
                      {() => (
                        <Input placeholder="Telefone do dependente" />
                      )}
                    </InputMask>
                  </Form.Item>
                  <Form.Item label="CPF">
                    <InputMask
                      mask="999.999.999-99"
                      maskChar=""
                      value={dependentFormValues.cpf}
                      onChange={(e) => setDependentFormValues({ ...dependentFormValues, cpf: e.target.value })}
                    >
                      {() => (
                        <Input placeholder="CPF do dependente" />
                      )}
                    </InputMask>
                  </Form.Item>
                  <Form.Item label="Relacionamento">
                    <Select
                      value={dependentFormValues.relacionamento}
                      onChange={(value) => setDependentFormValues({ ...dependentFormValues, relacionamento: value })}
                      placeholder="Selecione o relacionamento"
                    >
                      <Select.Option value="Filho(a)">Filho(a)</Select.Option>
                      <Select.Option value="Cônjuge">Cônjuge</Select.Option>
                      <Select.Option value="Pai/Mãe">Pai/Mãe</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="Upload de Arquivo">
                    <Upload
                      fileList={dependentFormValues.fileList}
                      onChange={({ fileList }) => setDependentFormValues({ ...dependentFormValues, fileList })}
                      beforeUpload={() => false}
                    >
                      <Button>Upload Arquivo</Button>
                    </Upload>
                  </Form.Item>
                </Form>
              </Modal>
              {formValues[1].dependentes && formValues[1].dependentes.length > 0 && (
                <Table
                  columns={[
                    { title: 'Nome', dataIndex: 'nome', key: 'nome' },
                    { title: 'Telefone', dataIndex: 'telefone', key: 'telefone' },
                    { title: 'CPF', dataIndex: 'cpf', key: 'cpf', render: (cpf) => cpf || 'Não informado' },
                    { title: 'Relacionamento', dataIndex: 'relacionamento', key: 'relacionamento' },
                    { title: 'Data Nascimento', dataIndex: 'dataNascimento', key: 'dataNascimento' },
                    {
                      title: 'Ações', key: 'acoes', render: (text, record, index) => (
                        <Space>
                          <Button icon={<EditOutlined />} onClick={() => handleEditDependent(index)}>Editar</Button>
                          <Button danger icon={<DeleteOutlined />} onClick={() => handleRemoveDependent(index)}>Remover</Button>
                        </Space>
                      )
                    },
                  ]}
                  dataSource={formValues[1].dependentes}
                  pagination={false}
                />
              )}
            </Space>
          </Form.Item>
        </Form>
      ),
      disabled: true
    }
  ];

  const handleSendData = () => {
    try {
      if (socios.length > 0) {
        console.log(socios);
        message.success('Dados enviados com sucesso!');
      } else {
        throw new Error('Nenhum dado adicionado');
      }
    } catch (error) {
      message.error('Erro ao enviar os dados: ' + error.message);
    }

  };

  return (
    <ConfigProvider locale={ptBR}>
      <div style={{ padding: '20px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ background: '#f0f2f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddSocio} style={{ marginBottom: 16 }}>
              Adicionar Sócio
            </Button>
            {isTabsVisible && (
              <TabsRender items={items} formValues={formValues} onHide={() => setIsTabsVisible(false)} onFinish={saveSocio} />
            )}
          </div>

          <div style={{ background: '#f0f2f5', padding: '20px', borderRadius: '8px' }}>
            <Button type="primary" disabled={socios.length > 0 ? false : true} onClick={handleSendData}>
              Enviar Dados
            </Button>
            <Button type="default" icon={<UnorderedListOutlined />} onClick={() => setDrawerVisible(true)} style={{ marginLeft: 16 }}>
              Listar Sócios
            </Button>
          </div>
        </Space>

        <Drawer
          title="Lista de Sócios"
          placement="right"
          onClose={() => setDrawerVisible(false)}
          visible={drawerVisible}
          width={600}
        >
          <Table
            columns={[
              { title: 'Nome', dataIndex: 'nome', key: 'nome' },
              { title: 'Telefone', dataIndex: 'telefone', key: 'telefone' },
              { title: 'CPF', dataIndex: 'cpf', key: 'cpf' },
              {
                title: 'Ações',
                key: 'acoes',
                render: (text, record) => (
                  <Space>
                    <Button icon={<EditOutlined />} onClick={() => handleEditSocio(record)} />
                    <Button danger icon={<DeleteOutlined />} onClick={() => handleRemoveSocio(record.id)} />
                  </Space>
                ),
              },
            ]}
            dataSource={socios}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            bordered
          />
        </Drawer>
      </div>
    </ConfigProvider>
  );
};

export default CadastroSocio;