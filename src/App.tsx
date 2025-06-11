import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Home from './pages/Home';
import WhatsAppFloat from './components/whatsapp/WhatsAppFloat';
import MeasurementForm from './components/measurement/MeasurementForm';
import ConsultationScheduler from './components/consultation/ConsultationScheduler';
import WhatsAppCatalog from './components/catalog/WhatsAppCatalog';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthPage && <Header />}
      <main className={`container mx-auto px-4 ${!isAuthPage ? 'py-8' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/medidas" element={<MeasurementForm />} />
          <Route path="/asesoria" element={<ConsultationScheduler />} />
          <Route path="/catalogo" element={<WhatsAppCatalog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      {!isAuthPage && <WhatsAppFloat />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
