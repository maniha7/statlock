import globals from "../globals.js"

const assetsAPI = globals.Deadlock_Assets_API_Address
const dataAPI = globals.Deadlock_Data_API_Address


export function isValidResponse(data) : boolean{
    if(data.detail){
        return false
    }
    return true
}

{/* Heros */}
export async function getHeroes() : Promise<Array<Object>>{
    const apiRes = await fetch('https://assets.deadlock-api.com/v2/heroes',{
        method:"get",
        headers:{
            "Accept":"application/json"
        }
    })
    const data = await apiRes.json()

    if(!isValidResponse(data)){
        return([])
    }

    
    return(data)
}


{/* Shop Items */}
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

{/* Hero Abilities */}
export async function getHeroAbilities(id : number): Promise<Object>{
    const apiRes = await fetch(assetsAPI+globals.Deadlock_Assets_Hero_Abilities_Endpoint +`/${id}`,{
        method:"get",
        headers:{
            "Accept":"application/json"
        }
    })
    const abilityData = await apiRes.json()
    const res = {};
    abilityData.forEach((ability)=>{
        res[ability.class_name] = ability
    })
    
    return res
}

{/* Global Rankings */}
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

{/* Player Match History */}
export async function getMatchHistory(accountId) {
    if (!accountId) {
        console.error("No account ID provided for match history.");
        return [];
    }

    const apiUrl = `https://api.deadlock-api.com/v1/players/${accountId}/match-history`;

    try {
        console.log(`Fetching match history for account ID: ${accountId}`);
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Accept": "application/json",
            }
        });

        if (!response.ok) {
            console.error(`Error fetching match history: ${response.statusText}`);
            return [];
        }

        const data = await response.json();
        console.log("Match History Data:", data);

        if (Array.isArray(data)) {
            return data; 
        } else if (data.matches && Array.isArray(data.matches)) {
            return data.matches; 
        } else {
            console.error("Unexpected data format:", data);
            return [];
        }
    } catch (error) {
        console.error("Failed to fetch match history:", error);
        return [];
    }
}