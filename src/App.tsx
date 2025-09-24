import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Lancamentos from './pages/lancamentos/Lancamentos';
import Limites from './pages/limites/Limites';
import Relatorios from './pages/Relatorios';
import { FinanceProvider } from './components/FinanceContent';

function App() {
  return (
    <FinanceProvider>
      <Router basename="/gerenciador-de-gastos">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lancamentos" element={<Lancamentos />} />
          <Route path="/limites" element={<Limites />} />
          <Route path="/relatorios" element={<Relatorios />} />
        </Routes>
      </Router>
    </FinanceProvider>
  );
}

export default App;