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
export async function getLeaderboard(region: string): Promise<Object> {
    const apiUrl = `https://api.deadlock-api.com/v1/leaderboard/${region}`;
    
    console.log(`Fetching leaderboard for region: ${region}`);

    try {
        const apiRes = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        console.log('API Response Status:', apiRes.status, apiRes.statusText);
        
        if (!apiRes.ok) {
            console.error(`API Error: ${apiRes.status} - ${apiRes.statusText}`);
            return { entries: [] };
        }

        const data = await apiRes.json();
        console.log('Raw API Response:', data);

        if (!data) {
            console.warn('API returned null or undefined data');
            return { entries: [] };
        }

        if (!data.entries || !Array.isArray(data.entries)) {
            console.warn('API response missing entries array:', data);
            return { entries: [] };
        }

        console.log(`Fetched ${data.entries.length} entries for ${region}`);
        
        // Return the raw data
        return data;
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        console.error("Error details:", {
            message: error.message,
            stack: error.stack
        });
        return { entries: [] };
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