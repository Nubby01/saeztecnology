import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';

export default function Navbar() {
    const { carrito, usuario, cerrarSesion } = useCarrito();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false);
    const [confirmarCierre, setConfirmarCierre] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        if (!menuUsuarioAbierto) return;
        function handleClickFuera(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuUsuarioAbierto(false);
            }
        }
        document.addEventListener('mousedown', handleClickFuera);
        return () => document.removeEventListener('mousedown', handleClickFuera);
    }, [menuUsuarioAbierto]);

    function solicitarCierreSesion() {
        setMenuUsuarioAbierto(false);
        setConfirmarCierre(true);
    }

    function confirmarCierreSesion() {
        cerrarSesion();
        setConfirmarCierre(false);
        navigate('/');
    }

    function scrollAlCarrito() {
        document.getElementById('carrito')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function handleIrAlCarrito(e) {
        e.preventDefault();
        setMenuUsuarioAbierto(false);
        document.getElementById('menu')?.classList.remove('show');
        if (location.pathname === '/') {
            scrollAlCarrito();
        } else {
            navigate('/', { state: { scrollToCarrito: true } });
        }
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark site-navbar fixed-top">
            <div className="container">
                <NavLink className="navbar-brand" to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>SáezTecnology</NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="menu">
                    <ul className="navbar-nav ms-auto align-items-lg-center">
                        <li className="nav-item"><NavLink className="nav-link" to="/">Inicio</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/quienes-somos">¿Quiénes Somos?</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/contacto">Contacto</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/terminos">Términos</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/diagramas">Diagramas</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/usuarios">Usuarios</NavLink></li>
                        <li className="nav-item">
                            <a
                                href="/#carrito"
                                className="nav-link nav-link-carrito d-inline-flex align-items-center"
                                onClick={handleIrAlCarrito}
                            >
                                🛒 {carrito.length > 0 && <span className="badge bg-success ms-1">{carrito.length}</span>}
                            </a>
                        </li>

                        {usuario ? (
                            <li className="nav-item dropdown ms-lg-2" ref={menuRef}>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-usuario-nav dropdown-toggle"
                                    aria-expanded={menuUsuarioAbierto}
                                    onClick={() => setMenuUsuarioAbierto(prev => !prev)}
                                >
                                    <span aria-hidden="true">👤</span> {usuario.nombre}
                                </button>
                                <ul className={`dropdown-menu dropdown-menu-end${menuUsuarioAbierto ? ' show' : ''}`}>
                                    <li><span className="dropdown-item-text small text-muted">{usuario.correo}</span></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <button
                                            type="button"
                                            className="dropdown-item text-danger"
                                            onClick={solicitarCierreSesion}
                                        >
                                            Cerrar Sesión
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <li className="nav-item ms-lg-2">
                                <NavLink className="btn btn-sm btn-registro" to="/registro">Registrarse</NavLink>
                            </li>
                        )}
                    </ul>
                </div>
            </div>

            {confirmarCierre && (
                <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-3">
                            <div className="modal-header border-0">
                                <h5 className="modal-title">Cerrar sesión</h5>
                            </div>
                            <div className="modal-body text-dark">
                                ¿Estás seguro que deseas cerrar sesión{usuario ? <>, <strong>{usuario.nombre}</strong></> : ''}?
                            </div>
                            <div className="modal-footer border-0">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setConfirmarCierre(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={confirmarCierreSesion}
                                >
                                    Sí, cerrar sesión
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
