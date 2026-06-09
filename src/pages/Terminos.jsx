import { Link } from 'react-router-dom';

export default function Terminos() {
    return (
        <main className="container page-content py-5">
            <div className="layout-navbar-spacer" aria-hidden="true"></div>
            <h1 className="page-title">Términos y Condiciones</h1>
            <p className="text-muted small mb-4">Última actualización: abril de 2026</p>
            <div className="cart-section p-4">
                <h2 className="h5 fw-bold text-dark">1. Uso del sitio</h2>
                <p>Al navegar y utilizar este sitio web, el usuario acepta los presentes términos y condiciones.</p>
                <h2 className="h5 fw-bold text-dark mt-4">2. Servicios ofrecidos</h2>
                <p>SáezTecnology ofrece servicios relacionados con desarrollo web, aplicaciones web y soporte técnico.</p>
                <h2 className="h5 fw-bold text-dark mt-4">3. Protección de datos</h2>
                <p>Los datos ingresados en formularios de contacto serán utilizados únicamente para responder consultas.</p>
                <h2 className="h5 fw-bold text-dark mt-4">4. Propiedad intelectual</h2>
                <p>Los contenidos presentes en este sitio pertenecen a SáezTecnology, salvo indicación contraria.</p>
                <h2 className="h5 fw-bold text-dark mt-4">5. Responsabilidad</h2>
                <p>SáezTecnology no se responsabiliza por problemas derivados del mal uso del sitio web.</p>
                <h2 className="h5 fw-bold text-dark mt-4">6. Contacto</h2>
                <p>Para consultas, los usuarios pueden comunicarse mediante la <Link to="/contacto">página de contacto</Link>.</p>
            </div>
        </main>
    );
}