import React, { useEffect, useState, useRef} from 'react';
import globals from '../globals';

export default function ShopItem(props){
    const gColors = globals.globalColors
    const item = props.item
    const isActive = item.activation=="instant_cast" || item.activation=="press"
    const itemTier = item.item_tier
    const itemColorPallet = globals.itemColors[item["item_slot_type"]]
    const bgColor = itemTier==4?itemColorPallet.t4gradient:itemColorPallet.basetw
    

    const itemRef = useRef(null)
    const tagRef = useRef(null)
    const [tagHeight, setTagHeight] = useState(0)

    useEffect(()=>{
        if(tagRef.current){
            setTagHeight(tagRef.current.getBoundingClientRect().height/2)
        }
        
    },[])

    function openPopup(){
        const rect = itemRef.current.getBoundingClientRect()
        const position = {
            x:rect.x-15,
            y:rect.y+rect.height/2
        }
        props.hover(item, position)
    }

    return(
        <div ref={itemRef} onMouseEnter={()=>openPopup()} onMouseLeave={()=>props.unhover()} className="flex select-none my-[6px] mx-[6px] drop-shadow-[0_4px_4px_rgba(0,0,0,0.65)]" onClick={()=>{console.log(item)}}>
            <div className={`flex flex-col items-center items-center max-w-[75px] hover:opacity-80 hover:cursor-pointer ${bgColor}`} style={{borderRadius:8}}>
                {/* Item Image*/}
                <img className="mx-5 my-1 max-w-[45px] min-w-[45px] min-h-[45px] invert" style={{ alignSelf:'center'}} src={item["image"]}/>

                
                
                {/* Item Label*/}
                <div className="px-[2px] pt-2 pb-1 flex flex-1 justify-center min-h-8" style={{backgroundColor:"rgba(255,255,255,.78)", position:'relative', borderBottomRightRadius:8, borderBottomLeftRadius:8, width:'100%',}}>
                    {/* Active Tag */}
                    {isActive &&
                        <div ref={tagRef} className="py-[.5px] px-[8px]" style={{backgroundColor:gColors.itemLabelBlack, borderRadius:3, position:'absolute', top:-tagHeight}}>
                            <div style={{fontWeight:'bold',fontSize:10,color:gColors.offWhite,}}>
                                ACTIVE
                            </div>
                            
                        </div>
                    }
                    <div className="flex self-center" style={{textAlign:'center', maxWidth:95, fontWeight:'bold', fontSize:11.5, lineHeight:1.2}}>
                        {item["name"]}
                    </div>
                </div>
            </div>
        </div> 
    )

}