import React, {useState} from 'react';
import CrearUsuario from "./Views/CrearUsuario";
import CrearPartida from "./Views/CrearPartida";
import EsperandoJugadores from "./Views/EsperandoJugadores";
import UnirsePartida from "./Views/UnirsePartida";
import JugandoPartida from "./Views/JugandoPartida";
import PartidaTerminada from "./Views/PartidaTerminada";


function App() {
    const [view, setView] = useState('CrearUsuario');
    const [nickname, setNickname] = useState('');

    return (
        <div>
            {view === 'CrearUsuario' && <CrearUsuario setView={setView} setNickname={setNickname}/>}
            {view === 'CrearPartida' && <CrearPartida setView={setView} nickname={nickname}/>}
            {view === 'UnirsePartida' && <UnirsePartida setView={setView} nickname={nickname}/>}
            {view === 'EsperandoJugadores' && <EsperandoJugadores setView={setView} nickname={nickname}/>}
            {view === 'JugandoPartida' && <JugandoPartida setView={setView} nickname={nickname}/>}
            {view === 'PartidaTerminada' && <PartidaTerminada nickname={nickname}/>}
        </div>
    );
}

export default App;
