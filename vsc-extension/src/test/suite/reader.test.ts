const { readPokemons, readPokemonById, readPokemonByName } = require('../../utils/db/reader');

describe('readPokemons function', () => {
    it('should return an array of Pokemon from the database', () => {
        const pokemons = readPokemons();
        expect(Array.isArray(pokemons)).toBe(true);
        expect(pokemons.length).toBe(151);
    });
});

describe('readPokemonById function', () => {
    it('should return a Pokemon object with the given ID', () => {
        const pokemon = readPokemonById(25);
        // NOTE: pikachu is my favorite pokemon, so I'm using it as an example
        const expected_output =  {
            id: 25,
            name: 'ピカチュウ',
            stats: {
              hp: 35,
              attack: 55,
              defense: 40,
              'special-attack': 50,
              'special-defense': 50,
              speed: 90
            }
        }
        
        expect(pokemon.id).toBe(expected_output.id);
        expect(pokemon.name).toBe(expected_output.name);
        expect(pokemon.stats.hp).toBe(expected_output.stats.hp);
        expect(pokemon.stats.attack).toBe(expected_output.stats.attack);
        expect(pokemon.stats.defense).toBe(expected_output.stats.defense);
        expect(pokemon.stats['special-attack']).toBe(expected_output.stats['special-attack']);
        expect(pokemon.stats['special-defense']).toBe(expected_output.stats['special-defense']);
        expect(pokemon.stats.speed).toBe(expected_output.stats.speed);

    });

    it('should throw an error when no Pokemon with the given ID is found', () => {
        expect(() => {
            readPokemonById(999); // Non-existent ID
        }).toThrowError('No pokemon found with id: 999');
    });
});

describe('readPokemonByName function', () => {
    it('should return a Pokemon object with the given name', () => {
        const pokemon = readPokemonByName('ピカチュウ');
        // NOTE: pikachu is my favorite pokemon, so I'm using it as an example
        const expected_output =  {
            id: 25,
            name: 'ピカチュウ',
            stats: {
              hp: 35,
              attack: 55,
              defense: 40,
              'special-attack': 50,
              'special-defense': 50,
              speed: 90
            }
        }
        expect(pokemon.id).toBe(expected_output.id);
        expect(pokemon.name).toBe(expected_output.name);
        expect(pokemon.stats.hp).toBe(expected_output.stats.hp);
        expect(pokemon.stats.attack).toBe(expected_output.stats.attack);
        expect(pokemon.stats.defense).toBe(expected_output.stats.defense);
        expect(pokemon.stats['special-attack']).toBe(expected_output.stats['special-attack']);
        expect(pokemon.stats['special-defense']).toBe(expected_output.stats['special-defense']);
        expect(pokemon.stats.speed).toBe(expected_output.stats.speed);

    });

    it('should throw an error when no Pokemon with the given name is found', () => {
        expect(() => {
            readPokemonByName('non-existent pokemon'); // Non-existent name
        }).toThrowError('No pokemon found with name: non-existent pokemon');
    });
});
