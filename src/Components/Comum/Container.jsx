export default function Paginas({ children, title }) {
    return (
        <div className="container">
            <div className="col-xl-12">
                <div className="card dz-card" id="accordion-three">
                    <div className="card-header flex-wrap d-flex justify-content-between align-items-center">
                        <div>
                            <h4 className="card-title">{title}</h4>
                        </div>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    )
}