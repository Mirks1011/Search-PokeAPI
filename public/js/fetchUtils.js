import {calculateResistance,displayMovesPagination} from "./extraUtils.js"

    const pokemoncontainer = document.getElementById("pokemon-container");
    const abilities = document.getElementById("pokemon-abilities-container");

    const type = document.getElementById("pokemon-types");
    const typeweak = document.getElementById("pokemon-type-weak");
    const typeres = document.getElementById("pokemon-type-res");
    const typeimmune = document.getElementById("pokemon-type-immune");

    const statistics = document.getElementById("pokemon-stats-container");
    const sprite = document.getElementById("pokemon-sprite");
    const cry = document.getElementById("pokemon-cry-container");
    const move = document.getElementById("pokemon-moves-container");
    const pokemoninfo = document.getElementById("pokemoninfo");
    const versions = new Set();

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

export function createStats(pokemon) {
    statistics.innerHTML = "";

    const label = document.createElement("h3");
    label.textContent = "STATS:";
    label.className = "h3";
    statistics.append(label);

    let BST = 0;

    for (const stats of pokemon.stats) {
        BST += stats.base_stat;

        const statRow = document.createElement("div");
        statRow.className = "stat-row";

        // Stat name
        const names = document.createElement("label");
        names.textContent = stats.stat.name.toUpperCase() + ":";
        names.className = stats.stat.name;

        // Bar
        const statBar = document.createElement("div");
        statBar.className = "stat-bar";

        const statFill = document.createElement("div");
        statFill.className = "stat-fill";

        // Width based on stat
        const percentage = (stats.base_stat / 255) * 100;
        statFill.style.width = `${percentage}%`;

        // Color: low = red, high = green
        const hue = (stats.base_stat / 255) * 120;
        statFill.style.backgroundColor = `hsl(${hue}, 70%, 50%)`;

        statBar.append(statFill);

        // Stat value
        const base_stats = document.createElement("label");
        base_stats.textContent = stats.base_stat;
        base_stats.className = "basestats";

        // NAME -> BAR -> VALUE
        statRow.append(names, statBar, base_stats);

        statistics.append(statRow);
    }

    const base_stat_total = document.createElement("label");
    base_stat_total.textContent = "BST: " + BST;
    base_stat_total.className = "base_stat_total";

    statistics.append(base_stat_total);
}

export function createMoves(pokemon){

    const prevBtn = document.createElement("button");
    prevBtn.name = "prevBtn";
    prevBtn.classList.add("prevBtn");
    const previcon = document.createElement("i");
    previcon.classList.add("fa-solid", "fa-arrow-left");
    prevBtn.append(previcon);

    const nextBtn = document.createElement("button");
    nextBtn.name = "nextBtn";
    nextBtn.classList.add("nextBtn");
    const nexticon = document.createElement("i");
    nexticon.classList.add("fa-solid", "fa-arrow-right");
    nextBtn.append(nexticon);

    move.append(prevBtn,nextBtn);
}

export function createVersionButtons(pokemon){
    const offset = 0;
    const limit = 20;

    for (const moves of pokemon.moves) {
    for (const version of moves.version_group_details) {
        versions.add(version.version_group.name);
        }
    }
    for (const fetchedVer of versions) {
        const versionLabel = document.createElement("label");
        versionLabel.classList.add("version-option");

        const versionRadio = document.createElement("input");
        versionRadio.type = "radio";
        versionRadio.name = "versionRadio";
        versionRadio.value = fetchedVer;

        const versionText = document.createElement("span");
        versionText.textContent = fetchedVer.toUpperCase();

        versionLabel.append(versionRadio, versionText);
        move.append(versionLabel);
    }
}

