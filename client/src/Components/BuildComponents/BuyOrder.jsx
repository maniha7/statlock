import React, { useState, useEffect, useRef } from 'react';
import {DndContext, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors, closestCenter} from '@dnd-kit/core';
import {SortableContext,rectSortingStrategy, sortableKeyboardCoordinates} from '@dnd-kit/sortable';

import { SortableShopItem} from './DraggableShopItem.jsx';
import globals from '../../globals';

const gColors = globals.globalColors

export function BuyOrder(props) {

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


    //handle sorting and reordering of items in buy order
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
                let filters = [upgrade1.id]
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
                if(upgrade1Index!==-1&&dropItemIndex>upgrade1Index){
                    
                    const filtered = []
                    let newDroppedItemIndex = -1
                    build.itemOrder = build.itemOrder.forEach((item)=>{
                        if(!filters.includes(item.id)){
                            filtered.push(item)
                        }
                        if(item.id == draggedItem.id){
                            newDroppedItemIndex = filtered.length-1
                        }
                    })
                    build.itemOrder = filtered
    
                    build.itemOrder.splice(newDroppedItemIndex+1,0,upgrade1)
                    if(upgrade2 && replacingUpgrade2){
                        build.itemOrder.splice(newDroppedItemIndex+2,0,upgrade2)
                    } 
                    
                }
            }
            props.setBuild(build)
        }
    }


    if(!build || build.itemOrder.length==0){return null}
    const list = build.itemOrder.map((_, index)=>{return(index)})
    return(
        <div style={{borderTopWidth:1, borderColor:gColors.greyBackground}}>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onBuyOrderDragEnd} >
                <div className="text-white pl-2 forevs2 text-[18px]" >Buy Order</div>
                <div className="flex flex-row flex-wrap">
                <SortableContext items={list} strategy={rectSortingStrategy} className="flex flex-row flex-wrap">
                    {list.map((itemIndex)=>{
                        const item = build.itemOrder[itemIndex]
                        return(
                            <SortableShopItem key={itemIndex} id={itemIndex} item={item} sortable/>
                        )
                    })}
                </SortableContext >
                </div>
                
            </DndContext>
        </div>
    )
}