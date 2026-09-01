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

export async function displayMovesPagination(pokemon,offset,limit){
    try{
        for(const moves of pokemon.moves.slice(offset,limit)){
            console.log(moves.version_group_details[0].level_learned_at);
            console.log(moves.version_group_details[0].version_group.name);
            console.log(moves.version_group_details[0].move_learn_method.name);
            const response = await fetch(moves.move.url);
            if(!response.ok){
                throw new Error("FAILED TO FETCH RESOURCE");
            }
            const data = await response.json();
            console.log(data.name);
            console.log(data.power);
            console.log(data.accuracy);
        }
    }
    catch(error){
        console.log(error);
    }
}
