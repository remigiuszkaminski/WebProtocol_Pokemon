import React, { useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";

export default function YourAcc() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:5000/getuser/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setUser(data);
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
        if (!values.password) {
            errors.password = 'Password required!';
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            password: '',
        },
        validate,
        onSubmit: (values) => {
            fetch(`http://localhost:5000/updateuserpassword/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: values.password,
                }),
            })
                .then((res) => {
                    if (res.status === 200) {
                        console.log(res)
                        alert('Hasło zostało zmienione')
                    } else {
                        alert('Hasło nie zostało zmienione');
                    }
                });
                formik.resetForm();
        },
    });

    const removeCookies = (name) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    };



    return (
        <div>
            {loading ? (
                    <h1>Wczytywanie...</h1>
            ) : (
                <div>
                    <div className='bg-gray-600 mb-20'>
                        <div className='flex justify-between'>
                                <div className='text-2xl text-white font-bold uppercase justify-self-start my-2 ml-2 flex-grow-0'>POKEMON BLOG</div>
                                <div className='ml-auto text-white mt-auto mb-auto flex-grow-1'> <Link to="/">Strona Główna</Link></div>
                                <div className='ml-auto text-white mt-auto mb-auto flex-grow-1'> <Link to="/search">Wyszukiwarka</Link></div>
                        </div>
                    </div>
                    <div className="text-center">
                        <div>
                            <p>Email twój: {user[0].email}</p>
                            <p>Twój nick: {user[0].name}</p>
                            <p>Twoje id: {user[0]._id}</p>
                        </div>
                    </div>
                    <div className="text-center">
                        <div>Edytuj swój profil:
                            {name === user[0].name ? (
                                <div>
                                    <form onSubmit={formik.handleSubmit}>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="Password"
                                            onChange={formik.handleChange}
                                            value={formik.values.password}
                                        />
                                        {formik.errors.password ? <div>{formik.errors.password}</div> : null}
                                        <button type="submit">Zmień hasło</button>
                                    </form>
                                    <div>
                                        Usuń konto:
                                        <button onClick={() => {
                                            fetch(`http://localhost:5000/deleteuser/${id}`, {
                                                method: 'DELETE',
                                            })
                                                .then((res) => {
                                                    if (res.status === 200) {
                                                        alert('Konto zostało usunięte');
                                                        removeCookies('user');
                                                        removeCookies('name');
                                                        navigate('/');
                                                    } else {
                                                        alert('Konto nie zostało usunięte');
                                                    }
                                                });
                                        }}
                                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-10 mr-2'
                                        >Usuń konto</button>
                                        <p>Wyloguj się:</p>
                                        <button onClick={() => {
                                            removeCookies('user');
                                            removeCookies('name');
                                            navigate('/');
                                        }}
                                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-10 mr-2'
                                        >
                                            Wyloguj się
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p>Nie możesz zmienić hasła innego użytkownika</p>
                            )}
                        </div>
                    </div>

                </div>
            )}
                

        </div>
    )
}
