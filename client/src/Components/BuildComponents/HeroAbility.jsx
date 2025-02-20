import React from 'react';

import globals from '../../globals';

const gColors = globals.globalColors

export function HeroAbility(props) {

    const ability = props.ability
    const maxSize = props.sizeOverride??86

    function onClick(){
        props.onClick(ability)
    }


    return (
        <div className={`flex flex-1 flex-col items-center px-2 ${props.hoverableFull&&"hover:-translate-y-1 hover:scale-110 transition duration-250 ease-in-out"}`}>
            {props.inverted&&
                <div className="text-white flex flex-1 mb-2 flex-wrap text-center self-center items-center justify-center "  style={{width:maxSize+5, fontSize:14, fontWeight:600}}>
                    {ability.name}
                </div>
            }
            
            
            <div className={`flex flex-0 p-3 rounded-full ${props.hoverable&&"hover:-translate-y-1 hover:scale-110 transition duration-250 ease-in-out"}`} style={{...props.style, width:maxSize, height:maxSize, backgroundColor:gColors.abilityBackground, cursor:props.clickable?"pointer":undefined,}}  onClick={()=>onClick()}>
                <img className="invert" style={{aspectRatio:1}} src={ability.image_webp} draggable={false}/>
            </div>
            

            {!props.inverted&&
                <div className="text-white flex flex-1 flex-wrap text-center self-center items-center justify-center"  style={{width:maxSize+5, fontSize:15, fontWeight:600}}>
                    {ability.name}
                </div>
            }
        </div>
        
    );
}