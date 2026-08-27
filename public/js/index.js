import{createName,createTypes,createAbilities,createCry,createSprite,createStats,createMoves} from "./fetchUtils.js"
import {fetchPokemon} from './fetch.js';

const submit = document.getElementById("submitBtn");
const pokemonName = document.getElementById("pokemon-name");
const errorContainer = document.getElementById("error-container");
submit.addEventListener("click", async ()=>{
    try{
    const pokemon = await fetchPokemon(pokemonName.value.toLowerCase().replace(/\s+/g, "-"));
    createName(pokemon);
    createTypes(pokemon);
    createAbilities(pokemon);
    createCry(pokemon);
    createSprite(pokemon);
    createStats(pokemon);
    createMoves(pokemon);

    }
    catch(error){
    errorContainer.textContent = error.message;
    }

});


    

