import React from 'react';

import globals from '../../globals';

const gColors = globals.globalColors

export function HeroAbility(props) {

    const ability = props.ability


    return (
        <div className=' p-3 rounded-full' style={{...props.style, backgroundColor:gColors.abilityBackground}}  onClick={props.onClick}>
            <img className="invert" style={{width:80, height:80, aspectRatio:1}} src={ability.image_webp} draggable={false}/>
        </div>
    );
}