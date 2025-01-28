import React, { useEffect, useState } from 'react';

import { getItems } from '../Util/ApiUtil';



const Builds = () => {

    const [items, setItems] = useState([])

    useEffect(()=>{
        getAPIData()
    },[])

    async function getAPIData(){
        const itemRes = await getItems()
        console.log(itemRes)
        setItems(itemRes)
    }

    function renderItemData(){
        return(
            <div style={{display:'flex',flexDirection:'row', flexWrap:'wrap', justifyContent:'center'}}>
            {items.map((item)=>{
                return(
                    <div onClick={()=>{console.log(item)}} key={item["id"]} style={{maxWidth:70,border:'solid', borderWidth:1, marginRight:5}}>
                        <div>
                            
                        </div>
                    </div> 
                )
            })}
            </div>
        )
        
    }
    
    return(
        <div style={{display:'flex',flex:1, width:"100%", flexDirection:'column',}}>
            {renderItemData()}
        </div>
    )
}


export default Builds