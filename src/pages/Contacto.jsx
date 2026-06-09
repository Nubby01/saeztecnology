import { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

function cifrarTexto(texto) {
  return CryptoJS.SHA256(texto).toString();
}

export default function Contacto() {
  const [form, setForm] = useState({
    nombre: '', correo: '', telefono: '', mensaje: '',
    tipoServicio: '', tipoProyecto: '', terminos: false
  });
  const [errores, setErrores] = useState({});

  const [mensajeCifrado, setMensajeCifrado] = useState('');
  const [errorCifrado, setErrorCifrado] = useState('');
  const [historialCifrado, setHistorialCifrado] = useState([]);
  const [copiado, setCopiado] = useState(null);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  useEffect(() => {
    const guardado = JSON.parse(localStorage.getItem('historialMensajesCifrados') || '[]');
    setHistorialCifrado(guardado);
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  function validar() {
    const e = {};
    if (!form.nombre || form.nombre.trim().length < 2)
      e.nombre = 'Mínimo 2 caracteres, solo letras.';
    else if (!/^[\p{L}]+(?:\s[\p{L}]+)*$/u.test(form.nombre.trim()))
      e.nombre = 'Solo letras y espacios.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.correo))
      e.correo = 'Correo inválido.';
    if (!/^\d{8,11}$/.test(form.telefono))
      e.telefono = 'Solo números, entre 8 y 11 dígitos.';
    if (!form.mensaje || form.mensaje.length > 200)
      e.mensaje = 'Mensaje obligatorio, máximo 200 caracteres.';
    if (!form.tipoServicio)
      e.tipoServicio = 'Seleccione un tipo de servicio.';
    if (!form.tipoProyecto)
      e.tipoProyecto = 'Seleccione un tipo de proyecto.';
    if (!form.terminos)
      e.terminos = 'Debe aceptar los términos.';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const e2 = validar();
    setErrores(e2);
    if (Object.keys(e2).length === 0) {
      alert('Solicitud enviada correctamente.');
      setForm({
        nombre: '', correo: '', telefono: '', mensaje: '',
        tipoServicio: '', tipoProyecto: '', terminos: false
      });
      setErrores({});
    }
  }

  function handleCifrar(e) {
    e.preventDefault();
    if (!mensajeCifrado.trim()) {
      setErrorCifrado('Escribe un mensaje para cifrar.');
      return;
    }
    setErrorCifrado('');
    const nuevo = {
      id: Date.now(),
      hash: cifrarTexto(mensajeCifrado.trim()),
      fecha: new Date().toLocaleString('es-CL'),
    };
    const nuevoHistorial = [nuevo, ...historialCifrado];
    setHistorialCifrado(nuevoHistorial);
    localStorage.setItem('historialMensajesCifrados', JSON.stringify(nuevoHistorial));
    setMensajeCifrado('');
    setMostrarHistorial(true);
  }

  function handleEliminarCifrado(id) {
    const nuevo = historialCifrado.filter(r => r.id !== id);
    setHistorialCifrado(nuevo);
    localStorage.setItem('historialMensajesCifrados', JSON.stringify(nuevo));
  }

  function handleCopiar(hash, id) {
    navigator.clipboard.writeText(hash).then(() => {
      setCopiado(id);
      setTimeout(() => setCopiado(null), 2000);
    });
  }

  return (
    <main className="container page-content py-5">
      <div className="layout-navbar-spacer" aria-hidden="true"></div>
      <h1 className="page-title">Contacto</h1>
      <p className="lead text-muted mb-4">Escríbenos y te responderemos a la brevedad.</p>

      <div className="row justify-content-center">
        <div className="col-lg-8">

          {/* ── Formulario de contacto normal ── */}
          <form className="contacto-formulario cart-section p-4 mb-4" onSubmit={handleSubmit} noValidate>
            <h2 className="h5 fw-bold mb-4">Formulario de contacto y servicios</h2>
            <h3 className="h6 fw-bold text-secondary mb-3 pb-2 border-bottom">Datos del cliente</h3>

            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre completo</label>
              <input type="text" className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                id="nombre" name="nombre" value={form.nombre} onChange={handleChange} />
              {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="correo" className="form-label">Correo electrónico</label>
              <input type="email" className={`form-control ${errores.correo ? 'is-invalid' : ''}`}
                id="correo" name="correo" value={form.correo} onChange={handleChange} />
              {errores.correo && <div className="invalid-feedback">{errores.correo}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="telefono" className="form-label">Teléfono</label>
              <input type="text" className={`form-control ${errores.telefono ? 'is-invalid' : ''}`}
                id="telefono" name="telefono" value={form.telefono} onChange={handleChange} />
              {errores.telefono && <div className="invalid-feedback">{errores.telefono}</div>}
            </div>
            <div className="mb-4">
              <label htmlFor="mensaje" className="form-label">Mensaje</label>
              <textarea className={`form-control ${errores.mensaje ? 'is-invalid' : ''}`}
                id="mensaje" name="mensaje" rows="4" value={form.mensaje} onChange={handleChange} />
              {errores.mensaje && <div className="invalid-feedback">{errores.mensaje}</div>}
            </div>

            <h3 className="h6 fw-bold text-secondary mb-3 pb-2 border-bottom mt-4">Solicitud de servicio</h3>
            <p className="form-label fw-semibold mb-2">Tipo de servicio</p>
            {['Página Web Básica', 'Página Web Personalizada', 'Soporte Técnico',
              'Aplicación Web Básica', 'Aplicación Web Personalizada',
              'Aplicación Web Multidispositivos'].map(srv => (
              <div className="form-check" key={srv}>
                <input className="form-check-input" type="radio" name="tipoServicio"
                  id={srv} value={srv} checked={form.tipoServicio === srv} onChange={handleChange} />
                <label className="form-check-label" htmlFor={srv}>{srv}</label>
              </div>
            ))}
            {errores.tipoServicio && <div className="text-danger small mt-1">{errores.tipoServicio}</div>}

            <div className="mb-4 mt-3">
              <label htmlFor="tipoProyecto" className="form-label">Tipo de proyecto</label>
              <select className={`form-select ${errores.tipoProyecto ? 'is-invalid' : ''}`}
                id="tipoProyecto" name="tipoProyecto" value={form.tipoProyecto} onChange={handleChange}>
                <option value="" disabled>Seleccione una opción</option>
                <option value="Proyecto desde cero">Proyecto desde cero</option>
                <option value="Proyecto intermedio">Proyecto intermedio</option>
                <option value="Proyecto avanzado">Proyecto avanzado</option>
                <option value="Actualización de sistema existente">Actualización de sistema existente</option>
                <option value="Mantención y soporte">Mantención y soporte</option>
              </select>
              {errores.tipoProyecto && <div className="invalid-feedback">{errores.tipoProyecto}</div>}
            </div>

            <h3 className="h6 fw-bold text-secondary mb-3 pb-2 border-bottom mt-4">Términos y condiciones</h3>
            <div className="form-check mb-4">
              <input className={`form-check-input ${errores.terminos ? 'is-invalid' : ''}`}
                type="checkbox" id="terminos" name="terminos"
                checked={form.terminos} onChange={handleChange} />
              <label className="form-check-label" htmlFor="terminos">
                He leído y acepto los términos y condiciones.
              </label>
              {errores.terminos && <div className="invalid-feedback">{errores.terminos}</div>}
            </div>

            <div className="text-end">
              <button type="submit" className="btn btn-primary px-4">Enviar solicitud</button>
            </div>
          </form>

          {/* ── Separador entre formularios ── */}
          <div className="text-center my-4">
            <div className="d-flex align-items-center gap-3">
              <hr className="flex-grow-1" />
              <span className="text-muted small fw-semibold px-2">¿Prefieres el anonimato?</span>
              <hr className="flex-grow-1" />
            </div>
          </div>

          {/* ── Formulario de mensaje cifrado ── */}
          <form className="cart-section contacto-formulario p-4 mb-5" onSubmit={handleCifrar} noValidate>
            <div className="d-flex align-items-start gap-3 mb-3">
              <span style={{ fontSize: '1.6rem' }}>🔒</span>
              <div>
                <h2 className="h5 fw-bold mb-1">Enviar mensaje cifrado</h2>
                <p className="text-muted small mb-0">
                  Tu mensaje será cifrado con SHA-256 antes de guardarse.
                  El texto original no se almacena, solo su representación cifrada.
                </p>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="mensajeCifrado" className="form-label">Tu mensaje anónimo</label>
              <textarea
                className={`form-control ${errorCifrado ? 'is-invalid' : ''}`}
                id="mensajeCifrado"
                rows="3"
                value={mensajeCifrado}
                onChange={e => { setMensajeCifrado(e.target.value); setErrorCifrado(''); }}
                placeholder="Escribe aquí tu mensaje. Será cifrado al enviarlo..."
                maxLength={500}
              />
              {errorCifrado && <div className="invalid-feedback">{errorCifrado}</div>}
              <div className="text-muted small mt-1 text-end">{mensajeCifrado.length}/500</div>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              {historialCifrado.length > 0 && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setMostrarHistorial(prev => !prev)}
                >
                  {mostrarHistorial
                    ? `Ocultar historial ▲`
                    : `Ver historial (${historialCifrado.length}) ▼`}
                </button>
              )}
              <button type="submit" className="btn btn-primary px-4 ms-auto">
                Cifrar y enviar
              </button>
            </div>

            {/* Historial de mensajes cifrados — mostrar/ocultar */}
            {mostrarHistorial && historialCifrado.length > 0 && (
              <div className="mt-4">
                <h3 className="h6 fw-bold text-secondary mb-3 pb-2 border-bottom">
                  Historial de mensajes cifrados
                </h3>
                <div className="d-flex flex-column gap-2">
                  {historialCifrado.map(r => (
                    <div key={r.id} className="rounded-3 p-3"
                      style={{ background: 'var(--pastel-bg)', border: '1px solid var(--border-soft)' }}>
                      <div className="d-flex justify-content-between align-items-start gap-2">
                        <div className="flex-grow-1">
                          <span className="text-muted small d-block mb-1">SHA-256</span>
                          <code className="text-break" style={{ fontSize: '0.75rem', wordBreak: 'break-all' }}>
                            {r.hash}
                          </code>
                          <div className="text-muted small mt-1">{r.fecha}</div>
                        </div>
                        <div className="d-flex gap-2 flex-shrink-0">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleCopiar(r.hash, r.id)}
                          >
                            {copiado === r.id ? '✓' : 'Copiar'}
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleEliminarCifrado(r.id)}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>

        </div>
      </div>

      {/* ── Mapa de ubicación ── */}
      <section className="container my-5 text-center">
        <h3>Ubicación</h3>
        <p className="mb-4">Punta Arenas, Chile</p>
        <iframe
          src="https://www.google.com/maps?q=Punta+Arenas,Chile&output=embed"
          width="100%" height="300"
          style={{ border: 0 }}
          className="rounded-3 shadow-sm"
          loading="lazy"
          title="Mapa de Punta Arenas, Chile"
        />
      </section>
    </main>
  );
}
