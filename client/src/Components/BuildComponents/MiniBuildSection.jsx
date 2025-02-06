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
import globals from '../../globals';
import ShopItem from './ShopItem';
import { DraggableShopItem } from './DraggableShopItem';

const gColors = globals.globalColors

export default function MiniBuild(props) {

    const build = props.build

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

      function onDragEnd(e){
        const {active, over} = e;
        Array.prototype.swapItems = function(a, b){
            this[a] = this.splice(b, 1, this[a])[0];
            return this;
        }
        if(active.id !== over.id){
            const swapped = build.itemOrder.swapItems(active.id, over.id)
            build.itemOrder = swapped
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
                                <ShopItem item={item} key={index} hover={props.openPopup} unhover={props.closePopup} widthOverride={90} heightOverride={100} transition renderRight/>
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
                    </div>
                    {/* buy order */}
                    {renderBuyOrder()}

                </div>
            </div>
    )
}
