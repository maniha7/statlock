import React, { useEffect, useState } from 'react';

import { getHeroes } from '../Util/ApiUtil';


export default function StatsPage(){

    const [heroes, setHeroes] = useState([])

    useEffect(()=>{
        getAPIData()
    },[])

    async function getAPIData(){
        const heroRes = await getHeroes()
        setHeroes(heroRes.filter((h)=>!h.disabled))
    }

    function renderHeroData(){
        return(
            <div className="" style={{display:'flex',flexDirection:'row', flexWrap:'wrap', justifyContent:'center'}}>
            {heroes.map((hero)=>{
                return(
                    <div onClick={()=>{console.log(hero)}} key={hero["id"]} className="border-2 border-stone-600 bg-stone-700 rounded-md" style={{maxWidth:70, marginRight:5}}>
                        <div>
                            <img style={{width:"auto", height:"auto"}} src={hero["images"]["icon_image_small_webp"]}/>
                        </div>
                    </div> 
                )
            })}
            </div>
        )
        
    }
    
    return(
        <div style={{display:'flex',flex:1, width:"100%", flexDirection:'column',}}>
            {renderHeroData()}
        </div>
    )
    
}