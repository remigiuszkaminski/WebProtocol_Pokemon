import './index.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import Home from './components/Home';
import LoginForm from './components/LoginForm';
import ChatMQTT from './components/ChatMQTT';
import CreatePokemon from './components/CreatePokemon';
import PokemonSearch from './components/PokemonSearch';
import EachPokemon from './components/EachPokemon';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/chat" element={<ChatMQTT />} />
        <Route path='create' element={<CreatePokemon />} />
        <Route path='search' element={<PokemonSearch />} />
        <Route path='pokemon/:id' element={<EachPokemon />} />
      </Routes>
    </div>
  );
}

export default App;
