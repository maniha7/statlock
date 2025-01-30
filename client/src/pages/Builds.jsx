import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';

import ShopItem from '../Components/ShopItem';
import ItemDescPopup from '../Components/ItemDescPopup';
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

    const [popupOpen, setPopupOpen] = useState(false)
    const [popupItem, setPopupItem] = useState(null)
    const [popupPosition, setPopupPosition] = useState(null)
    const [popupDirection, setPopupDirection] = useState(0)

    const contentWindowRef = useRef(null)

    useEffect(()=>{
        getAPIData()
        setItemListHeight(contentWindowRef.current.clientHeight)
    },[])

    useLayoutEffect(() => {
        setItemListHeight(contentWindowRef.current.clientHeight)
      });

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

    function openItemPopup(item, position){
        setPopupItem(item)
        setPopupPosition(position)

        setPopupOpen(true)
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

    function renderItemTypeMenu(type){
        return(
            <div className="flex flex-row self-center mb-[10px] my-[10px] px-[5px] flex-wrap gap-x-2" style={{width:'100%'}}>
                    {[...Object.keys(globals.itemTypes), "search"].map((type)=>{
                        return (
                            <div key={type} className="flex flex-1 flex-row mx-[2px] hover:opacity-80 py-2 justify-center hover:cursor-pointer hover:underline space-x-1 justify-center" onClick={()=>changeItemMenu(type)} style={{backgroundColor:globals.itemColors[type].base, borderRadius:12,}}>
                                <img className="h-6 object-center" src={globals.itemTypeImgs[type]}/>
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
                        <ShopItem item={item} key={item["id"]} hover={openItemPopup} unhover={setPopupOpen}/>
                    )
                })}
            </div>
    )}

    

    function renderItemsSidebar(){
        return(
            <div className={`flex flex-col flex-1 max-w-[30%] rounded-full border-b-4`} style={{borderRadius:8, height:itemListHeight}}>
                <div className="rounded-full">

                    {/* Item type select (weapon/vit/spirit)*/}
                    {renderItemTypeMenu()}

                </div>

                {/* Item List*/}
                <div className={`flex flex-1 px-2 py-2 overflow-auto rounded-lg ${gColors.stoneBackgroundGradient}`}>
                    
                    {renderItemData()}
                    
                </div>
                
            </div>
            
        )}

    function renderCurrentBuild(){
        return(
            <div className={`flex flex-1 mr-2 py-2 px-4 border-b-4  ${gColors.stoneBackgroundGradient}`} style={{borderRadius:8}}>
                <div className="text-white" style={{fontWeight:'bold'}}>CURRENT BUILD</div>

            </div>
        )}
    
    return(
        <div ref={contentWindowRef} className="flex flex-1 flex-col" style={{width:"100%",}}>

            <div className="flex flex-row flex-1 px-[10px] ">
                {/* Current build*/}
                {renderCurrentBuild()}

                {/* Item menu*/}
                {renderItemsSidebar()}
            </div>

            {popupOpen && <ItemDescPopup item={popupItem} pos={popupPosition} left={popupDirection!=0} open={()=>setPopupOpen(true)} close={()=>setPopupOpen(false)}/>}

        </div>
    )
}


export default Builds