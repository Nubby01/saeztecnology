import CalculadoraEdad from '../components/CalculadoraEdad';

export default function Edad() {
    return (
        <main className="container page-content py-5">
            <div className="layout-navbar-spacer" aria-hidden="true"></div>
            <h1 className="page-title">Calculadora de Edad</h1>
            <p className="lead text-muted mb-4">
                Herramienta simple para calcular tu edad exacta según tu fecha de nacimiento.
            </p>

            <div className="row justify-content-center">
                <div className="col-lg-6 col-xl-5">
                    <CalculadoraEdad />
                </div>
            </div>
        </main>
    );
}
