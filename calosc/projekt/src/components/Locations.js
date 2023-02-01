import React, {useState, useEffect} from "react";
import NavBar from "./NavBar";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
export default function Locations() {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:5000/getalllocations")
            .then((res) => res.json())
            .then((data) => {
                setLocations(data);
                setLoading(false);
                console.log(data)
            });
    }, [setLocations]);

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
            fetch("http://localhost:5000/createnewlocation", {
                method: 'POST',
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
                        alert("Lokacja została utworzona!");
                    } else {
                        alert("Wystąpił błąd!");
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
            <NavBar />
            <div>
                <div className="text-center">Lokacje:</div>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div>
                        <div className="grid grid-cols-6 gap-24">
                            {locations.map((location) => (
                                <div key={location._id} className='ml-auto mr-auto w-76 h-86 rounded-lg overflow-hidden shadow-lg 1/4 relative'>
                                    <div className="h-64 w-76">
                                        <img className="h-64 w-76" src={location.image} alt={location.name}></img>
                                    </div>
                                    <div className="px-6 py-4 bg-slate-400 h-40">
                                        <p className="text-xs mb-2">Nazwa: {location.name}</p>
                                        <p className="text-xs mt-2">Typ nawierzchni: {location.terrain}</p>
                                        <p className="text-xs mt-2">Poziom lokacji: {location.arealevel}</p>
                                        <p className="text-xs mt-2">Mistrz lokacji: {location.owner}</p>
                                        <p className="text-xs mt-2 text-blue-600"><Link to={`/location/${location._id}`}>Przejdź do strony lokacji.</Link></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div>
                            <div className="text-center">Dodaj nową lokację i zostań jej mistrzem:</div>
                            {name !== undefined ? (
                                <form onSubmit={formik.handleSubmit} className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96 ml-auto mr-auto'>
                                    <label htmlFor="name">Nazwa lokacji:</label>
                                    <input
                                        className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                        id="name"
                                        name="name"
                                        type="text"
                                        onChange={formik.handleChange}
                                        value={formik.values.name}
                                    />
                                    {formik.errors.name ? <div>{formik.errors.name}</div> : null}
                                    <label htmlFor="terrain">Typ nawierzchni:</label>
                                    <input
                                        className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                        id="terrain"
                                        name="terrain"
                                        type="text"
                                        onChange={formik.handleChange}
                                        value={formik.values.terrain}
                                    />
                                    {formik.errors.terrain ? <div>{formik.errors.terrain}</div> : null}
                                    <label htmlFor="arealevel">Poziom terenu:</label>
                                    <input
                                        className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                        id="arealevel"
                                        name="arealevel"
                                        type="text"
                                        onChange={formik.handleChange}
                                        value={formik.values.arealevel}
                                    />
                                    {formik.errors.arealevel ? <div>{formik.errors.arealevel}</div> : null}
                                    <label htmlFor="image">Obrazek:</label>
                                    <input
                                        className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                        id="image"
                                        name="image"
                                        type="text"
                                        onChange={formik.handleChange}
                                        value={formik.values.image}
                                    />
                                    {formik.errors.image ? <div>{formik.errors.image}</div> : null}
                                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Dodaj</button>
                                </form>
                            ) : (
                                <div className="text-center">Musisz się zalogować, aby móc dodawać lokacje!</div>
                            )}

                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}