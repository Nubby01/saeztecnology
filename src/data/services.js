import appMulti from '../assets/appmulti.png';
import appWebBasica from '../assets/appwebbasica.png';
import appWebPersonalizada from '../assets/appwebpersonalizada.png';
import paginaWebBasica from '../assets/paginaweb-basica.png';
import paginaPersonalizada from '../assets/paginapersonalizada.png';
import soporte from '../assets/soporte.png';

export const servicios = [
    { id: 1, nombre: 'Página Web Básica', precio: 120000, img: paginaWebBasica, desc: 'Sitio con estructura clara para presentar tu negocio.' },
    { id: 2, nombre: 'Página Web Personalizada', precio: 350000, img: paginaPersonalizada, desc: 'Diseño y contenidos a medida para reflejar tu marca.' },
    { id: 3, nombre: 'Soporte Técnico', precio: 90000, img: soporte, desc: 'Asistencia para resolver incidencias y actualizaciones.' },
    { id: 4, nombre: 'Aplicación Web Básica', precio: 500000, img: appWebBasica, desc: 'Plataforma web con funciones esenciales.' },
    { id: 5, nombre: 'Aplicación Web Personalizada', precio: 770000, img: appWebPersonalizada, desc: 'Desarrollo a medida con flujos adaptados a tu operación.' },
    { id: 6, nombre: 'Aplicación Web Multidispositivos', precio: 900000, img: appMulti, desc: 'Una misma experiencia en computador, tablet y móvil.' },
];