import CryptoJS from 'crypto-js';

export function cifrarPassword(password) {
    if (!password) return '';
    return CryptoJS.SHA256(String(password)).toString();
}

export function esPasswordCifrada(valor) {
    return typeof valor === 'string' && /^[a-f0-9]{64}$/i.test(valor);
}

export function prepararPasswordParaGuardar(valor, anteriorCifrado = null) {
    if (!valor || !String(valor).trim()) return anteriorCifrado || '';
    if (esPasswordCifrada(valor)) return valor;
    return cifrarPassword(valor);
}
