import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import globals from '../../globals';
import ShopItem from './ShopItem';

const gColors = globals.globalColors

export default function CurrentBuild(props) {

    const build = props.build

    function addCategory(){
        const newID = uuidv4()
        build.categories[newID]={
            name:"New Category",
            data:[],
        }
        props.setBuild(build)
        props.setCategory(newID)

    }

    function removeCategory(){
        //get index of removed category
        const catIDs = Object.keys(build.categories)
        let removedIndex = 0
        catIDs.forEach((id, index)=>{
            if(id==props.curCategory){
                removedIndex=index
            }
        })

        const newIndex = Math.max(0,removedIndex-1)


        //remove category items from build
        build.categories[props.curCategory].data.forEach((item)=>{
            delete build.items[item.id]
        })
        //remove category
        delete build.categories[props.curCategory]

        //if no categories remain, set default category
        if(Object.keys(build.categories).length==0){
            const initID = uuidv4()
            build.categories[initID]={
                name:"Category 1",
                data:[],
            }
        }
        const newCurCategory = Object.keys(build.categories)[newIndex]
        props.setBuild(build)
        props.setCategory(newCurCategory)
    }


    //render all items in a build category
    function renderCategory(categoryID){
        const category = build.categories[categoryID]
        return(
            <div onClick={()=>props.setCategory(categoryID)} key={categoryID} className="p-2" style={{width:"100%", borderWidth:categoryID==props.curCategory?3:1, borderColor:"#fff", borderRadius:5}}>
                <div style={{fontSize:16, fontWeight:700, color:"#fff"}}>{category.name}</div>
                <div className="flex flex-row flex-wrap">
                    {category.data.map((item)=>{
                        return(
                            <ShopItem item={item} key={item.id} hover={props.openPopup} unhover={props.closePopup}/>
                        )
                    })}
                </div>
                
                
            </div>
        )
    }
    
    return(
            <div className='flex flex-col'>
                <div className="flex flex-row items-center" style={{width:"100%"}}>
                    <div className="flex flex-1 text-white" style={{fontWeight:'bold'}}>CURRENT BUILD</div>
                    <div className="flex flex-row " style={{alignSelf:'flex-end'}}>
                        <div onClick={()=>addCategory()} className="p-2 mr-1 text-white" style={{backgroundColor:gColors.darkGrey, cursor:"pointer", userSelect:'none', fontSize:14, fontWeight:700, borderTopRightRadius:5, borderTopLeftRadius:5}}>
                            + Category
                        </div>
                        <div onClick={()=>removeCategory()} className="p-2 text-white" style={{backgroundColor:gColors.darkGrey, userSelect:'none', cursor:"pointer", fontSize:14, fontWeight:700, borderTopRightRadius:5, borderTopLeftRadius:5}}>
                            - Category
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col p-2 space-y-3" style={{backgroundColor:gColors.darkGrey, borderRadius:5, borderTopRightRadius:0, width:'100%'}}>
                    {
                        Object.keys(build.categories).map((categoryID)=>{
                            return(
                                renderCategory(categoryID)
                            )
                            
                        })
                    }
                </div>
            </div>
    )
}
