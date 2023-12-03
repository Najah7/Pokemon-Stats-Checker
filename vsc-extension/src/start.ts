import { getPokemons } from "./getPokemon";
import { LANGUAGES, openNote } from "./openNote";
import { PokemonType } from "./types/pokemons";

export let startTime: number;
export let pokemons: PokemonType[];

export type QuestionType = {
  script: string;
  trueAnswer: string;
};

// TODO: どうにかする
const QUIESTIONS = [
  {
    script: "低辺2m、高さ3mの3角形の面積は?",
    trueAnswer: "3",
  },
];

export async function start(language: LANGUAGES) {
  startTime = Date.now();
  openNote(language);
  pokemons = await getPokemons();
  const question = QUIESTIONS[0];
  return { question };
}
