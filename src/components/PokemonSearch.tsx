import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Keyboard,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { PokemonDetails } from "../interface/InterfacePokemon";
import FavoritesStorage from "../services/FavoritesStorage";
import PokemonRequests from "../services/PokemonRequests";
import PokemonCard from "./PokemonCard";

export default function PokemonSearch() {
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
    const [favorite, setFavorite] = useState(false);

    // Atualiza o coração ao voltar da aba Favoritos (o pokémon pode ter sido removido lá).
    useFocusEffect(
        useCallback(() => {
            if (pokemon) {
                setFavorite(FavoritesStorage.isFavorite(pokemon.pokemon_id));
            }
        }, [pokemon])
    );

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        setErrorMsg("");
        Keyboard.dismiss();

        try {
            const result = await PokemonRequests.fetchPokemonData(searchQuery);

            if (result) {
                setPokemon(result);
                setFavorite(FavoritesStorage.isFavorite(result.pokemon_id));
                setSearchQuery("");
            } else {
                setPokemon(null);
                setErrorMsg("Pokémon não encontrado. Verifique o nome ou número.");
            }
        } catch (error) {
            setPokemon(null);
            setErrorMsg("Erro ao buscar o Pokémon. Tente novamente.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFavorite = () => {
        if (!pokemon) return;
        try {
            setFavorite(FavoritesStorage.toggle(pokemon));
        } catch (error) {
            setErrorMsg("Não foi possível salvar o favorito.");
            console.error(error);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                <Text style={styles.title}>PokéSearch</Text>
                <Text style={styles.subtitle}>Busque um Pokémon pelo nome ou número.</Text>

                <View style={styles.searchRow}>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: bulbasaur ou 1"
                        placeholderTextColor="#8d8d99"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="search"
                        onSubmitEditing={handleSearch}
                    />
                    <Pressable
                        style={({ pressed }) => [styles.searchButton, pressed && { opacity: 0.8 }]}
                        onPress={handleSearch}
                        disabled={loading}
                        accessibilityRole="button"
                        accessibilityLabel="Buscar"
                    >
                        <Ionicons name="search" size={22} color="#fff" />
                    </Pressable>
                </View>

                {errorMsg ? (
                    <View style={styles.errorBox}>
                        <Ionicons name="alert-circle" size={20} color="#c62828" />
                        <Text style={styles.errorText}>{errorMsg}</Text>
                    </View>
                ) : null}

                {loading ? (
                    <ActivityIndicator size="large" color="#e3350d" style={{ marginTop: 40 }} />
                ) : pokemon ? (
                    <PokemonCard pokemon={pokemon} favorite={favorite} onToggleFavorite={handleToggleFavorite} />
                ) : !errorMsg ? (
                    <View style={styles.empty}>
                        <Ionicons name="search-circle-outline" size={64} color="#c4c4cc" />
                        <Text style={styles.emptyText}>Faça uma busca para ver as informações do Pokémon.</Text>
                    </View>
                ) : null}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f4f6",
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#e3350d",
    },
    subtitle: {
        fontSize: 15,
        color: "#4a4a55",
        marginTop: 4,
        marginBottom: 20,
    },
    searchRow: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 16,
    },
    input: {
        flex: 1,
        backgroundColor: "#fff",
        color: "#121214",
        fontSize: 16,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: "#d4d4d8",
    },
    searchButton: {
        backgroundColor: "#e3350d",
        borderRadius: 12,
        width: 54,
        alignItems: "center",
        justifyContent: "center",
    },
    errorBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#fdecea",
        borderRadius: 10,
        padding: 12,
        marginBottom: 16,
    },
    errorText: {
        color: "#c62828",
        flex: 1,
    },
    empty: {
        alignItems: "center",
        marginTop: 40,
        gap: 8,
    },
    emptyText: {
        color: "#8d8d99",
        textAlign: "center",
    },
});
