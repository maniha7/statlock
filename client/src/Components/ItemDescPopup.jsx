import React, { useEffect, useState, useRef} from 'react';
import globals from '../globals';
import souls from "../assets/souls.png"

export default function ItemDescPopup(props, left){

    const item = props.item
    const pos = props.pos
    const itemColor = globals.itemColors[item["item_slot_type"]]
    const properties = item.properties

    const hiddenProperties = new Set(["MoveWhileShootingSpeedPenaltyReductionPercent","MoveWhileZoomedSpeedPenaltyReductionPercent"])


    const innateItemProps = Object.keys(properties).filter((property)=>
        properties[property].provided_property_type 
        && properties[property].value!="0"
        && properties[property].tooltip_section!="passive"
        && properties[property].tooltip_section!="active"
        && !hiddenProperties.has(property)
    )
    //const passiveItemProps = item.properties.filter((property)=>property.tooltip_section=="passive")

    const [xOffset, setxOffset] = useState(0)

    const itemRef = useRef(null)

    useEffect(()=>{
        setxOffset(itemRef.current.clientWidth)
    },[])

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
            innateItemProps.map((propertyName)=>{
                let property = properties[propertyName]
                let propUnits = globals.itemIDtoUnitMap[propertyName]
                if(!propUnits){return false}
                return(
                    <div key={propertyName} className="flex flex-row text-white">
                        <div className="mb-2 mt-1 mr-1" style={{lineHeight:1, fontWeight:'bold'}}>
                            {(!["+","-"].includes(property.value.substring(0,1))?propUnits.sign:null) + property.value + propUnits.units}
                        </div>
                        <div className="mb-2 mt-1 ml-1" style={{lineHeight:1}}>
                            {globals.itemIDtoNameMap[propertyName]}
                        </div>
                    </div>
                    
                )
            })
        )
    }

    function renderPassiveToolTip(){
        return(
            null
        )
    }

    return(
        item&&
        <div ref={itemRef} className="flex flex-col rounded-lg pt-1 border-2 max-w-[15%]" style={{position:'absolute', backgroundColor:itemColor, top:pos.y, left:pos.x-xOffset}}>
            <div className="flex flex-col px-1 ml-0.5">
                <div className="text-white underline mb-0.5" style={{fontSize:20, fontWeight:'bold'}}> {item["name"]}</div>
                <div className="flex flex-row">
                    <img className="mr-1" src={souls}/>
                    <div className="text-white mb-0.5" style={{fontSize:16, fontWeight:'bold'}}> {item["cost"]}</div>
                </div>
                
            </div>

            <div className="px-2 py-2" style={{backgroundColor:"rgba(0,0,0,.4)"}}>
                {renderInnateTooltip()}
            </div>
            
        </div> 
    )

}