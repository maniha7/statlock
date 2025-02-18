import globals from "../globals.js"

const assetsAPI = globals.Deadlock_Assets_API_Address
const dataAPI = globals.Deadlock_Data_API_Address


function isValidResponse(data) : boolean{
    if(data.detail){
        return false
    }
    return true
}

export async function getHeroes() : Promise<Array<Object>>{
    const apiRes = await fetch(assetsAPI+globals.Deadlock_Assets_Heroes_Endpoint,{
        method:"get",
        headers:{
            "Content-Type":"application/json"
        }
    })
    const data = await apiRes.json()

    if(!isValidResponse(data)){
        return([])
    }

    
    return(data)
}


export async function getItems() : Promise<Object>{

    const apiRes = await fetch(assetsAPI+globals.Deadlock_Assets_Items_Endpoint,{
        method:"get",
        headers:{
            "Content-Type":"application/json"
        }
    })
    const data = await apiRes.json()
    const res = {}

    if(!isValidResponse(data)){
        return(res)
    }
    data.forEach((item)=>{
        res[item.class_name] = {...item}
    })
    return res
}

export async function getHeroAbilities(id : number): Promise<Object>{
    const apiRes = await fetch(assetsAPI+globals.Deadlock_Assets_Hero_Abilities_Endpoint +`/${id}`,{
        method:"get",
        headers:{
            "Content-Type":"application/json"
        }
    })
    const abilityData = await apiRes.json()
    const res = {};
    abilityData.forEach((ability)=>{
        res[ability.class_name] = ability
    })
    
    return res
}

export async function getPatchNotes(): Promise<Object> {
    const apiRes = await fetch(dataAPI + globals.Deadlock_Data_PatchNotes_Endpoint, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });

    const data = await apiRes.json();
    const res = {};

    if (!isValidResponse(data)) {
        return res;
    }

    data.forEach((note, index) => {
        res[index] = { ...note };
    });

    return res;
}

export async function getLeaderboard(region: string, start: number, limit: number = 1000): Promise<Object> {
    const apiUrl = `https://analytics.deadlock-api.com/v2/leaderboard/${region}?start=${start}&limit=${limit}`;
    
    console.log(`Fetching leaderboard for region: ${region}`);

    try {
        const apiRes = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Accept": "application/json",
            }
        });

        if (!apiRes.ok) {
            console.error(`API Error: ${apiRes.status} - ${apiRes.statusText}`);
            return {};
        }

        const data = await apiRes.json();

        if (!data || data.length === 0) {
            console.warn(`No data received for region: ${region}`);
            return {};
        }

        console.log(`Fetched ${data.length} entries for ${region}`);

        const res = {};
        data.forEach((player, index) => {
            res[index] = {
                account_id: player.account_id,
                region_mode: player.region_mode,
                leaderboard_rank: player.leaderboard_rank,
                matches_played: player.matches_played,
                wins: player.wins,
                kills: player.kills,
                deaths: player.deaths,
                assists: player.assists,
                ranked_badge_level: player.ranked_badge_level,
                ranked_rank: player.ranked_rank,
                ranked_subrank: player.ranked_subrank
            };
        });

        return res;
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return {};
    }
}

