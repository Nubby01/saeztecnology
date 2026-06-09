import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import MonedasServicios from '../components/MonedasServicios';
import {
    API_MONEDAS_URL,
    MONEDA_CLP,
    obtenerMoneda,
    formatearMoneda,
    convertirDesdeClp
} from '../utils/monedas';

export default function Home() {
    const { agregar, carrito, eliminar, calcularTotal, aviso } = useCarrito();
    const location = useLocation();

    const [monedaSel, setMonedaSel] = useState('clp');
    const [indicadores, setIndicadores] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [errorCarga, setErrorCarga] = useState('');
    const [compraConfirmada, setCompraConfirmada] = useState(false);

    useEffect(() => {
        let activo = true;
        async function cargar() {
            setCargando(true);
            setErrorCarga('');
            try {
                const respuesta = await fetch(API_MONEDAS_URL);
                if (!respuesta.ok) throw new Error('Respuesta no válida');
                const datos = await respuesta.json();
                if (activo) setIndicadores(datos);
            } catch {
                if (activo) {
                    setErrorCarga('No se pudieron cargar los valores de las monedas. Se muestran los precios en pesos.');
                    setMonedaSel('clp');
                }
            } finally {
                if (activo) setCargando(false);
            }
        }
        cargar();
        return () => { activo = false; };
    }, []);

    useEffect(() => {
        const debeIrAlCarrito = location.state?.scrollToCarrito || location.hash === '#carrito';
        if (!debeIrAlCarrito) return;
        const timer = setTimeout(() => {
            document.getElementById('carrito')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 80);
        return () => clearTimeout(timer);
    }, [location.pathname, location.hash, location.state]);

    const moneda = useMemo(() => obtenerMoneda(monedaSel), [monedaSel]);

    function mostrarPrecio(precioClp) {
        const convertido = convertirDesdeClp(precioClp, moneda, indicadores);
        return convertido !== null ? formatearMoneda(convertido, moneda) : '—';
    }

    return (
        <main>
            <div className="layout-navbar-spacer" aria-hidden="true"></div>
            <section className="hero-banner"></section>

            <section id="productos" className="container services-section mb-5">
                <h2 className="text-center mb-3 services-heading-spacer">Impulsa tu negocio con tecnología</h2>
                <div className="services-intro col-lg-10 col-xl-9 mx-auto text-center mb-0">
                    <p className="mb-0">En <strong>SáezTecnology</strong> desarrollamos páginas web, aplicaciones web y soluciones tecnológicas orientadas a mejorar la presencia digital de negocios y emprendedores.</p>
                </div>
                <h2 className="text-center mb-4 services-heading-spacer">Nuestros Servicios</h2>
                <MonedasServicios
                    onAgregar={agregar}
                    monedaSel={monedaSel}
                    setMonedaSel={setMonedaSel}
                    indicadores={indicadores}
                    cargando={cargando}
                    errorCarga={errorCarga}
                />
            </section>

            <section id="carrito" className="container my-5 cart-section">
                <h2 className="text-center mb-4">Carrito de compras</h2>
                <ul className="list-group mb-3">
                    {carrito.length === 0
                        ? <li className="list-group-item text-muted text-center py-4">Tu carrito está vacío. Agrega un servicio desde arriba.</li>
                        : carrito.map((item, i) => (
                            <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                                <span>{item.nombre}</span>
                                <span className="d-flex align-items-center gap-3">
                                    <strong>{mostrarPrecio(item.precio)}</strong>
                                    <button className="btn btn-danger btn-sm" onClick={() => eliminar(i)}>✕</button>
                                </span>
                            </li>
                        ))
                    }
                </ul>
                <h4 className="text-end">Total: {mostrarPrecio(calcularTotal())}</h4>
                {moneda.apiKey && carrito.length > 0 && (
                    <p className="text-end text-muted small mb-0">
                        Equivale a {formatearMoneda(calcularTotal(), MONEDA_CLP)} CLP
                    </p>
                )}
                {carrito.length > 0 && (
                    <div className="text-end mt-3">
                        <button className="btn btn-confirmar-compra" onClick={() => setCompraConfirmada(true)}>
                            Confirmar compra
                        </button>
                    </div>
                )}
            </section>

            {compraConfirmada && (
                <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.5)' }} role="dialog">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-3">
                            <div className="modal-header border-0">
                                <h5 className="modal-title">🛒 ¡Solicitud recibida!</h5>
                            </div>
                            <div className="modal-body text-dark">
                                Tu compra se confirmará tras enviar la solicitud a través del formulario de contacto. Nos pondremos en contacto contigo a la brevedad.
                            </div>
                            <div className="modal-footer border-0">
                                <button type="button" className="btn btn-primary px-4" onClick={() => setCompraConfirmada(false)}>
                                    Entendido
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {aviso && (
                <div className={`carrito-aviso carrito-aviso--visible ${aviso.tipo === 'eliminar' ? 'carrito-aviso--eliminar' : ''}`}>
                    {aviso.texto}
                </div>
            )}
        </main>
    );
}
