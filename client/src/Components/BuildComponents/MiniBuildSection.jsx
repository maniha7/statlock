import React, { useState, useEffect, useRef } from 'react';
import globals from '../../globals';
import ShopItem from './ShopItem';

const gColors = globals.globalColors

export default function MiniBuild(props) {

    const build = props.build
    

    //render all items in a mini build category (weapon / vit / spirit / flex)
    function renderCategory(categoryName){
        const category = build.categories[categoryName]
        return(
            <div className="flex flex-wrap flex-col p-2 mr-2" key={categoryName} style={{userSelect:"none", borderColor:"#fff", borderRadius:5}}>
                <div className='text-white' style={{fontSize:18, fontWeight:700}}>{categoryName.toUpperCase()}</div>
                <div className="flex grid grid-flow-row grid-cols-2 flex-wrap">
                    {
                        [0,1,2,3].map((index)=>{
                            
                            const item = category[index]??null
                            return(
                                <ShopItem item={item} key={index} hover={props.openPopup} unhover={props.closePopup} widthOverride={120} heightOverride={140} transition />
                            )
                            
                            
                        })
                    }
                </div>               
            </div>
        )
    }
    
    return(
            <div className='flex flex-col'>
                <div className="flex flex-row items-center" style={{width:"100%"}}>
                    <div className="flex flex-1 text-white" style={{fontWeight:'bold'}}>BUILD</div>
                </div>
                
                <div className="flex flex-wrap flex-row p-2 space-y-3" style={{backgroundColor:gColors.darkGrey, borderRadius:5, width:'100%'}}>
                    {
                        Object.keys(build.categories).map((categoryName)=>{
                            return(
                                renderCategory(categoryName)
                            )
                            
                        })
                    }
                </div>
            </div>
    )
}
