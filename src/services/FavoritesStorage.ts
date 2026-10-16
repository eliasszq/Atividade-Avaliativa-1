import { File, Paths } from "expo-file-system";
import { Platform } from "react-native";
import { PokemonDetails } from "../interface/InterfacePokemon";

const FILE_NAME = "favoritos.json";

// expo-file-system não funciona na web, então lá usamos o localStorage do navegador.
function readRaw(): string {
    if (Platform.OS === "web") {
        return globalThis.localStorage?.getItem(FILE_NAME) ?? "";
    }
    const file = new File(Paths.document, FILE_NAME);
    return file.exists ? file.textSync() : "";
}

function writeRaw(content: string) {
    if (Platform.OS === "web") {
        globalThis.localStorage?.setItem(FILE_NAME, content);
        return;
    }
    const file = new File(Paths.document, FILE_NAME);
    if (!file.exists) {
        file.create();
    }
    file.write(content);
}

class FavoritesStorage {
    getAll(): PokemonDetails[] {
        try {
            const raw = readRaw();
            return raw ? (JSON.parse(raw) as PokemonDetails[]) : [];
        } catch (error) {
            console.error(`[services/FavoritesStorage] Erro ao ler favoritos. ${error}`);
            return [];
        }
    }

    isFavorite(pokemon_id: number): boolean {
        return this.getAll().some((p) => p.pokemon_id === pokemon_id);
    }

    add(pokemon: PokemonDetails) {
        const favorites = this.getAll().filter((p) => p.pokemon_id !== pokemon.pokemon_id);
        favorites.push(pokemon);
        favorites.sort((a, b) => a.pokemon_id - b.pokemon_id);
        writeRaw(JSON.stringify(favorites));
    }

    remove(pokemon_id: number) {
        writeRaw(JSON.stringify(this.getAll().filter((p) => p.pokemon_id !== pokemon_id)));
    }

    // Retorna true se o pokémon ficou favoritado.
    toggle(pokemon: PokemonDetails): boolean {
        if (this.isFavorite(pokemon.pokemon_id)) {
            this.remove(pokemon.pokemon_id);
            return false;
        }
        this.add(pokemon);
        return true;
    }
}

export default new FavoritesStorage();
