import React, {useState} from 'react';

import globals from '../../globals';

const gColors = globals.globalColors

export function HeroPortrait(props) {

    const hero = props.hero

    const [loaded, setLoaded] = useState(false)

    function onClick(){
        if(props.onClick){
            props.onClick(hero)
        }
    }

    return (
        <div key={hero.id} onClick={()=>onClick()} className="flex  mr-2 mb-2 border-2 border-stone-600 bg-stone-700 rounded-md hover:-translate-y-1 hover:scale-105 transition duration-250 ease-in-out" style={{maxWidth:70, cursor:"pointer"}}>
            <div>
                <img hidden={!loaded} onLoad={()=>setLoaded(true)} style={{width:"auto", height:"auto"}} src={hero.images["icon_image_small_webp"]}/>
            </div>
        </div> 
        
    );
}