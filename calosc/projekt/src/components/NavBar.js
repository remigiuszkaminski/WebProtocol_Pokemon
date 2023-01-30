import React from 'react';
import { Link } from 'react-router-dom'
export default function NavBar() {

    return(
        <div className='bg-gray-600 mb-20'>
            <div className='flex justify-between'>
                    <div className='text-2xl text-white font-bold uppercase justify-self-start my-2 ml-2 flex-grow-0'>POKEMON BLOG</div>
                    <div className='ml-auto text-white mt-auto mb-auto flex-grow-1'> <Link to="/">Strona Główna</Link></div>
                    <div className='ml-auto text-white mt-auto mb-auto flex-grow-1'> <Link to='/register'>Zarejestruj się</Link></div>
                    <div className='ml-auto text-white mt-auto mb-auto flex-grow-1'> <Link to='/login'>Zaloguj się</Link></div>
                    <div className='ml-auto text-white mt-auto mb-auto mr-4 align-self-end ml-auto '><Link to='/chat'>Poczatuj</Link></div>
            </div>
        </div>

    )
}