import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { api } from '../../../lib/Axios';
import { useNavigate } from 'react-router-dom';
export default function Esqueceu_senha({rota}) {
  const [email, setEmail] = useState('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showEmailSentModal, setShowEmailSentModal] = useState(false);
  const navigate = useNavigate();

  
  const handleCloseForgotPasswordModal = () => setShowForgotPasswordModal(false);
  const handleShowForgotPasswordModal = () => setShowForgotPasswordModal(true);

  const handleCloseEmailSentModal = () => navigate(rota, { replace: true });
  const handleShowEmailSentModal = () => setShowEmailSentModal(true);

  const handleSendEmail = () => {
    try{
      api().put('/usuario/generateCode', {
       email: email
      })
      .then((response) => {
        if (response.data === true) {
          localStorage.setItem('email', email);
          handleCloseForgotPasswordModal()
          handleShowEmailSentModal();
        }
      })
    }catch(error){
      console.error("Erro ao enviar email:", error);
    }

    
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };
  return (
    <>
      <Button variant="link" className="form-check-label" onClick={handleShowForgotPasswordModal}>
        Esqueceu sua senha?
      </Button>

      <Modal
        show={showForgotPasswordModal}
        onHide={handleCloseForgotPasswordModal}
        backdrop="static"
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        keyboard={false}
      >
        <Modal.Header className="modal-header border-0" closeButton>
          <Modal.Title>Esqueceu sua senha?</Modal.Title>
        </Modal.Header>
        <Modal.Body id="contained-modal-title-vcenter">
          <form>
            <div className="mb-4">
              <p>Informe o e-mail para qual deseja redefinir a senha.</p>
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="mb-1 text-dark">Email</label>
              <input
                type="email"
                id="email-forgot-password"
                className="form-control"
                onChange={handleEmailChange}
                value={email}
                required
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer className="modal-footer border-0 d-flex justify-content-center">
          <Button
            type="button"
            className="btn btn-primary btn"
            onClick={handleSendEmail}
            disabled={!email || !validateEmail(email)}
          >
            Enviar link de redefinição
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showEmailSentModal}
        onHide={handleCloseEmailSentModal}
        backdrop="static"
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        keyboard={false}
      >
        <Modal.Header className="modal-header border-0" closeButton>
          <Modal.Title>Email enviado com sucesso!</Modal.Title>
        </Modal.Header>
        <Modal.Body id="contained-modal-title-vcenter">
          <div className="text-center">
            <i className="bi bi-check-circle text-success" style={{ fontSize: '72px' }}></i> {/* Ícone de sucesso */}
            <h5 className="mt-2">Email enviado com sucesso!</h5>
            <p className="mt-2">Por favor, verifique a caixa de entrada do email: {email}</p>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}