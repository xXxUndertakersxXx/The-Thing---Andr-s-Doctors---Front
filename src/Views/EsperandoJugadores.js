import React, {useState, useEffect} from 'react';


const EsperandoJugadores = ({setView, nickname}) => {
    const [gameName, setGameName] = useState('')
    const [gameCreator, setGameCreator] = useState('')
    const [playersCount, setPlayersCount] = useState(0)
    const [playersIn, setPlayersIn] = useState([])
    const [min, setMin] = useState(0)
    const [max, setMax] = useState(0)

    const refresh = async (e) => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/games/waiting/${nickname}`,
                {method: 'GET'}
            )

            if (response.ok) {
                const content = await response.json()
                setGameName(content.game_name)
                setGameCreator(content.creator)
                setPlayersCount(content.players_count)
                setPlayersIn(content.players_in)
                setMin(content.min_players)
                setMax(content.max_players)

                if (content.phase === 'Playing') {
                    setView('JugandoPartida')
                }

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
        const intervalId = setInterval(refresh, 1000); // Call every 1 second
        return () => {
            clearInterval(intervalId);
        }
    }, []);

    const start_game = async () => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/games/${nickname}`,
                {method: 'POST'}
            )

            if (response.ok) {
                setView('JugandoPartida')

            } else {
                return response.json().then(errorData => {
                    console.error(`status:${response.status}\ndetail:${errorData.detail}`);
                })
            }

        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    return (<>
        <div>Nombre del Juego: {gameName}</div>
        <div>Creador: {gameCreator}</div>
        <div>min: {min}</div>
        <div>max: {max}</div>
        <div>conteo jugadores: {playersCount}</div>
        <div>
            lista de jugadores:
            <ul> {playersIn.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
            </ul>
        </div>
        <button onClick={start_game}>Start</button>
    </>)
}


export default EsperandoJugadores;
