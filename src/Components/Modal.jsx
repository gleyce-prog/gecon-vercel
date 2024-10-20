import React, { useEffect, useState } from 'react'; 
import Multiselect from 'multiselect-react-dropdown';
import { Modal, Form, Row, Col, Button } from 'react-bootstrap';
import { api } from '../lib/Axios';
import axios from 'axios';

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
            api(true).get('/grupoAcesso/getList')
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
            axios.get(`${get}${dado}`)
                .then((response) => {
                    if (response.data) {
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

    const onSelect = (selectedList) => {
        setValueProfiles(selectedList.sort((a, b) => a.id - b.id).map((item) => item.id));
    };

    const onRemove = (selectedList, removedItem) => {
        setValueProfiles(valueProfiles.filter((id) => id !== removedItem.id));
    };

    const validateFields = () => {
        
        for (const field of fields) {
            if (field.required && !formValues[field.name]) {
                return false; 
            }
        }

        
        const perfilField = fields.find(field => field.name === 'perfil');
        if (perfilField?.required && valueProfiles.length === 0) {
            return false;
        }

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!validateFields()) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            setIsSubmitting(false);
            return;
        }

        let method = '';
        const data = {};

        for (const [key, value] of Object.entries(formValues)) {
            if (key === 'perfil') {
                data[key] = valueProfiles;
            } else if (value === '') {
                const field = fields.find(field => field.name === key && (field?.defaultValue ? field.defaultValue : field.value));
                if (field) data[key] = field?.defaultValue ?? field?.value;
            } else {
                data[key] = value;
            }
        }

        switch (title.trim().split(' ')[0]) {
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
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'dados-enviados.json';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const actions = { perfil: fetchProfiles };
        fields.forEach((field) => {
            const action = actions[field.name];
            if (action) action();
        });
        fields.forEach((field) => {
            if (field.type === 'multi-select' && field.checkeds && profiles) {
                setValueProfiles(field.checkeds);
            }
        });
    }, [fields]);

    return (
        <Modal show={show} onHide={onHide} backdrop="static" size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        {fields
                            .filter(field => field.step === currentStep)
                            .map((field, index) => (
                                <Col key={index} xl={fields.filter(f => f.step === currentStep).length >= 2 ? 6 : 12}>
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
                                                {field.options.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        ) : field.type === 'multi-select' && field.label === 'Perfil' ? (
                                            <Multiselect
                                                options={profiles.map(profile => ({ id: profile.id, name: profile.grupo }))}
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
                                                loading={!profiles}
                                                hideSelectedList={true}
                                                selectedValues={profiles.filter(profile => field?.checkeds?.includes(profile.id)).map(profile => ({ id: profile.id, name: profile.grupo }))}
                                            />
                                        ) : (
                                            <Form.Control
                                                type={field.type}
                                                placeholder={field.placeholder}
                                                name={field.name}
                                                value={formValues[field.name] ?? ''}
                                                onChange={handleChange}
                                                required={field.required}
                                            />
                                        )}
                                    </Form.Group>
                                </Col>
                            ))}
                    </Row>
                    <div className="mt-3 d-flex justify-content-end">
                        {currentStep > 1 && (
                            <Button variant="secondary" onClick={() => setCurrentStep(currentStep - 1)} className="me-2">
                                Voltar
                            </Button>
                        )}
                        {currentStep < steps.length ? (
                            <Button variant="primary" onClick={() => setCurrentStep(currentStep + 1)}>
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
