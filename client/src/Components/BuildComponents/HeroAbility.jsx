import React from 'react';

import globals from '../../globals';

const gColors = globals.globalColors

export function HeroAbility(props) {

    const ability = props.ability

    function onClick(){
        props.onClick(ability)
    }


    return (
        <div className="flex flex-col items-center px-2">
            <div className={`p-3 rounded-full ${props.clickable&&"hover:-translate-y-1 hover:scale-110 transition duration-250 ease-in-out"}`} style={{...props.style, width:86, height:86, backgroundColor:gColors.abilityBackground, cursor:props.clickable?"pointer":undefined,}}  onClick={()=>onClick()}>
                <img className="invert" style={{aspectRatio:1}} src={ability.image_webp} draggable={false}/>
            </div>
            <div className="text-white flex flex-1 flex-wrap text-center self-center items-center justify-center"  style={{width:90, fontSize:15, fontWeight:600}}>
                {ability.name}
            </div>
        </div>
        
    );
}