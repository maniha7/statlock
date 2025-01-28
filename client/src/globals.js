const globals = {
    //ASSETS API
    Deadlock_Assets_API_Address: "https://assets.deadlock-api.com",
    Deadlock_Assets_Heroes_Endpoint: "/v2/heroes",
    Deadlock_Assets_Items_Endpoint: "/v2/items/by-type/upgrade",

    //DATA API
    Deadlock_Data_API_Address: "https://data.deadlock-api.com",
    Deadlock_Data_PatchNotes_Endpoint: "/v1/patch-notes",

    globalColors:{
        greyBackground: "#333333"
    },

    itemColors: {
        vitality:"#55b332",
        spirit:"#b481c5",
        weapon:"#d59739",
        build:"#dad6a4"
    },
    
    itemTypes: {
        weapon:1,
        vitality:2,
        spirit:3
    }
}

export default globals;

