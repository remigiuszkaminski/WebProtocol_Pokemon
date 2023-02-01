import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
export default function EachPokemon() {

    const { id } = useParams();
    const [pokemon, setPokemon] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    const name = getCookie('name');
    useEffect(() => {
        fetch(`http://localhost:5000/getpokemon/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setPokemon(data);
                console.log(data)
                setLoading(false);
            });
    }, [id]);


    const validate = (values) => {
        const errors = {};
        if (!values.name) {
            errors.name = 'Required';
        } else if (values.name.length > 15) {
            errors.name = 'Must be 15 characters or less';
        }
        if (!values.type) {
            errors.type = 'Required';
        } else if (values.type.length > 15) {
            errors.type = 'Must be 15 characters or less';
        }
        if (!values.level) {
            errors.level = 'Required';
        } else if (values.level.length > 3) {
            errors.level = 'Must be 3 characters or less';
        }
        if (!values.owner) {
            errors.owner = 'Required';
        } else if (values.owner.length > 15) {
            errors.owner = 'Must be 15 characters or less';
        }
        if (!values.image) {
            errors.image = 'Required';
        }
        return errors;
    };

    const validate2 = (values) => {
        const errors = {};
        if (!values.opinion) {
            errors.opinion = 'Required';
        } else if (values.opinion.length > 100) {
            errors.opinion = 'Must be 100 characters or less';
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            type: '',
            level: '',
            owner: '',
            image: '',
        },
        validate,
        onSubmit: (values) => {
            fetch(`http://localhost:5000/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: values.name,
                    type: values.type,
                    level: values.level,
                    owner: values.owner,
                    image: values.image,
                }),
            })
                .then((res) => {
                    if (res.status === 200) {
                        alert('Pokemon został zaktualizowany');
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            navigate(`/search`);
        },
    });

    const formik2 = useFormik({
        initialValues: {
            name: name,
            opinion: '',
        },
        validate2,
        onSubmit: (values) => {
            fetch(`http://localhost:5000/addopinion/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: values.name,
                    opinion: values.opinion,
                }),
            })
                .then((res) => {
                    if (res.status === 200) {
                        alert('Opinia została dodana');
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            formik2.resetForm();
        },
    });


    function handleDelete() {
        fetch(`http://localhost:5000/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => {
                if (res.status === 200) {
                    alert('Pokemon został usunięty');
                    navigate('/search')
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }


    return (
        <div>
            {loading ? (
                <div>Ładowanie...</div>
            ) : (
            <div>
                <div className='bg-gray-600 mb-20'>
                    <div className='flex justify-between'>
                            <div className='text-2xl text-white font-bold uppercase justify-self-start my-2 ml-2 flex-grow-0'>POKEMON BLOG</div>
                            <div className='ml-auto text-white mt-auto mb-auto flex-grow-1'> <Link to="/">Strona Główna</Link></div>
                            <div className='ml-auto text-white mt-auto mb-auto flex-grow-1'> <Link to="/search">Wyszukiwarka</Link></div>
                    </div>
                </div>
                <div className='ml-auto mr-auto w-76 h-86 rounded-lg overflow-hidden shadow-lg 1/4 relative'>
                    <div className='h-64 w-76'>
                        <img className='h-64 align-center w-76 ' src={pokemon[0].image} alt={pokemon[0].name}></img>
                    </div>
                    <div className='px-6 py-4 bg-slate-400 h-40 ' >
                        <p className=' text-xs mb-2'>Nazwa: {pokemon[0].name}</p>
                        <p className=' text-xs mt-2'>Właściciel: {pokemon[0].owner}</p>
                        <p className=' text-xs mt-2'>Typ: {pokemon[0].type}</p>
                        <p className=' text-xs mt-2'>Poziom: {pokemon[0].level}</p>
                    </div>
                </div>
                <div className='mb-4'>
                    <div className='text-center'>Opinie o tym pokemonie:</div>
                    {pokemon[0].opinions.map((opinion) => (
                        <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 w-96 ml-auto mr-auto'>
                            <p className='mb-2'>{opinion.name}: {opinion.opinion}</p>
                            {opinion.name === name && (
                                <button
                                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                                    onClick={() => {
                                        fetch(`http://localhost:5000/deleteopinion/${id}`, {
                                            method: 'PUT',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({
                                                name: opinion.name,
                                                opinion: opinion.opinion,
                                            }),
                                        })
                                            .then((res) => {
                                                if (res.status === 200) {
                                                    alert('Opinia została usunięta');
                                                }
                                            })
                                            .catch((err) => {
                                                console.log(err);
                                            });
                                    }}
                                >
                                    Usuń
                                </button>
                            )


                                    }
                        </div>
                    ))}
                </div>
                <div>
                    <p className='text-center'>Zedytuj tego poksa</p>
                    <form onSubmit={formik.handleSubmit} className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96 ml-auto mr-auto'>
                        <label htmlFor='name'>Nazwa</label>
                        <input
                            className='shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
                            id='name'
                            name='name'
                            type='text'
                            onChange={formik.handleChange}
                            value={formik.values.name}
                        />
                        {formik.errors.name ? <div>{formik.errors.name}</div> : null}
                        <label htmlFor='type'>Typ</label>
                        <input
                            className='shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
                            id='type'
                            name='type'
                            type='text'
                            onChange={formik.handleChange}
                            value={formik.values.type}
                        />
                        {formik.errors.type ? <div>{formik.errors.type}</div> : null}
                        <label htmlFor='level'>Poziom</label>
                        <input
                            className='shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
                            id='level'
                            name='level'
                            type='text'
                            onChange={formik.handleChange}
                            value={formik.values.level}
                        /> 
                        {formik.errors.level ? <div>{formik.errors.level}</div> : null}
                        <label htmlFor='owner'>Właściciel</label>
                        <input
                            className='shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
                            id='owner'
                            name='owner'
                            type='text'
                            onChange={formik.handleChange}
                            value={formik.values.owner}
                        />
                        {formik.errors.owner ? <div>{formik.errors.owner}</div> : null}
                        <label htmlFor='image'>Link do zdjęcia</label>
                        <input
                            className='shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
                            id='image'
                            name='image'
                            type='text'
                            onChange={formik.handleChange}
                            value={formik.values.image}
                        /> 
                        {formik.errors.image ? <div>{formik.errors.image}</div> : null}
                        <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Zaktualizuj</button>
                    </form>

                </div>
                <div className='text-center'>
                    <p className='text-center '>Usuń tego poksa</p>
                    <button onClick={handleDelete} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-10'>Usuń</button>
                </div>

                <div>
                    <div className='text-center'> Dodaj opinie o tym poksie</div>
                    <form onSubmit={formik2.handleSubmit} className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96 ml-auto mr-auto'>
                        <label htmlFor='opinion'>Opinia</label>
                        <input
                            className='shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
                            id='opinion'
                            name='opinion'
                            type='text'
                            onChange={formik2.handleChange}
                            value={formik2.values.opinion}
                        />
                        {formik2.errors.opinion ? <div>{formik2.errors.opinion}</div> : null}
                        <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-10'>Dodaj</button>
                    </form>
                        
                </div>

            </div>
            )}
        </div>
    )
}