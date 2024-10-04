import React, { useState } from 'react';
import Voltar_login from '../Components/Buttons/Login/Voltar_login';
import { mostrarAlertaErro, mostrarAlertaSucesso } from '../lib/swal';
import { api } from '../lib/Axios';
import { useNavigate } from 'react-router-dom';
const Alterar_senha = ({ rota }) => {
  const [password_new, setPasswordNew] = useState('');
  const [password_confirm, setPasswordConfirm] = useState('');
  const [code, setCode] = useState('');
  const [errorNewPassword, setErrorNewPassword] = useState('');
  const [errorConfirmPassword, setErrorConfirmPassword] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const navigate = useNavigate();

  const handleNewPassword = (e) => {
    const newPassword = e.target.value;
    setPasswordNew(newPassword);
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!regex.test(newPassword)) {
      setErrorNewPassword('A nova senha deve ter pelo menos 8 caracteres, 1 número, 1 letra maiscula, 1 minuscula e 1 caractér especial.');
    } else {
      setErrorNewPassword('');
    }

    if (newPassword !== password_confirm && password_confirm.length > 0) {
      setErrorConfirmPassword('As senhas digitadas não coincidem.');
    } else {
      setErrorConfirmPassword('');
    }
  };

  const handleConfirmPassword = (e) => {
    const confirmPassword = e.target.value;
    setPasswordConfirm(confirmPassword);

    if (password_new !== confirmPassword) {
      setErrorConfirmPassword('As senhas digitadas não coincidem.');
    } else {
      setErrorConfirmPassword('');
    }
  };

  const handleCode = (e) => {
    const codeValue = e.target.value;
    setCode(codeValue);
    const regex = /^\d{6}$/;
    if (!regex.test(codeValue)) {
      setErrorCode('O código apenas 6 números.');
    } else {
      setErrorCode('');
    }
  };

  const limparFormulario = () => {
    setPasswordNew('');
    setPasswordConfirm('');
    setCode('');
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    api().put('/usuario/setPassword', {
      email: localStorage.getItem('email'),
      codigo: Number(code),
      senha: password_new
    })
      .then((response) => {
        if (response.data === true) {
          mostrarAlertaSucesso(
            'Sua senha foi alterada com sucesso',
            'Você pode agora voltar para o login.',
            () => {
              localStorage.removeItem('email');
              navigate(rota, { replace: true });
            }
          );
        }
      })
      .catch((error) => {
        mostrarAlertaErro('Não foi possível resetar a senha');
        console.error(error);
        limparFormulario();
      });
  };

  return (
    <section className="vh-100 login-ativa-projetos">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card" style={{ borderRadius: '1rem' }}>
              <div className="row g-0">
                <div className="col-md-6 col-lg-5 d-none d-md-block">
                  <div>
                    <div className="login-content">
                      <a href=""><img src="" className="mb-3 logo-dark" alt="" /></a>
                      <a href=""><img src="" className="mb-3 logo-light" alt="" /></a>
                    </div>
                    <div className="login-media text-center">
                    <img src="/images/logo/Logotipo Principal.png" alt="" />
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                  <div className="card-body p-4 p-lg-5 text-black">
                    <div className="login-form">
                      <div className="text-center">
                        <h3 className="title">Resetar Senha</h3>
                      </div>
                      <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                          <label className="mb-1 text-dark">Insira o código de reset:</label>
                          <input
                            type="text"
                            id="code"
                            className={`form-control ${errorCode && 'is-invalid'}`}
                            required
                            value={code}
                            onChange={handleCode}
                          />
                        </div>
                        {errorCode && <div className="mb-3 text-danger">{errorCode}</div>}
                        <div className="mb-4">
                          <label className="mb-1 text-dark">Digite a nova senha:</label>
                          <input
                            type="password"
                            id="password_new"
                            className={`form-control ${errorNewPassword && 'is-invalid'}`}
                            required
                            value={password_new}
                            onChange={handleNewPassword}
                          />
                        </div>
                        {errorNewPassword && <div className="mb-3 text-danger">{errorNewPassword}</div>}
                        <div className="mb-4">
                          <label className="mb-1 text-dark">Confirme a senha:</label>
                          <input
                            type="password"
                            id="password_new_confirm"
                            className={`form-control ${errorConfirmPassword && 'is-invalid'}`}
                            required
                            value={password_confirm}
                            onChange={handleConfirmPassword}
                          />
                        </div>
                        {errorConfirmPassword && <div className="mb-3 text-danger">{errorConfirmPassword}</div>}
                        <div className="form-row d-flex justify-content-between mt-4 mb-2">
                          <Voltar_login rota={rota} />
                        </div>
                        <div className="text-center mb-4">
                          <button type="submit" className="btn btn-primary btn-block">Enviar</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Alterar_senha;
