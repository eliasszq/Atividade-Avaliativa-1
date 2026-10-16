import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    Keyboard,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { alternarFavorito, ehFavorito } from "../services/FavoritesStorage";
import PokemonRequests from "../services/PokemonRequests";
import PokemonImage from "./PokemonImage";

type PokemonEncontrado = NonNullable<Awaited<ReturnType<typeof PokemonRequests.fetchPokemonData>>>;

export default function PokemonSearch() {
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [pokemon, setPokemon] = useState<PokemonEncontrado | null>(null);
    const [favorito, setFavorito] = useState(false);

    // O usuário pode remover o favorito na outra aba; ao voltar, atualiza o botão.
    useFocusEffect(
        useCallback(() => {
            if (pokemon) {
                ehFavorito(pokemon.pokemon_id).then(setFavorito);
            }
        }, [pokemon])
    );

    const handleToggleFavorito = async () => {
        if (!pokemon) return;

        setFavorito(await alternarFavorito(pokemon.pokemon_id));
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        setErrorMsg("");
        setPokemon(null);
        Keyboard.dismiss();

        try {
            const result = await PokemonRequests.fetchPokemonData(searchQuery);

            if (result) {
                console.log("=========================================");
                console.log("POKÉMON ENCONTRADO!");
                console.log(`- Nome: ${result.pokemon_name}`);
                console.log(`- ID: ${result.pokemon_id}`);
                console.log(`- URL da Imagem: ${result.pokemon_image}`);
                console.log(`- Tipagem: ${result.types.join(", ")}`);
                console.log(`- Descrição: ${result.description || "Nenhuma descrição encontrada."}`);
                console.log("=========================================");

                setPokemon(result);
                setFavorito(await ehFavorito(result.pokemon_id));
                setSearchQuery("");
            } else {
                setErrorMsg("Pokémon não encontrado. Verifique o nome ou número.");
            }
        } catch (error) {
            setErrorMsg("Erro ao buscar o Pokémon. Tente novamente.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, padding: 20 }}>
            <View>
                <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>PokéSearch 🔍</Text>

                <Text style={{ marginBottom: 20 }}>
                    Atividade Avaliativa: busque um Pokémon pelo nome ou número.
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Digite o nome ou ID (ex: bulbasaur ou 1)"
                    placeholderTextColor="#8d8d99"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onSubmitEditing={handleSearch}
                />

                {errorMsg ? <Text style={{ color: "red", marginTop: 10 }}>{errorMsg}</Text> : null}

                {loading ? <Text style={{ marginTop: 10 }}>Buscando...</Text> : null}

                {pokemon ? (
                    <View style={styles.card}>
                        <PokemonImage
                            id={pokemon.pokemon_id}
                            uri={pokemon.pokemon_image}
                            style={styles.image}
                        />

                        <Text style={styles.name}>{pokemon.pokemon_name}</Text>
                        <Text style={styles.details}>
                            #{pokemon.pokemon_id} · {pokemon.types.join(", ")}
                        </Text>

                        {pokemon.description ? (
                            <Text style={styles.description}>{pokemon.description}</Text>
                        ) : null}

                        <Pressable
                            style={[styles.favoriteButton, favorito && styles.favoriteButtonActive]}
                            onPress={handleToggleFavorito}
                        >
                            <Text style={styles.favoriteButtonText}>
                                {favorito ? "❤️ Favoritado" : "🤍 Favoritar"}
                            </Text>
                        </Pressable>
                    </View>
                ) : null}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: "#e1e1e6",
        color: "#121214",
        fontSize: 16,
        borderRadius: 6,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#323238",
    },
    card: {
        alignItems: "center",
        backgroundColor: "#e1e1e6",
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#323238",
        padding: 16,
        marginTop: 10,
    },
    image: {
        width: 120,
        height: 120,
    },
    name: {
        color: "#121214",
        fontSize: 22,
        fontWeight: "bold",
        textTransform: "capitalize",
    },
    details: {
        color: "#323238",
        fontSize: 14,
        marginBottom: 8,
        textTransform: "capitalize",
    },
    description: {
        color: "#121214",
        textAlign: "center",
        marginBottom: 12,
    },
    favoriteButton: {
        backgroundColor: "#fff",
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#323238",
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    favoriteButtonActive: {
        backgroundColor: "#ffd6d6",
        borderColor: "#e3350d",
    },
    favoriteButtonText: {
        color: "#121214",
        fontSize: 16,
        fontWeight: "600",
    },
});