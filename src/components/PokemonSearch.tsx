import { useState } from "react";

import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";


export default function PokemonSearch(){


const [pokemon,setPokemon] = useState<any>(null);
const [name,setName] = useState("");
const [animado,setAnimado] = useState(false);



async function buscar(){

try{


const resposta = await fetch(
`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
);


const dados = await resposta.json();


setPokemon(dados);
setAnimado(false);


}catch{

alert("Pokémon não encontrado");

}


}





const cores:any={


fire:"#F08030",
water:"#6890F0",
grass:"#78C850",
electric:"#F8D030",
psychic:"#F85888",
ice:"#98D8D8",
dragon:"#7038F8",
dark:"#705746",
fairy:"#EE99AC",
fighting:"#C03028",
rock:"#B8A038",
ground:"#E0C068",
bug:"#A8B820",
ghost:"#705898",
normal:"#A8A878"


};





const corPokemon = pokemon

?

cores[pokemon.types[0].type.name]

:

"#E60012";





const imagem = animado

?

`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemon.id}.gif`

:

pokemon?.sprites?.other?.["official-artwork"]?.front_default;





const hp = pokemon?.stats?.find(
(s:any)=>s.stat.name==="hp"
)?.base_stat;


const ataque = pokemon?.stats?.find(
(s:any)=>s.stat.name==="attack"
)?.base_stat;



const defesa = pokemon?.stats?.find(
(s:any)=>s.stat.name==="defense"
)?.base_stat;






return(



<View


style={[
  styles.container,
  {
    backgroundColor: pokemon
      ? corPokemon + "55"
      : "#000"
  }
]}



>



<Text style={styles.titulo}>

POKÉDEX

</Text>







<View style={styles.search}>


<TextInput
  style={styles.input}
  placeholder="Digite o Pokémon..."
  placeholderTextColor="#888"
  value={name}
  onChangeText={setName}
  onSubmitEditing={buscar}
  returnKeyType="search"
/>





<TouchableOpacity


style={styles.botao}


onPress={buscar}


>


<Text style={styles.botaoTexto}>

BUSCAR

</Text>



</TouchableOpacity>



</View>









{pokemon && (





<View


style={[

styles.card,

{

borderColor:corPokemon

}

]}


>






<Text style={styles.nome}>

{pokemon.name.toUpperCase()}

</Text>






<Text style={styles.numero}>

#{String(pokemon.id).padStart(3,"0")}

</Text>








<View


style={[

styles.aura,

{

backgroundColor:corPokemon

}

]}


>





<Image


style={styles.img}


source={{

uri:imagem

}}


/>





</View>









<View style={styles.tipos}>


{

pokemon.types.map((t:any)=>(



<View


key={t.type.name}


style={[

styles.tipo,

{

backgroundColor:cores[t.type.name]

}

]}



>



<Text style={styles.tipoTexto}>

{t.type.name.toUpperCase()}

</Text>




</View>




))



}



</View>










<TouchableOpacity


style={styles.animar}


onPress={()=>setAnimado(!animado)}



>



<Text style={styles.animarTexto}>


{animado

?

"Imagem oficial"

:

"Ver animação"


}



</Text>



</TouchableOpacity>









<View style={styles.info}>


<Text style={styles.texto}>

⭐ Número: {pokemon.id}

</Text>



<Text style={styles.texto}>

📏 Altura: {pokemon.height/10}m

</Text>




<Text style={styles.texto}>

⚖ Peso: {pokemon.weight/10}kg

</Text>





<Text style={styles.texto}>

❤️ HP: {hp}

</Text>



<View style={styles.barra}>


<View


style={[

styles.hp,

{

width:`${hp}%`,

backgroundColor:corPokemon

}


]}


/>



</View>





<Text style={styles.texto}>

⚔ Ataque: {ataque}

</Text>




<Text style={styles.texto}>

🛡 Defesa: {defesa}

</Text>





</View>






</View>





)}



</View>



)

}









const styles = StyleSheet.create({



container:{


flex:1,


padding:25


},





titulo:{


fontSize:42,


fontWeight:"900",


color:"#fff",


textAlign:"center",


marginBottom:25



},





search:{


flexDirection:"row",


gap:10



},





input:{


flex:1,


backgroundColor:"#111",


color:"#fff",


borderRadius:15,


padding:12,


borderWidth:1,


borderColor:"#fff"



},





botao:{


backgroundColor:"#000000ff",


paddingHorizontal:18,


justifyContent:"center",


borderRadius:15



},




botaoTexto:{


color:"#fff",


fontWeight:"bold"



},





card:{


marginTop:35,


backgroundColor:"#080808",


borderRadius:30,


alignItems:"center",


padding:25,


borderWidth:3



},





nome:{


fontSize:30,


color:"#fff",


fontWeight:"900"



},





numero:{


fontSize:20,


color:"#aaa",


marginBottom:15



},





aura:{
width:320,
height:320,
borderRadius:160,
alignItems:"center",
justifyContent:"center",
opacity:0.85,
borderWidth:3,
borderColor:"rgba(255,255,255,0.15)"
},





img:{


width:280,


height:280



},






tipos:{


flexDirection:"row",


gap:10,


marginVertical:20



},





tipo:{


paddingHorizontal:18,


paddingVertical:8,


borderRadius:20



},





tipoTexto:{


color:"#fff",


fontWeight:"bold"



},





animar:{


backgroundColor:"#fff",


padding:12,


borderRadius:15,


marginBottom:15



},





animarTexto:{


color:"#000",


fontWeight:"bold"



},





info:{


backgroundColor:"#151515",


width:"100%",


borderRadius:15,


padding:15



},





texto:{


color:"#fff",


fontSize:17,


fontWeight:"bold",


margin:5



},





barra:{


height:12,


backgroundColor:"#333",


borderRadius:20,


overflow:"hidden",


marginVertical:10



},





hp:{


height:"100%",


borderRadius:20



}



});