import React, { useEffect, useState, useMemo } from 'react';
import { Pokemon, getAll, getByName } from './API';

import './styles.css';

interface PokemonWithPower extends Pokemon {
  power: number;
}

const calculatePower = (pokemon: Pokemon) =>
  pokemon.hp +
  pokemon.attack +
  pokemon.defense +
  pokemon.special_attack +
  pokemon.special_defense +
  pokemon.speed;

let tableRender = 0;

const PokemonTable: React.FunctionComponent<{
  pokemon: PokemonWithPower[];
}> = ({ pokemon }) => {
  console.log(`table Render = ${tableRender++}`);
  return (
    <table>
      <thead>
        <tr>
          <td>ID</td>
          <td>Name</td>
          <td>Type</td>
          <td colSpan={6}>Stats</td>
          <td>Power</td>
        </tr>
      </thead>
      <tbody>
        {pokemon.map((p) => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.name}</td>
            <td>{p.type.join(',')}</td>
            <td>{p.hp}</td>
            <td>{p.attack}</td>
            <td>{p.defense}</td>
            <td>{p.special_attack}</td>
            <td>{p.special_defense}</td>
            <td>{p.speed}</td>
            <td>{p.power}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

let appRender = 0;

const MemodPokemonTable = React.memo(PokemonTable);

export default function App() {
  console.log(`appRender = ${appRender++}`);

  const [pokemon, setPokemon] = useState<Pokemon[]>([]);

  const [search, setSearch] = useState<string>('');

  const [threshold, setThreshold] = useState(0);

  useEffect(() => {
    getByName(search).then(setPokemon);
    return () => {};
  }, [search]);

  const pokemonWithPower = React.useMemo(
    () => pokemon.map((p) => ({ ...p, power: calculatePower(p) })),
    [pokemon]
  );

  const onSetThreshold = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => setThreshold(+evt.currentTarget.value),
    []
  );

  const countOverThreshold = React.useMemo(
    () => pokemonWithPower.filter((p) => p.power > threshold).length,
    [pokemonWithPower, threshold]
  );

  const min = React.useMemo(
    () => Math.min(...pokemonWithPower.map((p) => p.power)),
    [pokemonWithPower]
  );

  const max = React.useMemo(
    () => Math.max(...pokemonWithPower.map((p) => p.power)),
    [pokemonWithPower]
  );

  const onSetSearch = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => setSearch(evt.currentTarget.value),
    []
  );

  return (
    <div>
      <div className="top-bar">
        <div>Search</div>
        <input type="text" value={search} onChange={onSetSearch} />
        <div>Power threshold</div>
        <input type="text" value={threshold} onChange={onSetThreshold}></input>
        <div>Count over threshold: {countOverThreshold}</div>
      </div>
      <div className="two-column">
        <MemodPokemonTable pokemon={pokemonWithPower} />
        <div>
          <div>Min: {min}</div>
          <div>Max: {max}</div>
        </div>
      </div>
    </div>
  );
}
