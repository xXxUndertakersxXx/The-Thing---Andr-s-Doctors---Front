import React, {useState} from 'react';

const CrearPartida = ({setView, nickname}) => {
    const [gameName, setGameName] = useState('');
    const [min, setMin] = useState(4);
    const [max, setMax] = useState(12);

    const handleSubmitAux = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/users/${nickname}?game_name=${gameName}`, {
                method: 'PATCH'
            });

            if (response.ok) {
                setView('EsperandoJugadores');

            } else {
                return response.json().then(errorData => {
                    console.error(`status:${response.status}\ndetail:${errorData.detail}`);
                })
            }

        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                game_name: gameName,
                min_players: min,
                max_players: max,
                creator: nickname
            }
            const response = await fetch(`http://127.0.0.1:8000/games`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                await handleSubmitAux();

            } else {
                return response.json().then(errorData => {
                    console.error(`status:${response.status}\ndetail:${errorData.detail}`);
                })
            }

        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return (
        <>
            <h4> {nickname} </h4>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="nombrePartida">Nombre de la partida:</label>
                    <input
                        type="text"
                        id="nombrePartida"
                        value={gameName}
                        onChange={(e) => setGameName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="min">Mínimo (opcional):</label>
                    <input
                        type="number"
                        id="min"
                        value={min}
                        onChange={(e) => setMin(parseInt(e.target.value))}
                    />
                </div>
                <div>
                    <label htmlFor="max">Máximo (opcional):</label>
                    <input
                        type="number"
                        id="max"
                        value={max}
                        onChange={(e) => setMax(parseInt(e.target.value))}
                    />
                </div>
                <button type="submit">Crear</button>
            </form>
        </>
    );
};

export default CrearPartida;
