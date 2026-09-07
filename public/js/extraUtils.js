export const versionGroupUrls = new Set();
export const versionGroupings = new Map();
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
    let firstVersion = true;
    const versionHeader = document.createElement("h3");
    versionHeader.textContent = "Moves Learnt Per Generation";
    versionHeader.classList.add("version-header");
    move.append(versionHeader);
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
            versionGroupings.set(data.generation.name, new Set().add(data.name));
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
            if(firstVersion){
            versionRadio.checked = true;
            firstVersion = false;

        }

        const versionText = document.createElement("span");
        versionText.textContent = fetchedVer.toUpperCase().replace("-","/");

        versionLabel.append(versionRadio, versionText);
        move.append(versionLabel);
    }
}

export async function displayLevelUpMoves(pokemon,lvlup){
lvlup.innerHTML="";

const getSelectedVersion = document.querySelector('input[name="versionRadio"]:checked').value;
const selectedVersion  = versionGroupings.get(getSelectedVersion);
console.log(selectedVersion);

   const tempSet = new Set();
   const levelUpMoves = [];

    for (const moves of pokemon.moves) {
        for (const verdet of moves.version_group_details) {

            if (selectedVersion.has(verdet.version_group.name) && verdet.move_learn_method.name === "level-up"){
                if(tempSet.has(moves.move.name)){

                }
                else{
                tempSet.add(moves.move.name);
                levelUpMoves.push({move: moves,
                level: verdet.level_learned_at});
                console.log(tempSet);               
                }


            }
        }
    }

    levelUpMoves.sort((a, b) => a.level - b.level);
        const lvlLearnedHeader = document.createElement("h3");
        lvlLearnedHeader.classList.add("header");
        lvlLearnedHeader.textContent = "Moves Learnt by Level";

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
        lvlup.append(lvlLearnedHeader,lvlLearnedHead,moveNameHead,moveTypeHead,moveCategoryHead,movePowerHead,moveAccuracyHead);

    for (const moveData of levelUpMoves) {
        try{
        const response = await fetch(moveData.move.move.url);

        if (!response.ok) {
            throw new Error("FAILED TO FETCH RESOURCE");
        }

        const data = await response.json();
        const lvlLearnedLbl = document.createElement("label");
        lvlLearnedLbl.classList.add("label");
        lvlLearnedLbl.textContent = moveData.level;

        const moveNameLbl = document.createElement("label");
        moveNameLbl.classList.add("label");
        moveNameLbl.textContent = data.name[0].toUpperCase() + data.name.slice(1);

        const moveTypeLbl = document.createElement("label");
        moveTypeLbl.classList.add("pokemon-type");
        moveTypeLbl.classList.add(data.type.name);
        moveTypeLbl.textContent = data.type.name.toUpperCase();

        const moveCategoryIcon = document.createElement("img");
        moveCategoryIcon.classList.add("icon");

        if(data.damage_class.name==="physical"){
        moveCategoryIcon.src = "/public/img/PhysicalIC_HOME.png"
        moveCategoryIcon.alt = "Physical Icon";
        }
        if(data.damage_class.name==="special"){
        moveCategoryIcon.src = "/public/img/SpecialIC_HOME.png"
        moveCategoryIcon.alt = "Special Icon";
        }
        if(data.damage_class.name==="status"){
        moveCategoryIcon.src = "/public/img/StatusIC_HOME.png"
        moveCategoryIcon.alt = "Status Icon";
        }
        

        const movePowerLbl = document.createElement("label");
        movePowerLbl.classList.add("label");
        if(data.power === null){
            movePowerLbl.textContent = "-";
        }
        else{
            movePowerLbl.textContent = data.power;
        }

        const moveAccuracyLbl = document.createElement("label");
        moveAccuracyLbl.classList.add("label");
        if(data.accuracy === null){
            moveAccuracyLbl.textContent = "-";
        }
        else{
            moveAccuracyLbl.textContent = data.accuracy;
        }
        lvlup.append(lvlLearnedLbl,moveNameLbl,moveTypeLbl,moveCategoryIcon,movePowerLbl,moveAccuracyLbl);
    }
        catch(error) {
            console.log(error);
        }
    }   
}
