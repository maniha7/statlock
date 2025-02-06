import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import ShopItem from './ShopItem';

export function DraggableShopItem(props) {

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
        <div key={props.id} id={props.id} className='select-none' ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <ShopItem item={item} widthOverride={90} heightOverride={100} noPopup draggable />
        </div>
    );
}