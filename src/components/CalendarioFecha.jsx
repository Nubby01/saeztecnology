import { useEffect, useRef, useState } from 'react';

const MESES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DIAS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];

function parseIso(iso) {
    if (!iso) return null;
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d);
}

function toIso(fecha) {
    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, '0');
    const d = String(fecha.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function mismoDia(a, b) {
    return a.getFullYear() === b.getFullYear()
        && a.getMonth() === b.getMonth()
        && a.getDate() === b.getDate();
}

function inicioSemanaLunes(fecha) {
    const dia = (fecha.getDay() + 6) % 7;
    const inicio = new Date(fecha);
    inicio.setDate(fecha.getDate() - dia);
    inicio.setHours(0, 0, 0, 0);
    return inicio;
}

function formatearFechaLarga(iso) {
    const fecha = parseIso(iso);
    if (!fecha) return 'Selecciona una fecha';
    return fecha.toLocaleDateString('es-CL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

export default function CalendarioFecha({ id, value, onChange, maxDate, invalid, valid, onAnioCambiadoSinFecha }) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const max = maxDate ? parseIso(maxDate) : hoy;

    const [abierto, setAbierto] = useState(false);
    const [mesVisible, setMesVisible] = useState(() => parseIso(value) || hoy);
    const contenedorRef = useRef(null);

    useEffect(() => {
        if (!abierto) return;
        function cerrarSiClickFuera(e) {
            if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
                setAbierto(false);
            }
        }
        function cerrarConEscape(e) {
            if (e.key === 'Escape') setAbierto(false);
        }
        const timer = setTimeout(() => {
            document.addEventListener('mousedown', cerrarSiClickFuera);
        }, 0);
        document.addEventListener('keydown', cerrarConEscape);
        return () => {
            clearTimeout(timer);
            document.removeEventListener('mousedown', cerrarSiClickFuera);
            document.removeEventListener('keydown', cerrarConEscape);
        };
    }, [abierto]);

    useEffect(() => {
        if (value) setMesVisible(parseIso(value));
    }, [value]);

    function cambiarMesSeleccionado(e) {
        const mes = Number(e.target.value);
        setMesVisible(prev => new Date(prev.getFullYear(), mes, 1));
    }

    function cambiarAnioSeleccionado(e) {
        const anio = Number(e.target.value);
        setMesVisible(prev => {
            let mes = prev.getMonth();
            if (anio === max.getFullYear() && mes > max.getMonth()) {
                mes = max.getMonth();
            }
            return new Date(anio, mes, 1);
        });
        if (!value) {
            onAnioCambiadoSinFecha?.();
        }
    }

    const anioMinimo = max.getFullYear() - 120;
    const aniosDisponibles = [];
    for (let anio = max.getFullYear(); anio >= anioMinimo; anio--) {
        aniosDisponibles.push(anio);
    }

    function seleccionarDia(fecha) {
        if (fecha > max) return;
        onChange(toIso(fecha));
        setAbierto(false);
    }

    const seleccionada = parseIso(value);
    const inicioCalendario = inicioSemanaLunes(new Date(mesVisible.getFullYear(), mesVisible.getMonth(), 1));
    const celdas = [];

    for (let i = 0; i < 42; i++) {
        const fecha = new Date(inicioCalendario);
        fecha.setDate(inicioCalendario.getDate() + i);
        const fueraMes = fecha.getMonth() !== mesVisible.getMonth();
        const deshabilitada = fecha > max;
        const esHoy = mismoDia(fecha, hoy);
        const esSeleccionada = seleccionada && mismoDia(fecha, seleccionada);

        celdas.push(
            <button
                key={toIso(fecha)}
                type="button"
                className={[
                    'calendario-fecha-dia',
                    fueraMes && 'calendario-fecha-dia--fuera-mes',
                    deshabilitada && 'calendario-fecha-dia--deshabilitado',
                    esHoy && 'calendario-fecha-dia--hoy',
                    esSeleccionada && 'calendario-fecha-dia--seleccionado'
                ].filter(Boolean).join(' ')}
                disabled={deshabilitada}
                onClick={() => seleccionarDia(fecha)}
                aria-label={fecha.toLocaleDateString('es-CL')}
                aria-pressed={esSeleccionada}
            >
                {fecha.getDate()}
            </button>
        );
    }

    const clasesTrigger = [
        'calendario-fecha-trigger',
        'form-control',
        invalid && 'is-invalid',
        valid && 'is-valid'
    ].filter(Boolean).join(' ');

    return (
        <div className={`calendario-fecha${abierto ? ' calendario-fecha--abierto' : ''}`} ref={contenedorRef}>
            <button
                type="button"
                id={id}
                className={clasesTrigger}
                onClick={() => setAbierto(prev => !prev)}
                aria-expanded={abierto}
                aria-haspopup="dialog"
            >
                <span className={`calendario-fecha-trigger-text${value ? '' : ' calendario-fecha-placeholder'}`}>
                    {formatearFechaLarga(value)}
                </span>
                <span className="calendario-fecha-trigger-icon" aria-hidden="true">📅</span>
            </button>

            {abierto && (
                <div className="calendario-fecha-panel" role="dialog" aria-label="Seleccionar fecha">
                    <div className="calendario-fecha-selectores">
                        <label className="calendario-fecha-select-label">
                            <span>Mes</span>
                            <select
                                className="calendario-fecha-select"
                                value={mesVisible.getMonth()}
                                onChange={cambiarMesSeleccionado}
                                aria-label="Seleccionar mes"
                            >
                                {MESES.map((nombre, indice) => (
                                    <option
                                        key={nombre}
                                        value={indice}
                                        disabled={
                                            mesVisible.getFullYear() === max.getFullYear()
                                            && indice > max.getMonth()
                                        }
                                    >
                                        {nombre}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="calendario-fecha-select-label">
                            <span>Año</span>
                            <select
                                className="calendario-fecha-select calendario-fecha-select--anio"
                                value={mesVisible.getFullYear()}
                                onChange={cambiarAnioSeleccionado}
                                aria-label="Seleccionar año"
                            >
                                {aniosDisponibles.map(anio => (
                                    <option key={anio} value={anio}>{anio}</option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="calendario-fecha-dias-semana">
                        {DIAS.map(dia => (
                            <span key={dia} className="calendario-fecha-dia-semana">{dia}</span>
                        ))}
                    </div>

                    <div className="calendario-fecha-grid">{celdas}</div>
                </div>
            )}
        </div>
    );
}
