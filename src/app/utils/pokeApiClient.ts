import { NamedAPIResourceList, PokemonClient } from "pokenode-ts";

const cache: { pokemons: NamedAPIResourceList; timestamp: number } = {
  pokemons: { count: 0, next: "", previous: "", results: [] },
  timestamp: 0,
};

export const getPokeNames = async (
  apiContructor: PokemonClient,
  pokemonName: string
) => {
  const cacheDuration = 24 * 60 * 60 * 1000; // 24 hours
  const now = Date.now();

  if (!cache.pokemons || now - cache.timestamp > cacheDuration) {
    cache.pokemons = await apiContructor.listPokemons(0, 1500);
    cache.timestamp = now;
  } else {
    console.log("🚀 ~ getPokeNames ~ using cached data");
  }

  return await cache.pokemons.results
    .filter((item) => {
      if (item.name.includes(pokemonName.toLowerCase())) {
        return item.name;
      }
    })
    .slice(0, 5);
};
