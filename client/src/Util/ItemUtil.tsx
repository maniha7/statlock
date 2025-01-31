import allItems from "../assets/dlItems.json"

export function getItemByID(id : string) : any{
    
    return allItems[id]
}