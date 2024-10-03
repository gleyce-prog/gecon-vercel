import HandleLogout from '../utils/Logout';
import { useState, useEffect } from "react";
import { getCookie, setCookie } from "../utils/Cookies";
export default function Header({ props }) {
  const logout = () => {
    HandleLogout();
  }
  const [theme, setTheme] = useState(getCookie('theme'));

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setCookie('theme', newTheme, 30);
  };

  useEffect(() => {
    if (!getCookie('theme'))
      setCookie('theme', 'light', 30);

    document.body.setAttribute('data-theme-version', theme);
  }, [theme]);
  return (
    <div>
      <div className="nav-header">
        <a href="/dashboard" className="brand-logo">

          <img className="logo-abbr" src="../images/logo/Símbolo Principal.png" alt="" srcSet="" width={39}
            height={23} />
          <img className="brand-title" src="../images/logo/Logotipo Negativo 01.png" width={100}
            height={20} />
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
                  <a
                    className="nav-link"
                    href=""
                    data-bs-toggle="dropdown"
                    onClick={toggleTheme}
                  >
                    <i className={`fa-regular fa-${theme === 'dark' ? 'sun' : 'moon'}`} style={{ color: theme === 'black' ? '#fff' : '#f0f0f0' }} />
                  </a>
                </li>
                <li className="nav-item dropdown notification_dropdown">
                  <a
                    className="nav-link bell dz-fullscreen"
                    href="javascript:void(0)"
                  >
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
                        <div className="header-info">
                          <p>{props}</p>
                        </div>
                      </div>
                    </a>
                    <div className="dropdown-menu dropdown-menu-end" style={{}}>
                      <div className="card border-0 mb-0">
                        <div className="card-header py-2">
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
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </div>

  )
}