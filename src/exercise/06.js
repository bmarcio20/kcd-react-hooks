// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
  PokemonForm,
} from '../pokemon'

function PokemonInfo({ pokemonName }) {
  const [state, setState] = React.useState({
    pokemon: null,
    error: null,
    status: 'idle',
  })
  const { pokemon, error, status } = state
  const isPending = status === 'pending'
  const isResolved = status === 'resolved'
  const isIdle = status === 'idle'
  const isRejected = status === 'rejected'

  React.useEffect(() => {
    ; (async () => {
      if (!pokemonName) {
        return
      }
      setState({ status: 'pending' })
      try {
        const newPokemon = await fetchPokemon(pokemonName)
        setState({ status: 'resolved', pokemon: newPokemon })
      } catch (error) {
        setState({ status: 'rejected', error })
      }
    })()
  }, [pokemonName])

  if (isRejected) {
    return (
      <div role="alert">
        There was an error:{' '}
        <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
      </div>
    )
  } else if (isIdle) {
    return 'Submit a pokemon'
  } else if (isPending) {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (isResolved) {
    return <PokemonDataView pokemon={pokemon} />
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
