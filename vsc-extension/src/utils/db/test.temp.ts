// TODO: use jest to test the db functions.

import { Pokemon } from "../../types/pokemon";
import { Question } from "../../types/question";
import { Score } from "../../types/score";

import { readPokemons, readPokemonById, readPokemonByName } from "./pokemons/reader";
import { readQuestions, readQuestionById } from "./questions/reader";

import { readScores, readScoreByUserName } from "./scores/reader";
import { insertScore, updateScore, deleteScore } from "./scores/writer";

const DISPLAY_ALL = false;
const DISPLAY_SINGLE = true;

const run = async (): Promise<void> => {

    const pokemons = await readPokemons();
    console.log('fetch all pokemons');
    console.log(pokemons.size !== 0 ? "success" : "failed");
    if (DISPLAY_ALL) console.log(pokemons);

    const p: Pokemon = await readPokemonById(1);
    console.log('fetch pokemon by id');
    console.log(
        p.id === 1 &&
        p.name === "フシギダネ" &&
        p.stats.hp === 45 &&
        p.stats.attack === 49 &&
        p.stats.defense === 49 &&
        p.stats["special-attack"] === 65 &&
        p.stats["special-defense"] === 65 &&
        p.stats.speed === 45 ? "success" : "failed"
        );
    if (DISPLAY_SINGLE) console.log(p);

    const p2: Pokemon = await readPokemonByName("フシギダネ");
    console.log('fetch pokemon by name');
    console.log(
        p2.id === 1 &&
        p2.name === "フシギダネ" &&
        p2.stats.hp === 45 &&
        p2.stats.attack === 49 &&
        p2.stats.defense === 49 &&
        p2.stats["special-attack"] === 65 &&
        p2.stats["special-defense"] === 65 &&
        p2.stats.speed === 45 ? "success" : "failed"
        );
    if (DISPLAY_SINGLE) console.log(p2);

    const questions = await readQuestions();
    console.log('fetch all questions');
    console.log(questions.size !== 0 ? "success" : "failed");
    if (DISPLAY_ALL) console.log(questions);

    const q: Question = await readQuestionById(1);
    console.log('fetch question by id');
    console.log(
        q.id === 1 &&
        q.text === "What is the capital of India?" &&
        q.answer === "New Delhi" ? "success" : "failed"
        );
    if (DISPLAY_SINGLE) console.log(q);

    const s: Score = {
        name: "test",
        stats: {
            hp: 100,
            attack: 100,
            defense: 100,
            "special-attack": 100,
            "special-defense": 100,
            speed: 100
        }
    };

    const s2: Score = {
        name: "test",
        stats: {
            hp: 0,
            attack: 0,
            defense: 0,
            "special-attack": 0,
            "special-defense": 0,
            speed: 0
        }
    };


    insertScore(s);
    updateScore(s2);
    const score = await readScoreByUserName("test");
    if (DISPLAY_SINGLE) console.log(score);
    deleteScore("test");

    const scores = await readScores();
    console.log(scores.size !== 0 ? "success" : "failed");
    if (DISPLAY_ALL) console.log(scores);
}

run();

