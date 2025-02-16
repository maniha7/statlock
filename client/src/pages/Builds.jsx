import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Shop } from '../Components/BuildComponents/Shop';
import ShopItem from '../Components/BuildComponents/ShopItem';
import ItemDescPopup from '../Components/BuildComponents/ItemDescPopup';
import CurrentBuild from '../Components/BuildComponents/CurrentBuildSection';
import MiniBuild from '../Components/BuildComponents/MiniBuildSection';
import { BuyOrder } from '../Components/BuildComponents/BuyOrder';
import BuildStats from '../Components/BuildComponents/BuildStatsSection';
import globals from '../globals';
import dlItems from "../assets/dlItems.json"
import { getItemByID } from '../Util/ItemUtil';

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
        allItems:{},
        imbueItems:{},
        hero:null
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

    const [buildType, setBuildType] = useState("mini")
    const [build, setBuild] = useState(baseBuild)
    const [miniBuild, setMiniBuild] = useState({...baseMiniBuild})
    const [buildUpdate, setBuildUpdate] = useState(0)
    const [curCategory, setCurCategory] = useState(initID)
    const [buildChartType, setBuildChartType] = useState("DmgVsResistances")

    const [imbueItem, setImbueItem] = useState(null)

    const [noSlotsErrorOpen, setNoSlotsErrorOpen] = useState(false)

    const [popupOpen, setPopupOpen] = useState(false)
    const [popupItem, setPopupItem] = useState(null)
    const [popupPosition, setPopupPosition] = useState(null)

    const contentWindowRef = useRef(null)


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
    

    //**************************************************************/
    //**************ADD ITEM TO BUILD MEGA FUNCTION ****************/
    function addItemToBuild(item, imbueAbility=null){
        if(buildType=="mini"){
            const category =  item.item_slot_type
            const newMini = {...miniBuild}
            let itemAddedSuccessfully = false
            
            if(newMini.allItems[item.id]){return} //if item is already in build, don't add it

            function addToCategory(categoryName){
                newMini.categories[categoryName].push(item)
            }

            function upgradeItemInBuild(oldItem,newItem){
                let resCat=null
                let resInd=null
                Object.keys(newMini.categories).forEach((cat)=>{
                    newMini.categories[cat].forEach((item,index)=>{
                        if(item.id==oldItem.id){
                            resCat=cat
                            resInd=index
                        }
                    })
                })
                if(resCat!==null&&resInd!==null){   
                    newMini.categories[resCat][resInd] = newItem
                    return true
                }
                return false
            }

            function addItemToSlot(){
                //if item can fit in its own category, put it there
                if (newMini.categories[category].length<4) {addToCategory(category); return true}
                
                //if item's own category is full, put it in flex slot if available
                else if(newMini.categories['flex'].length<4) {addToCategory('flex'); return true}

                return false
            }

            function addItemToMetaData(addItem){
                newMini.allItems[addItem.id]=addItem
                newMini.itemOrder.push(addItem)
                //if item was set to imbue an ability
                if(addItem.imbue){
                    newMini.imbueItems[addItem.id] = {id:addItem.id, imbuedAbility:imbueAbility}
                    setImbueItem(null)
                }
            }

            //handle upgrading from owned component items, if necessary, otherwise add individual item as usual
            if(item.upgradesFrom){
                const component1 = getItemByID(item.upgradesFrom)

                //if first level component is in build, replace it with upgrade
                if(newMini.allItems[component1.id]){
                    itemAddedSuccessfully = upgradeItemInBuild(component1,item)
                }
                
                else{
                    //otherwise check if 2nd level component is in build
                    if(component1.upgradesFrom){
                        const component2 = getItemByID(component1.upgradesFrom)
                        //if 2nd level component is in build, replace it with this upgrade
                        if(newMini.allItems[component2.id]){
                            itemAddedSuccessfully = upgradeItemInBuild(component2,item)
                            
                        }
                        //else add 2nd level component to build
                        else{
                            //no components were in build so add main item as usual
                            itemAddedSuccessfully = addItemToSlot()
                            if(itemAddedSuccessfully){
                                addItemToMetaData(component2)
                            }
                        }
                    }
                    else{
                        itemAddedSuccessfully = addItemToSlot()
                    }
                    //then add first level component
                    if(itemAddedSuccessfully){
                        addItemToMetaData(component1)
                    }
                }
                //then add this item
                if(itemAddedSuccessfully){
                    addItemToMetaData(item)
                }
            }
            else{ //if not an upgrade item, add as usual
                itemAddedSuccessfully = addItemToSlot()
                if(itemAddedSuccessfully){
                    addItemToMetaData(item)
                }
                
                
            }

            updateMiniBuild(newMini)
            //if there was no space for item, render alert text
            if(!itemAddedSuccessfully){
                setNoSlotsErrorOpen(true)
                setTimeout(()=>{setNoSlotsErrorOpen(false)},1500)
            }
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
    //**************END ADD ITEM TO BUILD MEGA FUNCTION ****************/
    //******************************************************************/

    function removeItemFromMini(item){
        const newMini = {...miniBuild}

        function removeMetaData(item){
            newMini.itemOrder = newMini.itemOrder.filter((item2)=>item2.id!=item.id)
            delete newMini.allItems[item.id]
            delete newMini.imbueItems[item.id]
        }


        //when selling an item, also sell its upgrades if you have bought them
        let soldUpgradeCat = null
        let soldUpgradeInd = null
        function removeBoughtUpgrades(item){
            if(item.upgradesTo){
                const upgrade = getItemByID(item.upgradesTo)
                if(newMini.allItems[upgrade.id]){
                    removeMetaData(upgrade)
                    Object.keys(newMini.categories).forEach((cat)=>{
                        newMini.categories[cat].forEach((slotItem,index)=>{
                            if(slotItem.id === upgrade.id){
                                soldUpgradeCat = cat
                                soldUpgradeInd = index
                            }
                        })
                    })
                    
                    if(soldUpgradeInd!=null){
                        newMini.categories[soldUpgradeCat].splice(soldUpgradeInd,1)
                    }
                }
                removeBoughtUpgrades(upgrade)
                
            }
        }

        removeBoughtUpgrades(item)

        //if item is has a component, replace sold item with component in item slot
        if(item.upgradesFrom){
            const componentItem = getItemByID(item.upgradesFrom)
            let replaceCat = null
            let replaceInd = null

            let itemCat = null
            let itemInd = null
            Object.keys(newMini.categories).forEach((cat)=>{
                newMini.categories[cat].forEach((slotItem,index)=>{
                    if(slotItem.id===item.id){
                        itemCat=cat
                        itemInd=index
                    }
                })
            })
            replaceCat = itemCat
            replaceInd = itemInd
            //if we sold an item for which we own both a component and upgrade, the upgrade will have the item slot, so we replace that instead
            if(soldUpgradeInd!=null){
                replaceCat = soldUpgradeCat
                replaceInd = soldUpgradeInd
            }

            if(replaceCat!=null&&replaceInd!=null){
                newMini.categories[replaceCat][replaceInd]=componentItem
            }
        }
        else{
            Object.keys(newMini.categories).forEach((cat)=>{
                newMini.categories[cat] = newMini.categories[cat].filter((item2)=>item2.id!=item.id)
            })
        }
        
        removeMetaData(item)

        updateMiniBuild(newMini)
        closeItemPopup()
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

    const popupHandlers = [openItemPopup, closeItemPopup]
    const imbueState = [imbueItem, setImbueItem]
    const noSlotsHandlers = [noSlotsErrorOpen, setNoSlotsErrorOpen]

    function renderBuildContent(){
        return(
            <div className={`flex flex-col flex-1 mr-2 py-3 px-4 border-b-4 border-l-2 border-r-1 border-stone-600 ml-2  ${gColors.stoneBackgroundGradient}`} style={{borderRadius:8}}>
                {false&&<CurrentBuild build={build} setBuild={updateBuild} openPopup={openItemPopup} closePopup={closeItemPopup} curCategory={curCategory} setCategory={setCurCategory}/>}
                <MiniBuild build={miniBuild} base={baseMiniBuild} setBuild={updateMiniBuild} addItem={addItemToBuild} removeItem={removeItemFromMini} noSlotsHandlers={noSlotsHandlers} popupHandlers={popupHandlers} imbueHandler={imbueState}/>              
                <BuildStats build={miniBuild} updated={buildUpdate} chartType={buildChartType}/>
                <BuyOrder build={miniBuild} setBuild={updateMiniBuild}  />
                
            </div>
        )
    }
    
    return(
        <div ref={contentWindowRef} className="flex flex-1 flex-col" style={{width:"100%",height:'100%', }}>

            <div className="flex flex-row flex-1 px-[10px] " style={{height:'100%', maxHeight:"100%"}}>
                {/* Current build & build stats*/}
                {renderBuildContent()}

                {/* Render Shop*/}
                <Shop popupHandlers={[openItemPopup,closeItemPopup]} buyHandlers={[addItemToBuild, removeItemFromMini]} setImbue={setImbueItem} boughtItems={buildType=="mini"?miniBuild.allItems:build.items}/>
            </div>

            {popupOpen && (popupPosition.x+popupPosition.y>0)&&<ItemDescPopup item={popupItem} isOpen={popupOpen} pos={popupPosition} buildType={buildType}/>}

        </div>
    )
}


export default Builds