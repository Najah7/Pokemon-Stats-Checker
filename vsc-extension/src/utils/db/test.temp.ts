// TODO: use jest to test the db functions.

import { Pokemon } from "../../types/pokemon";
import { Question } from "../../types/question";
import { Score } from "../../types/score";

import { readPokemons, readPokemonById, readPokemonByName } from "./pokemons/reader";
import { readQuestions } from "./questions/reader";

import { readScoreByUserName } from "./scores/reader";
import { insertScore, updateScore, deleteScore } from "./scores/writer";

const DISPLAY_ALL = false;
const DISPLAY_SINGLE = true;

const run = async (): Promise<void> => {

    const pokemons = await readPokemons();
    console.log('fetch all pokemons');
    console.log(pokemons.size !== 0 ? "success" : "failed");
    if (DISPLAY_ALL) console.log(pokemons);

    const p: Pokemon = await readPokemonById(1);
    console.log(p)
    console.log('fetch pokemon by id');
    console.log(
        p.pokemonId === 1 &&
        p.name === "フシギダネ" &&
        p.baseStats.hp === 45 &&
        p.baseStats.attack === 49 &&
        p.baseStats.defense === 49 &&
        p.baseStats["specialAttack"] === 65 &&
        p.baseStats["specialDefense"] === 65 &&
        p.baseStats.speed === 45 ? "success" : "failed"
        );
    if (DISPLAY_SINGLE) console.log(p);

    const p2: Pokemon = await readPokemonByName("フシギダネ");
    console.log('fetch pokemon by name');
    console.log(
        p2.pokemonId === 1 &&
        p2.name === "フシギダネ" &&
        p2.baseStats.hp === 45 &&
        p2.baseStats.attack === 49 &&
        p2.baseStats.defense === 49 &&
        p2.baseStats["specialAttack"] === 65 &&
        p2.baseStats["specialDefense"] === 65 &&
        p2.baseStats.speed === 45 ? "success" : "failed"
        );
    if (DISPLAY_SINGLE) console.log(p2);

    const questions = await readQuestions();
    console.log('fetch all questions');
    console.log(questions.length !== 0 ? "success" : "failed");
    if (DISPLAY_ALL) console.log(questions);


    const s: Score = {
        userName: "test",
        baseStats: {
            hp: 100,
            attack: 100,
            defense: 100,
            "specialAttack": 100,
            "specialDefense": 100,
            speed: 100
        }
    };

    const s2: Score = {
        userName: "test",
        baseStats: {
            hp: 0,
            attack: 0,
            defense: 0,
            "specialAttack": 0,
            "specialDefense": 0,
            speed: 0
        }
    };


    insertScore(s);
    updateScore(s2);
    const score = await readScoreByUserName("test");
    if (DISPLAY_SINGLE) console.log(score);
    deleteScore("test");

    const qs: Question[] = await readQuestions();
    console.log(qs);
}

run();

