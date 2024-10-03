import React, { useEffect, useState } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import { Modal, Form, Row, Col, Button } from 'react-bootstrap';
import { api } from '../lib/Axios';
import { API_URL, TOKEN } from '../config/Globals';
import axios from 'axios';
const DynamicModal = ({ show, onHide, fields, post, get, onSubmit, title }) => {
  const [formValues, setFormValues] = useState({});
  const [valueProfiles, setValueProfiles] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  // Função para obter etapas distintas
  const getFieldSteps = (fields) => {
    const steps = [];
    fields.forEach(field => {
      if (field.step) {
        if (!steps.includes(field.step)) {
          steps.push(field.step);
        }
      } else if (!steps.length) {
        steps.push(1);
      }
    });
    return steps.sort((a, b) => a - b);
  };

  const steps = getFieldSteps(fields);

  // Funções para buscar dados
  const fetchStates = async () => {
    try {
      const response = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
      setStates(response.data);
    } catch (error) {
      console.error('Erro ao buscar estados:', error);
    }
  };

  const fetchProfiles = () => {
    try {
      api(true).get('/grupoAcesso/getList')
        .then(response => response.data)
        .then(data => setProfiles(data))
        .catch(error => console.error('Erro:', error));
    } catch (error) {
      console.error('Erro ao buscar perfis:', error);
    }
  };

  const fetchCities = async (stateId) => {
    try {
      const response = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateId}/municipios`);
      setCities(response.data);
    } catch (error) {
      console.error('Erro ao buscar cidades:', error);
    }
  };

  // Função para preencher campos automaticamente
  const fetchAdditionalData = (fieldName, fieldValue) => {
    let dado = fieldName === 'cnpj' ? fieldValue.replace(/[./-]/g, '') : fieldValue;
    try {
      axios.get(
        `${get}${dado}`
      ).then((response) => {
        if (response.data) {
          onSubmit(response.data);
          const newFormValues = { ...formValues };
          for (const [key, value] of Object.entries(response.data)) {
            const field = fields.find(f => f.name === key);
            if (field) {
              newFormValues[key] = value;
            }
          }
          setFormValues(newFormValues);
          onSubmit(response.data);
        }
      })
    } catch (error) {
      console.error('Erro ao buscar dados adicionais:', error);
    }
  };
  function getFirst(title) {
    const trimmed = title.trim();
    const name = trimmed.split(' ');
    return name[0];
  }
  // Manipulação de eventos
  const handleChange = (e) => {
    console.log('ok')
    const { name, value } = e.target;
    console.log(name)
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));

    if (name === 'state') {
      fetchCities(value);
    }

    const field = fields.find(field => field.name === name);
    if (field?.request && value) {
      fetchAdditionalData(name, value);
    }
  };
  const onSelect = (selectedList, selectedItem) => {
    setValueProfiles(selectedList.sort((a, b) => a.id - b.id).map((item) => item.id));
  };

  const onRemove = (selectedList, removedItem) => {
    setValueProfiles(valueProfiles.filter((id) => id !== removedItem.id));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let method = '';

    const data = {};

    for (const [key, value] of Object.entries(formValues)) {
      if (key === 'perfil') {
        data[key] = valueProfiles;
      } else if (value === '') {
        const field = fields.find(
          (field) => field.name === key && (field?.defaultValue ? field.defaultValue : field.value)
        );
        if (field) data[key] = field?.defaultValue ?? field?.value;
      } else {
        data[key] = value;
      }
    }
    switch (getFirst(title)) {
      case 'Cadastro':
        method = 'POST';
        break;
      case 'Editar':
        method = 'PUT';
        break;
      default:
        break;
    }



    try {
    console.table(data, { tableName: 'Dados enviados!!' });

      fetch(`${API_URL}/${post}`, {
        method: `${method}`,
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
        .then(response => response)
        .then(response =>
          response.status === 201 ?
            setTimeout(() => {
              onHide();
              window.location.reload();
            }, 500)
            :
            alert(response.json()['description']))
        .catch(error => console.error('Erro:', error));
      {
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
    }

  };

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  useEffect(() => {
    const container = document.querySelector('.searchWrapper');
    if (container) {
      container.classList.remove('searchWrapper');
      container.classList.add('form-control');
    }

    // Definindo ações para campos que necessitam de busca de dados
    const actions = {
      perfil: fetchProfiles,
      states: fetchStates,
    };

    fields.forEach((field) => {
      const action = actions[field.name];
      if (action) {
        action();
      }
    });
  }, [fields]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      size="lg"
      centered
      dialogClassName={`modal-${currentStep}`}
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            {fields
              .filter(field => field.step === currentStep)
              .map((field, index) => {
                const colWidth = fields.filter(f => f.step === currentStep).length >= 2 ? 6 : 12;
                return (
                  <Col key={index} xl={colWidth}>
                    <Form.Group controlId={`formGrid${field.name}`}>
                      <Form.Label>
                        {field.label}
                        {field.required && <span style={{ color: 'red', marginLeft: '5px' }}>*</span>}
                      </Form.Label>
                      {field.type === 'select' ? (
                        <Form.Control
                          as="select"
                          name={field.name}
                          value={formValues[field.name] ?? ''}
                          onChange={handleChange}
                          required={field.required}
                        >
                          <option value="" disabled>Selecione</option>
                          {field.label === 'Estado' && states.map(state => (
                            <option key={state.id} value={state.id}>
                              {state.nome}
                            </option>
                          ))}
                          {field.label === 'Cidade' && cities.map(city => (
                            <option key={city.id} value={city.id}>
                              {city.nome}
                            </option>
                          ))}
                        </Form.Control>
                      ) : field.type === 'multi-select' ? (
                        field.label === 'Perfil' && (
                          <Multiselect
                            options={profiles.map((profile) => ({
                              id: profile.id,
                              name: profile.grupo,
                              disabled: !profile.ativo
                            }))}
                            showCheckbox={true}
                            onChange={(e) => handleChange}
                            onSelect={onSelect}
                            onRemove={onRemove}
                            placeholder={field.placeholder}
                            selectedValues={field.defaultValue}
                            name={field.name}
                            required={field.required}
                            loading={!profiles ? true : false}
                            hidePlaceholder={false}
                          />
                        )
                      ) : field.type === 'checkbox' ? (
                        field.options?.map((option, i) => (
                          <Form.Check
                            key={i}
                            type="checkbox"
                            label={option.label}
                            name={field.name}
                            value={option.nome}
                            onChange={handleChange}
                          />
                        ))
                      ) : field.type === 'custom' ? (
                        field.customComponent
                      ) : (
                        <Form.Control
                          type={field.type}
                          placeholder={field.placeholder}
                          name={field.name}
                          value={formValues[field.name] ?? ''}
                          onChange={handleChange}
                          required={field.required}
                          pattern={field.pattern}
                          title={field.title}
                          disabled={field.disabled}
                        />
                      )}
                    </Form.Group>
                  </Col>
                );
              })}
          </Row>
          <div className="mt-3 d-flex justify-content-end">
            {currentStep > 1 && (
              <Button variant="secondary" onClick={handlePreviousStep} className="me-2">
                Voltar
              </Button>
            )}
            {currentStep < steps.length ? (
              <Button variant="primary" onClick={handleNextStep}>
                Próximo
              </Button>
            ) : (
              <Button variant="primary" type="submit">
                Enviar
              </Button>
            )}
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default DynamicModal;
