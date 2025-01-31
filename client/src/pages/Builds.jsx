import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';

import ShopItem from '../Components/ShopItem';
import ItemDescPopup from '../Components/ItemDescPopup';
import { genItems, filterItems } from '../Util/generateItems';
import globals from '../globals';
import dlItems from "../assets/dlItems.json"

import souls from "../assets/souls.png"

const gColors = globals.globalColors

const Builds = () => {

    const [displayedT1s, setDisplayedT1s] = useState([])
    const [displayedT2s, setDisplayedT2s] = useState([])
    const [displayedT3s, setDisplayedT3s] = useState([])
    const [displayedT4s, setDisplayedT4s] = useState([])
    const [itemListHeight, setItemListHeight] = useState(0)
    const [activeItemType, setActiveItemType]=useState("weapon")
    const [buildItems, setBuildItems] = useState([])
    const [weaponItems, setWeaponItems] = useState([])
    const [vitalityItems, setVitalityItems] = useState([])
    const [spiritItems, setSpiritItems] = useState([])

    const [popupOpen, setPopupOpen] = useState(false)
    const [popupItem, setPopupItem] = useState(null)
    const [popupPosition, setPopupPosition] = useState(null)
    const [popupDirection, setPopupDirection] = useState(0)
    const [ires, setres] = useState(null)

    const contentWindowRef = useRef(null)

    useEffect(()=>{
        getAPIData()
        setItemListHeight(contentWindowRef.current.clientHeight)
    },[])

    useLayoutEffect(() => {
        setItemListHeight(contentWindowRef.current.clientHeight)
      });

    async function getAPIData(){
        const itemRes = dlItems

        let weaponItemsRes = []
        let vitItemsRes = []
        let spiritItemsRes = []
        Object.values(itemRes).forEach((item)=>{
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
        setItemsByTier(weaponItemsRes)
        setWeaponItems(weaponItemsRes)
        setVitalityItems(vitItemsRes)
        setSpiritItems(spiritItemsRes)
    }

    function setItemsByTier(items){
        const t1s = []
        const t2s = []
        const t3s = []
        const t4s = []
        items.forEach((item)=>{
            switch(item.cost){
                case 500:
                    console.log('frog')
                    t1s.push(item)
                    break;
                case 1250:
                    t2s.push(item)
                    break;
                case 3000:
                    t3s.push(item)
                    break;
                default:
                    t4s.push(item)
                    break;
            }
        })
        setDisplayedT1s(t1s)
        setDisplayedT2s(t2s)
        setDisplayedT3s(t3s)
        setDisplayedT4s(t4s)
    }

    function itemSort(item1,item2){
        //compare by tier
        const tierDif = item1["item_tier"] - item2["item_tier"]
        if(tierDif!=0){
            return tierDif
        }

        //compare by isActive
        const activeDif = +((item1['activation']=="instant_cast" || item1['activation']=="press") - (item2['activation']=="instant_cast" || item2['activation']=="press"))
        if(activeDif!=0){
            return activeDif
        }

        //compare by name
        return item1["name"].localeCompare(item2["name"])
    }

    function openItemPopup(item, position){
        setPopupItem(item)
        setPopupPosition(position)

        setPopupOpen(true)
    }

    function closeItemPopup(){
        const position = {
            x:0,
            y:0
        }
        setPopupPosition(position)
        setPopupOpen(false)
    }

    function changeItemMenu(type){
        setActiveItemType(type)
        switch(type){
            case "weapon":
                setItemsByTier(weaponItems)
                break;
            case "vitality":
                setItemsByTier(vitalityItems)
                break;
            default:
                setItemsByTier(spiritItems)
                break;
        }
    }

    function renderItemTypeMenu(type){
        return(
            <div className="flex flex-row self-center mb-[10px] my-[10px] px-[5px] flex-wrap gap-x-2 " style={{width:'100%'}}>
                    {[...Object.keys(globals.itemTypes), "search"].map((type)=>{
                        return (
                            <div key={type} 
                            className={`flex flex-1 flex-row mx-[2px] hover:opacity-80 py-2 justify-center hover:cursor-pointer hover:underline space-x-1 justify-center transition duration-300 ease-in-out hover:-translate-y-0.5 hover:scale-110 ${type==activeItemType&&""}`}
                            onClick={()=>changeItemMenu(type)} style={{backgroundColor:globals.itemColors[type].base, borderRadius:12, }}
                            >
     
                                <img className="h-6 object-center" src={globals.itemTypeImgs[type]}/>
                                <div className="flex" style={{fontWeight:'bold',}}>
                                    {type.toUpperCase()}
                                </div>
                                
                            </div>
                        )
                        })}
                </div> 
    )}

    function renderTierData(cost, tierItems){
        return(
            <>  
                <div className="flex flex-row items-center pt-2 ">
                    <img className="ml-1 mr-2 drop-shadow-[0_3px_3px_rgba(0,0,0,0.55)]" style={{height:22, width:'auto'}} src={souls}/>
                    <div className="drop-shadow-[0_3px_3px_rgba(0,0,0,0.55)]" style={{fontSize:22, fontWeight:'bold', color:gColors.itemCost}}>
                        {cost}
                    </div>
                </div>
                
                <div className='flex flex-row flex-wrap'>
                    {tierItems.map((item)=>{
                        return(
                            <ShopItem item={item} key={item["id"]} hover={openItemPopup} unhover={closeItemPopup}/>
                        )
                    })}
                </div>
            </>
        )
    }

    function renderItemData(){
        return(
            <div className="flex " style={{width:'100%', height:'100%'}}>
                <div className="flex flex-1 flex-col ">

                    {/* TIER 1 */}
                    {renderTierData("500", displayedT1s)}

                    {/* TIER 2 */}
                    {renderTierData("1250", displayedT2s)}

                    {/* TIER 3 */}
                    {renderTierData("3000", displayedT3s)}

                    {/* TIER 4 */}
                    {renderTierData("6000+", displayedT4s)}

                    {/* spacer */}
                    <div><div style={{height:15}}></div></div>

                </div>
            </div>
    )}

    

    function renderItemsSidebar(){
        return(
            <div className={`flex flex-col flex-1 max-w-[30%] rounded-full`} style={{borderRadius:8}}>
                <div className="rounded-full ">

                    {/* Item type select (weapon/vit/spirit)*/}
                    {renderItemTypeMenu()}

                </div>

                {/* Item List*/}
                <div className={`flex flex-1 px-2 overflow-auto rounded-lg border-l-2 border-r-1 border-b-4  ${gColors.stoneBackgroundGradient}`}>
                    
                    {renderItemData()}
                    
                </div>
                
            </div>
            
        )}

    function renderCurrentBuild(){
        return(
            <div className={`flex flex-col flex-1 mr-2 py-2 px-4 border-b-4 border-l-2 border-r-1  ${gColors.stoneBackgroundGradient}`} style={{borderRadius:8}}>
                <div className="text-white" style={{fontWeight:'bold'}}>CURRENT BUILD</div>

                <div className='flex flex-row'>
                    <div className='flex ' onClick={()=>{filterItems(setres)}} style={{backgroundColor:"#fff",display:'block'}}>manually generates a file, dont click it again</div>
                </div>
                <div>
                    {ires}
                </div>
                

            </div>
        )}
    
    return(
        <div ref={contentWindowRef} className="flex flex-1 flex-col" style={{width:"100%",height:'100%', minHeight:400}}>

            <div className="flex flex-row flex-1 px-[10px] " style={{height:'100%', maxHeight:"100%"}}>
                {/* Current build*/}
                {renderCurrentBuild()}

                {/* Item menu*/}
                {renderItemsSidebar()}
            </div>

            {popupOpen && (popupPosition.x+popupPosition.y>0)&&<ItemDescPopup item={popupItem} isOpen={popupOpen} pos={popupPosition} />}

        </div> /*Big Chungus Word puzzle eats lebron james hairline guy */
    )
}


export default Builds