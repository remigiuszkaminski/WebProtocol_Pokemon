import React from 'react';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';

export default function CreatePokemon() {


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
            fetch('http://localhost:5000/create', {
                method: 'POST',
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
                        alert('Pokemon created');
                    } else {
                        alert('Error creating pokemon');
                    }
                });
            formik.resetForm();


        },
    });

    return (
        <div className='text-center'>
            <div className='bg-gray-600 mb-20 p-2 text-white text-2xl'>Dodaj swojego poksa</div>
            <form onSubmit={formik.handleSubmit} className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96 ml-auto mr-auto'>
                <label htmlFor="name">Nazwa</label>
                <input
                    id="name"
                    className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    name="name"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                />
                {formik.errors.name ? <div>{formik.errors.name}</div> : null}
                <label htmlFor="type">Typ</label>
                <input
                    id="type"
                    className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    name="type"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.type}
                />
                {formik.errors.type ? <div>{formik.errors.type}</div> : null}
                <label htmlFor="level">Level</label>
                <input
                    id="level"
                    className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    name="level"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.level}
                />
                {formik.errors.level ? <div>{formik.errors.level}</div> : null}
                <label htmlFor="owner">Właściciel</label>
                <input
                    id="owner"
                    className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    name="owner"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.owner}
                />
                {formik.errors.owner ? <div>{formik.errors.owner}</div> : null}
                <label htmlFor="image">Link do zdjęcia</label>
                <input
                    id="image"
                    className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    name="image"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.image}
                />
                {formik.errors.image ? <div>{formik.errors.image}</div> : null}
                <button type="submit" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-10 mr-2 '>Dodaj pokemona</button>
            </form>     
            <Link to='/' className='text-blue-500'>Wróc do strony głównej</Link> 
        </div>
    )
}