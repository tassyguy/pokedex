'use client';

import { useEffect, useState } from 'react';
import { Pokedex } from 'pokeapi-js-wrapper';

const pokedex = new Pokedex();

type PokemonType = {
  slot: number;
  type: {
    name: string;
  };
};

type PokemonGame = {
  version: {
    name: string;
  };
};

type PokemonData = {
  name: string;
  types: PokemonType[];
  game_indices: PokemonGame[];
};

export default function PokedexPage() {
  const [pokemonList, setPokemonList] = useState<string[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);
  const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);

  // Fetch the list of all Pokémon on page load
  useEffect(() => {
    async function fetchPokemonList() {
      try {
        const response = await pokedex.getPokemonsList({ offset: 0, limit: 800 }); // Adjust limit as needed
        setPokemonList(response.results.map((pokemon: any) => pokemon.name));
      } catch (error) {
        console.error("Error fetching Pokémon list:", error);
      }
    }
    fetchPokemonList();
  }, []);

  // Fetch selected Pokémon details
  useEffect(() => {
    async function fetchPokemonData() {
      if (!selectedPokemon) return;

      try {
        const response = await pokedex.getPokemonByName(selectedPokemon);
        setPokemonData({
          name: response.name,
          types: response.types,
          game_indices: response.game_indices,
        });
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      }
    }
    fetchPokemonData();
  }, [selectedPokemon]);

  return (
    <div>
      <h1>Pokedex</h1>

      <select
        onChange={(e) => setSelectedPokemon(e.target.value)}
        value={selectedPokemon || ""}
      >
        <option value="">Select a Pokémon</option>
        {pokemonList.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>

      {pokemonData && (
        <div>
          <h2>{pokemonData.name.toUpperCase()}</h2>
          <p><strong>Type:</strong> {pokemonData.types.map((type) => type.type.name).join(', ')}</p>
          <p><strong>Available in games:</strong> {pokemonData.game_indices.map((game) => game.version.name).join(', ')}</p>
        </div>
      )}
    </div>
  );
}
