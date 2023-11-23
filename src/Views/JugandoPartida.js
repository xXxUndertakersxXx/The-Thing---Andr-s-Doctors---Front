import React, {useState, useEffect} from 'react';

const JugandoPartida = ({setView, nickname}) => {
    const [gameName, setGameName] = useState([])
    const [creator, setCreator] = useState('')
    const [activePlayer, setActivePlayer] = useState('')
    const [alivePlayers, setAlivePlayers] = useState([])
    const [lockedDoors, setLockedDoors] = useState([])
    const [quarantines, setQuarantines] = useState([])
    const [playerHand, setPlayerHand] = useState([])
    const [visibleCards, setVisibleCards] = useState([])
    const [playableCards, setPlayableCards] = useState({})
    const [selectedCard, setSelectedCard] = useState('-')
    const [selectedTarget, setSelectedTarget] = useState('-')
    const [discard, setDiscard] = useState(false)

    const refresh_playable_cards = async () => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/games/playing/${nickname}/active`,
                {method: 'GET'}
            )

            if(response.ok) {
                const content = await response.json()
                setSelectedCard('-')
                setSelectedTarget('-')
                setPlayableCards(content.playable_cards)

            } else {
                return response.json().then(errorData => {
                    console.error(`status:${response.status}\ndetail:${errorData.detail}`);
                })
            }

        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    let active_player = ''
    const refresh = async () => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/games/playing/${nickname}`,
                {method: 'GET'}
            )

            if (response.ok) {
                const content = await response.json()

                const b2 = nickname === active_player
                const b1 = nickname === content.active_player
                active_player = content.active_player

                if(b1 && !b2) {
                    await refresh_playable_cards()

                } else if (!b1 && b2) {
                    setSelectedCard('-')
                    setSelectedTarget('-')
                    setPlayableCards({})
                }

                setGameName(content.game_name)
                setCreator(content.creator)
                setActivePlayer(content.active_player)
                setAlivePlayers(content.alive_players)
                setLockedDoors(content.locked_doors)
                setQuarantines(content.quarantines)
                setPlayerHand(content.player_hand)
                setVisibleCards(content.visible_cards)

                if (content.phase === 'Finished') {
                    setView('PartidaTerminada')
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
        const interval = setInterval(async () => {
            await refresh();
        }, 1000)
        return () => clearInterval(interval);
    }, []);

    const ListAlivePlayers = ({alivePlayers, quarantines, lockedDoors}) => {
        const ListPlayer = ({alivePlayers, quarantines, lockedDoors, index}) => {
            return <ul>
                <li>nickname: {alivePlayers[index]}</li>
                <li>cuarentena: {quarantines[index] ? 'Si' : 'No'}</li>
                <li>puerta atrancada: {lockedDoors[index] ? 'Si' : 'No'}</li>
            </ul>
        }

        return <> { alivePlayers.map((player, index) => (
            <ListPlayer alivePlayers={alivePlayers} quarantines={quarantines} lockedDoors={lockedDoors} index={index}/>
        ))}</>
    }

    const ListPlayerHand = ({playerHand}) => {
        const ListCard = ({card}) => {
            return <ul>
                <li>nombre: {card.name}</li>
                <li>descripción: {card.description}</li>
            </ul>
        }

        return <> { playerHand.map((card, index) => (
            <ListCard card={card}/>
        ))}</>
    }

    const ListVisibleCards = ({visibleCards}) => {
        const ListCard = ({card}) => {
            return <ul>
                <li>dueño: {card.owner}</li>
                <li>nombre: {card.name}</li>
                <li>descripción: {card.description}</li>
            </ul>
        }

        return <> { visibleCards.map((card, index) => (
            <ListCard card={card}/>
        ))}</>
    }

    const play_card = async () => {
        try {
            const target = selectedTarget !== '-' ? selectedTarget : null
            const response = await fetch(
                `http://127.0.0.1:8000/games/playing/${nickname}?discard=${discard}&card_name=${selectedCard}&target=${target}`,
                {method: 'POST'}
            )

            if (!response.ok) {
                return response.json().then(errorData => {
                    console.error(`status:${response.status}\ndetail:${errorData.detail}`);
                })
            }

        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    return <div>
        <div>Nombre del Juego: {gameName}</div>
        <div>Tu nickname: {nickname}</div>
        <div>Creador: {creator}</div>
        <div>Jugador activo: {activePlayer}</div>
        <div>
            Jugadores vivos:
            <ListAlivePlayers alivePlayers={alivePlayers} quarantines={quarantines} lockedDoors={lockedDoors}/>
        </div>
        <div>
            Tus cartas:
            <ListPlayerHand playerHand={playerHand}/>
        </div>
        <div>
            Cartas enseñadas a vos:
            <ListVisibleCards visibleCards={visibleCards}/>
        </div>
        {activePlayer === nickname && <div>
            Jugar Carta:
            <select onChange={(e) => {setSelectedCard(e.target.value); if (e.target.value === '-') {setSelectedTarget('-')}}} value={selectedCard}>
                <option value="-">-</option>
                {Object.keys(playableCards).map((card_name, index) => (
                <option value={card_name}>{card_name}</option>
                ))}
            </select>
            {selectedCard !== '-' && playableCards[selectedCard].needs_target && <select
                onChange={(e) => {setSelectedTarget(e.target.value)}}
                value={selectedTarget}>
                <option value="-">-</option>
                {playableCards[selectedCard].valid_targets.map((target, index) => (
                <option value={target}>{target}</option>
                ))}
            </select>}
            {selectedCard !== '-' && (selectedTarget !== '-' || !playableCards[selectedCard].needs_target) &&
             selectedCard !== 'La Cosa' && <div>
                <div>
                    <input type="checkbox" checked={discard} onChange={() => setDiscard(!discard)}/>
                    <label>descartar</label>
                </div>
                {(selectedCard !== '¡Infectado!' ||
                 (discard && !Object.keys(playableCards).includes('La Cosa'))) && <button
                    onClick={play_card}>
                    Jugar
                </button>}
            </div>}
        </div>}
    </div>
}

export default JugandoPartida
