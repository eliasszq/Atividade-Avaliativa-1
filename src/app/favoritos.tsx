import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PokemonImage from "../components/PokemonImage";
import { PokemonDetails } from "../interface/InterfacePokemon";
import FavoritesStorage from "../services/FavoritesStorage";

export default function Favoritos() {
    const [favorites, setFavorites] = useState<PokemonDetails[]>([]);

    useFocusEffect(
        useCallback(() => {
            setFavorites(FavoritesStorage.getAll());
        }, [])
    );

    const handleRemove = (pokemon_id: number) => {
        FavoritesStorage.remove(pokemon_id);
        setFavorites(FavoritesStorage.getAll());
    };

    return (
        <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
            <Text style={styles.title}>Favoritos</Text>
            <FlatList
                data={favorites}
                keyExtractor={(item) => String(item.pokemon_id)}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Ionicons name="heart-dislike-outline" size={64} color="#c4c4cc" />
                        <Text style={styles.emptyText}>
                            Nenhum favorito ainda. Busque um Pokémon e toque no coração para salvá-lo aqui.
                        </Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <PokemonImage uri={item.pokemon_image} pokemon_id={item.pokemon_id} size={64} />
                        <View style={styles.info}>
                            <Text style={styles.number}>#{String(item.pokemon_id).padStart(3, "0")}</Text>
                            <Text style={styles.name}>{item.pokemon_name}</Text>
                            <Text style={styles.types}>{item.types.join(" • ")}</Text>
                        </View>
                        <Pressable
                            onPress={() => handleRemove(item.pokemon_id)}
                            hitSlop={10}
                            accessibilityRole="button"
                            accessibilityLabel={`Remover ${item.pokemon_name} dos favoritos`}
                        >
                            <Ionicons name="trash-outline" size={24} color="#c62828" />
                        </Pressable>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f4f6",
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#e3350d",
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 8,
    },
    list: {
        padding: 20,
        gap: 12,
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 12,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    info: {
        flex: 1,
    },
    number: {
        color: "#8d8d99",
        fontWeight: "bold",
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#121214",
        textTransform: "capitalize",
    },
    types: {
        color: "#4a4a55",
        textTransform: "capitalize",
    },
    empty: {
        alignItems: "center",
        marginTop: 60,
        gap: 8,
    },
    emptyText: {
        color: "#8d8d99",
        textAlign: "center",
        paddingHorizontal: 20,
    },
});
