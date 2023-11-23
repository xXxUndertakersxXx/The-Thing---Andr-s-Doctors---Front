import React, {useEffect, useState} from 'react';


const PartidaTerminada = ({nickname}) => {
    const [winners, setWinners] = useState('')
    const [humans, setHumans] = useState([])
    const [infecteds, setInfecteds] = useState([])
    const [theThing, setTheThing] = useState('')

    const get_winners = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/games/finished/${nickname}`, {
                method: 'GET',
            });

            if (response.ok) {
                const content = await response.json()
                setWinners(content.winners)
                setHumans(content.humans)
                setInfecteds(content.infected)
                setTheThing(content.the_thing)

            } else {
                return response.json().then(errorData => {
                    console.error(`status:${response.status}\ndetail:${errorData.detail}`);
                })
            }

        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    useEffect(() => {
        get_winners();
        return () => {};
    }, []);

    return <div>
        <div>Ganan los {winners}!</div>
        <div>La Cosa:{theThing}</div>
        <div>
            Humanos: <ul>
                {humans.map((human, index) => (
                <li>{human}</li>
                ))}
            </ul>
        </div>
        <div>
            Infectados: <ul>
                {infecteds.map((infected, index) => (
                <li>{infected}</li>
                ))}
            </ul>
        </div>
    </div>
}

export default PartidaTerminada;
