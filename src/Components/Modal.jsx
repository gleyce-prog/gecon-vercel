import React, { useEffect, useState } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import { Modal, Form, Row, Col, Button } from 'react-bootstrap';
import { api } from '../lib/Axios';
import { url, token } from '../config/Globals';
import InputMask from 'react-input-mask';
import axios from 'axios';
import { mostrarAlertaSucesso } from '../lib/swal';

const DynamicModal = ({ show, onHide, fields, post, get, onSubmit, title }) => {
  const [formValues, setFormValues] = useState(
    fields.reduce((acc, field) => {
      acc[field.name] = '';
      return acc;
    }, {})
  );
  const [valueProfiles, setValueProfiles] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const fetchProfiles = () => {
    try {
      api(true)
        .get('/grupoAcesso/getList')
        .then(response => response.data)
        .then(data => setProfiles(data))
        .catch(error => console.error('Erro:', error));
    } catch (error) {
      console.error('Erro ao buscar perfis:', error);
    }
  };

  const fetchAdditionalData = (fieldName, fieldValue) => {
    let dado = fieldName === 'cnpj' ? fieldValue.replace(/[./-]/g, '') : fieldValue;
    try {
      axios.get(`${get}${dado}`).then((response) => {
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
      });
    } catch (error) {
      console.error('Erro ao buscar dados adicionais:', error);
    }
  };

  function getFirst(title) {
    const trimmed = title.trim();
    const name = trimmed.split(' ');
    return name[0];
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));

    const field = fields.find(field => field.name === name);
    if (field?.request && value) {
      fetchAdditionalData(name, value);
    }
  };

  const onSelect = (selectedList, selectedItem) => {
    console.log(selectedList);
    setValueProfiles(selectedList.sort((a, b) => a.id - b.id).map((item) => item.id));
  };

  const onRemove = (selectedList, removedItem) => {
    setValueProfiles(valueProfiles.filter((id) => id !== removedItem.id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Set submitting to true

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

      fetch(`https://painel-ativa.vercel.app/api/proxy/${post}`, {
        method: `${method}`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
        .then(response => {
          if (!response.ok) {
            return response.json().then(err => {
              alert(err.error.mensagem);
            }).catch((err) => {
              alert(err.error.mensagem);
            });
          }
          return response.json();
        })
        .then(data => {
          if (data) {
            mostrarAlertaSucesso(`Usuário ${(title.trim().split(' ')[0]) === "Cadastro" ? "cadastrado" : "editado"} com sucesso!`, 'Sucesso', () => {
              onHide();
              setTimeout(() => {
                window.location.reload();
              }, 700);
            });
          }
        })
        .catch(error => {
          alert(error);
        })
        .finally(() => {
          setIsSubmitting(false);
        });

    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      setIsSubmitting(false);
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

    const actions = {
      perfil: fetchProfiles
    };

    fields.forEach((field) => {
      const action = actions[field.name];
      if (action) {
        action();
      }
    });

    fields.forEach((field) => {
      if (field.type === 'multi-select' && field.checkeds && profiles) {
        setValueProfiles(field.checkeds);
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
                          {field.options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Form.Control>
                      ) : field.type === 'multi-select' ? (
                        field.label === 'Perfil' && (
                          <Multiselect
                            options={profiles.map((profile) => ({
                              id: profile.id,
                              name: profile.grupo
                            }))}
                            displayValue="name"
                            showCheckbox={true}
                            style={{
                              multiselectContainer: { fontSize: '12px' },
                              optionContainer: { fontSize: '12px' },
                              chips: { fontSize: '12px' }
                            }}
                            emptyRecordMsg={"Sem opções"}
                            onSelect={onSelect}
                            onRemove={onRemove}
                            placeholder={field.placeholder}
                            name={field.name}
                            required={field.required}
                            loading={!profiles ? true : false}
                            hideSelectedList={true}
                            selectedValues={
                              profiles
                                .filter(profile => field?.checkeds?.includes(profile.id))
                                .map(profile => ({ id: profile.id, name: profile.grupo }))
                            }
                          />
                        )
                      ) : field.type === 'custom' ? (
                        field.customComponent
                      ) : field.type === 'mask' ? (
                        <InputMask
                          mask={field.mask}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          disabled={field.disabled}
                          name={field.name}
                          title={field.title}
                          className={`form-control ${field.disabled ? 'disabled' : ''}`}
                          required={field.required}
                          style={{ borderRadius: '0.25rem', padding: '0.375rem 0.75rem' }}
                        />
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
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Enviado' : 'Enviar'}
              </Button>
            )}
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default DynamicModal;