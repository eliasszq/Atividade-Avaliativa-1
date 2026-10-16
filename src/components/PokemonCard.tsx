import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { PokemonDetails } from "../interface/InterfacePokemon";
import PokemonImage from "./PokemonImage";

const TYPE_COLORS: Record<string, string> = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD",
};

interface Props {
    pokemon: PokemonDetails;
    favorite: boolean;
    onToggleFavorite: () => void;
}

export default function PokemonCard({ pokemon, favorite, onToggleFavorite }: Props) {
    const mainColor = TYPE_COLORS[pokemon.types[0]] ?? "#68A090";

    return (
        <View style={styles.card}>
            <View style={[styles.header, { backgroundColor: mainColor }]}>
                <Text style={styles.number}>#{String(pokemon.pokemon_id).padStart(3, "0")}</Text>
                <Pressable
                    onPress={onToggleFavorite}
                    hitSlop={10}
                    style={styles.favoriteButton}
                    accessibilityRole="button"
                    accessibilityLabel={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                >
                    <Ionicons name={favorite ? "heart" : "heart-outline"} size={26} color={favorite ? "#e63946" : "#fff"} />
                </Pressable>
                <PokemonImage uri={pokemon.pokemon_image} pokemon_id={pokemon.pokemon_id} size={140} />
            </View>

            <View style={styles.body}>
                <Text style={styles.name}>{pokemon.pokemon_name}</Text>

                <View style={styles.types}>
                    {pokemon.types.map((type) => (
                        <View key={type} style={[styles.typeChip, { backgroundColor: TYPE_COLORS[type] ?? "#68A090" }]}>
                            <Text style={styles.typeText}>{type}</Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.description}>
                    {pokemon.description || "Nenhuma descrição encontrada."}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 20,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    header: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 20,
    },
    number: {
        position: "absolute",
        top: 12,
        left: 16,
        color: "rgba(255,255,255,0.9)",
        fontSize: 18,
        fontWeight: "bold",
    },
    favoriteButton: {
        position: "absolute",
        top: 10,
        right: 12,
        backgroundColor: "rgba(0,0,0,0.15)",
        borderRadius: 20,
        padding: 6,
    },
    body: {
        padding: 20,
        alignItems: "center",
    },
    name: {
        fontSize: 26,
        fontWeight: "bold",
        textTransform: "capitalize",
        color: "#121214",
        marginBottom: 10,
    },
    types: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 14,
    },
    typeChip: {
        paddingHorizontal: 14,
        paddingVertical: 5,
        borderRadius: 999,
    },
    typeText: {
        color: "#fff",
        fontWeight: "bold",
        textTransform: "capitalize",
    },
    description: {
        fontSize: 15,
        lineHeight: 22,
        color: "#4a4a55",
        textAlign: "center",
    },
});
