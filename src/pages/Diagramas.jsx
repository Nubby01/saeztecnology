import { useState } from 'react';
import diagramaCaso from '../assets/diagrama-caso.png';
import diagramaClases from '../assets/diagrama-clases.png';

export default function Diagramas() {
    const [modalImg, setModalImg] = useState(null);

    return (
        <main className="container page-content py-5">
            <div className="layout-navbar-spacer" aria-hidden="true"></div>
            <h1 className="page-title">Diagramas</h1>
            <h2 className="h4 fw-bold mb-2">📊 Arquitectura y Modelado del Sistema</h2>
            <p className="lead text-muted mb-4">En esta sección se presenta la documentación técnica que respalda el diseño de la aplicación web SAEZTECNOLOGY. A través de modelos estandarizados en UML, se detalla tanto la estructura lógica del código como el comportamiento del sistema frente a los distintos tipos de usuarios.</p>

            <h2 className="h5 fw-bold mb-3">Diagramas UML</h2>
            <div className="row g-4">
                <div className="col-lg-6">
                    <figure className="diagrama-imagen m-0">
                        <img src={diagramaCaso} className="diagrama-thumb img-fluid rounded-3 border shadow-sm w-100"
                            alt="Diagrama de casos de uso" onClick={() => setModalImg({ src: diagramaCaso, titulo: 'Diagrama de casos de uso' })} />
                        <figcaption className="small text-muted mt-2 text-center">Diagrama de casos de uso — presione para ver</figcaption>
                    </figure>
                    <p className="diagrama-descripcion mt-3 mb-0">Modela el comportamiento dinámico del sistema y las interacciones entre los distintos actores y la aplicación. El diagrama expone de forma detallada la herencia de permisos entre un Usuario No Registrado (que accede de forma pública al catálogo, conversor de divisas, cálculo de edad y contacto) y un Usuario Registrado (con privilegios exclusivos sobre el CRUD de su cuenta propia), asegurando la trazabilidad de los procesos automáticos de validación de identidad y criptografía mediante relaciones de inclusión y extensión.</p>
                </div>
                <div className="col-lg-6">
                    <figure className="diagrama-imagen m-0">
                        <img src={diagramaClases} className="diagrama-thumb img-fluid rounded-3 border shadow-sm w-100"
                            alt="Diagrama de clases" onClick={() => setModalImg({ src: diagramaClases, titulo: 'Diagrama de clases' })} />
                        <figcaption className="small text-muted mt-2 text-center">Diagrama de clases — presione para ver</figcaption>
                    </figure>
                    <p className="diagrama-descripcion mt-3 mb-0">Muestra la estructura estática del sistema con sus clases principales, atributos, métodos y multiplicidades. El modelo destaca la separación de la lógica de negocio (Usuario, Carrito, Servicio) de los módulos utilitarios e independientes de seguridad y cálculo (Encriptador, CalculadoraEdad), reflejando fielmente la arquitectura modular implementada en los componentes y Contexts de la aplicación React.</p>
                </div>
            </div>

            {modalImg && (
                <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setModalImg(null)}>
                    <div className="modal-dialog modal-dialog-centered modal-xl" onClick={e => e.stopPropagation()}>
                        <div className="modal-content rounded-3 overflow-hidden">
                            <div className="modal-header border-0 py-2">
                                <h2 className="modal-title fs-6 mb-0">{modalImg.titulo}</h2>
                                <button type="button" className="btn-close" onClick={() => setModalImg(null)}></button>
                            </div>
                            <div className="modal-body text-center p-2">
                                <img src={modalImg.src} alt={modalImg.titulo} className="img-fluid rounded" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}