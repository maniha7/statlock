import React, { useEffect, useState, useRef} from 'react';
import globals from '../globals';

export default function ShopItem(props){

    const item = props.item
    const itemTier = item.item_tier
    const itemColorPallet = globals.itemColors[item["item_slot_type"]]
    const bgColor = itemTier==4?itemColorPallet.t4gradient:itemColorPallet.basetw
    

    const itemRef = useRef(null)

    function openPopup(){
        const rect = itemRef.current.getBoundingClientRect()
        const position = {
            x:rect.x-15,
            y:rect.y+rect.height/2
        }
        props.hover(item, position)
    }

    return(
        <div ref={itemRef} onMouseEnter={()=>openPopup()} onMouseLeave={()=>props.unhover()} className="flex select-none my-[6px] mx-[6px]" onClick={()=>{console.log(item)}}>
            <div className={`flex flex-col items-center items-center max-w-[75px] hover:opacity-80 hover:cursor-pointer ${bgColor}`} style={{borderRadius:8}}>
                {/* Item Image*/}
                <img className="mx-5 my-1 max-w-[50px] min-w-[50px] min-h-[50px] invert" style={{ alignSelf:'center'}} src={item["image"]}/>
                
                {/* Item Label*/}
                <div className="px-1 py-1 flex flex-1 justify-center" style={{backgroundColor:"rgba(255,255,255,.7)", borderBottomRightRadius:8, borderBottomLeftRadius:8, width:'100%',}}>
                    <div className="flex self-center" style={{textAlign:'center', maxWidth:95, fontWeight:'bold', fontSize:11.5, lineHeight:1.2}}>
                        {item["name"]}
                    </div>
                </div>
            </div>
        </div> 
    )

}