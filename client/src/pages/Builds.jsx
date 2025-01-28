import React, { useEffect, useState } from 'react';

import { getItems } from '../Util/ApiUtil';
import globals from '../globals';


const Builds = () => {

    const [displayedItems, setDisplayedItems] = useState([])
    const [buildItems, setBuildItems] = useState([])
    const [weaponItems, setWeaponItems] = useState([])
    const [vitalityItems, setVitalityItems] = useState([])
    const [spiritItems, setSpiritItems] = useState([])

    useEffect(()=>{
        getAPIData()
    },[])

    async function getAPIData(){
        const itemRes = await getItems()

        let weaponItemsRes = []
        let vitItemsRes = []
        let spiritItemsRes = []
        itemRes.forEach((item)=>{
            item.name = item.name.replaceAll("_"," ")
            if(item.disabled){return}
            switch(item["item_slot_type"]){
                case "weapon":
                    weaponItemsRes.push(item)
                    break;
                case "vitality":
                    vitItemsRes.push(item)
                    break;
                default:
                    spiritItemsRes.push(item)
                    break;
            }
        })
        weaponItemsRes.sort(itemSort)
        vitItemsRes.sort(itemSort)
        spiritItemsRes.sort(itemSort)
        setDisplayedItems(weaponItemsRes)
        setWeaponItems(weaponItemsRes)
        setVitalityItems(vitItemsRes)
        setSpiritItems(spiritItemsRes)
    }

    function itemSort(item1,item2){
        //compare by tier
        const tierDif = item1["item_tier"] - item2["item_tier"]
        if(tierDif!=0){
            return tierDif
        }

        //compare by name
        return item1["name"].localeCompare(item2["name"])
    }

    function changeItemMenu(type){
        switch(type){
            case "build":
                setDisplayedItems(buildItems)
                break;
            case "weapon":
                setDisplayedItems(weaponItems)
                break;
            case "vitality":
                setDisplayedItems(vitalityItems)
                break;
            default:
                setDisplayedItems(spiritItems)
                break;
        }
    }

    function renderItemData(){
        return(
                <div className="flex flex-row flex-wrap justify-center" >
                {displayedItems.map((item)=>{
                    return(
                        <div className="flex my-[6px] mx-[6px] hover:mx-[3px]" onClick={()=>{console.log(item)}} key={item["id"]}>
                            <div className="flex flex-col items-center items-center max-w-[95px] hover:max-w-[101px] " style={{borderRadius:8, backgroundColor:globals.itemColors[item["item_slot_type"]]}}>
                                <img className="mx-5 max-w-[70px] min-w-[70px] min-h-[70px]" style={{ alignSelf:'center'}} src={item["image"]}/>
                                <div className="px-1 pb-2 flex flex-1 justify-center" style={{backgroundColor:"rgba(255,255,255,.7)", borderBottomRightRadius:8, borderBottomLeftRadius:8, width:'100%',}}>
                                    <div className="flex self-center" style={{textAlign:'center', maxWidth:95, fontWeight:'bold', fontSize:14, lineHeight:1}}>
                                        {item["name"]}
                                    </div>
                                </div>
                            </div>
                        </div> 
                    )
                })}
                </div>
        )
    }

    function renderItemMenuTab(type){
        return(
            <div className="flex mx-[20px] min-w-[200px] hover:min-w-[210px] hover:mx-[15px] py-2 justify-center" onClick={()=>changeItemMenu(type)} style={{backgroundColor:globals.itemColors[type], borderRadius:12,}}>
                <div className="flex" style={{fontWeight:'bold',}}>
                    {type.toUpperCase()}
                </div>
                
            </div>
        )
    }
    
    return(
        <div className="flex flex-1 flex-col" style={{width:"100%"}}>

            {/* Item type select (weapon/vit/spirit)*/}
            <div className="flex flex-row self-center mb-[10px]">
                {["build", ...Object.keys(globals.itemTypes)].map((type)=>{return renderItemMenuTab(type)})}
            </div>

            {/* Item menu*/}
            {renderItemData()}

        </div>
    )
}


export default Builds