import React, { useState, useEffect, useRef } from 'react';
import {DndContext, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors, closestCenter} from '@dnd-kit/core';
import {SortableContext,rectSortingStrategy, sortableKeyboardCoordinates} from '@dnd-kit/sortable';

import { HeroAbility } from './HeroAbility';
import { SortableHeroAbility } from './DraggableHeroAbility';
import globals from '../../globals';

const gColors = globals.globalColors

export function AbilityOrderChooser(props) {

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
            
            props.setBuild(build)
        }
    }


    if(!build.hero || !build.hero.abilities || build.hero.abilities.length==0){return null}
    const list = [0,1,2]
    return(
        <div style={{}}>
            <div className='' style={{borderBottomWidth:1, borderColor:gColors.greyBackground}}>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onBuyOrderDragEnd} >
                    <div className="text-white pl-2 forevs2 text-[20px]" >Unlock Order</div>
                    <div className="flex flex-row flex-wrap mt-2 mb-4 items-start">
                        <SortableContext items={list} strategy={rectSortingStrategy} className="flex flex-row flex-wrap">
                            {list.map((itemIndex)=>{
                                const ability = build.hero.abilities[itemIndex]
                                return(
                                    <div className="flex flex-col justify-center ">
                                        <h3 style={{fontSize:20}} className="text-center text-white forevs2 mb-3">
                                            {itemIndex}
                                        </h3>
                                        <SortableHeroAbility key={itemIndex} id={itemIndex} ability={ability} sortable/>
                                    </div>
                                    
                                )
                            })}
                        </SortableContext >
                        <div className="flex flex-col justify-center opacity-70">
                            <h3 style={{fontSize:20}} className="text-center text-white forevs2 mb-3">
                                4
                            </h3>
                            <HeroAbility ability={build.hero.abilities[3]}/>
                        </div>
                        
                    </div>
                    
                </DndContext>
            </div>
            <div className="mt-2">
                <div className="text-white pl-2 forevs2 text-[20px]" >Upgrade Order</div>
            </div>
        </div>
    )
}