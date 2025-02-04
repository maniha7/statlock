import React, { useEffect, useState, useRef} from 'react';

import globals from '../globals';
import souls from "../assets/souls.png"
import timer from "../assets/time_icon.png"
import { getItemByID } from '../Util/ItemUtil';

import dpsIcon from "../assets/stat-icons/dps-icon.png"
import regenIcon from "../assets/stat-icons/health-regen-icon.png"
import movespeedIcon from "../assets/stat-icons/movement-speed-icon.png"


export default function ItemDescPopup(props){

    const item = props.item
    const pos = props.pos??{x:0,y:0}
    const upgradesFrom = item.upgradesFrom?getItemByID(item.upgradesFrom):null
    const upgradesTo = item.upgradesTo?getItemByID(item.upgradesTo):null
    const itemIsActive = item.activation=="instant_cast" || item.activation=="press"
    const itemBaseBonus = globals.itemBaseBonuses[item["item_slot_type"]][item.cost]
    const itemBaseBonusType = globals.itemBaseBonusTypes[item["item_slot_type"]]

    const itemColorPallet = globals.itemColors[item["item_slot_type"]]
    const upgradesFromColors = upgradesFrom?globals.itemColors[upgradesFrom["item_slot_type"]]:null
    const upgradesToColors = upgradesTo?globals.itemColors[upgradesTo["item_slot_type"]]:null
    const gColors = globals.globalColors


    const [xOffset, setXOffset] = useState(0)
    const [yOffset, setYOffset] = useState(0)
    const [initted, setInitted] = useState(false)

    const itemRef = useRef(null)

    useEffect(()=>{
        //position popup box relative to its respective shop item
        setXOffset(itemRef.current.clientWidth)
        setCorrectY()
    })


    function setCorrectY(){
        const baseYOffset = itemRef.current.clientHeight/2
        let res = baseYOffset

        //if box extends below bottom of window, move it up
        if(pos.y+baseYOffset>window.innerHeight){ 
            let extraOffset = pos.y+baseYOffset - window.innerHeight + 30
            res+=extraOffset
        }

        //if box extends above top of window, move it down
        if(pos.y-baseYOffset<0){
            console.log(pos.y-baseYOffset)
            let extraOffset = Math.abs(pos.y-baseYOffset) + 30
            res-=extraOffset
        }

        setYOffset(res)
        setInitted(true)
    }

    function renderPropValue(prop){
        const propUnits = prop.units
        const isBad = prop.isBad??false
        return(
            <span>
                <span style={{color:isBad?gColors.itemNegativePropertyRed:gColors.itemUnitsText}}>{propUnits.sign}</span><span style={{color:isBad?gColors.itemNegativePropertyRed:gColors.itemText}}>{prop.value}</span><span style={{color:isBad?gColors.itemNegativePropertyRed:gColors.itemUnitsText}}>{propUnits.units}</span>
            </span>
        )
    }

    /**render a single "important" item property (non-innate prop which gets its own container)**/
    function renderImportantProp(prop){
        let propColor = gColors.offWhite
        let propIcon = null
        if(prop.css_class=="tech_damage"){
            propColor = globals.itemColors.spirit.base
        }
        if(prop.css_class=="bullet_damage"){
            propColor = globals.itemColors.weapon.base
        }
        if(prop.css_class=="healing"){
            propColor = globals.itemColors.vitality.typeText
        }

        return(
            <div key={prop.propName} className="flex flex-1 flex-col mb-1 p-2 items-center justify-center rounded-lg min-w-[28%]" style={{backgroundColor:itemColorPallet.dark}}>
                <div className="flex flex-row">
                    {propIcon &&
                        <img style={{maxWidth:14, aspectRatio:1}} src={propIcon}/>
                    }
                    <div style={{fontWeight:'bold', fontSize:20, color:gColors.itemText}}>
                        {renderPropValue(prop)}
                    </div>
                </div>
                    
                <div className="flex-wrap text-center" style={{fontSize:14, color:propColor, fontWeight:700}}>
                    {prop.title}
                </div>

                
                {/* 'Conditional' / 'Status Effect' Text */}
                {prop.type&&
                    <div style={{fontWeight:600, fontStyle:"italic", color:gColors.itemUnitsText}}>
                        {prop.type}
                    </div>
                }
                
            </div>
        )
    }

    /**render a single "unimportant" item property (grouped into container with other unimportant properties of same class (active, passive, or extra))**/
    function renderUnimportantProp(prop){
        return(
            <div className="flex flex-row" key={prop.propName}>
                <div className="text-white mr-2" style={{fontWeight:'bold', fontSize:14}}>
                    {renderPropValue(prop)}
                </div>
                <div className="flex-wrap " style={{fontSize:14, color:gColors.offWhite}}>
                    {prop.title}
                </div>
            </div>
        )
    }

    /**render tooltip of all important properties of a class (active, passive, or extra)**/
    function renderImportantTooltip(tooltipItems){
        if(!tooltipItems || tooltipItems.length == 0){return null}
        return(
            <div className="flex flex-2 flex-row gap-2 flex-wrap" style={{width:"100%", }}>
                {tooltipItems.map((prop)=>{
                    return(
                        renderImportantProp(prop)
                    )
                })}
            </div>
        )
    }

    /**render tooltip of all unimportant properties of a class (active, passive, or extra)**/
    function renderUnimportantTooltip(tooltipItems){
        if(!tooltipItems || tooltipItems.length == 0){return null}
        return(
            <div className="flex flex-col p-2 rounded-lg mb-2 justify-center " style={{backgroundColor:itemColorPallet.dark, width:"100%"}}>
                {tooltipItems.map((prop)=>{
                    return(
                        renderUnimportantProp(prop)
                    )
                })}
            </div>
        )
    }

    function renderInnateTooltip(){
        return(
            <div className="px-2">
                {item.innateProperties.map((property)=>{
                    const propUnits = property.units
                    const isBad = property.isBad??false
                    return(
                        <div key={property.propName} className="flex flex-row">
                            <div className="mb-2 mt-1 mr-1 ml-2" style={{lineHeight:1, fontWeight:'bold', color:isBad?gColors.itemNegativePropertyRed:gColors.itemText}}>
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
                        <div className="flex flex-row flex-0 px-6 text-white items-center justify-center" style={{backgroundColor:gColors.itemLabelBlack, fontWeight:'bold', color:gColors.itemText}}>
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
                    <div className='px-4 py-2 ' style={{lineHeight:1.2, fontSize:15, color:gColors.offWhite}} dangerouslySetInnerHTML={{__html:item.description?.passive??item.description?.desc}} />
                }
                

                {/*Passive properties */}
                <div className="flex flex-1 flex-row flex-wrap gap-2 px-4" style={{width:"100%"}}>
                    {/*"Important" properties */}
                    {renderImportantTooltip(item.passiveImportantProperties)}
                    {/*"Unimportant" properties */}
                    {renderUnimportantTooltip(item.passiveUnimportantProperties)}
                </div>
            </div>
        )
    }

    function renderActiveTooltip(){
        if(!itemIsActive){ return null}
        return(
            <div className='flex flex-col'>
                {/*Active label bar */}
                <div className="flex flex-row flex-1 pl-2 " style={{backgroundColor:itemColorPallet.dark}}>
                    <div className="flex flex-1 py-1 ml-2 mb-0.5" style={{fontSize:16, color:gColors.itemText, fontWeight:"bold"}}>
                        Active
                    </div>
                    {item.activeCooldown&&
                        <div className="flex flex-row flex-0 px-6 text-white items-center justify-center" style={{backgroundColor:gColors.itemLabelBlack, fontWeight:'bold', color:gColors.itemText}}>
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
                    <div className='px-4 py-2' style={{lineHeight:1.2, fontSize:15, color:gColors.offWhite}} dangerouslySetInnerHTML={{__html:item.description?.desc}} />
                    
                }
                {
                    item.description.active &&
                    <div className='px-4 text-white py-2' style={{lineHeight:1.2, fontSize:15,}} dangerouslySetInnerHTML={{__html:item.description?.active}} />
                }
                

                {/*Active properties */}
                <div className="flex flex-1 flex-row flex-wrap gap-2 px-4" style={{width:"100%"}}>
                    {/*"Important" properties */}
                    {renderImportantTooltip(item.activeImportantProperties)}
                    {/*"Unimportant" properties */}
                    {renderUnimportantTooltip(item.activeUnimportantProperties)}
                </div>
            </div>
        )
    }

    function renderExtraToolTip(){
        if((!item.extraImportantProperties || item.extraImportantProperties.length==0)
            && (!item.extraUnimportantProperties || item.extraUnimportantProperties.length==0) 
            && !item.extraDescription)
            { return null}
        
        return(
            <div className='flex flex-col'>
                {/*Extra label bar */}
                {item.extraTooltipLabel&&<div className="flex flex-row flex-1 pl-2 " style={{backgroundColor:itemColorPallet.dark}}>
                    <div className="flex flex-1 py-1 ml-2 mb-0.5" style={{fontSize:16, color:gColors.itemText, fontStyle:'italic', fontWeight:"bold"}}>
                        {item.extraTooltipLabel}
                    </div>
                    {item.extraTooltipCooldown&&
                        <div className="flex flex-row flex-0 px-6 text-white items-center justify-center" style={{backgroundColor:gColors.itemLabelBlack, fontWeight:'bold', color:gColors.itemText}}>
                            <img src={timer} className="mr-1.5" style={{height:16, width:'auto'}}/>
                            <div>
                                {item.extraTooltipCooldown+"s"}
                            </div>
                        </div>
                    }
                </div>}

                {/*Extra text description */}
                {
                    (item.extraDescription)&&
                    <div className='px-4 py-2' style={{lineHeight:1.2, fontSize:15, color:gColors.offWhite}} dangerouslySetInnerHTML={{__html:item.extraDescription}} />
                }
                

                {/*Extra properties */}
                <div className="flex flex-1 flex-row flex-wrap gap-2 px-4" style={{width:"100%"}}>
                    {/*"Important" properties */}
                    {renderImportantTooltip(item.extraImportantProperties)}
                    {/*"Unimportant" properties */}
                    {renderUnimportantTooltip(item.extraUnimportantProperties)}
                </div>
            </div>
        )
    }

    return(
        item
        &&

        <div ref={itemRef} className="flex flex-col select-none pt-1 min-w-[18%] max-w-[18%] drop-shadow-[0_8px_8px_rgba(0,0,0,0.65)] opacityAppear" 
        style={{position:'absolute', borderRadius:8, backgroundColor:itemColorPallet.medium, top:yOffset==0?0:pos.y-yOffset, left:yOffset==0?0:pos.x-xOffset, opacity:initted?undefined:0}}
        >
            
            <div className="flex flex-row px-4 py-2 width-full" >
                <div className="flex flex-1 flex-col">
                    {/*Item name*/}
                    <div className="drop-shadow-[0_3px_3px_rgba(0,0,0,0.25)] mb-0.5 forevs" style={{fontSize:20, fontWeight:'bold', color:gColors.itemText}}>
                        {item.name}
                    </div>
                    {/*Item cost*/}
                    <div className="flex flex-row items-center"> 
                        <img className="mr-1" style={{height:18, width:'auto'}} src={souls}/>
                        <div className="mb-0.5" style={{fontSize:16, fontWeight:'bold', color:gColors.itemCost}}> {item.cost}</div>
                    </div>
                </div>
                {/*Item base bonus*/}
                <div className="flex flex-col justify-center text-center" style={{fontWeight:700}}>
                    <div style={{backgroundColor:itemColorPallet.mediumDark, borderRadius:5}}>
                        <div className="px-2 py-[2px]" >
                            <span style={{color:gColors.itemUnitsText}}>+</span><span style={{color:gColors.offWhite}}>{itemBaseBonus}</span><span style={{color:gColors.itemUnitsText}}>%</span>
                        </div>
                        <div className="px-2 py-[3px] flex-wrap max-w-[85px]" style={{backgroundColor:itemColorPallet.mediumDarker, fontSize:11, fontWeight:600, color:gColors.itemUnitsText, borderBottomLeftRadius:5, borderBottomRightRadius:5}}>
                            {itemBaseBonusType}
                        </div>
                    </div>
                    
                </div>
            </div>
            

            {/*Component*/}
            {
                upgradesFrom&&
                <div className="flex flex-col px-2 py-1" style={{backgroundColor:itemColorPallet.darkPlus, color:gColors.offWhite, fontSize:12, fontWeight:800}}>
                    COMPONENTS:
                    <div className="flex flex-row rounded-full items-center mt-1" style={{backgroundColor:itemColorPallet.veryDark}}>
                        <div className="p-1 rounded-full" style={{backgroundColor:upgradesFromColors.base}}>
                            <img className="max-w-[28px] min-w-[28px] min-h-[28px] invert " style={{ alignSelf:'center'}} src={upgradesFrom.image}/>
                        </div>
                        <span className="pl-2" style={{fontSize:14, fontWeight:700}}>{upgradesFrom.name}</span>  
                    </div>
                </div>
            }

            <div className="py-2 pb-1 " style={{backgroundColor:itemColorPallet.mediumDark, borderBottomLeftRadius:upgradesTo?0:8,borderBottomRightRadius:upgradesTo?0:8}}>
                {renderInnateTooltip()}
                {renderPassiveToolTip()}
                {renderActiveTooltip()}
                {renderExtraToolTip()}
            </div>

            {/*Is Component Of*/}
            {
                upgradesTo&&
                <div className="flex flex-col px-2 py-1" style={{backgroundColor:itemColorPallet.mediumDarker, color:gColors.offWhite, fontSize:12, fontWeight:800, borderBottomLeftRadius:5,borderBottomRightRadius:5}}>
                    IS COMPONENT OF:
                    <div className="flex flex-row rounded-full items-center mt-1" style={{backgroundColor:itemColorPallet.dark}}>
                        <div className="p-1 rounded-full" style={{backgroundColor:upgradesToColors.base}}>
                            <img className="max-w-[28px] min-w-[28px] min-h-[28px] invert " style={{ alignSelf:'center'}} src={upgradesTo.image}/>
                        </div>
                        <span className="pl-2" style={{fontSize:14, fontWeight:700}}>{upgradesTo.name}</span>  
                    </div>
                </div>
            }
            
        </div> 
    )

}

