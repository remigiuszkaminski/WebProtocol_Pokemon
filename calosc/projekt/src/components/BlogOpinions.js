import React, {useState, useEffect} from "react";
import NavBar from "./NavBar";
import { useFormik } from "formik";

export default function BlogOpinions() {

    const [opinions, setOpinions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newOpinion, setNewOpinion] = useState(false);
    const [editOpinion, setEditOpinion] = useState(false);

    useEffect(() => {
        fetch("http://localhost:5000/getallblogopinions")
            .then((res) => res.json())
            .then((data) => {
                setOpinions(data); 
                setLoading(false);
                setNewOpinion(false);
            });
    }, [setOpinions, newOpinion]);




    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    const name = getCookie('name');

    const validate = (values) => {
        const errors = {};
        if (!values.opinion) {
            errors.opinion = "Opinia jest wymagana!";
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            name: name,
            opinion: "",
        },
        validate,
        onSubmit: (values) => {
            fetch("http://localhost:5000/createblogopinion", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: values.name,
                    opinion: values.opinion,
                }),
            })
                .then((res) => {
                    if (res.status === 200) {
                        alert("Opinia została dodana");
                        setNewOpinion(true);
                    } else {
                        alert("Opinia nie została dodana");
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            formik.resetForm();
        },
    });

    const EditOpinionForm = ({ opinionId }) => {
        const formik2 = useFormik({
            initialValues: {
                name: name,
                opinion: "",
            },
            validate,
            onSubmit: (values) => {
                fetch(`http://localhost:5000/updateblogopinion/${opinionId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: values.name,
                        opinion: values.opinion,
                    }),
                })
                    .then((res) => {
                        if (res.status === 200) {
                            alert("Opinia została zmieniona");
                            setEditOpinion(false);
                            setNewOpinion(true);
                        } else {
                            alert("Opinia nie została zmieniona");
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                formik2.resetForm();
            },
        });

        return (
            <form onSubmit={formik2.handleSubmit} className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96 ml-auto mr-auto'>
                <div className="mr-auto ml-auto">
                    <label htmlFor="opinion">Edytuj opinię:</label>
                    <input
                        id="opinion"
                        name="opinion"
                        type="text"
                        onChange={formik2.handleChange}
                        value={formik2.values.opinion}
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    />
                    {formik2.errors.opinion ? <div>formik2.errors.opinion</div> : null}
                </div>
                <button type="submit" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                    Zapisz zmiany
                </button>
            </form>
        );
    }


    return (
        <div>
            <div>
                <NavBar />
                <h1 className="text-center">Opinie o naszym blogu:</h1>
                {loading ? (
                    <p>Ładowanie opini</p>
                ) : (
                    <div>
                        <div className="ml-auto mr-auto">
                            <div className="ml-auto mr-auto">
                                {opinions.map((opinion) => (
                                    <div key={opinion._id} className='border-2 w-96 ml-auto mr-auto rounded p-2'>
                                        <p>{opinion.name}: {opinion.opinion}</p>
                                        {opinion.name === name ? (
                                            <div className="ml-auto mr-auto">
                                                <button onClick={() => {
                                                    fetch(`http://localhost:5000/deleteblogopinion/${opinion._id}`, {
                                                        method: "DELETE",
                                                    })
                                                        .then((res) => {
                                                            if (res.status === 200) {
                                                                alert("Opinia została usunięta");
                                                                setNewOpinion(true);
                                                            } else {
                                                                alert("Opinia nie została usunięta");
                                                            }
                                                        })
                                                        .catch((err) => {
                                                            console.log(err);
                                                        });
                                                }}
                                                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                                                >Usuń opinię</button>
                                                <button onClick={() => {setEditOpinion(true)}} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-1'>
                                                    Edytuj opinię
                                                </button>
                                                {editOpinion ? (
                                                    <EditOpinionForm opinionId={opinion._id} />
                                                ) : null}

                                            </div>
                                        ) : null
                                        }
                                    </div>
                                ))}
                            </div>
                            <div>
                                {name !== undefined ? (
                                    <form onSubmit={formik.handleSubmit} className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96 ml-auto mr-auto'>
                                    <div>
                                        <label htmlFor="opinion">Dodaj opinię:</label>
                                        <input
                                            className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                            id="opinion"
                                            name="opinion"
                                            type="text"
                                            onChange={formik.handleChange}
                                            value={formik.values.opinion}
                                        />
                                        {formik.errors.opinion ? <div>{formik.errors.opinion}</div> : null}
                                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Dodaj opinię</button>
                                    </div>
                                </form>
                                ) : <p>Aby dodać opinie musisz być zalogowany</p>
                                } 
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}