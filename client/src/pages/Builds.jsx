import React, { useEffect, useState, useRef} from 'react';

import { getItems } from '../Util/ApiUtil';
import globals from '../globals';

const gColors = globals.globalColors

const Builds = () => {

    const [displayedItems, setDisplayedItems] = useState([])
    const [itemListHeight, setItemListHeight] = useState(0)
    const [buildItems, setBuildItems] = useState([])
    const [weaponItems, setWeaponItems] = useState([])
    const [vitalityItems, setVitalityItems] = useState([])
    const [spiritItems, setSpiritItems] = useState([])

    const contentWindowRef = useRef(null)

    useEffect(()=>{
        getAPIData()
        setItemListHeight(contentWindowRef.current.clientHeight)
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

    function renderItemMenu(type){
        return(
            <div className="flex flex-row self-center mb-[10px] my-[10px] px-[5px]" style={{width:'100%'}}>
                    {Object.keys(globals.itemTypes).map((type)=>{
                        return (
                            <div className="flex flex-1 mx-[2px] hover:opacity-80 py-2 justify-center" onClick={()=>changeItemMenu(type)} style={{backgroundColor:globals.itemColors[type], borderRadius:12,}}>
                                <div className="flex" style={{fontWeight:'bold',}}>
                                    {type.toUpperCase()}
                                </div>
                                
                            </div>
                        )
                        })}
                </div> 
    )}

    function renderItemData(){
        return(
            <div className="flex flex-row flex-wrap justify-center overflow-auto" style={{overflowY:'scroll',}}>
                {displayedItems.map((item)=>{
                    return(
                        <div className="flex my-[6px] mx-[6px]" onClick={()=>{console.log(item)}} key={item["id"]}>
                            <div className="flex flex-col items-center items-center max-w-[75px] hover:opacity-80 " style={{borderRadius:8, backgroundColor:globals.itemColors[item["item_slot_type"]]}}>
                                {/* Item Image*/}
                                <img className="mx-5 my-1 max-w-[50px] min-w-[50px] min-h-[50px]" style={{ alignSelf:'center'}} src={item["image"]}/>
                                
                                {/* Item Label*/}
                                <div className="px-1 py-1 flex flex-1 justify-center" style={{backgroundColor:"rgba(255,255,255,.7)", borderBottomRightRadius:8, borderBottomLeftRadius:8, width:'100%',}}>
                                    <div className="flex self-center" style={{textAlign:'center', maxWidth:95, fontWeight:'bold', fontSize:11.5, lineHeight:1.2}}>
                                        {item["name"]}
                                    </div>
                                </div>
                            </div>
                        </div> 
                    )
                })}
            </div>
    )}

    

    function renderItemsSidebar(){
        return(
            <div className="flex flex-col flex-1 max-w-[30%]" style={{borderRadius:8, backgroundColor:gColors.greyBackground,height:itemListHeight}}>

                {/* Item type select (weapon/vit/spirit)*/}
                {renderItemMenu()}

                {/* Item List*/}
                <div className="flex flex-1 px-2 py-2 overflow-auto">
                    
                    {renderItemData()}
                </div>
            </div>
            
        )}

    function renderCurrentBuild(){
        return(
            <div className="flex flex-1 mr-2 py-2 px-4" style={{borderRadius:8, backgroundColor:gColors.greyBackground}}>
                <div className="text-white" style={{fontWeight:'bold'}}>CURRENT BUILD</div>

            </div>
        )}
    
    return(
        <div ref={contentWindowRef} className="flex flex-1 flex-col" style={{width:"100%", }}>

            <div className="flex flex-row flex-1 px-[10px]">
                {/* Current build*/}
                {renderCurrentBuild()}

                {/* Item menu*/}
                {renderItemsSidebar()}
            </div>

            

        </div>
    )
}


export default Builds