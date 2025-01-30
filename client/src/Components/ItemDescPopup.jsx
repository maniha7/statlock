import React, { useEffect, useState, useRef} from 'react';
import globals from '../globals';
import souls from "../assets/souls.png"
import timer from "../assets/time_icon.png"

export default function ItemDescPopup(props, left){

    const item = props.item
    const pos = props.pos
    const itemColorPallet = globals.itemColors[item["item_slot_type"]]
    const properties = item.properties
    const gColors = globals.globalColors

    const innateItemProps = Object.keys(properties).filter((property)=>
        properties[property].provided_property_type 
        && properties[property].value!="0"
        && properties[property].tooltip_section!="passive"
        && properties[property].tooltip_section!="active"
        && (!globals.innateHiddenProperties.has(property) || properties[property].tooltip_section=="innate")
    )

    const hasCooldown = item.properties["AbilityCooldown"]?.value!="0"

    const passiveItemProps = Object.keys(properties).filter((property)=>
        properties[property].tooltip_section=="passive"
        && properties[property].value!="0"
        && properties[property].tooltip_section!="innate"
        && properties[property].tooltip_section!="active"
        && !globals.passiveHiddenProperties.has(property) 
    )
    const passiveImportantProps = passiveItemProps.filter((p)=>properties[p].tooltip_is_important)
    const passiveUnimportantProps = passiveItemProps.filter((p)=>!properties[p].tooltip_is_important)

    const [xOffset, setXOffset] = useState(0)
    const [yOffset, setYOffset] = useState(0)

    const itemRef = useRef(null)

    useEffect(()=>{
        setXOffset(itemRef.current.clientWidth)
        setYOffset(itemRef.current.clientHeight/2)
    })

    function renderImportantTooltip(){
        return(
            null
        )
    }

    function renderUnimportantTooltip(){
        return(
            null
        )
    }

    function renderInnateTooltip(){
        return(
            <div className="px-2">
                {innateItemProps.map((propertyName)=>{

                    let property = properties[propertyName]
                    let propUnits = globals.itemIDtoUnitMap[propertyName]
                    if(!propUnits){propUnits={sign:"",units:""};//return false
                    }
                    return(
                        <div key={propertyName} className="flex flex-row">
                            <div className="mb-2 mt-1 mr-1 ml-2" style={{lineHeight:1, fontWeight:'bold', color:gColors.itemText}}>
                                {(!["+","-"].includes(property.value.substring(0,1))?propUnits.sign:"") + property.value + propUnits.units}
                            </div>
                            <div className="mb-2 mt-1 ml-1" style={{lineHeight:1, color:gColors.offWhite}}>
                                {globals.itemIDtoNameMap[propertyName]?globals.itemIDtoNameMap[propertyName]:propertyName}
                            </div>
                        </div>
                        
                    )
                })}
            </div>
        )
    }

    function renderPassiveToolTip(){
        if(passiveItemProps.length==0 && !hasCooldown){return null}
        return(
            <div className='flex flex-col'>
                {/*Passive cooldown bar */}
                <div className="flex flex-row flex-1 pl-2 " style={{backgroundColor:itemColorPallet.dark}}>
                    <div className="flex flex-1 py-1 ml-2 mb-0.5" style={{fontSize:16, color:gColors.itemText, fontStyle:'italic', fontWeight:"bold"}}>Passive</div>
                    {item.properties["AbilityCooldown"]?.value!=0&&
                        <div className="flex flex-row flex-0 px-6 text-white items-center justify-center" style={{backgroundColor:"#070d0d", fontWeight:'bold', color:gColors.itemText}}>
                            <img src={timer} className="mr-1.5" style={{height:16, width:'auto'}}/>
                            <div>
                                {item.properties["AbilityCooldown"].value+"s"}
                            </div>
                            
                        </div>
                    }
                </div>
                {/*Passive description */}
                <div className='px-4 text-white py-2' style={{lineHeight:1.2, fontSize:15,}} dangerouslySetInnerHTML={{__html:item.description?.desc}} />

                {/*Passive properties */}
                <div className="flex flex-1 flex-row flex-wrap space-x-2 px-4" style={{width:"100%"}}>
                    {/*"Important" properties */}
                    <div className="flex flex-2 flex-row space-x-2 mb-2" style={{width:"100%", }}>
                        {passiveImportantProps.length>0 && passiveImportantProps.map((propName)=>{
                            const prop = properties[propName]
                            const propTitle = globals.itemIDtoNameMapPassive[propName]??globals.itemIDtoNameMap[propName]??propName
                            return(
                                <div key={propName} className="flex flex-1 flex-col p-2 items-center justify-center rounded-lg " style={{backgroundColor:itemColorPallet.dark}}>
                                    <div style={{fontWeight:'bold', fontSize:20, color:gColors.itemText}}>
                                        {prop.value}
                                    </div>
                                    <div className="text-white flex-wrap text-center" style={{fontSize:14}}>
                                        {propTitle}
                                    </div>
                                    
                                </div>
                            )
                        })}
                    </div>
                    {/*"Unimportant" properties */}
                    <div hidden={passiveUnimportantProps.length==0} className="flex flex-col p-2 rounded-lg mb-2" style={{backgroundColor:itemColorPallet.dark, width:passiveImportantProps.length>1?"100%":undefined}}>

                        {passiveUnimportantProps.length>0 && passiveUnimportantProps.map((propName)=>{
                            const prop = properties[propName]
                            const propTitle = globals.itemIDtoNameMapPassive[propName]??globals.itemIDtoNameMap[propName]??propName
                            return(
                                <div className="flex flex-row" key={propName}>
                                    <div className="text-white mr-2" style={{fontWeight:'bold', fontSize:14}}>
                                        {prop.value}
                                    </div>
                                    <div className="text-white flex-wrap " style={{fontSize:14}}>
                                        {propTitle}
                                    </div>
                                </div>
                                    
                                
                            )
                        })}
                    </div>
                
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
            </div>
            
        </div> 
    )

}