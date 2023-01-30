import React from 'react';
import { useFormik} from 'formik';
import { Link } from 'react-router-dom';

export default function RegisterForm() {

    const validate = values => {
        const errors = {};
        if (!values.name) {
            errors.name = 'Required';
        } else if (values.name.length > 15) {
            errors.name = 'Must be 15 characters or less';
        }
        if (!values.email) {
            errors.email = 'Required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = 'Invalid email address';
        }
        if (!values.password) {
            errors.password = 'Required';
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
        name: '',
        email: '',
        password: '',
        },
        validate,
        onSubmit: (values) => {
        fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: values.name,
                email: values.email,
                password: values.password,
            }),
        })
            .then((res) => {
                if (res.status === 200) {
                    alert('User created');
                } else {
                    alert('User not created');
                }
            });
            formik.resetForm();
            
        },
    });
    
    return (
        <div className='text-center'>
        <div className='bg-gray-600 mb-20 p-2 text-white text-2xl'>Zarejestruj się</div>
        <form onSubmit={formik.handleSubmit} className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96 ml-auto mr-auto'>
            <label htmlFor="name">Name</label>
            <input
            className='shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
            id="name"
            name="name"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.name}
            />
            <label htmlFor="email">Email</label>
            <input
            className='shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            />
            <label htmlFor="password">Password</label>
            <input
            className='shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            />
            <button type="submit">Submit</button>
        </form>
        <Link to='/' className='text-blue-500'>Powrót do strony głównej</Link>
        </div>
    );
}