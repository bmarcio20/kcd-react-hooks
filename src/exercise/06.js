// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
  PokemonForm,
} from '../pokemon'

function ErrorComponent({error, resetErrorBoundary}){
  return (
    <div role="alert">
      There was a huge mistake (or error):{' '}
      <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

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
    throw new Error('This pokemon will not be displayed');
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

  function handleReset() {
    setPokemonName('');
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary FallbackComponent={ErrorComponent} onReset={handleReset}>
        <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
