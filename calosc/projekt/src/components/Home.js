import React, {useState, useEffect} from "react";
import NavBar from "./NavBar";
export default function Home() {

  const [pokemons, setPokemons] = useState([]);
  
  
  useEffect(() => {
    fetch("http://localhost:5000/getall", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        },
      })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setPokemons(data);
      });
  }, []);

  const randompokemons = pokemons
        .sort(() => Math.random() - 0.5)
        .slice(0,4)

  return (
    <div className="text-center"> 
        <NavBar />
        <div>Strona główna</div>
        <div>
          Pare pokemonów ha
          <div className='grid grid-cols-4 gap-6 gap-x-1 grid-flow-dense justify-center gap-2.5' >
          {randompokemons.map((pokemon) => (
            <div key={pokemon._id} className='ml-auto mr-auto w-76 h-86 rounded-lg overflow-hidden shadow-lg 1/4 relative'>
              <div className='h-64 w-76'>
                  <img className='h-64 align-center w-76 ' src={pokemon.image} alt={pokemon.name}></img>
              </div>
              <div className='px-6 py-4 bg-slate-400 h-40 ' >
                <p className=' text-xs mb-2'></p>
                <p className=' text-xs mt-2'>Właściciel: {pokemon.owner}</p>
                <p className=' text-xs mt-2'>Typ: {pokemon.type}</p>
                <p className=' text-xs mt-2'>Poziom: {pokemon.level}</p>
              </div>
            </div>
            ))}
          </div>
      </div>
    </div>
)
}