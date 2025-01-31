import React, { useEffect, useState, useRef} from 'react';

import globals from '../globals';
import souls from "../assets/souls.png"
import timer from "../assets/time_icon.png"

export default function ItemDescPopup(props, left){

    const item = props.item
    const pos = props.pos
    const itemColorPallet = globals.itemColors[item["item_slot_type"]]
    const hasCooldown = item.properties["AbilityCooldown"]?.value!="0"
    
    const itemIsActive = item.activation=="instant_cast" || item.activation=="press"
    const properties = item.properties
    const gColors = globals.globalColors

    const inheritedDescription = null

    const [xOffset, setXOffset] = useState(0)
    const [yOffset, setYOffset] = useState(0)

    const itemRef = useRef(null)

    useEffect(()=>{
        setXOffset(itemRef.current.clientWidth)
        setCorrectHeight()
    })

    function setCorrectHeight(){
        const baseYOffset = itemRef.current.clientHeight/2
        let res = baseYOffset
        if(pos.y+baseYOffset>window.innerHeight){
            let extraOffset = pos.y+baseYOffset - window.innerHeight + 30
            res+=extraOffset
        }
        setYOffset(res)
    }

    function renderPassiveImportantTooltip(){
        if(item.passiveImportantProperties.length==0){return null}
        return(
            <div className="flex flex-2 flex-row flex-wrap mb-2" style={{width:"100%", }}>
                {item.passiveImportantProperties.map((prop)=>{
                    let propUnits = prop.units
                    return(
                        <div key={prop.propName} className="flex flex-1 flex-col mx-1 mb-1 p-2 items-center justify-center rounded-lg min-w-[28%]" style={{backgroundColor:itemColorPallet.dark}}>
                            <div style={{fontWeight:'bold', fontSize:20, color:gColors.itemText}}>
                                {propUnits.sign + prop.value + propUnits.units}
                            </div>
                            <div className="text-white flex-wrap text-center" style={{fontSize:14}}>
                                {prop.title}
                            </div>
                            
                        </div>
                    )
                })}
            </div>
        )
    }

    function renderPassiveUnimportantTooltip(){
        if(item.passiveUnimportantProperties.length==0){return null}
        return(
            <div className="flex flex-col p-2 rounded-lg mb-2 justify-center" style={{backgroundColor:itemColorPallet.dark, width:"100%"}}>
                {item.passiveUnimportantProperties.map((prop)=>{
                    let propUnits = prop.units
                    return(
                        <div className="flex flex-row" key={prop.propName}>
                            <div className="text-white mr-2" style={{fontWeight:'bold', fontSize:14}}>
                                {propUnits.sign + prop.value + propUnits.units}
                            </div>
                            <div className="text-white flex-wrap " style={{fontSize:14}}>
                                {prop.title}
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    function renderExtraImportantTooltip(){
        if(!item.extraImportantProperties||item.extraImportantProperties.length==0){return null}
        return(
            <div className="flex flex-col p-2 rounded-lg mb-2 justify-center" style={{backgroundColor:itemColorPallet.dark, width:"100%"}}>
                {item.extraImportantProperties.map((prop)=>{
                    let propUnits = prop.units
                    return(
                        <div className="flex flex-row" key={prop.propName}>
                            <div className="text-white mr-2" style={{fontWeight:'bold', fontSize:14}}>
                                {propUnits.sign + prop.value + propUnits.units}
                            </div>
                            <div className="text-white flex-wrap " style={{fontSize:14}}>
                                {prop.title}
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    function renderExtraUnimportantTooltip(){
        if(!item.extraUnimportantProperties||item.extraUnimportantProperties.length==0){return null}
        return(
            <div className="flex flex-col p-2 rounded-lg mb-2 justify-center" style={{backgroundColor:itemColorPallet.dark, width:"100%"}}>
                {item.extraUnimportantProperties.map((prop)=>{
                    let propUnits = prop.units
                    return(
                        <div className="flex flex-row" key={prop.propName}>
                            <div className="text-white mr-2" style={{fontWeight:'bold', fontSize:14}}>
                                {propUnits.sign + prop.value + propUnits.units}
                            </div>
                            <div className="text-white flex-wrap " style={{fontSize:14}}>
                                {prop.title}
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    function renderActiveImportantTooltip(){
        if(item.activeImportantProperties.length==0){return null}
        return(
            <div className="flex flex-2 flex-row flex-wrap mb-2" style={{width:"100%", }}>
                {item.activeImportantProperties.map((prop)=>{
                    let propUnits = prop.units
                    return(
                        <div key={prop.propName} className="flex flex-1 flex-col mx-1 mb-1 p-2 items-center justify-center rounded-lg min-w-[28%]" style={{backgroundColor:itemColorPallet.dark}}>
                            <div style={{fontWeight:'bold', fontSize:20, color:gColors.itemText}}>
                                {propUnits.sign + prop.value + propUnits.units}
                            </div>
                            <div className="text-white flex-wrap text-center" style={{fontSize:14}}>
                                {prop.title}
                            </div>
                            
                        </div>
                    )
                })}
            </div>
        )
    }

    function renderActiveUnimportantTooltip(){
        if(item.activeUnimportantProperties.length==0){return null}
        return(
            <div className="flex flex-col p-2 rounded-lg mb-2 justify-center" style={{backgroundColor:itemColorPallet.dark, width:"100%"}}>
                {item.activeUnimportantProperties.map((prop)=>{
                    let propUnits = prop.units
                    return(
                        <div className="flex flex-row" key={prop.propName}>
                            <div className="text-white mr-2" style={{fontWeight:'bold', fontSize:14}}>
                                {propUnits.sign + prop.value + propUnits.units}
                            </div>
                            <div className="text-white flex-wrap " style={{fontSize:14}}>
                                {prop.title}
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    function renderExtraToolTip(){
        if(!item.upgradesFrom){return null}
        let itemTypeTitle="Passive"
        if(item.upgradesFrom.activation=="instant_cast" || item.upgradesFrom.activation=="press"){
            itemTypeTitle = "Active"
        }
        return(
            <div className='flex flex-col'>
                {/*Extra label bar */}
                <div className="flex flex-row flex-1 pl-2 " style={{backgroundColor:itemColorPallet.dark}}>
                    <div className="flex flex-1 py-1 ml-2 mb-0.5" style={{fontSize:16, color:gColors.itemText, fontStyle:'italic', fontWeight:"bold"}}>
                        {itemTypeTitle}
                    </div>
                </div>

                {/*Extra text description */}
                {
                    (item.extraDescription)&&
                    <div className='px-4 text-white py-2' style={{lineHeight:1.2, fontSize:15,}} dangerouslySetInnerHTML={{__html:item.extraDescription}} />
                }
                

                {/*Extra properties */}
                <div className="flex flex-1 flex-row flex-wrap space-x-2 px-4" style={{width:"100%"}}>
                    {/*"Important" properties */}
                    {renderExtraImportantTooltip()}
                    {/*"Unimportant" properties */}
                    {renderExtraUnimportantTooltip()}
                </div>
            </div>
        )
    }

    function renderInnateTooltip(){
        return(
            <div className="px-2">
                {item.innateProperties.map((property)=>{

                    let propUnits = property.units
                    return(
                        <div key={property.propName} className="flex flex-row">
                            <div className="mb-2 mt-1 mr-1 ml-2" style={{lineHeight:1, fontWeight:'bold', color:gColors.itemText}}>
                                {propUnits.sign + property.value + propUnits.units}
                            </div>
                            <div className="mb-2 mt-1 ml-1" style={{lineHeight:1, color:gColors.offWhite}}>
                                {property.title} 
                            </div>
                        </div>
                        
                    )
                })}
            </div>
        )
    }

    function renderPassiveToolTip(){
        if(item.passiveImportantProperties.length==0 && item.passiveUnimportantProperties.length==0 && !item.passiveCooldown){return null}
        return(
            <div className='flex flex-col'>
                {/*Passive label bar */}
                <div className="flex flex-row flex-1 pl-2 " style={{backgroundColor:itemColorPallet.dark}}>
                    <div className="flex flex-1 py-1 ml-2 mb-0.5" style={{fontSize:16, color:gColors.itemText, fontStyle:'italic', fontWeight:"bold"}}>
                        Passive
                    </div>
                    {item.passiveCooldown&&
                        <div className="flex flex-row flex-0 px-6 text-white items-center justify-center" style={{backgroundColor:"#070d0d", fontWeight:'bold', color:gColors.itemText}}>
                            <img src={timer} className="mr-1.5" style={{height:16, width:'auto'}}/>
                            <div>
                                {item.passiveCooldown+"s"}
                            </div>
                        </div>
                    }
                </div>

                {/*Item text description */}
                {
                    (!itemIsActive || item.description.active)&&
                    <div className='px-4 text-white py-2' style={{lineHeight:1.2, fontSize:15,}} dangerouslySetInnerHTML={{__html:item.description?.passive??item.description?.desc}} />
                }
                

                {/*Passive properties */}
                <div className="flex flex-1 flex-row flex-wrap space-x-2 px-4" style={{width:"100%"}}>
                    {/*"Important" properties */}
                    {renderPassiveImportantTooltip()}
                    {/*"Unimportant" properties */}
                    {renderPassiveUnimportantTooltip()}
                </div>
            </div>
        )
    }

    function renderActiveTooltip(){
        if(item.activeImportantProperties.length==0 && item.activeUnimportantProperties.length==0){ return null}
        return(
            <div className='flex flex-col'>
                {/*Active label bar */}
                <div className="flex flex-row flex-1 pl-2 " style={{backgroundColor:itemColorPallet.dark}}>
                    <div className="flex flex-1 py-1 ml-2 mb-0.5" style={{fontSize:16, color:gColors.itemText, fontWeight:"bold"}}>
                        Active
                    </div>
                    {item.activeCooldown&&
                        <div className="flex flex-row flex-0 px-6 text-white items-center justify-center" style={{backgroundColor:"#070d0d", fontWeight:'bold', color:gColors.itemText}}>
                            <img src={timer} className="mr-1.5" style={{height:16, width:'auto'}}/>
                            <div>
                                {item.activeCooldown+"s"}
                            </div>
                        </div>
                    }
                </div>

                {/*Item text description */}
                {
                    (itemIsActive && !item.description.active)&& 
                    <div className='px-4 text-white py-2' style={{lineHeight:1.2, fontSize:15,}} dangerouslySetInnerHTML={{__html:item.description?.desc}} />
                    
                }
                <div className='px-4 text-white py-2' style={{lineHeight:1.2, fontSize:15,}} dangerouslySetInnerHTML={{__html:item.description?.active}} />

                {/*Active properties */}
                <div className="flex flex-1 flex-row flex-wrap space-x-2 px-4" style={{width:"100%"}}>
                    {/*"Important" properties */}
                    {renderActiveImportantTooltip()}
                    {/*"Unimportant" properties */}
                    {renderActiveUnimportantTooltip()}
                </div>
            </div>
        )
    }

    return(
        item&&
        <div ref={itemRef} onMouseEnter={()=>props.open()} onMouseLeave={()=>props.close()} className="flex flex-col select-none pt-1 min-w-[18%] max-w-[18%] drop-shadow-[0_8px_8px_rgba(0,0,0,0.65)]" style={{position:'absolute', borderRadius:8, backgroundColor:itemColorPallet.medium, top:pos.y-yOffset, left:pos.x-xOffset}}>
            {/*Item name and cost */}
            <div className="flex flex-col px-2 pb-2 ml-0.5 p-2 ml-2">
                <div className="drop-shadow-[0_3px_3px_rgba(0,0,0,0.25)] mb-0.5" style={{fontSize:20, fontWeight:'bold', color:gColors.itemText}}> {item["name"]}</div>
                <div className="flex flex-row items-center">
                    <img className="mr-1" style={{height:18, width:'auto'}} src={souls}/>
                    <div className="mb-0.5" style={{fontSize:16, fontWeight:'bold', color:"#9affd6"}}> {item["cost"]}</div>
                </div>
            </div>

            <div className="py-2 pb-1" style={{backgroundColor:itemColorPallet.mediumDark, borderBottomLeftRadius:8,borderBottomRightRadius:8}}>
                {renderInnateTooltip()}
                {renderPassiveToolTip()}
                {renderActiveTooltip()}
                {renderExtraToolTip()}
            </div>
            
        </div> 
    )

}