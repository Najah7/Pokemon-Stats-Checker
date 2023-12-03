import csv
import json
import sys

def read_pokemon_color_csv(file_path):
    pokemon_data = []
    with open(file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            row = {key.strip(): value for key, value in row.items()}
            pokemon_data.append(row)
    return pokemon_data

def read_pokemon_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as jsonfile:
        data = json.load(jsonfile)
    return data


def write_json(data, file_path):
    with open(file_path, 'w', encoding='utf-8') as jsonfile:
        json.dump(data, jsonfile, indent=2, ensure_ascii=False)

def run(csv_file, json_file):
    color_data = read_pokemon_color_csv(csv_file)
    pokemons = read_pokemon_json(json_file)

    json_data = []
    # NOTE: because the data is small, I use blue force to find the match
    for csv_row in color_data:
        for pokemon in pokemons:
            print(csv_row.keys())
            if csv_row['name'] == pokemon['name']:
                if 'color' not in pokemon:
                    pokemon['color'] = {}
                pokemon['color']['fillColor'] = csv_row['fillColor']
                pokemon['color']['lineColor'] = csv_row['lineColor']
                json_data.append(pokemon)

    write_json(json_data, 'pokemon_with_color.json')

if __name__ == '__main__':
    try:
        csv_file = sys.argv[1]
        json_file = sys.argv[2]
    except IndexError:
        print('Usage: python add_color.py <csv_file> <json_file>')
        sys.exit(1)
    run(csv_file, json_file)