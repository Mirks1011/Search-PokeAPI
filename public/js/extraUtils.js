const multipliers ={};
export async function calculateResistance(pokemon){
    try {
    for(const type of pokemon.types){
        //REMEMBER TO USE ANOTHER ASYNC/AWAIT IF ACCESSING URLs
        const response = await fetch(type.type.url);
        if(!response.ok){
            throw new Error("FAILED TO FETCH DATA");
        }

        const data = await response.json();
        //GET THE FREAKING WEAKNESS TURNS OUT NO CALCULATION INVOLVED // I WAS WRONG, I NEED TO CALCULATE THE 2 TYPES

        for (const weak of data.damage_relations.double_damage_from) {
            console.log("WEAKNESS: ");
            console.log(weak);
            multipliers[weak.name] = 2;
        }

        for(const half of data.damage_relations.half_damage_from){
            console.log("HALF: ");
            console.log(half);
            multipliers[half.name] = 0.5;
        }

        for(const res of data.damage_relations.no_damage_from){
            console.log("IMMUNITY: ");
            console.log(res);
            multipliers[res.name] = 0;
        }


        console.log(multipliers);
    }
    } catch (error) {
        console.log(error);
    }

}