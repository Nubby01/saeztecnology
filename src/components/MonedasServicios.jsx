import { useMemo, useState } from 'react';
import { servicios } from '../data/services';
import {
    MONEDAS,
    MONEDA_CLP,
    obtenerMoneda,
    formatearMoneda,
    convertirDesdeClp
} from '../utils/monedas';

export default function MonedasServicios({ onAgregar, monedaSel, setMonedaSel, indicadores, cargando, errorCarga }) {
    const [montoPersonalizado, setMontoPersonalizado] = useState('');
    const [monedaPersonalizada, setMonedaPersonalizada] = useState('dolar');
    const [errorPersonalizado, setErrorPersonalizado] = useState('');
    const [resultadoPersonalizado, setResultadoPersonalizado] = useState(null);

    const moneda = useMemo(() => obtenerMoneda(monedaSel), [monedaSel]);

    const monedasDisponibles = useMemo(
        () => MONEDAS.filter(m => !m.apiKey || indicadores?.[m.apiKey]?.valor),
        [indicadores]
    );

    function consultarPersonalizado(e) {
        e.preventDefault();
        setErrorPersonalizado('');
        setResultadoPersonalizado(null);

        const cantidad = Number(montoPersonalizado);
        if (montoPersonalizado === '' || Number.isNaN(cantidad)) {
            setErrorPersonalizado('Ingresa una cantidad válida.');
            return;
        }
        if (cantidad <= 0) {
            setErrorPersonalizado('La cantidad debe ser mayor que cero.');
            return;
        }

        const m = obtenerMoneda(monedaPersonalizada);
        const valor = indicadores?.[m.apiKey]?.valor;
        if (!valor) {
            setErrorPersonalizado('Esa moneda no está disponible en este momento.');
            return;
        }

        setResultadoPersonalizado({
            cantidad,
            moneda: m,
            enPesos: cantidad * valor
        });
    }

    return (
        <>
            <div className="monedas-panel mb-4">
                <div className="monedas-panel-cabecera">
                    <div>
                        <h3 className="h6 fw-bold mb-1">
                            <span aria-hidden="true">💱</span> Monedas disponibles
                        </h3>
                        <p className="text-muted small mb-0">
                            Elige una moneda y los precios de los servicios (y el total del carrito) se mostrarán en ella, con valores de mindicador.cl.
                        </p>
                    </div>
                    <div className="monedas-selector">
                        <label htmlFor="monedaServicios" className="form-label small fw-semibold mb-1">Ver precios en</label>
                        <select
                            id="monedaServicios"
                            className="form-select"
                            value={monedaSel}
                            onChange={(e) => setMonedaSel(e.target.value)}
                            disabled={cargando}
                        >
                            {monedasDisponibles.map(m => (
                                <option key={m.codigo} value={m.codigo}>
                                    {m.etiqueta} ({m.abrev})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {cargando && (
                    <p className="text-muted small mb-0 mt-2 d-flex align-items-center gap-2">
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Cargando valores de monedas...
                    </p>
                )}
                {errorCarga && (
                    <div className="alert alert-warning py-2 px-3 small mb-0 mt-2" role="alert">{errorCarga}</div>
                )}
                {!cargando && !errorCarga && moneda.apiKey && (
                    <p className="monedas-tasa small mb-0 mt-2">
                        1 {moneda.abrev} = {formatearMoneda(indicadores[moneda.apiKey].valor, MONEDA_CLP)} CLP
                    </p>
                )}
            </div>

            <div className="row">
                {servicios.map(s => {
                    const precioConvertido = convertirDesdeClp(s.precio, moneda, indicadores);
                    return (
                        <div key={s.id} className="col-md-6 col-lg-4 mb-4">
                            <div className="card service-card h-100 shadow-sm">
                                <img src={s.img} className="card-img-top service-img-basica" alt={s.nombre} />
                                <div className="card-body text-center">
                                    <h5>{s.nombre}</h5>
                                    <p className="service-desc">{s.desc}</p>
                                    <p className="service-price">
                                        {precioConvertido !== null ? formatearMoneda(precioConvertido, moneda) : '—'}
                                    </p>
                                    {moneda.apiKey && (
                                        <p className="service-price-clp">≈ {formatearMoneda(s.precio, MONEDA_CLP)} CLP</p>
                                    )}
                                    <button className="btn btn-success" onClick={() => onAgregar(s.nombre, s.precio)}>
                                        Agregar al Carrito
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="monedas-personalizado">
                <h3 className="h6 fw-bold mb-1">
                    <span aria-hidden="true">🔎</span> Consultar precios específicos
                </h3>
                <p className="text-muted small mb-3">
                    Ingresa la cantidad exacta de la moneda que quieres ver y conoce su equivalente en pesos chilenos.
                </p>

                <form onSubmit={consultarPersonalizado} noValidate className="monedas-personalizado-form">
                    <div className="monedas-personalizado-campos">
                        <div>
                            <label htmlFor="montoPersonalizado" className="form-label small fw-semibold">Cantidad</label>
                            <input
                                type="number"
                                id="montoPersonalizado"
                                className={`form-control${errorPersonalizado ? ' is-invalid' : ''}`}
                                placeholder="Ej: 25"
                                min="0"
                                step="any"
                                value={montoPersonalizado}
                                onChange={(e) => {
                                    setMontoPersonalizado(e.target.value);
                                    setErrorPersonalizado('');
                                    setResultadoPersonalizado(null);
                                }}
                            />
                        </div>
                        <div>
                            <label htmlFor="monedaPersonalizada" className="form-label small fw-semibold">Moneda</label>
                            <select
                                id="monedaPersonalizada"
                                className="form-select"
                                value={monedaPersonalizada}
                                onChange={(e) => {
                                    setMonedaPersonalizada(e.target.value);
                                    setResultadoPersonalizado(null);
                                }}
                            >
                                {monedasDisponibles.filter(m => m.apiKey).map(m => (
                                    <option key={m.codigo} value={m.codigo}>
                                        {m.etiqueta} ({m.abrev})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary px-4" disabled={cargando || Boolean(errorCarga)}>
                            Consultar
                        </button>
                    </div>
                    {errorPersonalizado && <div className="invalid-feedback d-block">{errorPersonalizado}</div>}
                </form>

                {resultadoPersonalizado && (
                    <div className="monedas-personalizado-resultado mt-3" role="status" aria-live="polite">
                        <span className="monedas-personalizado-origen">
                            {formatearMoneda(resultadoPersonalizado.cantidad, resultadoPersonalizado.moneda)}
                        </span>
                        <span className="monedas-personalizado-flecha" aria-hidden="true">→</span>
                        <span className="monedas-personalizado-destino">
                            {formatearMoneda(resultadoPersonalizado.enPesos, MONEDA_CLP)} CLP
                        </span>
                    </div>
                )}
            </div>
        </>
    );
}
