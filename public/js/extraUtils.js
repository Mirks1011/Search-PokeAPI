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

export async function displayLevelUpMoves(pokemon,offset,limit,versions){

    const selectedVersion = document.querySelector('input[name="versionRadio"]:checked').value;
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

    for (const moveData of levelUpMoves) {

        const response = await fetch(moveData.move.move.url);

        if (!response.ok) {
            throw new Error("FAILED TO FETCH RESOURCE");
        }

        const data = await response.json();

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
