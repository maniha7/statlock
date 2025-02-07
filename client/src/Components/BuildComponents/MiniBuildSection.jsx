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

const gColors = globals.globalColors

export default function MiniBuild(props) {

    const build = props.build

    const [heroes, setHeroes] = useState([])
    const [heroAbilityImgs, setHeroAbilityImgs] = useState([])
    const [heroSelectorOpen, setHeroSelectorOpen] = useState(false)
    const [abilitySelectorOpen, setAbilitySelectorOpen] = useState(false)

    useEffect(()=>{
        getAPIData()
    },[])

    async function getAPIData(){
        const heroRes = await getHeroes()
        const filteredHeroes = heroRes.filter((h)=>!h.disabled)
        setHeroes(filteredHeroes)
        build.hero = filteredHeroes[0]
        props.setBuild(build)
    }

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

      async function setHeroAbilities(){
        if(build.hero){
            const abils = await getHeroAbilities(build.hero.id)
            console.log(abils)
        }
        
      }

      function setHero(hero){
        build.hero = hero
        setHeroAbilities()
        props.setBuild(build)
        setHeroSelectorOpen(false)
        console.log(hero)
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
                <div className="text-white pl-2 forevs2 text-[18px]">Buy Order</div>
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
                    <div className="text-white select-none" style={{fontSize:22, fontWeight:700}}>Select Hero</div>
                    <img onClick={()=>setHeroSelectorOpen(true)} style={{width:140, height:"auto", borderColor:"#444",borderWidth:1, cursor:'pointer', userSelect:'none', borderRadius:500,}} src={hero.images["icon_image_small_webp"]}/>
                    <div className="mt-2 text-white forevs2" style={{fontSize:18, fontWeight:700}}>{hero.name}</div>
                    <div onClick={()=>setAbilitySelectorOpen(true)} className="text-white select-none p-2 hover:opacity-80 cursor-pointer" style={{backgroundColor:gColors.greyBackground, fontSize:16, fontWeight:700, borderRadius:5}}>
                        Choose Ability Order
                    </div>
                </div>
            </div>
        )
    }

    function renderHeroSelector(){
        return(
            <div onClick={(e)=>{if (e.currentTarget !== e.target){return};setHeroSelectorOpen(false)}} className="flex fixed top-0 left-0 items-center justify-center select-none" style={{width:'100vw', height:"100vh", zIndex:5, backgroundColor:"rgba(0,0,0,0.6)"}}>
                <div className="flex p-3" style={{backgroundColor:gColors.darkGrey, borderRadius:8, zIndex:6, maxWidth:"35%", borderWidth:3}}>
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
                                    <div onClick={()=>setHero(hero)} className="mr-2 mb-2 border-2 border-stone-600 bg-stone-700 rounded-md" key={hero.id} style={{maxWidth:70, cursor:"pointer"}}>
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

    
    return(
            <div className='flex flex-col'>
                <div className="flex flex-row items-center" style={{width:"100%"}}>
                    <div className="flex flex-1 text-white mb-2 forevs2 text-2xl mt-1 justify-center" style={{fontWeight:'bold'}}>ʙᴜɪʟᴅ</div>
                </div>
                
                <div className='p-2 ' style={{backgroundColor:gColors.darkGrey, borderRadius:5,}}>
                    <div className="flex flex-wrap flex-row space-y-3" style={{  width:'100%'}}>
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
                {/* Hero Selector Popup */}
                {heroSelectorOpen&&
                    renderHeroSelector()
                }
            </div>
    )
}
