import { getHeroes, isValidResponse } from "../Util/ApiUtil";

export async function getHeroMap() {
    const heroes = await getHeroes(); // Fetch the hero array

    // Create a lookup object { hero_id: { name, image } }
    const heroMap = {};
    heroes.forEach(hero => {
        if (!hero.disabled) {
            heroMap[hero.id] = {
                name: hero.name,
                image: hero.images?.icon_image_small_webp || ""
            };
        }
    });

    return heroMap;
}

export async function getMatchMetaData(matchID){
    const apiURL = `https://api.deadlock-api.com/v1/matches/${matchID}/metadata`

    const apiRes = await fetch(apiURL,{
        method:"get",
        headers:{
            "Accept":"application/json"
        }
    })
    const data = await apiRes.json()

    if(!isValidResponse(data)){
        return(undefined)
    }
    return data.match_info

}