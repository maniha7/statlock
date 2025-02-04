import React, { useEffect, useState, useRef} from 'react';
import globals from '../../globals';
import { getItemByID } from '../../Util/ItemUtil';

export default function ShopItem(props){
    const gColors = globals.globalColors
    const item = props.item
    const isActive = item.activation=="instant_cast" || item.activation=="press"
    const itemTier = item.item_tier
    const itemColorPallet = globals.itemColors[item["item_slot_type"]]
    const bgColor = itemTier==4?itemColorPallet.t4gradient:itemColorPallet.basetw
    const upgradesFrom = item.upgradesFrom?getItemByID(item.upgradesFrom):null
    

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

    function closePopup(){
        
        props.unhover()
    }

    return(
        <div ref={itemRef} onClick={()=>props.click(item)} onMouseEnter={()=>openPopup()} onMouseLeave={()=>closePopup()} className="flex select-none my-[6px] mx-[6px] drop-shadow-[0_4px_4px_rgba(0,0,0,0.65)] "  >
            <div className={`flex flex-col items-center items-center max-w-[90px] hover:opacity-80 hover:cursor-pointer transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110  ${bgColor}`} style={{borderRadius:8}}>
                
                <div style={{position:'relative', padding:0}}>
                    {/* Item Image*/}
                    <img className="mx-5 my-1 max-w-[52px] min-w-[52px] min-h-[52px] invert py-2 px-2" style={{ alignSelf:'center'}} src={item["image"]}/>

                    {/* Item Upgrade Icon*/}
                    {upgradesFrom &&
                    <div className="absolute right-1 rounded-full p-1" style={{bottom:-5, backgroundColor:gColors.itemLabelBackground, zIndex:2}}>
                        <img className="max-w-[22px] min-w-[22px] min-h-[22px] invert " style={{ alignSelf:'center'}} src={upgradesFrom["image"]}/>
                    </div> 
                        
                    }
                    {/* 'Item has been bought' overlay*/}
                    {props.bought&&
                    <div className='absolute flex flex-wrap max-w-[90px] left-[1px] top-0 items-center justify-center' style={{width:'100%', height:'100%', backgroundColor:"rgba(0,0,0,.8)", borderTopLeftRadius:7, borderTopRightRadius:7}}>
                        <div className='text-white' style={{fontWeight:700}}>
                            In Build
                        </div>
                    </div>
                    }
                </div>
                {/* Item Label*/}
                <div className="relative px-[2px] pt-2 pb-1 flex flex-1 justify-center min-h-10 " style={{backgroundColor:gColors.itemLabelBackground, borderBottomRightRadius:8, borderBottomLeftRadius:8, width:'100%',}}>
                    {/* Active Tag */}
                    {isActive &&
                        <div ref={tagRef} className="py-[.5px] px-[8px]" style={{backgroundColor:gColors.itemLabelBlack, borderRadius:3, position:'absolute', top:-tagHeight, zIndex:1}}>
                            <div style={{fontWeight:800,fontSize:10,color:gColors.offWhite,}}>
                                ACTIVE
                            </div>
                            
                        </div>
                    }
                    {/* Imbue Tag */}
                    {
                        item.imbue &&
                        <div ref={tagRef} className="flex py-[.5px] px-[8px]" style={{backgroundColor:itemColorPallet.light, borderRadius:3, position:'absolute', top:-tagHeight}}>
                            <div style={{fontWeight:800,fontSize:10,color:itemColorPallet.dark, textAlign:'center'}}>
                                IMBUE
                            </div>
                            
                        </div>
                    }
                    <div className="flex self-center forevs2" style={{textAlign:'center', fontSize:14.5, maxWidth:95, lineHeight:1.2,}}>
                        {item["name"]}
                    </div>
                </div>
            </div>
        </div> 
    )

}