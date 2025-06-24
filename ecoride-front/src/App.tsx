import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Users from './pages/Users';
import Header from './components/Header';
import Register from "./pages/Register";
import CreerVoyagePage from './pages/CreerVoyage';
import Profile from './pages/Profile';
import Login from './pages/login';
import Footer from './components/Footer';
import CovoiturageDetails from './pages/CovoiturageDetails';
import VoirCovoiturages from "./pages/VoirCovoiturages";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/register" element={<Register />} />
            <Route path="/covoiturage/:id" element={<CovoiturageDetails />} />
            <Route path="/covoiturage" element={<VoirCovoiturages />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
    

  );
}

export default App;
