export const API_MONEDAS_URL = 'https://mindicador.cl/api';

export const MONEDAS = [
    { codigo: 'clp', etiqueta: 'Peso chileno', abrev: 'CLP', simbolo: '$', apiKey: null, decimales: 0, sufijo: false },
    { codigo: 'dolar', etiqueta: 'Dólar', abrev: 'USD', simbolo: 'US$', apiKey: 'dolar', decimales: 2, sufijo: false },
    { codigo: 'euro', etiqueta: 'Euro', abrev: 'EUR', simbolo: '€', apiKey: 'euro', decimales: 2, sufijo: false },
    { codigo: 'uf', etiqueta: 'Unidad de Fomento', abrev: 'UF', simbolo: 'UF', apiKey: 'uf', decimales: 2, sufijo: true },
    { codigo: 'utm', etiqueta: 'Unidad Tributaria Mensual', abrev: 'UTM', simbolo: 'UTM', apiKey: 'utm', decimales: 2, sufijo: true }
];

export const MONEDA_CLP = MONEDAS[0];

export function obtenerMoneda(codigo) {
    return MONEDAS.find(m => m.codigo === codigo) || MONEDA_CLP;
}

export function formatearNumero(valor, decimales) {
    return new Intl.NumberFormat('es-CL', {
        minimumFractionDigits: decimales,
        maximumFractionDigits: decimales
    }).format(valor);
}

export function formatearMoneda(valor, moneda) {
    const num = formatearNumero(valor, moneda.decimales);
    return moneda.sufijo ? `${num} ${moneda.simbolo}` : `${moneda.simbolo}${num}`;
}

export function convertirDesdeClp(precioClp, moneda, indicadores) {
    if (!moneda.apiKey) return precioClp;
    const valor = indicadores?.[moneda.apiKey]?.valor;
    return valor ? precioClp / valor : null;
}
