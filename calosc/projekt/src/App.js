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
import YourAcc from './components/YourAcc';
import BlogOpinions from './components/BlogOpinions';
import Locations from './components/Locations';
import EachLocation from './components/EachLocation';
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
        <Route path='youracc/:id' element={<YourAcc />} />
        <Route path='blogopinions' element={<BlogOpinions />} />
        <Route path='locations' element={<Locations />} />
        <Route path='location/:id' element={<EachLocation />} />
      </Routes>
    </div>
  );
}

export default App;
