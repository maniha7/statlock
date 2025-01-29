import React, { useEffect, useState, useRef} from 'react';
import globals from '../globals';
import souls from "../assets/souls.png"

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
        properties[property].provided_property_type 
        && properties[property].value!="0"
        && properties[property].tooltip_section!="innate"
        && properties[property].tooltip_section!="active"
        && (!globals.passiveHiddenProperties.has(property) && properties[property].tooltip_section=="passive")
    )
    //const passiveItemProps = item.properties.filter((property)=>property.tooltip_section=="passive")

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
                        <div key={propertyName} className="flex flex-row text-white">
                            <div className="mb-2 mt-1 mr-1" style={{lineHeight:1, fontWeight:'bold'}}>
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
        console.log(passiveItemProps)
        if(passiveItemProps.length==0 && !hasCooldown){return null}
        return(
            <div className="flex flex-row flex-1 pl-2" style={{backgroundColor:itemColorPallet.dark}}>
                <div className="flex flex-1 py-1" style={{fontSize:16, color:gColors.offWhite, fontStyle:'italic', fontWeight:"bold"}}>Passive</div>
                {item.properties["AbilityCooldown"]?.value!=0&&
                    <div className="flex flex-col flex-0 px-3 text-white justify-center text-white" style={{backgroundColor:"#070d0d", fontWeight:'bold', color:"#f3f3f1"}}>
                            {item.properties["AbilityCooldown"].value+"s"}
                    </div>
                }
            </div>
        )
    }

    return(
        item&&
        <div ref={itemRef} onMouseEnter={()=>props.open()} onMouseLeave={()=>props.close()} className="flex flex-col pt-1 min-w-[18%] max-w-[18%] drop-shadow-[0_8px_8px_rgba(0,0,0,0.65)]" style={{position:'absolute', borderRadius:8, backgroundColor:itemColorPallet.medium, top:pos.y-yOffset, left:pos.x-xOffset}}>
            <div className="flex flex-col px-2 pb-2 ml-0.5 ">
                <div className="text-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.25)] mb-0.5" style={{fontSize:20, fontWeight:'bold'}}> {item["name"]}</div>
                <div className="flex flex-row">
                    <img className="mr-1" src={souls}/>
                    <div className="text-white mb-0.5" style={{fontSize:16, fontWeight:'bold'}}> {item["cost"]}</div>
                </div>
                
            </div>

            <div className="py-2 pb-1" style={{backgroundColor:itemColorPallet.mediumDark, borderBottomLeftRadius:8,borderBottomRightRadius:8}}>
                {renderInnateTooltip()}
                {renderPassiveToolTip()}
            </div>
            
        </div> 
    )

}