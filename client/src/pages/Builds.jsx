import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Shop } from '../Components/BuildComponents/Shop';
import ShopItem from '../Components/BuildComponents/ShopItem';
import ItemDescPopup from '../Components/BuildComponents/ItemDescPopup';
import CurrentBuild from '../Components/BuildComponents/CurrentBuildSection';
import MiniBuild from '../Components/BuildComponents/MiniBuildSection';
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
    const [miniBuild, setMiniBuild] = useState(baseMiniBuild)
    const [buildUpdate, setBuildUpdate] = useState(0)
    const [curCategory, setCurCategory] = useState(initID)
    const [buildChartType, setBuildChartType] = useState("DmgVsResistances")

    const [imbueItem, setImbueItem] = useState(null)

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
    function addItemToBuild(item){
        if(buildType=="mini"){
            const category =  item.item_slot_type
            const newMini = {...miniBuild}
            
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
                }
            }

            function addItemToSlot(){
                //if item can fit in its own category, put it there
                if (newMini.categories[category].length<4) {addToCategory(category)}
                
                //if item's own category is full, put it in flex slot if available
                else if(newMini.categories['flex'].length<4) {addToCategory('flex')}
            }

            function addItemToMetaData(addItem){
                newMini.allItems[addItem.id]=addItem
                newMini.itemOrder.push(addItem)
                if(addItem.imbue){
                    setImbueItem(addItem)
                    newMini.imbueItems[addItem.id] = {id:addItem.id, imbuedAbility:null}
                }
            }


            if(item.upgradesFrom){
                const component1 = getItemByID(item.upgradesFrom)

                //if first level component is in build, replace it with upgrade
                if(newMini.allItems[component1.id]){
                    upgradeItemInBuild(component1,item)
                }
                else{
                    if(component1.upgradesFrom){
                        const component2 = getItemByID(component1.upgradesFrom)
                        //if 2nd level component is in build, replace it with this upgrade
                        if(newMini.allItems[component2.id]){
                            upgradeItemInBuild(component2,item)
                            
                        }
                        //else add 2nd level component to build
                        else{
                            addItemToMetaData(component2)

                            //no components were in build so add main item as usual
                            addItemToSlot()
                        }
                    }
                    //then add first level component
                    addItemToMetaData(component1)
                }
                //then add this item
                addItemToMetaData(item)
            }
            else{ //if not an upgrade item, add as usual
                addItemToMetaData(item)
                addItemToSlot()
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
    //**************END ADD ITEM TO BUILD MEGA FUNCTION ****************/
    //******************************************************************/

    function removeItemFromMini(item){
        const newMini = {...miniBuild}
        if(item.upgradesFrom){
            const componentItem = getItemByID(item.upgradesFrom)
            let resCat = null
            let resInd = null
            Object.keys(newMini.categories).forEach((cat)=>{
                newMini.categories[cat].forEach((slotItem,index)=>{
                    if(slotItem.id===item.id){
                        resCat=cat
                        resInd=index
                    }
                })
            })
            if(resCat!=null&&resInd!=null){
                newMini.categories[resCat][resInd]=componentItem
            }
        }
        else{
            Object.keys(newMini.categories).forEach((cat)=>{
                newMini.categories[cat] = newMini.categories[cat].filter((item2)=>item2.id!=item.id)
            })
        }
        
        newMini.itemOrder = newMini.itemOrder.filter((item2)=>item2.id!=item.id)
        delete newMini.allItems[item.id]
        delete newMini.imbueItems[item.id]
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
    function renderBuildContent(){
        return(
            <div className={`flex flex-col flex-1 mr-2 py-2 px-4 border-b-4 border-l-2 border-r-1 border-stone-600  ${gColors.stoneBackgroundGradient}`} style={{borderRadius:8}}>
                {false&&<CurrentBuild build={build} setBuild={updateBuild} openPopup={openItemPopup} closePopup={closeItemPopup} curCategory={curCategory} setCategory={setCurCategory}/>}
                <MiniBuild build={miniBuild} setBuild={updateMiniBuild} removeItem={removeItemFromMini} popupHandlers={popupHandlers} imbueHandler={imbueState}/>              
                <BuildStats build={miniBuild} chartType={buildChartType}/>
                
            </div>
        )
    }
    
    return(
        <div ref={contentWindowRef} className="flex flex-1 flex-col" style={{width:"100%",height:'100%', }}>

            <div className="flex flex-row flex-1 px-[10px] " style={{height:'100%', maxHeight:"100%"}}>
                {/* Current build & build stats*/}
                {renderBuildContent()}

                {/* Render Shop*/}
                <Shop openItemPopup={openItemPopup} closeItemPopup={closeItemPopup} addItemToBuild={addItemToBuild} removeItemFromBuild={removeItemFromMini} boughtItems={buildType=="mini"?miniBuild.allItems:build.items}/>
            </div>

            {popupOpen && (popupPosition.x+popupPosition.y>0)&&<ItemDescPopup item={popupItem} isOpen={popupOpen} pos={popupPosition} buildType={buildType}/>}

        </div>
    )
}


export default Builds