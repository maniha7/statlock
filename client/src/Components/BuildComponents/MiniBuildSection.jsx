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
  import { TailSpin } from 'react-loader-spinner'
import { getHeroes, getHeroAbilities } from '../../Util/ApiUtil.tsx';
import globals from '../../globals';
import ShopItem from './ShopItem';
import { DraggableShopItem } from './DraggableShopItem';
import { HeroAbility } from './HeroAbility.jsx';


const gColors = globals.globalColors

export default function MiniBuild(props) {

    const build = props.build

    const [heroes, setHeroes] = useState([])
    const [heroSelectorOpen, setHeroSelectorOpen] = useState(false)
    const [abilitySelectorOpen, setAbilitySelectorOpen] = useState(false)
    const [imbuingItem, setImbuingItem] = useState(null)
    const [imbueChooserOpen, setImbueChooserOpen] = useState(false)
    const [imbueChangerOpen, setImbueChangerOpen] = useState(false)

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
            console.log(build.hero)
            props.setBuild(build)
        }
        
      }

      function setHero(hero){
        build.hero = hero
        setHeroBaseAbilities()
        props.setBuild(build)
        setHeroSelectorOpen(false)
      }

      function removeItemFromBuild(item){
        Object.keys(build.categories).forEach((cat)=>{
            build.categories[cat] = build.categories[cat].filter((item2)=>item2.id!=item.id)
        })
        build.itemOrder = build.itemOrder.filter((item2)=>item2.id!=item.id)
        delete build.allItems[item.id]
        props.setBuild(build)
      }

      function onDragEnd(e){
        const {active, over} = e;
        
        if(active.id !== over.id){
            
            const swapItem = build.itemOrder.splice(active.id,1)[0]
            build.itemOrder.splice(over.id,0,swapItem)
            props.setBuild(build)
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
                                <ShopItem item={item} key={index} hover={props.openPopup} unhover={props.closePopup} click={removeItemFromBuild} widthOverride={83} heightOverride={90} transition renderRight removable/>
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
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                <div className="text-white pl-2 pt-2 forevs2 text-[18px]" style={{borderTopWidth:1, borderColor:gColors.greyBackground}}>Buy Order</div>
                <div className="flex flex-row flex-wrap">
                <SortableContext items={list} strategy={rectSortingStrategy} className="flex flex-row flex-wrap">
                    {list.map((id,index)=>{
                        const item = build.itemOrder[index]
                        return(
                            <DraggableShopItem key={id} id={id} item={item}/>
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
                    <div className="text-white select-none" style={{fontSize:20, fontWeight:700}}>Select Hero</div>
                    <img className="select-none" onClick={()=>setHeroSelectorOpen(true)} style={{width:80, aspectRatio:1, borderColor:"#444",borderWidth:1, cursor:'pointer', borderRadius:10,}} src={hero.images["icon_image_small_webp"]}/>
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
            <div onClick={(e)=>{if (e.currentTarget !== e.target){return};setHeroSelectorOpen(false)}} className="flex fixed top-0 left-0 items-center justify-center select-none" style={{width:'100vw', height:"100vh", zIndex:5, backgroundColor:"rgba(0,0,0,0.6)"}}>
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
                                    <div onClick={()=>setHero(hero)} className="flex  mr-2 mb-2 border-2 border-stone-600 bg-stone-700 rounded-md" key={hero.id} style={{maxWidth:70, cursor:"pointer"}}>
                                        <div>
                                            <img style={{width:"auto", height:"auto"}} src={hero.images["icon_image_small_webp"]}/>
                                        </div>
                                    </div> 
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
            <div onClick={(e)=>{if (e.currentTarget !== e.target){return};setAbilitySelectorOpen(false)}} className="flex fixed top-0 left-0 items-center justify-center select-none" style={{width:'100vw', height:"100vh", zIndex:5, backgroundColor:"rgba(0,0,0,0.6)"}}>
                <div className="flex p-3" style={{backgroundColor:gColors.darkGrey, borderRadius:8, zIndex:6, maxWidth:"35%", borderWidth:3}}>
                    <div className="flex flex-row flex-wrap justify-center">
                        
                    </div>
                </div>
            </div>
        )
    }

    function renderImbueChooser(){

        return(
            <div onClick={(e)=>{if (e.currentTarget !== e.target){return};setImbueChangerOpen(false)}} className="flex fixed top-0 left-0 items-start justify-center select-none" style={{width:'100vw',  height:"100vh", zIndex:5, backgroundColor:"rgba(0,0,0,0.6)"}}>
                <div className="p-3 mt-[100px]" style={{backgroundColor:gColors.darkGrey, borderRadius:8, zIndex:6, maxWidth:"35%", borderWidth:3}}>
                    <div className="flex  flex-row flex-wrap space-x-7 justify-center">
                        {build.hero?.abilities&&
                            build.hero.abilities.map((ability)=>{
                                return(
                                    <HeroAbility ability={ability}/>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }

    function renderImbueChanger(){
        return(
            <div onClick={(e)=>{if (e.currentTarget !== e.target){return};setImbueChangerOpen(false)}} className="flex fixed top-0 left-0 items-start justify-center select-none" style={{width:'100vw',  height:"100vh", zIndex:5, backgroundColor:"rgba(0,0,0,0.6)"}}>
                <div className="p-3 mt-[100px]" style={{backgroundColor:gColors.darkGrey, borderRadius:8, zIndex:6, maxWidth:"35%", borderWidth:3}}>
                    <div className="flex  flex-row flex-wrap space-x-7 justify-center">
                        {build.hero?.abilities&&
                            build.hero.abilities.map((ability)=>{
                                return(
                                    <HeroAbility ability={ability}/>
                                )
                            })
                        }
                    </div>
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
                {imbueChooserOpen&&
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
