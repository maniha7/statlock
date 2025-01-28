import React, { useEffect, useState } from 'react';

import { getHeroes } from '../Util/ApiUtil';


export default function StatsPage(){

    const [heroes, setHeroes] = useState([])

    useEffect(()=>{
        console.log("DOGFROG")
    },[])

    async function getAPIData(){
        const heroRes = await getHeroes()
        console.log(heroRes)
        setHeroes(heroRes)
    }

    function renderHeroData(){
        return(
            heroes.map((hero)=>{
                return(
                    <div id={hero[""]}>
                    </div>    
                )
            })
        )
        
    }
    
    return(
        <div style={{display:'flex',flex:1, backgroundColor:"#fff", width:"100%", flexDirection:'column'}}>
            <div>Why</div>
            <div>Waht</div>
        </div>
    )
    
}