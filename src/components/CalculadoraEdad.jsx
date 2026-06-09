import { useState } from 'react';
import CalendarioFecha from './CalendarioFecha';

function toIsoLocal(fecha) {
    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, '0');
    const d = String(fecha.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function CalculadoraEdad({ onEdadCalculada }) {
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [edad, setEdad] = useState(null);
    const [error, setError] = useState('');
    const [aviso, setAviso] = useState('');

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const hoyIso = toIsoLocal(hoy);

    function calcularEdad(e) {
        e?.preventDefault();
        setError('');

        if (!fechaNacimiento) {
            setEdad(null);
            onEdadCalculada?.(null);
            setError('Selecciona tu fecha de nacimiento.');
            return;
        }

        const hoy = new Date();
        const nacimiento = new Date(`${fechaNacimiento}T00:00:00`);

        if (Number.isNaN(nacimiento.getTime())) {
            setEdad(null);
            onEdadCalculada?.(null);
            setError('La fecha ingresada no es válida.');
            return;
        }

        if (nacimiento > hoy) {
            setEdad(null);
            onEdadCalculada?.(null);
            setError('La fecha de nacimiento no puede ser futura.');
            return;
        }

        let años = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();

        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            años--;
        }

        setEdad(años);
        onEdadCalculada?.(años);
    }

    return (
        <div className="calculadora-edad cart-section contacto-formulario p-4">
            <div className="calculadora-edad-header mb-4">
                <span className="calculadora-edad-icon" aria-hidden="true">🎂</span>
                <div>
                    <h2 className="h5 fw-bold mb-1">¿Cuántos años tienes?</h2>
                    <p className="text-muted mb-0 small">
                        Ingresa tu fecha de nacimiento y obtén tu edad al día de hoy.
                    </p>
                </div>
            </div>

            <form onSubmit={calcularEdad} noValidate>
                <div className="mb-4 calculadora-edad-campo-fecha">
                    <label htmlFor="fechaNacimiento" className="form-label">Fecha de nacimiento</label>
                    <CalendarioFecha
                        id="fechaNacimiento"
                        value={fechaNacimiento}
                        maxDate={hoyIso}
                        invalid={Boolean(error)}
                        valid={edad !== null && !error}
                        onChange={(iso) => {
                            setFechaNacimiento(iso);
                            setError('');
                            setAviso('');
                            setEdad(null);
                            onEdadCalculada?.(null);
                        }}
                        onAnioCambiadoSinFecha={() =>
                            setAviso('Cambiaste el año, pero aún debes seleccionar el mes y el día en el calendario.')
                        }
                    />
                    {error && <div className="invalid-feedback d-block">{error}</div>}
                    {aviso && (
                        <div className="alert alert-warning mt-2 mb-0 py-2 px-3 small" role="alert">
                            {aviso}
                        </div>
                    )}
                </div>

                <button type="submit" className="btn btn-primary px-4">
                    Calcular edad
                </button>
            </form>

            {edad !== null && (
                <div className="calculadora-edad-resultado mt-4" role="status" aria-live="polite">
                    <p className="calculadora-edad-resultado-label mb-2">Tu edad es</p>
                    <p className="calculadora-edad-resultado-valor mb-0">
                        <span className="calculadora-edad-numero">{edad}</span>
                        <span className="calculadora-edad-unidad">{edad === 1 ? 'año' : 'años'}</span>
                    </p>
                </div>
            )}
        </div>
    );
}

export default CalculadoraEdad;
