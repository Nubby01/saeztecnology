import bannerImg from '../assets/banner.png';
import valoresImg from '../assets/valores.png';
import necyreqImg from '../assets/necyreq.png';

export default function QuienesSomos() {
    return (
        <main className="container page-content py-5">
            <div className="layout-navbar-spacer" aria-hidden="true"></div>
            <h1 className="page-title mb-2">Conoce SáezTecnology</h1>
            <p className="page-subtitle">Impulsa tu negocio con tecnología</p>
            <figure className="quienes-somos-banner mb-4">
                <img src={bannerImg} className="img-fluid rounded shadow-sm w-100" alt="Banner SáezTecnology" />
            </figure>
            <h2 className="section-title">¿Quiénes Somos?</h2>
            <div className="row">
                <div className="col-lg-8 quienes-somos-texto">
                    <p>En <strong>SáezTecnology</strong> somos una empresa enfocada en brindar soluciones tecnológicas a negocios, emprendedores y pymes que buscan crecer en el mundo digital.</p>
                    <p>Trabajamos con compromiso, innovación y responsabilidad para ofrecer herramientas digitales modernas, accesibles y eficientes.</p>
                    <h3 className="subsection-title">Misión</h3>
                    <p>Desarrollar soluciones tecnológicas funcionales y accesibles que permitan a los negocios optimizar sus procesos y mejorar la interacción con sus clientes.</p>
                    <h3 className="subsection-title">Visión</h3>
                    <p>Ser una empresa reconocida por entregar soluciones digitales innovadoras y de calidad, apoyando el crecimiento tecnológico de emprendedores y pequeñas empresas.</p>
                    <h3 className="subsection-title">Nuestros valores</h3>
                    <figure className="quienes-valores-fig">
                        <img src={valoresImg} className="img-fluid rounded shadow-sm w-100" alt="Nuestros valores" />
                    </figure>
                    <h2 className="section-title mt-4 pt-2">Necesidades y requerimientos del sistema</h2>
                    <p><strong>SáezTecnology</strong> identifica la necesidad de negocios y empresas para que cuenten con herramientas digitales que mejoren su presencia en internet.</p>
                    <ul className="quienes-somos-lista">
                        <li>Visualización de servicios tecnológicos ofrecidos por la empresa.</li>
                        <li>Simulación de solicitud de servicios mediante carrito de compras.</li>
                        <li>Formularios de contacto con validaciones utilizando JavaScript.</li>
                        <li>Navegación clara y organizada entre las distintas páginas del sitio.</li>
                        <li>Compatibilidad con distintos dispositivos mediante diseño responsive.</li>
                        <li>Acceso a información corporativa, términos y diagramas del sistema.</li>
                    </ul>
                    <figure className="quienes-necyreq-fig">
                        <img src={necyreqImg} className="img-fluid rounded shadow-sm w-100" alt="Necesidades y requerimientos" />
                    </figure>
                </div>
            </div>
        </main>
    );
}