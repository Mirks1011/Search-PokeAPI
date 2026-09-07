const versionGroupUrls = new Set();
const versionGroupings = new Map();
export async function calculateResistance(pokemon){
    const values = {};
    try {
    for(const type of pokemon.types){
        //REMEMBER TO USE ANOTHER ASYNC/AWAIT IF ACCESSING URLs
        const response = await fetch(type.type.url);
        if(!response.ok){
            throw new Error("FAILED TO FETCH DATA");
        }

        const data = await response.json();
        //GET THE FREAKING WEAKNESS TURNS OUT NO CALCULATION INVOLVED // I WAS WRONG, I NEED TO CALCULATE THE 2 TYPES
        const relations = {double_damage_from:2, half_damage_from:0.5, no_damage_from:0};

        for (const relasyon of Object.keys(relations)) {
            const multipliers = relations[relasyon];
            const types = data.damage_relations[relasyon];

            for (const names of types) {

                if(names.name in values){
                    values[names.name] = values[names.name]* multipliers;
                }
                else{
                  values[names.name] = multipliers;
                }
            }     
        }
    }
        return values;
    } catch (error) {
        console.log(error);
    }
}

export async function createVersionButtons(pokemon,move){
    versionGroupUrls.clear();
    for (const moves of pokemon.moves) {
        for (const version of moves.version_group_details) {
            versionGroupUrls.add(version.version_group.url);
        }
    }

    for(const versions of versionGroupUrls){
        try {
            const response = await fetch(versions);
            const data = await response.json();

            if(versionGroupings.has(data.generation.name)){
            versionGroupings.get(data.generation.name).add(data.name);
            }
            else{               
            versionGroupings.set(data.generation.name, new Set());
            }
            
        } catch (error) {
            console.log(error);
        }
    }
    console.log(versionGroupings);

    for (const fetchedVer of versionGroupings.keys()) {
        const versionLabel = document.createElement("label");
        versionLabel.classList.add("version-option");

        const versionRadio = document.createElement("input");
        versionRadio.type = "radio";
        versionRadio.name = "versionRadio";
        versionRadio.value = fetchedVer;

        const versionText = document.createElement("span");
        versionText.textContent = fetchedVer.toUpperCase().replace("-","/");

        versionLabel.append(versionRadio, versionText);
        move.append(versionLabel);
    }
}

export async function displayLevelUpMoves(pokemon,lvlup){
lvlup.innerHTML="";

const selectedVersion = document.querySelector('input[name="versionRadio"]:checked');
console.log(selectedVersion);
   const levelUpMoves = [];

    try {

    for (const moves of pokemon.moves) {
        for (const verdet of moves.version_group_details) {

            if (
                verdet.version_group.name === selectedVersion &&
                verdet.move_learn_method.name === "level-up"
            ) {

                levelUpMoves.push({
                    move: moves,
                    level: verdet.level_learned_at
                });

            }
        }
    }

    levelUpMoves.sort((a, b) => a.level - b.level);
        const lvlLearnedHead = document.createElement("h5");
        lvlLearnedHead.classList.add("header");
        lvlLearnedHead.textContent = "Level Learned";

        const moveNameHead = document.createElement("h5");
        moveNameHead.classList.add("header");
        moveNameHead.textContent = "Name";

        const moveTypeHead = document.createElement("h5");
        moveTypeHead.classList.add("header");
        moveTypeHead.textContent = "Type";

        const moveCategoryHead = document.createElement("h5");
        moveCategoryHead.classList.add("header");
        moveCategoryHead.textContent = "Category";

        const movePowerHead = document.createElement("h5");
        movePowerHead.classList.add("header");
        movePowerHead.textContent = "Power";

        const moveAccuracyHead = document.createElement("h5");
        moveAccuracyHead.classList.add("header");
        moveAccuracyHead.textContent = "Accuracy";
        lvlup.append(lvlLearnedHead,moveNameHead,moveTypeHead,moveCategoryHead,movePowerHead,moveAccuracyHead);



    for (const moveData of levelUpMoves) {

        const response = await fetch(moveData.move.move.url);

        if (!response.ok) {
            throw new Error("FAILED TO FETCH RESOURCE");
        }

        const data = await response.json();

        const lvlLearnedLbl = document.createElement("label");
        lvlLearnedLbl.classList.add("levelLearned");
        lvlLearnedLbl.textContent = moveData.level;

        console.log("Level Learned: " + moveData.level);
        console.log("Name: " + data.name);
        console.log("Power: " + data.power);
        console.log("Accuracy: " + data.accuracy);
        console.log("PP: " + data.pp);
    }

        }
        catch(error) {
            console.log(error);
        }
    }
