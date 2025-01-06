import React, { useState, useEffect } from 'react';
import { Button, Tabs, message } from 'antd';

const TabsRender = ({ items, apiUrlPost, formValues, onHide }) => {
  const [activeTab, setActiveTab] = useState('1');
  const [isLastStep, setIsLastStep] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsLastStep(Number(activeTab) === items.length);
  }, [activeTab, items.length]);

  const isTabValid = () => {
    const currentTabValues = formValues[activeTab];
    if (currentTabValues) {
      return Object.values(currentTabValues).every(value => value !== '' && value !== null);
    }
    return false;
  };

  const postApiData = async () => {
    try {
      setLoading(true);
      // const response = await fetch(apiUrlPost, {
      //   method: 'POST',
      //   body: JSON.stringify(formValues),  
      //   headers: { 'Content-Type': 'application/json' },
      // });
      // const data = await response.json();

      // if (data.success) {
      //   message.success('Cadastro realizado com sucesso!');
      if (onHide) {
        onHide();
      }
      //   } else {
      //     message.error('Erro ao cadastrar.');
      //   }
    } catch (error) {
      message.error('Erro ao enviar dados.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleNext = () => {
    if (isTabValid()) {
      if (isLastStep) {
        postApiData();
      } else {
        setActiveTab((prev) => String(Number(prev) + 1));
      }
    } else {
      message.error('Preencha todos os campos obrigatórios');
    }
  };


  const handleBack = () => {
    if (Number(activeTab) > 1) {
      setActiveTab((prev) => String(Number(prev) - 1));
    }
  };

  return (
    <div style={{ margin: '20px' }}>
      <div>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={items}
          tabBarStyle={{ marginBottom: 24 }}
          size="large"
        />
        <div style={{ marginTop: 16 }}>
          <Button onClick={handleBack} disabled={Number(activeTab) === 1} style={{ marginRight: 8 }}>
            Voltar
          </Button>
          <Button onClick={handleNext} loading={loading} disabled={!isTabValid()}>
            {isLastStep ? 'Enviar' : 'Avançar'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TabsRender;