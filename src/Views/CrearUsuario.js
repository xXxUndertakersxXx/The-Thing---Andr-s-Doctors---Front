import React, {useState} from 'react';


const CrearUsuario = ({setView, setNickname}) => {
    const [nicknameField, setNicknameField] = useState('');

    const handleSubmit = async (view) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/users?nickname=${nicknameField}`, {
                method: 'POST',
            });

            if (response.ok) {
                setNickname(nicknameField)
                setView(view);

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
        <div>
            <h2>Crear Usuario</h2>
            <form>
                <label>
                    Nickname:
                    <input
                        type="text"
                        value={nicknameField}
                        onChange={(e) => setNicknameField(e.target.value)}
                    />
                </label>
                <button type="button" onClick={() => handleSubmit('CrearPartida')}>Crear Partida</button>
                <button type="button" onClick={() => handleSubmit('UnirsePartida')}>Unirse a Partida</button>
            </form>
        </div>
    );
}

export default CrearUsuario;
