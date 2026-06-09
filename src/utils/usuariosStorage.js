import {
    cifrarPassword,
    esPasswordCifrada,
    prepararPasswordParaGuardar
} from './passwordUtils';

function migrarContraseñaUsuario(usuario) {
    if (!usuario) return usuario;
    if (esPasswordCifrada(usuario.contraseña)) return usuario;

    if (usuario.contraseña && !String(usuario.contraseña).startsWith('gAAAAA')) {
        return { ...usuario, contraseña: cifrarPassword(usuario.contraseña) };
    }

    const seed = `${usuario.rut || ''}|${usuario.correo || ''}` || 'usuario_sin_clave';
    return { ...usuario, contraseña: cifrarPassword(seed) };
}

function migrarListaUsuarios(lista) {
    return lista.map(migrarContraseñaUsuario);
}

export function cargarUsuarios() {
    const guardados = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const migrados = migrarListaUsuarios(guardados);
    if (JSON.stringify(migrados) !== JSON.stringify(guardados)) {
        localStorage.setItem('usuarios', JSON.stringify(migrados));
    }
    return migrados;
}

export function guardarUsuarios(lista) {
    localStorage.setItem('usuarios', JSON.stringify(lista));
    window.dispatchEvent(new Event('usuarios-actualizados'));
    return lista;
}

export function registrarUsuario(datosUsuario, contraseñaPlana) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    usuarios.push({
        ...datosUsuario,
        contraseña: cifrarPassword(contraseñaPlana),
        fechaRegistro: new Date().toISOString()
    });
    guardarUsuarios(usuarios);
    return usuarios;
}

export function usuarioConContraseñaCifrada(form, editandoIndex, usuarios) {
    const contraseñaGuardada = editandoIndex !== null
        ? prepararPasswordParaGuardar(form.contraseña, usuarios[editandoIndex].contraseña)
        : cifrarPassword(form.contraseña);
    const { contraseña: _omit, ...datosForm } = form;
    return { ...datosForm, contraseña: contraseñaGuardada };
}
