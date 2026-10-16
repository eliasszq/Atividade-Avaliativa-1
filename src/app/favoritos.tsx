import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PokemonImage from "../components/PokemonImage";
import {
    buscarFavoritos,
    limparFavoritos,
    removerFavorito
} from "../services/FavoritesStorage";
import PokemonRequests from "../services/PokemonRequests";

interface PokemonFavorito {
    pokemon_id: number;
    pokemon_name: string;
    pokemon_image: string;
    types: string[];
}

export default function Favoritos() {
    const [pokemons, setPokemons] = useState<PokemonFavorito[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    const carregarFavoritos = useCallback(async () => {
        setLoading(true);
        setErrorMsg("");

        try {
            // O arquivo/localStorage guarda só os IDs; os dados vêm da PokeAPI.
            const ids = await buscarFavoritos();
            const resultados = await Promise.all(
                ids.map((id) => PokemonRequests.fetchPokemonData(String(id)))
            );

            const encontrados: PokemonFavorito[] = [];
            resultados.forEach((resultado) => {
                if (resultado) encontrados.push(resultado);
            });

            setTotal(ids.length);
            setPokemons(encontrados);

            if (encontrados.length < ids.length) {
                setErrorMsg("Não foi possível carregar alguns favoritos. Verifique sua conexão.");
            }
        } catch (error) {
            setErrorMsg("Erro ao carregar os favoritos. Tente novamente.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Recarrega toda vez que a aba ganha foco, para refletir o que foi
    // favoritado na aba de busca.
    useFocusEffect(
        useCallback(() => {
            carregarFavoritos();
        }, [carregarFavoritos])
    );

    const handleRemover = async (id: number) => {
        await removerFavorito(id);
        setPokemons((atual) => atual.filter((pokemon) => pokemon.pokemon_id !== id));
        setTotal((atual) => Math.max(0, atual - 1));
    };

    const handleLimpar = async () => {
        await limparFavoritos();
        setPokemons([]);
        setTotal(0);
        setErrorMsg("");
    };

    return (
        <SafeAreaView style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
                Favoritos ❤️
            </Text>

            <View style={styles.headerRow}>
                <Text style={styles.counter}>
                    ⭐ {total} {total === 1 ? "favorito" : "favoritos"}
                </Text>

                {total > 0 ? (
                    <Pressable style={styles.clearButton} onPress={handleLimpar}>
                        <Text style={styles.clearButtonText}>🗑 Limpar favoritos</Text>
                    </Pressable>
                ) : null}
            </View>

            {errorMsg ? <Text style={{ color: "red", marginBottom: 10 }}>{errorMsg}</Text> : null}

            {loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={pokemons}
                    keyExtractor={(item) => String(item.pokemon_id)}
                    ListEmptyComponent={
                        <Text style={styles.empty}>
                            Você ainda não favoritou nenhum Pokémon. Busque um na aba Buscar e toque em Favoritar.
                        </Text>
                    }
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <PokemonImage
                                id={item.pokemon_id}
                                uri={item.pokemon_image}
                                style={styles.image}
                            />

                            <View style={{ flex: 1 }}>
                                <Text style={styles.name}>{item.pokemon_name}</Text>
                                <Text style={styles.details}>
                                    #{item.pokemon_id} · {item.types.join(", ")}
                                </Text>
                            </View>

                            <Pressable
                                style={styles.removeButton}
                                onPress={() => handleRemover(item.pokemon_id)}
                            >
                                <Text style={styles.removeButtonText}>❤️ Remover</Text>
                            </Pressable>
                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    counter: {
        fontSize: 16,
        fontWeight: "600",
    },
    clearButton: {
        backgroundColor: "#e1e1e6",
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: "#323238",
    },
    clearButtonText: {
        color: "#121214",
        fontSize: 14,
    },
    empty: {
        color: "#8d8d99",
        marginTop: 20,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: "#e1e1e6",
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#323238",
        padding: 12,
        marginBottom: 12,
    },
    image: {
        width: 64,
        height: 64,
    },
    name: {
        color: "#121214",
        fontSize: 18,
        fontWeight: "bold",
        textTransform: "capitalize",
    },
    details: {
        color: "#323238",
        fontSize: 14,
        textTransform: "capitalize",
    },
    removeButton: {
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    removeButtonText: {
        color: "#e3350d",
        fontSize: 14,
        fontWeight: "600",
    },
});