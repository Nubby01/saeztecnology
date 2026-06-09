import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SocialStrip from './components/SocialStrip';
import Home from './pages/Home';
import QuienesSomos from './pages/QuienesSomos';
import Contacto from './pages/Contacto';
import Terminos from './pages/Terminos';
import Diagramas from './pages/Diagramas';
import Registro from './pages/Registro';
import { CarritoProvider } from './context/CarritoContext';
import Usuarios from './pages/Usuarios';
import Edad from './pages/Edad';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <CarritoProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quienes-somos" element={<QuienesSomos />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/terminos" element={<Terminos />} />
          <Route path="/diagramas" element={<Diagramas />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/edad" element={<Edad />} />
        </Routes>
        <SocialStrip />
        <Footer />
      </CarritoProvider>
    </BrowserRouter>
  );
}

export default App;