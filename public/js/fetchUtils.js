import {calculateResistance} from "./extraUtils.js"

    const pokemoncontainer = document.getElementById("pokemon-container");
    const abilities = document.getElementById("pokemon-abilities-container");

    const type = document.getElementById("pokemon-types");
    const typeweak = document.getElementById("pokemon-type-weak");
    const typeres = document.getElementById("pokemon-type-res");
    const typeimmune = document.getElementById("pokemon-type-immune");

    const statistics = document.getElementById("pokemon-stats-container");
    const sprite = document.getElementById("pokemon-sprite");
    const cry = document.getElementById("pokemon-cry-container");
    const pokemoninfo = document.getElementById("pokemoninfo");

export function createName(pokemon){
pokemoninfo.innerHTML = "";

const pokedexEntry = document.createElement("label");
pokedexEntry.textContent = pokemon.id;
pokedexEntry.className = "dex-entry";

const pokemonNameLbl = document.createElement("label");
pokemonNameLbl.className = "label";
pokemonNameLbl.textContent = pokemon.name.toUpperCase();

pokemoninfo.append(pokemonNameLbl,pokedexEntry);
}

export async function createTypes(pokemon){
type.innerHTML = "";

typeweak.innerHTML = "";
typeres.innerHTML = "";
typeimmune.innerHTML = "";

    pokemon.types.forEach(typeFetch => {
    const createpokemonTypes = document.createElement("label");
    createpokemonTypes.textContent = typeFetch.type.name.toUpperCase();
    createpokemonTypes.classList.add("pokemon-type");
    createpokemonTypes.classList.add(typeFetch.type.name);
    type.append(createpokemonTypes);   
    });

    const resistances = await calculateResistance(pokemon);

    for (const matchups of Object.entries(resistances)) {
    if (matchups[1] === 0) {
        const immune = document.createElement("label");
        immune.textContent = matchups[0].toUpperCase() + " x"+matchups[1];
        immune.classList.add("pokemon-type");
        immune.classList.add(matchups[0]);
        typeimmune.append(immune);

    } else if (matchups[1] <= 0.5) {
        const resistant = document.createElement("label");
        resistant.textContent = matchups[0].toUpperCase()+ " x"+matchups[1];
        resistant.classList.add("pokemon-type");
        resistant.classList.add(matchups[0]);
        typeres.append(resistant);

    } else if (matchups[1] >= 2) {
        const weak = document.createElement("label");
        weak.textContent = matchups[0].toUpperCase()+ " x"+matchups[1];
        weak.classList.add("pokemon-type");
        weak.classList.add(matchups[0]);
        typeweak.append(weak);
    }
}

}

export function createAbilities(pokemon){
    abilities.innerHTML = "";
    const label = document.createElement("label");
    label.textContent = "Abilities: ";
    label.className = "label";
    const dropdown = document.createElement("select");
    pokemon.abilities.forEach(ability =>{
    const option = document.createElement("option");

    option.textContent = ability.ability.name;  
    if(ability.is_hidden){
        option.textContent+=" (Hidden)";
    }

    option.value = ability.ability.name;
    option.dataset.url = ability.ability.url;
    dropdown.append(option);
    });

    const desc = document.createElement("p");
    abilities.append(label,dropdown,desc);

    async function showAbilityEffect(){
        const selected = dropdown.options[dropdown.selectedIndex];

        const response = await fetch(selected.dataset.url);

        const data = await response.json();

        const effectEntry = data.effect_entries.find(
            entry => entry.language.name === "en"
        );

        if(effectEntry){
            desc.textContent = "Effect: "+effectEntry.short_effect;
        }
    }

    dropdown.addEventListener("change", showAbilityEffect);
    showAbilityEffect();    
}

export function createCry(pokemon){
    cry.innerHTML = "";
    const label = document.createElement("label");
    label.textContent = "Cry: ";
    label.className = "label";
    cry.append(label);
    for (const cried in pokemon.cries) {
            if (!pokemon.cries[cried]) {
            continue;
        }
        const radio = document.createElement("input");
        radio.type = "radio"
        radio.name = "pokemon-cry";
        radio.value = cried;

        const label = document.createElement("label");
        label.textContent = cried;
        cry.append(radio,label);
    }
    const audio = document.createElement("audio");
    audio.controls = true;
    audio.name = "audio";
    audio.className = "audio";
    cry.append(audio);

    cry.addEventListener("change", ()=>{
        const selected = cry.querySelector('input[name="pokemon-cry"]:checked');
        if(selected){
        audio.src = pokemon.cries[selected.value];
        }      
    });     
}

export function createSprite(pokemon){
    sprite.innerHTML = "";
    const display = document.createElement("img");
    for(const coke in pokemon.sprites){
        if(coke === "other" || coke ==="versions" || coke ==="front_shiny_female" || coke==="back_shiny_female" || coke==="back_female" || coke==="front_female"){
            continue;
        }
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "pokemon-sprites";
        radio.value = coke;

        const label = document.createElement("label");
        label.textContent = coke;
        label.className = "label";
        sprite.append(radio,label);
    }
    sprite.append(display);
    sprite.addEventListener("click", () =>{
        const selected = sprite.querySelector('input[name="pokemon-sprites"]:checked');
        if(selected){
            display.src=pokemon.sprites[selected.value];
        }
    });
}

export function createStats(pokemon){
    statistics.innerHTML = "";
    const label = document.createElement("h3");
    label.textContent = "STATS: ";
    label.className = "h3";
    statistics.append(label);
    let BST = 0;
    for(const stats of pokemon.stats){
        BST+=stats.base_stat;
        const names = document.createElement("label");
        names.textContent = stats.stat.name.toUpperCase() + ": ";
        names.className = stats.stat.name;

        const base_stats = document.createElement("label");
        base_stats.textContent = stats.base_stat;
        base_stats.className = "basestats";

        statistics.append(names,base_stats);
    }
        const base_stat_total = document.createElement("label");
        base_stat_total.textContent = "BST: " + BST;
        base_stat_total.className = "base_stat_total";
        statistics.append(base_stat_total);
}

