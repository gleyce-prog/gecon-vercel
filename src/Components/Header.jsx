import HandleLogout from '../utils/Logout';
import { useState, useEffect } from "react";
import { getCookie, setCookie } from "../utils/Cookies";
export default function Header({ props }) {
  const logout = () => {
    HandleLogout();
  }


  return (
    <div>
      <div className="nav-header">
        <a href="/home" className="brand-logo">
          <img className="logo-abbr" src="/images/logo/Símbolo Principal.png" alt="" srcSet="" width={39} height={23} />
          <img className="brand-title" src="/images/logo/Logotipo Negativo 01.png" width={100} height={10} />
        </a>
        <div className="nav-control">
          <div className="hamburger">
            <span className="line" />
            <span className="line" />
            <span className="line" />
          </div>
        </div>
      </div>
      <div className="header is-fixed">
        <div className="header-content">
          <nav className="navbar navbar-expand">
            <div className="collapse navbar-collapse justify-content-between">
              <div className="header-left">
              </div>
              <ul className="navbar-nav header-right">
                <li className="nav-item dropdown notification_dropdown">
                  <a id="theme" class="nav-link" data-bs-toggle="dropdown">
                    <i class="fa-regular fa-moon" style={{color: "#f0f0f0"}}/>
                  </a>
                </li>
                <li className="nav-item dropdown notification_dropdown">
                  <a className="nav-link bell dz-fullscreen">
                    <i className="fas fa-expand" style={{ color: "#FFFFFF" }} />
                  </a>
                </li>
                <li className="nav-item ps-3">
                  <div className="nav-item dropdown notification_dropdown">
                    <a
                      className="nav-link"
                      href=""
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <div className="header-info2 d-flex align-items-center">
                        <div className="header-media">
                          <i className="fa-solid fa-user" style={{ color: "#FFFFFF" }} />

                        </div>
                      </div>
                    </a>
                    <div className="dropdown-menu dropdown-menu-end" style={{}}>
                      <div className="card border-0 mb-0">
                        <div className="card-header py-2">
                          <div class="products">
                            <div>
                              <p>{props}</p>
                              <a
                                className="dropdown-item ai-icon"
                                onClick={logout}
                              >
                                <i className="fas fa-sign-out-alt" style={{ color: "#ff7979" }} />
                                <span className="ms-2 text-danger" >Logout </span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </div>

  )
}