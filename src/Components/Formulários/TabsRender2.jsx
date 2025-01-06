import React, { useState, useEffect } from 'react';
import { Button, Tabs, message } from 'antd';

const TabsRender = ({ items, formValues, onHide, onFinish }) => {
  const [activeTab, setActiveTab] = useState('1');
  const [isLastStep, setIsLastStep] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsLastStep(Number(activeTab) === items.length);
  }, [activeTab, items.length]);

  const isTabValid = () => {
    const currentTabValues = formValues;
    return Object.values(currentTabValues).every(value => value !== '' && value !== null);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleNext = () => {
    if (isTabValid()) {
      if (isLastStep) {
        setLoading(true);
        onFinish(); // Chama a função de salvar quando chegar ao último passo
        setLoading(false);
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
          {isLastStep ? 'Salvar' : 'Avançar'}
        </Button>
      </div>
    </div>
  );
};

export default TabsRender;
