import { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { cargarUsuarios, guardarUsuarios, usuarioConContraseñaCifrada } from '../utils/usuariosStorage';

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

const FORM_VACIO = { nombre: '', rut: '', correo: '', contraseña: '', pais: '', ciudad: '', direccion: '' };

export default function Usuarios() {
    const { usuario, cerrarSesion, iniciarSesion } = useCarrito();
    const [usuarios, setUsuarios] = useState([]);
    const [form, setForm] = useState(FORM_VACIO);
    const [errores, setErrores] = useState({});
    const [editandoIndex, setEditandoIndex] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [confirmarEliminar, setConfirmarEliminar] = useState(null);
    const [aviso, setAviso] = useState(null);
    const [filaExpandida, setFilaExpandida] = useState(null);
    const [avisoAcceso, setAvisoAcceso] = useState(null);

    useEffect(() => {
        setUsuarios(cargarUsuarios());
    }, []);

    const indexUsuarioActivo = usuario
        ? usuarios.findIndex(u => u.correo === usuario.correo)
        : -1;

    function esPropio(indexReal) {
        return indexUsuarioActivo === indexReal;
    }

    function guardarEnStorage(lista) {
        guardarUsuarios(lista);
        setUsuarios([...lista]);
    }

    function mostrarAviso(texto, tipo = 'exito') {
        setAviso({ texto, tipo });
        setTimeout(() => setAviso(null), 3000);
    }

    function mostrarAvisoAcceso(texto) {
        setAvisoAcceso(texto);
        setTimeout(() => setAvisoAcceso(null), 3000);
    }

    function handleChange(e) {
        const { name, value } = e.target;
        if (name === 'rut') {
            setForm(prev => ({ ...prev, rut: formatearRut(value) }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    }

    function validar() {
        const e = {};
        if (!form.nombre.trim() || form.nombre.trim().length < 2)
            e.nombre = 'Ingrese nombre completo (mínimo 2 caracteres).';
        else if (!/^[\p{L}]+(?:\s[\p{L}]+)*$/u.test(form.nombre.trim()))
            e.nombre = 'Solo letras y espacios.';
        if (!form.rut.trim()) e.rut = 'Ingrese el RUT.';
        else if (!validarRut(form.rut)) e.rut = 'RUT inválido.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.correo)) e.correo = 'Correo inválido.';
        if (form.contraseña.trim().length > 0 && form.contraseña.length < 6)
            e.contraseña = 'La nueva contraseña debe tener al menos 6 caracteres.';
        if (!form.pais.trim()) e.pais = 'Ingrese el país.';
        if (!form.ciudad.trim()) e.ciudad = 'Ingrese la ciudad.';
        if (!form.direccion.trim()) e.direccion = 'Ingrese la dirección.';
        const duplicado = usuarios.find((u, i) =>
            i !== editandoIndex && (u.correo === form.correo || u.rut === form.rut)
        );
        if (duplicado) e.correo = 'Ya existe un usuario con ese correo o RUT.';
        return e;
    }

    function handleSubmit(e) {
        e.preventDefault();
        const e2 = validar();
        setErrores(e2);
        if (Object.keys(e2).length > 0) return;

        if (editandoIndex !== null) {
            const nueva = [...usuarios];
            nueva[editandoIndex] = {
                ...nueva[editandoIndex],
                ...usuarioConContraseñaCifrada(form, editandoIndex, usuarios)
            };
            guardarEnStorage(nueva);
            if (esPropio(editandoIndex)) {
                iniciarSesion({ nombre: form.nombre, correo: form.correo, rut: form.rut });
            }
            mostrarAviso('Tus datos fueron actualizados correctamente.');
            setEditandoIndex(null);
        }
        setForm(FORM_VACIO);
        setErrores({});
    }

    function handleEditar(index) {
        if (!esPropio(index)) {
            mostrarAvisoAcceso('Solo puedes cambiar datos de tu cuenta.');
            return;
        }
        const u = usuarios[index];
        setForm({
            nombre: u.nombre,
            rut: u.rut,
            correo: u.correo,
            contraseña: '',
            pais: u.pais || '',
            ciudad: u.ciudad || '',
            direccion: u.direccion || ''
        });
        setEditandoIndex(index);
        setErrores({});
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function handleEliminar(index) {
        const nueva = usuarios.filter((_, i) => i !== index);
        guardarEnStorage(nueva);
        setConfirmarEliminar(null);
        mostrarAviso('Cuenta eliminada correctamente.', 'eliminar');
        cerrarSesion();
        setForm(FORM_VACIO);
        setEditandoIndex(null);
    }

    function handleCancelar() {
        setForm(FORM_VACIO);
        setEditandoIndex(null);
        setErrores({});
    }

    function handleVerDetalles(indexReal) {
        if (!usuario) {
            mostrarAvisoAcceso('Debes iniciar sesión para ver los detalles.');
            return;
        }
        if (!esPropio(indexReal)) {
            mostrarAvisoAcceso('Solo puedes ver tus propios datos.');
            return;
        }
        setFilaExpandida(filaExpandida === indexReal ? null : indexReal);
    }

    const usuariosFiltrados = usuarios.filter(u =>
        u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.correo.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.rut.includes(busqueda)
    );

    return (
        <main className="container page-content py-5">
            <div className="layout-navbar-spacer" aria-hidden="true"></div>
            <h1 className="page-title">Usuarios registrados</h1>
            <p className="lead text-muted mb-4">
                {usuario
                    ? `Sesión iniciada como ${usuario.nombre}. Puedes editar o eliminar tu propia cuenta.`
                    : 'Inicia sesión para gestionar tu cuenta.'}
            </p>

            {aviso && (
                <div className={`alert ${aviso.tipo === 'eliminar' ? 'alert-danger' : 'alert-success'} mb-4`}>
                    {aviso.texto}
                </div>
            )}

            {avisoAcceso && (
                <div className="alert alert-warning mb-4">
                    🔒 {avisoAcceso}
                </div>
            )}

            {editandoIndex !== null && esPropio(editandoIndex) && (
                <div className="cart-section p-4 mb-5">
                    <h2 className="h5 fw-bold mb-4">✏️ Editar mis datos</h2>
                    <form className="contacto-formulario" onSubmit={handleSubmit} noValidate>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="nombre" className="form-label">Nombre completo</label>
                                <input type="text" className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                                    id="nombre" name="nombre" value={form.nombre} onChange={handleChange} />
                                {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="rut" className="form-label">RUT</label>
                                <input type="text"
                                    className={`form-control ${errores.rut ? 'is-invalid' : form.rut && validarRut(form.rut) ? 'is-valid' : ''}`}
                                    id="rut" name="rut" value={form.rut} onChange={handleChange} maxLength={12} />
                                {errores.rut
                                    ? <div className="invalid-feedback">{errores.rut}</div>
                                    : form.rut && validarRut(form.rut) && <div className="valid-feedback">RUT válido ✓</div>}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="correo" className="form-label">Correo electrónico</label>
                                <input type="email" className={`form-control ${errores.correo ? 'is-invalid' : ''}`}
                                    id="correo" name="correo" value={form.correo} onChange={handleChange} />
                                {errores.correo && <div className="invalid-feedback">{errores.correo}</div>}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="contraseña" className="form-label">
                                    Nueva contraseña <span className="text-muted small">(dejar vacío para mantener la actual)</span>
                                </label>
                                <input type="password" className={`form-control ${errores.contraseña ? 'is-invalid' : ''}`}
                                    id="contraseña" name="contraseña" value={form.contraseña} onChange={handleChange}
                                    placeholder="Nueva contraseña (opcional)" autoComplete="new-password" />
                                {errores.contraseña && <div className="invalid-feedback">{errores.contraseña}</div>}
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="pais" className="form-label">País</label>
                                <input type="text" className={`form-control ${errores.pais ? 'is-invalid' : ''}`}
                                    id="pais" name="pais" value={form.pais} onChange={handleChange} />
                                {errores.pais && <div className="invalid-feedback">{errores.pais}</div>}
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="ciudad" className="form-label">Ciudad</label>
                                <input type="text" className={`form-control ${errores.ciudad ? 'is-invalid' : ''}`}
                                    id="ciudad" name="ciudad" value={form.ciudad} onChange={handleChange} />
                                {errores.ciudad && <div className="invalid-feedback">{errores.ciudad}</div>}
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="direccion" className="form-label">Dirección</label>
                                <input type="text" className={`form-control ${errores.direccion ? 'is-invalid' : ''}`}
                                    id="direccion" name="direccion" value={form.direccion} onChange={handleChange} />
                                {errores.direccion && <div className="invalid-feedback">{errores.direccion}</div>}
                            </div>
                        </div>
                        <div className="d-flex gap-2 justify-content-end">
                            <button type="button" className="btn btn-outline-secondary" onClick={handleCancelar}>Cancelar</button>
                            <button type="submit" className="btn btn-primary px-4">Guardar cambios</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="cart-section p-4">
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                    <h2 className="h5 fw-bold mb-0">
                        Usuarios registrados
                        <span className="badge bg-secondary ms-2">{usuarios.length}</span>
                    </h2>
                    <input type="text" className="form-control w-auto"
                        placeholder="Buscar por nombre..."
                        value={busqueda} onChange={e => setBusqueda(e.target.value)}
                        style={{ minWidth: '260px' }} />
                </div>

                {!usuario && (
                    <div className="alert alert-info mb-3">
                        🔒 <Link to="/registro">Regístrate</Link> o inicia sesión para gestionar tu cuenta.
                    </div>
                )}

                {usuariosFiltrados.length === 0 ? (
                    <p className="text-muted text-center py-4">No se encontraron usuarios.</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>Nombre</th>
                                    <th>Ciudad</th>
                                    <th>Registro</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuariosFiltrados.map((u, i) => {
                                    const indexReal = usuarios.indexOf(u);
                                    const estaExpandido = filaExpandida === indexReal;
                                    const esMiCuenta = esPropio(indexReal);

                                    return (
                                        <Fragment key={i}>
                                            <tr className={esMiCuenta ? 'table-warning' : ''}>
                                                <td className="text-muted small">{indexReal + 1}</td>
                                                <td className="fw-semibold">
                                                    {u.nombre}
                                                    {esMiCuenta && <span className="badge bg-warning text-dark ms-2 small">Tu cuenta</span>}
                                                </td>
                                                <td>{u.ciudad || '—'}</td>
                                                <td className="text-muted small">
                                                    {u.fechaRegistro ? new Date(u.fechaRegistro).toLocaleDateString('es-CL') : '—'}
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2 flex-wrap">
                                                        <button
                                                            className="btn btn-sm btn-outline-info"
                                                            onClick={() => handleVerDetalles(indexReal)}
                                                        >
                                                            {estaExpandido ? 'Ocultar ▲' : 'Ver detalles ▼'}
                                                        </button>
                                                        {esMiCuenta && (
                                                            <>
                                                                <button className="btn btn-sm btn-outline-primary"
                                                                    onClick={() => handleEditar(indexReal)}>
                                                                    Editar
                                                                </button>
                                                                <button className="btn btn-sm btn-outline-danger"
                                                                    onClick={() => setConfirmarEliminar(indexReal)}>
                                                                    Eliminar
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>

                                            {estaExpandido && esMiCuenta && (
                                                <tr className="table-light">
                                                    <td colSpan={5}>
                                                        <div className="p-3">
                                                            <h6 className="fw-bold mb-3">📋 Mis datos</h6>
                                                            <div className="row g-2">
                                                                <div className="col-md-4">
                                                                    <span className="text-muted small">Nombre completo</span>
                                                                    <p className="mb-1 fw-semibold">{u.nombre}</p>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <span className="text-muted small">RUT</span>
                                                                    <p className="mb-1 fw-semibold">{u.rut}</p>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <span className="text-muted small">Correo</span>
                                                                    <p className="mb-1 fw-semibold">{u.correo}</p>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <span className="text-muted small">País</span>
                                                                    <p className="mb-1 fw-semibold">{u.pais || '—'}</p>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <span className="text-muted small">Ciudad</span>
                                                                    <p className="mb-1 fw-semibold">{u.ciudad || '—'}</p>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <span className="text-muted small">Dirección</span>
                                                                    <p className="mb-1 fw-semibold">{u.direccion || '—'}</p>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <span className="text-muted small">Fecha de registro</span>
                                                                    <p className="mb-1 fw-semibold">
                                                                        {u.fechaRegistro ? new Date(u.fechaRegistro).toLocaleDateString('es-CL') : '—'}
                                                                    </p>
                                                                </div>
                                                                <div className="col-12">
                                                                    <span className="text-muted small">Contraseña (hash SHA-256)</span>
                                                                    <p className="mb-0">
                                                                        <code className="text-break" style={{ fontSize: '0.75rem' }}>
                                                                            {u.contraseña || '—'}
                                                                        </code>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {confirmarEliminar !== null && (
                <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-3">
                            <div className="modal-header border-0">
                                <h5 className="modal-title">Eliminar mi cuenta</h5>
                            </div>
                            <div className="modal-body">
                                ¿Estás seguro que deseas eliminar tu cuenta? <strong>Esta acción no se puede deshacer.</strong>
                            </div>
                            <div className="modal-footer border-0">
                                <button className="btn btn-outline-secondary" onClick={() => setConfirmarEliminar(null)}>
                                    Cancelar
                                </button>
                                <button className="btn btn-danger" onClick={() => handleEliminar(confirmarEliminar)}>
                                    Sí, eliminar mi cuenta
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
