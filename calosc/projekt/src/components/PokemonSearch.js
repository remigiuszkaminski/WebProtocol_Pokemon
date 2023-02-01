import React, { useState, useEffect} from 'react';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
export default function PokemonSearch() {
    const [pokemons, setPokemons] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
  
    useEffect(() => {
        if(searchTerm === "") {

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
        } else {
            fetch(`http://localhost:5000/getall/${searchTerm}`, {
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
        }
    }, [searchTerm]);

    const formik = useFormik({
        initialValues: {
            search: '',
        },
        onSubmit: (values) => {
            setSearchTerm(values.search);
        },
    });

    return (
        <div className='text-center'>
            <div className='bg-gray-600 mb-20'>
                    <div className='flex justify-between'>
                        <div className='text-2xl text-white font-bold uppercase justify-self-start my-2 ml-2 flex-grow-0'>POKEMON BLOG</div>
                        <div className='ml-auto text-white mt-auto mb-auto mr-auto'> <Link to="/">Strona Główna</Link></div>
                </div>
            </div>
            <form onSubmit={formik.handleSubmit} className='border-1 bg-gray-500 w-96 ml-auto mr-auto text-white rounded p-2 mb-4'>
                <input
                className="border-2 border-black rounded py-2 px-4"
                id='search'
                name='search'
                type="text"
                placeholder="🔍 wyszukaj"
                onChange={formik.handleChange}
                value={formik.values.search}
                />
                <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Wyszukaj</button>
            </form>
            <div className='grid grid-cols-4 gap-24'>
                {pokemons.map((pokemon) => (
                    <div key={pokemon._id} className='ml-auto mr-auto w-76 h-86 rounded-lg overflow-hidden shadow-lg 1/4 relative'>
                    <div className='h-64 w-76'>
                        <img className='h-64 align-center w-76 ' src={pokemon.image} alt={pokemon.name}></img>
                    </div>
                    <div className='px-6 py-4 bg-slate-400 h-40 ' >
                        <p className=' text-xs mb-2'>Nazwa: {pokemon.name}</p>
                      <p className=' text-xs mt-2'>Właściciel: {pokemon.owner}</p>
                      <p className=' text-xs mt-2'>Typ: {pokemon.type}</p>
                      <p className=' text-xs mt-2'>Poziom: {pokemon.level}</p>
                      <p className=' text-xs mt-2 text-blue-600'><Link to={`/pokemon/${pokemon._id}`}>Przejdź do jego strony.</Link></p>
                    </div>
                  </div>
                ))}
            </div>
        </div>
    )
}