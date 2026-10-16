import { Image } from "expo-image";
import { useState } from "react";
import { ImageStyle, StyleProp } from "react-native";

interface PokemonImageProps {
    id: number;
    uri: string;
    style?: StyleProp<ImageStyle>;
}

/**
 * Mostra o sprite animado do Pokémon. Nem todos os Pokémon têm esse sprite,
 * então, se a imagem falhar, usamos a arte oficial como alternativa.
 */
export default function PokemonImage({ id, uri, style }: PokemonImageProps) {
    const [falhou, setFalhou] = useState(false);

    const fallback = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

    return (
        <Image
            source={{ uri: falhou ? fallback : uri }}
            style={style}
            contentFit="contain"
            onError={() => setFalhou(true)}
        />
    );
}