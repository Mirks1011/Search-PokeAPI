export async function fetchPokemon(name){ 
    const errorContainer = document.getElementById("error-container");
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        errorContainer.innerHTML="";
        if(!response.ok){
            throw new Error("COULD NOT FETCH RESOURCE");
        }

        if(response.status === 404){
        throw new Error("POKEMON NOT FOUND");
        }

        const data = await response.json();
        return data;
    }




