import axios from "axios";
import { PokemonType } from "./types/pokemons";

export const getPokemons = async () => {
  const res = await axios.get(
    "https://graph-bucket-sugiyama.s3.ap-northeast-1.amazonaws.com/pokemons.json"
  );
  const pokemons: PokemonType[] = await res.data;
  return pokemons;
};
