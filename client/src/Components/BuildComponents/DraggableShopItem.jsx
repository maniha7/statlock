import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {useDraggable, useDroppable} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';
import ShopItem from './ShopItem';
import globals from '../../globals';

const gColors = globals.globalColors

//DRAGGABLE, SORTABLE
export function SortableShopItem(props) {

    const item = props.item

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: props.id, animateLayoutChanges: () => false, transition: undefined});
    
    let style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    return (
        <div key={props.id} id={props.id} className='relative select-none' ref={setNodeRef} style={{...style, zIndex:2}} {...attributes} {...listeners}>
            <ShopItem item={item} widthOverride={90} heightOverride={100} noPopup/>
        </div>
    );
}

//DRAGGABLE, UNSORTABLE
export function DraggableShopItem(props) {

    const item = props.item

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useDraggable({id: props.id, data:{item:item}});
    
    let style = {
        transform: CSS.Translate.toString(transform),
        transition
    };

    return (
        <div key={props.id} id={props.id} className='relative select-none' ref={setNodeRef} style={{...style,  zIndex:2}} {...attributes} {...listeners}>
            <ShopItem item={item} widthOverride={90} heightOverride={100} noPopup/>
        </div>
    );
}

//DROP SECTION
export function DroppableItemSection(props) {

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