import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { registrarUsuario } from '../utils/usuariosStorage';
import CalculadoraEdad from '../components/CalculadoraEdad';

const MAYORIA_EDAD = 18;

function validarRut(rut) {
    const rutLimpio = rut.replace(/[^0-9kK]/g, '');
    if (rutLimpio.length < 8) return false;
    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1).toUpperCase();
    let suma = 0;
    let multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo[i]) * multiplo;
        multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }
    const dvEsperado = 11 - (suma % 11);
    const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : String(dvEsperado);
    return dv === dvCalculado;
}

function formatearRut(valor) {
    const limpio = valor.replace(/[^0-9kK]/g, '');
    if (limpio.length <= 1) return limpio;
    const cuerpo = limpio.slice(0, -1);
    const dv = limpio.slice(-1);
    const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${cuerpoFormateado}-${dv}`;
}

export default function Registro() {
    const navigate = useNavigate();
    const { iniciarSesion } = useCarrito();

    const [form, setForm] = useState({
        nombre: '', rut: '', correo: '', contraseña: '',
        pais: '', ciudad: '', direccion: '', terminos: false
    });
    const [errores, setErrores] = useState({});
    const [edadVerificada, setEdadVerificada] = useState(null);

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        if (name === 'rut') {
            setForm(prev => ({ ...prev, rut: formatearRut(value) }));
        } else {
            setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        }
    }

    function validar() {
        const e = {};
        if (!form.nombre.trim() || form.nombre.trim().length < 2)
            e.nombre = 'Ingrese su nombre completo (mínimo 2 caracteres).';
        else if (!/^[\p{L}]+(?:\s[\p{L}]+)*$/u.test(form.nombre.trim()))
            e.nombre = 'Solo letras y espacios, sin números ni símbolos.';

        if (!form.rut.trim())
            e.rut = 'Ingrese su RUT.';
        else if (!validarRut(form.rut))
            e.rut = 'RUT inválido. Verifique el número y dígito verificador.';

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.correo))
            e.correo = 'Ingrese un correo electrónico válido.';

        if (!form.contraseña || form.contraseña.length < 6)
            e.contraseña = 'La contraseña debe tener al menos 6 caracteres.';

        if (!form.pais.trim())
            e.pais = 'Ingrese su país.';

        if (!form.ciudad.trim())
            e.ciudad = 'Ingrese su ciudad.';

        if (!form.direccion.trim())
            e.direccion = 'Ingrese su dirección.';

        if (!form.terminos)
            e.terminos = 'Debe aceptar los términos y condiciones para registrarse.';

        if (edadVerificada === null)
            e.edad = 'Es obligatorio que calcule su edad para poder crear tu cuenta.';
        else if (edadVerificada < MAYORIA_EDAD)
            e.edad = 'Debes ser mayor de 18 años para crear una cuenta.';

        return e;
    }

    function handleSubmit(e) {
        e.preventDefault();
        const e2 = validar();
        setErrores(e2);
        if (Object.keys(e2).length === 0) {
            // Guardar en localStorage
            const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
            const yaExiste = usuarios.find(u => u.correo === form.correo || u.rut === form.rut);
            if (yaExiste) {
                setErrores({ correo: 'Ya existe una cuenta con ese correo o RUT.' });
                return;
            }
            const { terminos, contraseña, ...datosUsuario } = form;
            registrarUsuario(datosUsuario, contraseña);
            iniciarSesion({ nombre: form.nombre, correo: form.correo, rut: form.rut });
            navigate('/');
        }
    }

    return (
        <main className="container page-content py-5">
            <div className="layout-navbar-spacer" aria-hidden="true"></div>
            <h1 className="page-title">Crear cuenta</h1>
            <p className="lead text-muted mb-4">Regístrate para solicitar nuestros servicios.</p>

            <div className="row justify-content-center">
                <div className="col-lg-7">
                    <form id="formRegistro" className="contacto-formulario cart-section p-4" onSubmit={handleSubmit} noValidate>
                        <h2 className="h5 fw-bold mb-4">Formulario de registro</h2>

                        <h3 className="h6 fw-bold text-secondary mb-3 pb-2 border-bottom">Datos personales</h3>

                        <div className="mb-3">
                            <label htmlFor="nombre" className="form-label">Nombre completo</label>
                            <input type="text" className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                                id="nombre" name="nombre" value={form.nombre} onChange={handleChange}
                                placeholder="Ej: Juan Pérez González" />
                            {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="rut" className="form-label">RUT</label>
                            <input type="text" className={`form-control ${errores.rut ? 'is-invalid' : form.rut && validarRut(form.rut) ? 'is-valid' : ''}`}
                                id="rut" name="rut" value={form.rut} onChange={handleChange}
                                placeholder="Ej: 12.345.678-9" maxLength={12} />
                            {errores.rut
                                ? <div className="invalid-feedback">{errores.rut}</div>
                                : form.rut && validarRut(form.rut) && <div className="valid-feedback">RUT válido ✓</div>
                            }
                        </div>

                        <div className="mb-3">
                            <label htmlFor="correo" className="form-label">Correo electrónico</label>
                            <input type="email" className={`form-control ${errores.correo ? 'is-invalid' : ''}`}
                                id="correo" name="correo" value={form.correo} onChange={handleChange}
                                placeholder="Ej: juan@correo.cl" />
                            {errores.correo && <div className="invalid-feedback">{errores.correo}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="contraseña" className="form-label">Contraseña</label>
                            <input type="password" className={`form-control ${errores.contraseña ? 'is-invalid' : ''}`}
                                id="contraseña" name="contraseña" value={form.contraseña} onChange={handleChange}
                                placeholder="Mínimo 6 caracteres" autoComplete="new-password" />
                            {errores.contraseña && <div className="invalid-feedback">{errores.contraseña}</div>}
                        </div>

                        <h3 className="h6 fw-bold text-secondary mb-3 pb-2 border-bottom mt-4">Ubicación</h3>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="pais" className="form-label">País</label>
                                <input type="text" className={`form-control ${errores.pais ? 'is-invalid' : ''}`}
                                    id="pais" name="pais" value={form.pais} onChange={handleChange}
                                    placeholder="Ej: Chile" />
                                {errores.pais && <div className="invalid-feedback">{errores.pais}</div>}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="ciudad" className="form-label">Ciudad</label>
                                <input type="text" className={`form-control ${errores.ciudad ? 'is-invalid' : ''}`}
                                    id="ciudad" name="ciudad" value={form.ciudad} onChange={handleChange}
                                    placeholder="Ej: Punta Arenas" />
                                {errores.ciudad && <div className="invalid-feedback">{errores.ciudad}</div>}
                            </div>
                            <div className="col-12 mb-3">
                                <label htmlFor="direccion" className="form-label">Dirección</label>
                                <input type="text" className={`form-control ${errores.direccion ? 'is-invalid' : ''}`}
                                    id="direccion" name="direccion" value={form.direccion} onChange={handleChange}
                                    placeholder="Ej: Av. Bulnes 123, depto 4B" />
                                {errores.direccion && <div className="invalid-feedback">{errores.direccion}</div>}
                            </div>
                        </div>

                        <h3 className="h6 fw-bold text-secondary mb-3 pb-2 border-bottom mt-4">Términos y condiciones</h3>

                        <div className="form-check mb-2">
                            <input className={`form-check-input ${errores.terminos ? 'is-invalid' : ''}`}
                                type="checkbox" id="terminos" name="terminos"
                                checked={form.terminos} onChange={handleChange} />
                            <label className="form-check-label" htmlFor="terminos">
                                He leído y acepto los <Link to="/terminos" target="_blank">términos y condiciones</Link>.
                            </label>
                            {errores.terminos && <div className="invalid-feedback">{errores.terminos}</div>}
                        </div>
                    </form>

                    <div className="mt-4">
                        <h2 className="h5 fw-bold mb-2">¿Puedes crear una cuenta?</h2>
                        <p className="text-muted mb-3">
                            Calcula tu edad para saber si puedes crearte una cuenta. Solo las personas mayores de {MAYORIA_EDAD} años pueden registrarse.
                        </p>
                        <CalculadoraEdad onEdadCalculada={setEdadVerificada} />

                        {edadVerificada !== null && edadVerificada >= MAYORIA_EDAD && (
                            <div className="alert alert-success mt-3 mb-0" role="status">
                                ✓ Cumples con la edad mínima. Puedes crear tu cuenta.
                            </div>
                        )}
                        {edadVerificada !== null && edadVerificada < MAYORIA_EDAD && (
                            <div className="alert alert-danger mt-3 mb-0" role="alert">
                                Lo sentimos, debes tener al menos {MAYORIA_EDAD} años para crear una cuenta.
                            </div>
                        )}
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <span className="text-muted small">
                            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                        </span>
                        <button type="submit" form="formRegistro" className="btn btn-primary px-4">Crear cuenta</button>
                    </div>
                    {errores.edad && <div className="invalid-feedback d-block text-end mt-2">{errores.edad}</div>}
                </div>
            </div>
        </main>
    );
}