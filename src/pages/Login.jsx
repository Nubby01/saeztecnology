import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { cargarUsuarios } from '../utils/usuariosStorage';
import { cifrarPassword } from '../utils/passwordUtils';

export default function Login() {
    const navigate = useNavigate();
    const { iniciarSesion } = useCarrito();

    const [form, setForm] = useState({ correo: '', contraseña: '' });
    const [errores, setErrores] = useState({});
    const [errorGeneral, setErrorGeneral] = useState('');

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setErrores(prev => ({ ...prev, [name]: undefined }));
        setErrorGeneral('');
    }

    function validar() {
        const e = {};
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.correo))
            e.correo = 'Ingrese un correo electrónico válido.';
        if (!form.contraseña)
            e.contraseña = 'Ingrese su contraseña.';
        return e;
    }

    function handleSubmit(e) {
        e.preventDefault();
        const e2 = validar();
        setErrores(e2);
        if (Object.keys(e2).length > 0) return;

        const usuarios = cargarUsuarios();
        const usuario = usuarios.find(u => u.correo === form.correo);

        if (!usuario) {
            setErrorGeneral('No existe una cuenta con ese correo electrónico.');
            return;
        }

        if (usuario.contraseña !== cifrarPassword(form.contraseña)) {
            setErrorGeneral('La contraseña es incorrecta.');
            return;
        }

        iniciarSesion({ nombre: usuario.nombre, correo: usuario.correo, rut: usuario.rut });
        navigate('/');
    }

    return (
        <main className="container page-content py-5">
            <div className="layout-navbar-spacer" aria-hidden="true"></div>
            <h1 className="page-title">Iniciar sesión</h1>
            <p className="lead text-muted mb-4">Ingresa con tu correo y contraseña.</p>

            <div className="row justify-content-center">
                <div className="col-lg-5 col-md-7">
                    <form className="contacto-formulario cart-section p-4" onSubmit={handleSubmit} noValidate>
                        <h2 className="h5 fw-bold mb-4">Acceder a tu cuenta</h2>

                        {errorGeneral && (
                            <div className="alert alert-danger py-2 px-3 small" role="alert">
                                {errorGeneral}
                            </div>
                        )}

                        <div className="mb-3">
                            <label htmlFor="correo" className="form-label">Correo electrónico</label>
                            <input type="email" className={`form-control ${errores.correo ? 'is-invalid' : ''}`}
                                id="correo" name="correo" value={form.correo} onChange={handleChange}
                                placeholder="Ej: juan@correo.cl" autoComplete="email" />
                            {errores.correo && <div className="invalid-feedback">{errores.correo}</div>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="contraseña" className="form-label">Contraseña</label>
                            <input type="password" className={`form-control ${errores.contraseña ? 'is-invalid' : ''}`}
                                id="contraseña" name="contraseña" value={form.contraseña} onChange={handleChange}
                                placeholder="Tu contraseña" autoComplete="current-password" />
                            {errores.contraseña && <div className="invalid-feedback">{errores.contraseña}</div>}
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted small">
                                ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
                            </span>
                            <button type="submit" className="btn btn-primary px-4">Ingresar</button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
