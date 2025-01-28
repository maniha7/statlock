import globals from "../globals.js"

const assetsAPI = globals.Deadlock_Assets_API_Address



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


export async function getItems() : Promise<Array<Object>>{

    const apiRes = await fetch(assetsAPI+globals.Deadlock_Assets_Items_Endpoint,{
        method:"get",
        headers:{
            "Content-Type":"application/json"
        }
    })
    const data = await apiRes.json()

    if(!isValidResponse(data)){
        return([])
    }
    return data
}