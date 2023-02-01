import React from 'react';
import { useFormik} from 'formik'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
export default function LoginForm() {

    const [cookies, setCookie] = useCookies('user');
    const navigate = useNavigate();


    const handleCookie = (user) => {
        let time = new Date()
        time.setMinutes(time.getMinutes() + 30);
        setCookie('user', user, { path: '/', expires: time });
    }

    const handleCookieName = (name) => {
        let time = new Date();
        time.setMinutes(time.getMinutes() + 30);
        setCookie('name', name, { path: '/', expires: time });
    }


    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        onSubmit: values => {
            fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                }),
            })
                .then((res) => {
                    if (res.status === 200) {
                        console.log(res)
                        res.json().then((data) => {
                            console.log(data)
                            console.log(data._id)
                            if(data._id){
                                handleCookie(data._id);
                                handleCookieName(data.name);
                                alert('Zalogowano pomyslnie')
                                navigate('/');
                            } else {
                                alert('Niepoprawne dane logowania');
                            }
                        });
                    } else {
                        alert('User not logged in');
                    }
                });
                formik.resetForm();
        },
    });



  return (
    <div className='text-center'>
        <div className='bg-gray-600 mb-20 p-2 text-white text-2xl'>Zaloguj się</div>
        <form onSubmit={formik.handleSubmit} className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96 ml-auto mr-auto'>
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
            <button type="submit">Zaloguj</button>
        </form>
        <Link to='/' className='text-blue-500'>Wroc do strony glownej</Link>
    </div>
  );
}