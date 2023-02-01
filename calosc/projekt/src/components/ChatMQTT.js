import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import mqtt from 'precompiled-mqtt';
import { Link } from 'react-router-dom';


export default function ChatMQTT() {

    const [chat, setChat] = useState([]);
    const [client, setClient] = useState(null);
    const [czaters, setCzaters] = useState(false);
    const [subik, setSubik] = useState(false);
    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    const name = getCookie('name');
    console.log(name)

    useEffect(() => {
        const client = mqtt.connect('ws://localhost:8000/mqtt');
        client.on('connect', () => {
            setCzaters(true);
            console.log('Broker dziala')
        });
        if(czaters) {
            client.subscribe('/chat/message');
            setSubik(true);
        }
        if(subik){
            client.on('message', (topic, message) => {
                console.log(message.toString())
                setChat((acc) => [...acc, message.toString()]);
            });
        }
        setClient(client)
        return () => {
            client.end();
            setClient(null);
        };
        
    }, [czaters, subik]);

    const validate = (values) => {
        const errors = {};
        if (!values.message) {
            errors.message = 'Wiadomość wymagana!';
        }
        return errors;
    };


    const formik = useFormik({
        initialValues: {
            message: '',
        },
        validate,
        onSubmit: (values) => {
            client.publish('/chat/message', `${name}: ${values.message}`);
            formik.resetForm();
        },
    });
    
    function handleEndingChat() {
        client.end();
        setClient(null);
        console.log("Zakonczenie dzialania clienta")
    }

    return (
        <div className="text-center">
            <h1 className='bg-gray-600 mb-20 text-xl text-white p-2.5'>ChatMQTT = porozmawiajmy o pokemonach <Link to='/' className='ml-12'><button onClick={handleEndingChat}>Wroc do strony glownej</button></Link></h1>
            <div className='p-2'>
                <div className='bg-white  border-1  border-neutral-700 w-96 text-left ml-auto mr-auto mb-2'>
                    {chat.map((message, index) => (
                        <div key={index} className='bg-white w-96'>{message}</div>
                    ))}
                </div>
                <form onSubmit={formik.handleSubmit} className='bg-white shadow-md rounded w-96 ml-auto mr-auto'>
                    <input
                        id="message"
                        name="message"
                        type="text"
                        className='bg-white shadow-md rounded w-96 border-neutral-700'
                        onChange={formik.handleChange}
                        value={formik.values.message}
                    />
                    <button type="submit" className='w-full border-1 border-neutral-700 bg-gray-600 text-white rounded'>Wyślij wiadomość do innych pokeświrów</button>
                </form>
            </div>
        </div>
    )
}