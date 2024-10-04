import { useNavigate } from "react-router-dom";

export default function Pagina_nao_encontrada({ rota }) {
  const navigate = useNavigate();
    const telaInicial = () =>  navigate(rota, { replace: true });
    return (
        <body className="vh-100" data-typography="poppins" data-theme-version="light" data-layout="vertical" data-nav-headerbg="color_4" data-headerbg="color_4" data-sidebar-style="overlay" data-sidebarbg="color_1" data-sidebar-position="fixed" data-header-position="fixed" data-container="wide" data-primary="color_1" data-secondary="color_1">
            <div className="authincation h-100">
                <div className="container ">
                    <div className="row justify-content-center h-100 align-items-center">
                        <div className="col-md-6">
                            <div className="error-page">
                                <div className="error-inner text-center">
                                    <div className="dz-error" data-text="400">400</div>
                                    <h2 className="error-head">Lamentamos, mas a página que você está procurando não pode ser encontrada.</h2>
                                    <button className="btn btn-secondary" onClick={telaInicial}>
                                        VOLTAR PARA PÁGINA INICIAL
                                    </button>                                
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
    )
}
