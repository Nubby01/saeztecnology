import { createContext, useContext, useReducer, useState, useEffect, useCallback } from 'react';

const CarritoContext = createContext();

function carritoReducer(state, action) {
    switch (action.type) {
        case 'AGREGAR': return [...state, action.payload];
        case 'ELIMINAR': return state.filter((_, i) => i !== action.index);
        default: return state;
    }
}

export function CarritoProvider({ children }) {
    const [carrito, dispatch] = useReducer(carritoReducer, []);
    const [aviso, setAviso] = useState(null);
    const [usuario, setUsuario] = useState(() => {
        const guardado = localStorage.getItem('usuarioActivo');
        return guardado ? JSON.parse(guardado) : null;
    });

    function usuarioExisteEnRegistro(datos) {
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        return usuarios.some(u => u.correo === datos.correo || u.rut === datos.rut);
    }

    const validarSesionActiva = useCallback(() => {
        const guardado = localStorage.getItem('usuarioActivo');
        if (!guardado) return;
        const activo = JSON.parse(guardado);
        if (!usuarioExisteEnRegistro(activo)) {
            localStorage.removeItem('usuarioActivo');
            setUsuario(null);
        }
    }, []);

    function iniciarSesion(datos) {
        localStorage.setItem('usuarioActivo', JSON.stringify(datos));
        setUsuario(datos);
    }

    function agregar(nombre, precio) {
        dispatch({ type: 'AGREGAR', payload: { nombre, precio } });
        setAviso({ texto: 'Servicio agregado al carrito', tipo: 'agregar' });
    }

    function eliminar(index) {
        dispatch({ type: 'ELIMINAR', index });
        setAviso({ texto: 'Servicio eliminado del carrito', tipo: 'eliminar' });
    }

    function calcularTotal() {
        return carrito.reduce((acc, item) => acc + item.precio, 0);
    }

    function cerrarSesion() {
        localStorage.removeItem('usuarioActivo');
        setUsuario(null);
    }

    useEffect(() => {
        if (!aviso) return;
        const timer = setTimeout(() => setAviso(null), 2800);
        return () => clearTimeout(timer);
    }, [aviso]);

    useEffect(() => {
        validarSesionActiva();
        window.addEventListener('usuarios-actualizados', validarSesionActiva);
        return () => window.removeEventListener('usuarios-actualizados', validarSesionActiva);
    }, [validarSesionActiva]);

    return (
        <CarritoContext.Provider value={{ carrito, agregar, eliminar, calcularTotal, aviso, usuario, setUsuario, iniciarSesion, cerrarSesion, validarSesionActiva }}>
            {children}
        </CarritoContext.Provider>
    );
}

export const useCarrito = () => useContext(CarritoContext);