import React, { useState, useEffect} from 'react';
import {DndContext, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors, closestCenter} from '@dnd-kit/core';
import {sortableKeyboardCoordinates,} from '@dnd-kit/sortable';
import {restrictToWindowEdges, restrictToFirstScrollableAncestor} from '@dnd-kit/modifiers';
import { TailSpin } from 'react-loader-spinner'
import { getHeroes, getHeroAbilities } from '../../Util/ApiUtil.tsx';
import globals from '../../globals';
import ShopItem from './ShopComponents/ShopItem';
import { HeroPortrait } from '../MiscComponents/HeroPortrait.jsx';
import { DraggableShopItem, DroppableItemSection } from './ShopComponents/DraggableShopItem.jsx';
import { HeroAbility } from './HeroAbility.jsx';
import { getItemByID } from '../../Util/ItemUtil';

const gColors = globals.globalColors

export default function MiniBuild(props) {

    const build = props.build
    const shouldRenderError = props.noSlotsHandlers[0]

    const [heroes, setHeroes] = useState([])
    const [heroSelectorOpen, setHeroSelectorOpen] = useState(false)
    const [abilitySelectorOpen, setAbilitySelectorOpen] = useState(false)
    const [imbueChangerOpen, setImbueChangerOpen] = useState(false)
    const [loadingHero, setLoadingHero] = useState(false)
    const [confirmingClear, setConfirmingClear] = useState(false)

    const [buildUpdate, setBuildUpdate] = useState(0)
    
    const openPopup = props.popupHandlers[0]
    const closePopup = props.popupHandlers[1]
    const imbueItem = props.imbueHandler[0]
    const imbueSetter = props.imbueHandler[1]
    

    //handle incoming event from imbued item chooser -- if imbue was not applied to an ability, count the imbue as cancelled and remove item from build
    useEffect(()=>{
            Object.values(build.imbueItems).forEach((item)=>{
                if(!item.imbuedAbility){
                    removeItemFromBuild(item)
                }
            })
        
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
        setHero(filteredHeroes[0])
    }

    function clearBuild(){
        setBuild({...props.base, hero:build.hero})
        setConfirmingClear(false)
    }

    
      async function setHero(hero){
        setLoadingHero(true)
        build.hero = hero
        
        //set hero base abilities
        if(build.hero){
            const mainSlots = ["signature1","signature2","signature3","signature4",]
            const abils = await getHeroAbilities(build.hero.id)
            const abilityNames = mainSlots.map((slotName)=>{return(build.hero.items[slotName])})
            const abilityObjects = abilityNames.map((name)=>{return(abils[name])})
            build.hero.abilities = abilityObjects
            const meleeName=build.hero.items["weapon_melee"]
            build.hero.melee = abils[meleeName]
            const primaryName=build.hero.items["weapon_primary"]
            build.hero.weaponPrimary = abils[primaryName]
            const secondaryName=build.hero.items["weapon_secondary"]??null
            if(secondaryName){
                build.hero.weaponSecondary = abils[secondaryName]
            }
        }
        
        setBuild(build)
        setHeroSelectorOpen(false)
        setLoadingHero(false)
        
      }

      function setBuild(build){
        props.setBuild(build)
        setBuildUpdate(buildUpdate+1)
      }

      function removeItemFromBuild(item){
        props.removeItem(item)
      }

    function imbueAbilityWithItem(ability){
        build.imbueItems[imbueItem.id] = {id:imbueItem.id, imbuedAbility:ability.id}
        setBuild(build)
        imbueSetter(null)
    }

    function swapImbues(event){
        const {active, over} = event
        if(over && active.data.current.item){
            let swapIndex = -1
            build.hero.abilities.forEach((ability,abilityIndex)=>{
                if(ability.id===over.id){
                    swapIndex = abilityIndex
                }
            })

            const item = active.data.current.item
            build.imbueItems[item.id].imbuedAbility = swapIndex
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
                                <ShopItem item={item} key={index} hover={openPopup} unhover={closePopup} click={removeItemFromBuild} widthOverride={83} heightOverride={90} transition renderRight removable hoverable/>
                            )
                            
                            
                        })
                    }
                </div>               
            </div>
        )
    }

    function renderCurrentHero(){
        const hero = build.hero
        if(!hero){return null}
        return(
            <div className="flex flex-1 flex-row justify-end ">
                <div className="flex flex-col mr-10 items-center">
                    <div className="text-stone-200 select-none mb-2 underline" style={{fontSize:20, fontWeight:700}}>ꜱᴇʟᴇᴄᴛ ʜᴇʀᴏ</div>
                    <img 
                    className="select-none bg-stone-700 border-stone-600 hover:opacity-85 border-x-2 border-b-4 border-t-1
                    transition duration-300 ease-in-out hover:-translate-y-0.5 hover:scale-110" 
                    onClick={()=>setHeroSelectorOpen(true)} 
                    style={{width:80, aspectRatio:1, cursor:'pointer', borderRadius:10,}} src={hero.images["icon_image_small_webp"]}
                    />
                    <div className="mt-2 text-stone-100 font-bold forevs2 text-xl" style={{}}>{hero.name}</div>
                    <div onClick={()=>setImbueChangerOpen(true)} 
                    className="text-stone-200 select-none p-2 hover:opacity-80 cursor-pointer border-x-2 border-b-4 border-t-1 border-stone-600 my-1
                    transition duration-300 ease-in-out hover:-translate-y-0.5 hover:scale-105" 
                    style={{backgroundColor:gColors.greyBackground, fontSize:16, fontWeight:700, borderRadius:5}}
                    >
                        Change Item Imbues
                    </div>
                    <div onClick={()=>setAbilitySelectorOpen(true)} 
                    className="text-stone-200 select-none p-2 hover:opacity-80 cursor-pointer border-x-2 border-b-4 border-t-1 border-stone-600 my-1
                    transition duration-300 ease-in-out hover:-translate-y-0.5 hover:scale-105" 
                    style={{backgroundColor:gColors.greyBackground, fontSize:16, fontWeight:700, borderRadius:5}}
                    >
                        Choose Ability Order
                    </div>
                </div>
            </div>
        )
    }

    function renderHeroSelector(){
        return(
            <div onClick={(e)=>{if (e.currentTarget !== e.target){return};setHeroSelectorOpen(false)}} className="flex fixed top-0 left-0 items-center justify-center select-none" style={{width:'100vw', height:"100vh", zIndex:5, backgroundColor:"rgba(0,0,0,0.7)"}}>
                <div className="relative flex flex-col p-3 " style={{backgroundColor:gColors.darkGrey, borderRadius:8,  width:"35%", borderWidth:3}}>
                    
                    {Object.keys(build.imbueItems).length>0&&
                        <div className="text-center py-1" style={{color:gColors.errorRed, fontWeight:600}}>
                            Imbued items will stay imbued on the same ability number when changing heroes
                        </div>
                    }
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

                    {loadingHero&&
                        <div className='absolute flex flex-1 items-center justify-center top-0 left-0 ' style={{width:'100%', height:"100%", backgroundColor:"rgba(0,0,0,0.6)"}}>
                            <TailSpin
                            visible={true}
                            height="80"
                            width="80"
                            color="#fff"
                            ariaLabel="tail-spin-loading"
                            radius="1"
                            />
                        </div>
                    }       
                    
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
                            build.hero.abilities.map((ability, abilityIndex)=>{
                                return(
                                    <div key={ability.id}>
                                        <HeroAbility onClick={()=>{props.addItem(imbueItem,abilityIndex)}} ability={ability} clickable/>
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
                                build.hero.abilities.map((ability,abilityIndex)=>{
                                    return(
                                        <DroppableItemSection modifiers={[restrictToFirstScrollableAncestor]} style={{borderRadius:8,}} key={ability.id} id={ability.id}>
                                            <div className="px-2 py-3 flex-1 " key={ability.id} style={{minHeight:0, borderRadius:5, }}>
                                                
                                                <HeroAbility ability={ability}/>
                                                <div style={{}}>
                                                    {
                                                        Object.values(build.imbueItems).map((item)=>{
                                                            if(item.imbuedAbility!=abilityIndex){return null}
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

    function renderClearBuildConfirmation(){
        return(
            <div onClick={(e)=>{if (e.currentTarget !== e.target){return};setConfirmingClear(false)}} className="flex fixed top-0 left-0 items-start justify-center select-none" style={{width:'100vw',  height:"100vh", zIndex:5, backgroundColor:"rgba(0,0,0,0.7)"}}>
                <div className="flex flex-col p-4 pt-2 pt-0 mt-[100px] items-center" style={{backgroundColor:gColors.darkGrey, borderRadius:8, zIndex:6, maxWidth:"35%", minHeight:0,borderWidth:3}}>
                    <div className="underline" style={{fontSize:22, fontWeight:700, color:gColors.errorRed}}>
                        Clearing Build
                    </div>
                    <div className="mt-2 text-white" style={{fontSize:16}}>
                        Are you sure you want to remove all items and reset this build?
                    </div>
                    <div className="flex flex-row mt-4" style={{width:"100%"}}>
                        <div onClick={()=>setConfirmingClear(false)} className="flex flex-1 p-2 text-white justify-center mr-5 hover:opacity-80 hover:underline" style={{backgroundColor:gColors.greyBackground, borderRadius:5, cursor:'pointer'}}>
                            Cancel
                        </div>
                        <div onClick={()=>clearBuild()} className="flex flex-1 p-2 text-white justify-center hover:opacity-80 hover:underline" style={{backgroundColor:gColors.errorRed, borderRadius:5, cursor:'pointer'}}>
                            Clear
                        </div>
                    </div>
                </div>

            </div>
        )
    }

    /******************** MAIN RENDER ********************/
    return(
            <div className='flex flex-col '>
                <div className="flex flex-row">
                    <div className="flex flex-1">

                    </div>
                    <div 
                    className="p-2 opacity-80 hover:opacity-100 text-stone-200 border-stone-500 border-x-2 border-t-1
                    hover:underline" 
                    onClick={()=>{setConfirmingClear(true)}} style={{backgroundColor:"#590d0d", cursor:'pointer', fontWeight:600, borderTopLeftRadius:5, borderTopRightRadius:5}}
                    >
                        Clear Build
                    </div>
                </div>
                
                <div className='flex flex-col p-2 border-x-2 border-b-4 border-stone-600' style={{backgroundColor:gColors.darkGrey, borderRadius:5, borderTopRightRadius:0}}>
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
                    <div className="text-white pl-2 text-[13px] text-center transition-opacity duration-90 ease-in-out select-none" style={{color:gColors.errorRed, fontWeight:'bold', opacity:shouldRenderError?1:0}}>No Space For Item</div>


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
                {confirmingClear&&
                    renderClearBuildConfirmation()
                }
            </div>
    )
}
