import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {useDraggable, useDroppable} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';
import { HeroAbility } from './HeroAbility';
import globals from '../../globals';



//DRAGGABLE, SORTABLE
export function SortableHeroAbility(props) {

    const ability = props.ability

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({id: props.id, animateLayoutChanges: () => false, transition: undefined});
    
    let style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    return (
        <div key={props.id} id={props.id} className='relative select-none' ref={setNodeRef} style={{...style, zIndex:2}} {...attributes} {...listeners}>
            <HeroAbility ability={ability} onClick={()=>null} hoverableFull/>
        </div>
    )
}

//DROP SECTION
export function DroppableAbilitySection(props) {

    const {
        setNodeRef,
        isOver,
    } = useDroppable({id: props.id});

    return (
        <div key={props.id} id={props.id} style={{...props.style, backgroundColor:gColors.mediumGrey, borderWidth:2, borderColor:isOver?"#b3b3b3":"rgba(0,0,0,0)" }} className={`select-none flex-1 relative transition duration-200 ease-in-out`} ref={setNodeRef}>
            {props.children}
        </div>
    );
}