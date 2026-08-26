import Chart from "https://esm.sh/chart.js/auto";

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
