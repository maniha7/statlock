import React, { useEffect, useState, useRef} from 'react';
import {useDraggable} from '@dnd-kit/core';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import { v4 as uuidv4 } from 'uuid';
import globals from '../../globals';
import { getItemByID } from '../../Util/ItemUtil';

export default function ShopItem(props){
    const gColors = globals.globalColors
    const item = props.item
    const scale = props.widthOverride?
                        props.widthOverride/globals.shopItemMaxWidth
                        :
                        1
                        

    const itemRef = useRef(null)
    const tagRef = useRef(null)
    const [tagHeight, setTagHeight] = useState(0)


    useEffect(()=>{
        if(tagRef.current){
            setTagHeight(tagRef.current.getBoundingClientRect().height/2)
        }
        
    })

    //IF ITEM IS NULL, RENDER ITEM PLACEHOLDER
    if(!item){return(renderBlankItem())}

    const isActive = item.activation=="instant_cast" || item.activation=="press"
    const itemTier = item.item_tier
    const itemColorPallet = globals.itemColors[item["item_slot_type"]]
    const bgColor = itemTier==4?itemColorPallet.t4gradient:itemColorPallet.basetw
    const upgradesFrom = item.upgradesFrom?getItemByID(item.upgradesFrom):null

    function openPopup(){
        if(props.noPopup){return} //for special item displays that don't need a popup
        const popupWidth = parseInt(globals.itemPopupWidth.split("p")[0])
        const rect = itemRef.current.getBoundingClientRect()
        const position = {
            x:rect.x-15,
            y:rect.y+rect.height/2
        }
        if(props.renderRight){
            position.x = rect.x+rect.width+popupWidth+20
        }
        props.hover(item, position)
    }

    function closePopup(){
        if(props.noPopup){return}
        props.unhover()
    }

    function renderBlankItem(){
        return(
            <div className="flex my-[6px] mx-[6px] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6)]" style={{backgroundColor:"#1a1a1a", borderRadius:8, width:props.widthOverride??globals.shopItemMaxWidth, height:props.heightOverride??globals.shopItemMaxWidth}}>

            </div>
        )
        
    }
    if(scale!=1){console.log(scale)}
    return(
        <button>
            <div ref={itemRef} onClick={()=>props.click(item)} onMouseEnter={()=>openPopup()} onMouseLeave={()=>closePopup()} className={`flex select-none my-[6px] mx-[6px] drop-shadow-[0_4px_4px_rgba(0,0,0,0.65)] ${props.transition?`opacityAppear`:``}`}  >
                
                <div className={`flex flex-1 flex-col items-center items-center hover:opacity-80 hover:cursor-pointer transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110  ${bgColor}`} style={{borderRadius:8, maxWidth:props.widthOverride??globals.shopItemMaxWidth, maxHeight:props.heightOverride, width:props.widthOverride, height:props.heightOverride}}>
                    
                    <div style={{position:'relative', padding:0}}>
                        {/* Item Image*/}
                        <img className="mx-5 my-1 invert py-2 px-2 select-none" style={{maxWidth:52*scale, minWidth:52*scale, minHeight:52*scale, alignSelf:'center'}} draggable={false} src={item["image"]}/>

                        {/* Item Upgrade Icon*/}
                        {upgradesFrom && scale==1 &&
                        <div className="absolute right-1 rounded-full p-1" style={{bottom:-5, backgroundColor:gColors.itemLabelBackground, zIndex:2}}>
                            <img className=" invert " style={{maxWidth:22*scale, minWidth:22*scale, minHeight:22*scale, alignSelf:'center'}} src={upgradesFrom["image"]}/>
                        </div> 
                            
                        }
                        {/* 'Item has been bought' overlay*/}
                        {props.bought&&
                        <div className='absolute flex flex-wrap  left-[1px] top-0 items-center justify-center' style={{width:'100%', height:'100%', maxWidth:globals.shopItemMaxWidth*scale, backgroundColor:"rgba(0,0,0,.8)", borderTopLeftRadius:7, borderTopRightRadius:7}}>
                            <div className='text-white' style={{fontWeight:700}}>
                                In Build
                            </div>
                        </div>
                        }
                    </div>
                    {/* Item Label*/}
                    <div className={`relative px-[2px] pt-2 pb-1 flex flex-1 justify-center ${scale==1?"min-h-10":"min-h-0"}`} style={{backgroundColor:gColors.itemLabelBackground, borderBottomRightRadius:8, borderBottomLeftRadius:8, width:'100%',}}>
                        {/* Active Tag */}
                        {isActive && scale==1 &&
                            <div ref={tagRef} className="py-[.5px] px-[8px]" style={{backgroundColor:gColors.itemLabelBlack, borderRadius:3, position:'absolute', top:-tagHeight, zIndex:1}}>
                                <div style={{fontWeight:800,fontSize:10,color:gColors.offWhite,}}>
                                    ACTIVE
                                </div>
                                
                            </div>
                        }
                        {/* Imbue Tag */}
                        {
                            item.imbue && scale ==1 &&
                            <div ref={tagRef} className="flex py-[.5px] px-[8px]" style={{backgroundColor:itemColorPallet.light, borderRadius:3, position:'absolute', top:-tagHeight}}>
                                <div style={{fontWeight:800,fontSize:10,color:itemColorPallet.dark, textAlign:'center'}}>
                                    IMBUE
                                </div>
                                
                            </div>
                        }
                        <div className="flex self-center forevs2" style={{textAlign:'center', fontSize:scale==1?14.5:12, maxWidth:90*scale, lineHeight:1.2,}}>
                            {item["name"]}
                        </div>
                    </div>
                </div>
                {props.removable&&
                    <div className="absolute flex items-center justify-center opacity-0 hover:opacity-100 transition duration-100 ease-in-out" style={{backgroundColor:"rgba(0,0,0,.6)", height:"100%", width:'100%', borderRadius:8}}>
                        <div className='text-white' style={{fontWeight:700}}>Remove</div>
                    </div>
                }
            </div>
        </button>
    )

}