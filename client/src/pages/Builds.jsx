import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ShopItem from '../Components/BuildComponents/ShopItem';
import ItemDescPopup from '../Components/BuildComponents/ItemDescPopup';
import CurrentBuild from '../Components/BuildComponents/CurrentBuildSection';
import MiniBuild from '../Components/BuildComponents/MiniBuildSection';
import BuildStats from '../Components/BuildComponents/BuildStatsSection';
import globals from '../globals';
import dlItems from "../assets/dlItems.json"

import souls from "../assets/souls.png"

const gColors = globals.globalColors

const Builds = () => {
    const initID = uuidv4()
    const baseMiniBuild = {
        categories:{
            weapon:[],
            vitality:[],
            spirit:[],
            flex:[],
        },
        itemOrder:[],
        allItems:{}
    }
    const baseBuild = {
        categories:{
            [initID]:{
                name:"Category 1",
                data:[],
            }
        },
        items:{}
    }

    const [displayedT1s, setDisplayedT1s] = useState([])
    const [displayedT2s, setDisplayedT2s] = useState([])
    const [displayedT3s, setDisplayedT3s] = useState([])
    const [displayedT4s, setDisplayedT4s] = useState([])
    const [itemListHeight, setItemListHeight] = useState(0)

    const [activeItemType, setActiveItemType]=useState("weapon")
    const [weaponItems, setWeaponItems] = useState([])
    const [vitalityItems, setVitalityItems] = useState([])
    const [spiritItems, setSpiritItems] = useState([])

    const [buildType, setBuildType] = useState("mini")
    const [build, setBuild] = useState(baseBuild)
    const [miniBuild, setMiniBuild] = useState(baseMiniBuild)
    const [buildUpdate, setBuildUpdate] = useState(0)
    const [curCategory, setCurCategory] = useState(initID)
    const [buildChartType, setBuildChartType] = useState("DmgVsResistances")

    const [popupOpen, setPopupOpen] = useState(false)
    const [popupItem, setPopupItem] = useState(null)
    const [popupPosition, setPopupPosition] = useState(null)

    const contentWindowRef = useRef(null)
    

    useEffect(()=>{
        getAPIData()
        setItemListHeight(contentWindowRef.current.clientHeight)
    },[])

    useLayoutEffect(() => {
        setItemListHeight(contentWindowRef.current.clientHeight)
      });


    //doesn't actually fetch API data anymore--fetches internal rewritten item objects
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


    //load items of selected type into shop menu, sorted into tier categories, like in game
    function setItemsByTier(items){
        const t1s = []
        const t2s = []
        const t3s = []
        const t4s = []
        items.forEach((item)=>{
            switch(item.cost){
                case 500:
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

    //update current build
    function updateBuild(newBuild){
        setBuild(newBuild)
        setBuildUpdate(buildUpdate+1) //force state update (build object property updates do not trigger react re-render)
    }

    //update current mini build
    function updateMiniBuild(newMiniBuild){
        setMiniBuild(newMiniBuild)
        setBuildUpdate(buildUpdate+1) //force state update (build object property updates do not trigger react re-render)
    }

    function addItemToBuild(item){
        if(buildType=="mini"){
            const category =  item.item_slot_type
            const newMini = {...miniBuild}
            //if item is already in build, don't add it
            if(newMini.allItems[item.id]){return}

            //if item can fit in its own category, put it there
            if (newMini.categories[category].length<4){
                newMini.allItems[item.id]=true
                newMini.categories[category].push(item)
                newMini.itemOrder.push(item)
                
            }

            //if item's own category is full, put it in flex slot if available
            else if(newMini.categories['flex'].length<4){
                newMini.allItems[item.id]=true
                newMini.categories['flex'].push(item)
                newMini.itemOrder.push(item)
            }
            updateMiniBuild(newMini)
        }

        else if(buildType=="full"){
            if(!build.categories[curCategory]){return}
            const newBuild = {...build}
            if(!newBuild.items[item.id]){
                newBuild.items[item.id] = true
                newBuild.categories[curCategory].data.push(item)
            }
            updateBuild(newBuild)
        }
        
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
            <div className="flex flex-row self-center mb-[10px] mb-[10px] px-[5px] flex-wrap gap-x-2 " style={{width:'100%'}}>
                    {[...Object.keys(globals.itemTypes), "search"].map((type)=>{
                        return (
                            <div key={type} 
                            className={` flex flex-1 flex-row mx-[2px] hover:opacity-80 py-2 justify-center hover:cursor-pointer hover:underline space-x-1 justify-center transition duration-300 ease-in-out hover:-translate-y-0.5 hover:scale-110 ${type==activeItemType&&""}`}
                            onClick={()=>changeItemMenu(type)} style={{backgroundColor:globals.itemColors[type].base, borderRadius:12, }}
                            >
     
                                <img className="h-6 object-center" src={globals.itemTypeImgs[type]}/>
                                <div className="flex forevs text-md mt-0.5" style={{fontWeight:'bold',}}>
                                    {type.toUpperCase()}
                                </div>
                                
                            </div>
                        )
                        })}
                </div> 
    )}

    function itemIsInBuild(itemID){
        if(buildType=="mini"){
            return miniBuild.allItems[itemID]
        }
        else if(buildType=="full"){
            return build.items[itemID]
        }
    }

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
                            <ShopItem item={item} key={item.id} hover={openItemPopup} unhover={closeItemPopup} click={addItemToBuild} bought={itemIsInBuild(item.id)}/>
                        )
                    })}
                </div>
            </>
        )
    }

    function renderItemData(){
        return(
            <div className="flex " style={{width:'100%', height:'100%'}}>
                <div className="flex flex-1 flex-col">

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

    
    function renderMainContent(){
        return(
            <div className={`flex flex-col flex-1 mr-2 py-2 px-4 border-b-4 border-l-2 border-r-1  ${gColors.stoneBackgroundGradient}`} style={{borderRadius:8}}>
                {false&&<CurrentBuild build={build} setBuild={updateBuild} openPopup={openItemPopup} closePopup={closeItemPopup} curCategory={curCategory} setCategory={setCurCategory}/>}
                <MiniBuild build={miniBuild} setBuild={updateMiniBuild} openPopup={openItemPopup} closePopup={closeItemPopup}/>              
                <BuildStats build={miniBuild} chartType={buildChartType}/>
                
            </div>
        )
    }
    
    return(
        <div ref={contentWindowRef} className="flex flex-1 flex-col" style={{width:"100%",height:'100%', }}>

            <div className="flex flex-row flex-1 px-[10px] " style={{height:'100%', maxHeight:"100%"}}>
                {/* Current build & build stats*/}
                {renderMainContent()}

                {/* Item menu*/}
                {renderItemsSidebar()}
            </div>

            {popupOpen && (popupPosition.x+popupPosition.y>0)&&<ItemDescPopup item={popupItem} isOpen={popupOpen} pos={popupPosition} />}

        </div>
    )
}


export default Builds