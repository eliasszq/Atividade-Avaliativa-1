import { Image } from "expo-image";
import React, { useState } from "react";
import { StyleProp, ImageStyle } from "react-native";

const ARTWORK_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";

interface Props {
    uri: string;
    pokemon_id: number;
    size: number;
    style?: StyleProp<ImageStyle>;
}

// Nem todo pokémon tem o GIF animado (showdown); nesses casos mostramos a arte oficial.
export default function PokemonImage({ uri, pokemon_id, size, style }: Props) {
    const [failed, setFailed] = useState(false);

    return (
        <Image
            source={{ uri: failed ? `${ARTWORK_URL}${pokemon_id}.png` : uri }}
            style={[{ width: size, height: size }, style]}
            contentFit="contain"
            onError={() => setFailed(true)}
            key={uri}
        />
    );
}
