import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Home from './pages/Home';
import WhatsAppFloat from './components/whatsapp/WhatsAppFloat';
import MeasurementForm from './components/measurement/MeasurementForm';
import ConsultationScheduler from './components/consultation/ConsultationScheduler';
import WhatsAppCatalog from './components/catalog/WhatsAppCatalog';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/medidas" element={<MeasurementForm />} />
            <Route path="/asesoria" element={<ConsultationScheduler />} />
            <Route path="/catalogo" element={<WhatsAppCatalog />} />
          </Routes>
        </main>
        <WhatsAppFloat />
      </div>
    </Router>
  );
};

export default App;
