import React, { useState, useEffect, useRef } from 'react';
import {DndContext,KeyboardSensor,MouseSensor,TouchSensor,useSensor,useSensors,closestCenter} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    horizontalListSortingStrategy,
    rectSwappingStrategy,
    rectSortingStrategy
  } from '@dnd-kit/sortable';
  import {
    restrictToWindowEdges,
    restrictToFirstScrollableAncestor
  } from '@dnd-kit/modifiers';
  import { TailSpin } from 'react-loader-spinner'
import { getHeroes, getHeroAbilities } from '../../Util/ApiUtil.tsx';
import globals from '../../globals';
import ShopItem from './ShopItem';
import { HeroPortrait } from '../MiscComponents/HeroPortrait.jsx';
import { SortableShopItem, DraggableShopItem, DroppableItemSection } from './DraggableShopItem.jsx';
import { HeroAbility } from './HeroAbility.jsx';
import { getItemByID } from '../../Util/ItemUtil';

const gColors = globals.globalColors

export default function MiniBuild(props) {

    const build = props.build

    const [heroes, setHeroes] = useState([])
    const [heroSelectorOpen, setHeroSelectorOpen] = useState(false)
    const [abilitySelectorOpen, setAbilitySelectorOpen] = useState(false)
    const [imbuingItem, setImbuingItem] = useState(null)
    const [imbueChooserOpen, setImbueChooserOpen] = useState(false)
    const [imbueChangerOpen, setImbueChangerOpen] = useState(false)

    const [buildUpdate, setBuildUpdate] = useState(0)
    
    const openPopup = props.popupHandlers[0]
    const closePopup = props.popupHandlers[1]
    const imbueItem = props.imbueHandler[0]
    const imbueSetter = props.imbueHandler[1]

    useEffect(()=>{
        if(imbueItem){
            setImbueChooserOpen(true)
        }
        else{
            Object.values(build.imbueItems).forEach((item)=>{
                if(!item.imbuedAbility){
                    removeItemFromBuild(item)
                }
            })
        }
    },[props.imbueHandler[0]])

    const sensors = useSensors(
        useSensor(MouseSensor, {
          activationConstraint: {
            distance: 8,
          },
        }),
        useSensor(TouchSensor, {
          activationConstraint: {
            delay: 200,
            tolerance: 6,
          },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
          })
        
      );
    
    /******************** FUNCTIONS ********************/
    useEffect(()=>{
        getAPIData()
    },[])

    async function getAPIData(){
        const heroRes = await getHeroes()
        const filteredHeroes = heroRes.filter((h)=>!h.disabled)
        setHeroes(filteredHeroes)
        build.hero = filteredHeroes[0]
        setHeroBaseAbilities()
    }

    

      async function setHeroBaseAbilities(){
        if(build.hero){
            const mainSlots = ["signature1","signature2","signature3","signature4",]
            const abils = await getHeroAbilities(build.hero.id)
            const abilityNames = mainSlots.map((slotName)=>{return(build.hero.items[slotName])})
            const abilityObjects = abilityNames.map((name)=>{return(abils[name])})
            build.hero.abilities = abilityObjects
            build.hero.melee = abils["weapon_melee"]
            build.hero.weaponPrimary = abils["weapon_primary"]
            build.hero.weaponSecondary = abils["weapon_secondary"]??null
            setBuild(build)
            
        }
        
      }

      function setHero(hero){
        build.hero = hero
        setHeroBaseAbilities()
        setBuild(build)
        setHeroSelectorOpen(false)
      }

      function setBuild(build){
        props.setBuild(build)
        setBuildUpdate(buildUpdate+1)
        //console.log(build)
      }

      function removeItemFromBuild(item){
        props.removeItem(item)
      }

      function onBuyOrderDragEnd(e){
        const {active, over} = e;
        const dragItemIndex = active.id
        const dropItemIndex = over.id
        if(dragItemIndex !== dropItemIndex){
            const draggedItem = build.itemOrder.splice(dragItemIndex,1)[0]
            build.itemOrder.splice(dropItemIndex,0,draggedItem)

            //force appropriate ordering of existing component items
            if(draggedItem.upgradesFrom){
                const component1 = getItemByID(draggedItem.upgradesFrom)
                let component2 = null
                let filters = [component1.id]
                let comp1Index = -1
                build.itemOrder.forEach((item,index)=>{
                    if(item.id===component1.id){comp1Index=index}
                })
                let comp2Index = -1
                let replacingComp2 = false
                if(component1.upgradesFrom){
                    component2 = getItemByID(component1.upgradesFrom)
                    build.itemOrder.forEach((item,index)=>{
                        if(item.id===component2.id){comp2Index=index}
                    })
                    if(dropItemIndex<comp2Index){
                        replacingComp2 = true
                        filters.push(component2.id)
                    }
                }
                //if item was placed before one of its components, reorder them
                if(dropItemIndex<comp1Index){
                    build.itemOrder = build.itemOrder.filter((item)=>!filters.includes(item.id))
                    
                    build.itemOrder.splice(dropItemIndex,0,component1)
                    if(component2 && replacingComp2){
                        build.itemOrder.splice(dropItemIndex,0,component2)
                    }
                    
                }
            }
            if(draggedItem.upgradesTo){
                const upgrade1 = getItemByID(draggedItem.upgradesTo)
                let upgrade2 = null
                let filters = [upgrade1.id, draggedItem.id]
                let upgrade1Index = -1
                build.itemOrder.forEach((item,index)=>{
                    if(item.id===upgrade1.id){upgrade1Index=index}
                })
                let upgrade2Index = -1
                let replacingUpgrade2 = false
                if(upgrade1.upgradesTo){
                    upgrade2 = getItemByID(upgrade1.upgradesTo)
                    build.itemOrder.forEach((item,index)=>{
                        if(item.id===upgrade2.id){upgrade2Index=index}
                    })
                    if(upgrade2Index!==-1&&dropItemIndex>=upgrade2Index){
                        replacingUpgrade2 = true
                        filters.push(upgrade2.id)
                    }
                }
                //if item was placed ahead of its upgrades, reorder them
                if(upgrade1Index!==-1&&dropItemIndex>=upgrade1Index){
                    
                    build.itemOrder = build.itemOrder.filter((item)=>!filters.includes(item.id))
                    
                    
                    if(upgrade2 && replacingUpgrade2){
                        build.itemOrder.splice(dropItemIndex,0,upgrade2)
                    } 
                    build.itemOrder.splice(dropItemIndex,0,draggedItem)
                    build.itemOrder.splice(dropItemIndex,0,upgrade1)
                }
            }
            setBuild(build)
        }
      }

    function imbueAbilityWithItem(ability){
        build.imbueItems[imbueItem.id] = {id:imbueItem.id, imbuedAbility:ability.id}
        setBuild(build)
        imbueSetter(null)
    }

    function swapImbues(event){
        const {active, over} = event
        if(over && active.data.current.item){
            const newAbility = over.id
            const item = active.data.current.item
            build.imbueItems[item.id].imbuedAbility = newAbility
            setBuild(build)

        }
    }


    /******************** RENDERING FUNCTIONS ********************/

    //render all items in a mini build category (weapon / vit / spirit / flex)
    function renderCategory(categoryName){
        const category = build.categories[categoryName]
        const catColor = globals.itemColors[categoryName.toLowerCase()]?.base??"#fff"
        return(
            <div className="flex flex-wrap flex-col p-2 mr-2" key={categoryName} style={{userSelect:"none", borderColor:"#fff", borderRadius:5}}>
                <div className='forevs2' style={{fontSize:18, fontWeight:700, textAlign:'center', color:catColor}}>{categoryName.toUpperCase()}</div>
                <div className="flex grid grid-flow-row grid-cols-2 flex-wrap">
                    {
                        [0,1,2,3].map((index)=>{
                            
                            const item = category[index]??null
                            return(
                                <ShopItem item={item} key={index} hover={openPopup} unhover={closePopup} click={removeItemFromBuild} widthOverride={83} heightOverride={90} transition renderRight removable/>
                            )
                            
                            
                        })
                    }
                </div>               
            </div>
        )
    }

    function renderBuyOrder(){
        if(build.itemOrder.length==0){return null}
        const list = build.itemOrder.map((item, index)=>{return(index)})
        return(
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onBuyOrderDragEnd}>
                <div className="text-white pl-2 pt-2 forevs2 text-[18px]" style={{borderTopWidth:1, borderColor:gColors.greyBackground}}>Buy Order</div>
                <div className="flex flex-row flex-wrap">
                <SortableContext items={list} strategy={rectSortingStrategy} className="flex flex-row flex-wrap">
                    {list.map((id,index)=>{
                        const item = build.itemOrder[index]
                        return(
                            <SortableShopItem key={id} id={id} item={item} sortable/>
                        )
                    })}
                </SortableContext >
                </div>
                
            </DndContext>
            
        )
    }

    function renderCurrentHero(){
        const hero = build.hero
        if(!hero){return null}
        return(
            <div className="flex flex-1 flex-row justify-end ">
                <div className="flex flex-col mr-10 items-center">
                    <div className="text-white select-none" style={{fontSize:20, fontWeight:700}}>ꜱᴇʟᴇᴄᴛ ʜᴇʀᴏ</div>
                    <img className="select-none bg-stone-700 hover:opacity-85" onClick={()=>setHeroSelectorOpen(true)} style={{width:80, aspectRatio:1, borderColor:"#444",borderWidth:1, cursor:'pointer', borderRadius:10,}} src={hero.images["icon_image_small_webp"]}/>
                    <div className="mt-2 text-white forevs2" style={{fontSize:18, fontWeight:700}}>{hero.name}</div>
                    <div onClick={()=>setAbilitySelectorOpen(true)} className="text-white select-none p-2 hover:opacity-80 cursor-pointer" style={{backgroundColor:gColors.greyBackground, fontSize:16, fontWeight:700, borderRadius:5}}>
                        Choose Ability Order
                    </div>
                    <div onClick={()=>setImbueChangerOpen(true)} className="text-white select-none mt-2 p-2 hover:opacity-80 cursor-pointer" style={{backgroundColor:gColors.greyBackground, fontSize:16, fontWeight:700, borderRadius:5}}>
                        Change Item Imbues
                    </div>
                </div>
            </div>
        )
    }

    function renderHeroSelector(){
        return(
            <div onClick={(e)=>{if (e.currentTarget !== e.target){return};setHeroSelectorOpen(false)}} className="flex fixed top-0 left-0 items-center justify-center select-none" style={{width:'100vw', height:"100vh", zIndex:5, backgroundColor:"rgba(0,0,0,0.7)"}}>
                <div className="flex p-3" style={{backgroundColor:gColors.darkGrey, borderRadius:8,  maxWidth:"35%", borderWidth:3}}>
                    <div className="flex flex-row flex-wrap justify-center">
                        {
                        heroes.length==0?
                        <TailSpin
                        visible={true}
                        height="80"
                        width="80"
                        color="#fff"
                        ariaLabel="tail-spin-loading"
                        radius="1"
                        />
                        :
                            heroes.map((hero)=>{
                                return(
                                    <HeroPortrait key={hero.id} hero={hero} onClick={setHero}/>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }

    function renderAbilitySelector(){
        return(
            <div onClick={(e)=>{if (e.currentTarget !== e.target){return};setAbilitySelectorOpen(false)}} className="flex fixed top-0 left-0 items-center justify-center select-none" style={{width:'100vw', height:"100vh", zIndex:5, backgroundColor:"rgba(0,0,0,0.7)"}}>
                <div className="flex p-3" style={{backgroundColor:gColors.darkGrey, borderRadius:8, zIndex:6, maxWidth:"35%", borderWidth:3}}>
                    <div className="flex flex-row flex-wrap justify-center">
                        
                    </div>
                </div>
            </div>
        )
    }

    function renderImbueChooser(){

        return(
            <div onClick={(e)=>{if (e.currentTarget !== e.target){return};imbueSetter(null)}} className="flex fixed top-0 left-0 items-start justify-center select-none" style={{width:'100vw',  height:"100vh", zIndex:5, backgroundColor:"rgba(0,0,0,0.7)"}}>
                <div className="flex flex-col items-center p-3 mt-[100px]" style={{backgroundColor:gColors.darkGrey, borderRadius:8, zIndex:6, maxWidth:"35%", borderWidth:3}}>
                    
                    <div className="text-white mb-4" style={{fontSize:16}}>Choose ability to imbue with <span style={{fontWeight:700, color:globals.itemColors.spirit.base}}>{imbueItem.name}</span></div>
                    
                    <div className="flex flex-row flex-wrap space-x-7 justify-center">
                        {build.hero?.abilities&&
                            build.hero.abilities.map((ability)=>{
                                return(
                                    <div key={ability.id}>
                                        <HeroAbility onClick={()=>props.addItem(imbueItem,ability.id)} ability={ability} clickable/>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div onClick={()=>imbueSetter(null)} className="py-2 px-5 mt-5 text-white hover:opacity-80" style={{backgroundColor:gColors.greyBackground, borderRadius:5, fontWeight:600}}>
                        Cancel
                    </div>
                </div>
            </div>
        )
    }

    function renderImbueChanger(){
        return(
            <div onClick={(e)=>{if (e.currentTarget !== e.target){return};setImbueChangerOpen(false)}} className="flex fixed top-0 left-0 items-start justify-center select-none" style={{width:'100vw',  height:"100vh", zIndex:5, backgroundColor:"rgba(0,0,0,0.7)"}}>
                
                <div className="flex flex-col p-4 pt-0 mt-[100px] items-end" style={{backgroundColor:gColors.darkGrey, borderRadius:8, zIndex:6, maxWidth:"35%", minHeight:0,borderWidth:3}}>
                    <div className="flex text-white text-center self-center py-2" style={{fontSize:20, fontWeight:700}}>Change Item Imbues</div>
                    <DndContext modifiers={[restrictToFirstScrollableAncestor]} sensors={sensors} collisionDetection={closestCenter} onDragEnd={swapImbues}>
                        <div className="flex flex-1 flex-row flex-wrap space-x-3 justify-center " style={{maxHeight:"80vh", overflowY:"auto", overflowX:"hidden"}}>
                            {build.hero?.abilities&&
                                build.hero.abilities.map((ability,index)=>{
                                    return(
                                        <DroppableItemSection modifiers={[restrictToFirstScrollableAncestor]} style={{borderRadius:8,}} key={ability.id} id={ability.id}>
                                            <div className="px-2 py-3 flex-1 " key={ability.id} style={{minHeight:0, borderRadius:5, }}>
                                                
                                                <HeroAbility ability={ability}/>
                                                <div style={{}}>
                                                    {
                                                        Object.values(build.imbueItems).map((item)=>{
                                                            if(item.imbuedAbility!=ability.id){return null}
                                                            return(
                                                                <DraggableShopItem key={item.id} id={item.id} item={build.allItems[item.id]}/>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                
                                            </div>
                                        </DroppableItemSection>
                                    )
                                })
                            }
                        </div>
                    </DndContext>
                    {Object.keys(build.imbueItems).length===0&&
                    <div className="text-white my-2 self-center" style={{fontSize:16, fontWeight:500}}>No Items To Imbue</div>}
                </div>
            </div>
        )
    }

    /******************** MAIN RENDER ********************/
    return(
            <div className='flex flex-col'>
                <div className="flex flex-row items-center" style={{width:"100%"}}>
                    <div className="flex flex-1 text-white mb-2 forevs2 text-2xl mt-1 justify-center" style={{fontWeight:'bold'}}>ʙᴜɪʟᴅ</div>
                </div>
                
                <div className='flex flex-col p-2 ' style={{backgroundColor:gColors.darkGrey, borderRadius:5,}}>
                    <div className="flex flex-1 flex-wrap flex-row items-center pb-3" style={{width:'100%'}}>
                        {
                            //main equipment slots
                            Object.keys(build.categories).map((categoryName)=>{
                                return(
                                    renderCategory(categoryName)
                                )
                                
                            })
                        }
                        {renderCurrentHero()}
                    </div>
                    {/* buy order */}
                    {renderBuyOrder()}

                </div>
                {/* Ability Selector Popup */}
                {abilitySelectorOpen&&
                    renderAbilitySelector()
                }
                {imbueItem&&
                    renderImbueChooser()
                }
                {imbueChangerOpen&&
                    renderImbueChanger()
                }
                {/* Hero Selector Popup */}
                {heroSelectorOpen&&
                    renderHeroSelector()
                }
            </div>
    )
}
