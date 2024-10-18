import React, { useEffect, useState } from 'react';
import EsqueceuSenha from '../Components/Buttons/Login/Esqueceu_senha';
import { setCookie, getCookie } from "../utils/Cookies";
import { loginApi } from '../utils/Login';
import { useNavigate } from 'react-router-dom';
export default function Login({ rota }) {
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const emailFromCookie = getCookie('email');
    if (emailFromCookie) {
      document.getElementById('email').value = emailFromCookie;
    }
  }, []);

  const Cookie = () => {
    const email = document.getElementById('email').value;
    setCookie('email', email, 30);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('dz-password').value;

    try {
      loginApi(email, senha).then((isLoggedIn) => {
        if (isLoggedIn) {
          setAlert(showSuccessAlert());
          setTimeout(() => {
            window.location.pathname = rota
          }, 500);
        } else {
          setAlert(showErrorAlert());
        }
      });


    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setAlert(showErrorAlert());
    }
  };

  const showSuccessAlert = () => (
    <div className="alert alert-success" role="alert">
      <h4 className="alert-heading">
        <i className="fa-regular fa-circle-check" style={{ color: "#00a372", marginRight: '8px' }} />
        Login bem sucedido!
      </h4>
    </div>
  );

  const showErrorAlert = () => (
    <div className="alert alert-danger" role="alert">
      <i className="fa-regular fa-circle-xmark" style={{ color: "#e81132", marginRight: '8px' }} />
      Usuário ou senha inválidos!
    </div>
  );


  return (
    <section className="vh-100 login-ativa-projetos">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card" style={{ borderRadius: '1rem' }}>
              <div className="row g-0">
                <div className="col-md-6 col-lg-5 d-md-block">
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
                        <h3 className="title">Login</h3>
                      </div>
                      <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                          <label className="mb-1 text-dark">Email</label>
                          <input type="email" id="email" className="form-control" required />
                        </div>
                        <div className="mb-4 position-relative">
                          <label className="mb-1 text-dark">Senha</label>
                          <input type="password" id="dz-password" className="form-control" required />
                          <span className="show-pass eye">
                            <i className="fa fa-eye-slash" />
                            <i className="fa fa-eye" />
                          </span>
                        </div>
                        <div className="form-row d-flex justify-content-between mt-4 mb-2">
                          <div className="mb-4">
                            <div className="form-check custom-checkbox mb-3">
                              <input type="checkbox" className="form-check-input" id="customCheckBox1" onClick={Cookie} />
                              <label className="form-check-label" htmlFor="customCheckBox1">Lembre minha preferência</label>
                            </div>
                          </div>
                          <div className="mb-4">
                            <EsqueceuSenha rota={"/nova-senha"} />
                          </div>
                        </div>
                        <div className="text-center mb-4">
                          <button type="submit" className="btn btn-primary btn-block">Entre</button>
                        </div>
                        {alert}
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
}