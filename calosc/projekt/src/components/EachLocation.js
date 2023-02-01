import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';
export default function EachLocation() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [location, setLocation] = useState({});
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetch(`http://localhost:5000/getlocation/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setLocation(data);
                setLoading(false);
                console.log(data)
            });
    }, [id]);
    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
    }
    const name = getCookie('name');

    const validate = (values) => {
        const errors = {};
        if (!values.name) {
            errors.name = 'Nazwa lokacji jest wymagana!';
        }
        if (!values.terrain) {
            errors.terrain = 'Typ nawierzchni jest wymagany!';
        }
        if (!values.arealevel) {
            errors.arealevel = 'Poziom terenu jest wymagany!';
        }
        if (!values.image) {
            errors.image = 'Obrazek jest wymagany!';
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            terrain: '',
            arealevel: '',
            owner: name,
            image: '',
        },
        validate,
        onSubmit: (values) => {
            fetch(`http://localhost:5000/updatelocation/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: values.name,
                    terrain: values.terrain,
                    arealevel: values.arealevel,
                    owner: values.owner,
                    image: values.image,
                }),
            })
                .then((res) => {
                    if (res.status === 200) {
                        console.log(res)
                        alert('Lokacja została zaktualizowana')
                        navigate('/locations');
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            formik.resetForm();
        },
    });



    return (
        <div>
            {loading ? (
                <div>Ładowanie...</div>
            ) : (
            <div>
                <NavBar />
                <div className='ml-auto mr-auto w-76 h-86 rounded-lg overflow-hidden shadow-lg 1/4 relative'>
                    <div className='h-64 w-76'>
                        <img className='h-64 align-center w-76 ' src={location[0].image} alt={location[0].name}></img>
                    </div>
                    <div className='px-6 py-4 bg-slate-400 h-40 ' >
                        <p className=' text-xs mb-2'>Nazwa lokacji: {location[0].name}</p>
                        <p className=' text-xs mt-2'>Typ nawierzchni: {location[0].terrain}</p>
                        <p className=' text-xs mt-2'>Poziom lokacji: {location[0].arealevel}</p>
                        <p className=' text-xs mt-2'>Mistrz lokacji: {location[0].owner}</p>
                    </div>
                </div>
                {name === location[0].owner ? (
                    <div>
                        <form onSubmit={formik.handleSubmit} className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96 ml-auto mr-auto'>
                            <label htmlFor='name'>Nazwa lokacji</label>
                            <input
                                className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                id='name'
                                name='name'
                                type='text'
                                onChange={formik.handleChange}
                                value={formik.values.name}
                            />
                            {formik.errors.name ? <div>{formik.errors.name}</div> : null}
                            <label htmlFor='terrain'>Typ nawierzchni</label>
                            <input
                                className='shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
                                id='terrain'
                                name='terrain'
                                type='text'
                                onChange={formik.handleChange}
                                value={formik.values.terrain}
                            />
                            {formik.errors.terrain ? <div>{formik.errors.terrain}</div> : null}
                            <label htmlFor='arealevel'>Poziom lokacji</label>
                            <input
                                className='shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
                                id='arealevel'
                                name='arealevel'
                                type='text'
                                onChange={formik.handleChange}
                                value={formik.values.arealevel}
                            />
                            {formik.errors.arealevel ? <div>{formik.errors.arealevel}</div> : null}
                            <label htmlFor='image'>Obrazek</label>
                            <input
                                className='shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
                                id='image'
                                name='image'
                                type='text'
                                onChange={formik.handleChange}
                                value={formik.values.image}
                            />
                            {formik.errors.image ? <div>{formik.errors.image}</div> : null}
                            <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Zaktualizuj lokację</button>
                        </form>
                        <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96 ml-auto mr-auto'>
                            <div>Usuń swoją lokację:</div>
                            <button type='submit' onClick={() => {
                                fetch(`http://localhost:5000/deletelocation/${id}`, {
                                    method: 'DELETE',
                                })
                                    .then((res) => {
                                        if (res.status === 200) {
                                            console.log(res)
                                            alert('Lokacja została usunięta')
                                            navigate('/locations');
                                        }
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    });
                            }} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Usuń swoją lokację</button>

                        </div>
                    </div>
                ) : (
                    <div>Musisz być mistrzem lokacji aby ją edytować!</div>
                )}
            </div>
            )}
        </div>
    )
}