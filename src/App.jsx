import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Catalog from './pages/Catalog';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col relative">
            {/* Mesh Glow Background */}
            <div className="bg-mesh"></div>
            
            {/* Central sticky Navigation */}
            <Navbar />
            
            {/* Page Content Shell */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
              <Routes>
                <Route path="/" element={<Navigate to="/catalog" replace />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="*" element={<Navigate to="/catalog" replace />} />
              </Routes>
            </main>
            
            {/* Ultra-sleek premium footer */}
            <footer className="border-t border-slate-800/40 bg-obsidian-900/60 backdrop-blur-md py-6 text-center text-xs text-slate-500 z-10">
              <p>&copy; {new Date().getFullYear()} Nexus Market. Microservice Orchestrated Front-End.</p>
            </footer>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
