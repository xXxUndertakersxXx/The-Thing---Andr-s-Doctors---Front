import React, {useState, useEffect} from 'react';

const UnirsePartida = ({setView, nickname}) => {
    const [games, setGames] = useState([])
    const [passwordField, setPasswordField] = useState('')

    const refresh = async (e) => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/games`,
                {method: 'GET'}
            )

            if (response.ok) {
                const content = await response.json()
                setGames(content.games)

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

    const join_game = async (game_name) => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/users/${nickname}?game_name=${game_name}`,
                {method: 'PATCH'}
            );

            if (response.ok) {
                setView('EsperandoJugadores')

            } else {
                return response.json().then(errorData => {
                    console.error(`status:${response.status}\ndetail:${errorData.detail}`);
                })
            }

        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    const list_users_in = (users_in) => {
        return <ul> {users_in.map((item, index) => (
            <li key={index}>{item}</li>))}
        </ul>
    }

    const list_game = (game) => {
        return <ul>
            <li>nombre: {game.name}</li>
            <li>creador: {game.creator}</li>
            <li>min: {game.min_players}</li>
            <li>max: {game.max_players}</li>
            <li>conteo jugadores: {game.users_count}</li>
            <li>jugadores esperando: {list_users_in(game.users_in)}</li>
            <li><button onClick={() => join_game(game.name)}> Unirse </button></li>
        </ul>
    }

    return <>
        <div>tu nickname: {nickname}</div>
        <div>{games.map((game, index) => (
            list_game(game)
        ))}</div>
    </>
}

export default UnirsePartida;
