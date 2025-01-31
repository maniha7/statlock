import globals from '../globals';
import { getItems } from "./ApiUtil";
import { getItemByID } from './ItemUtil';
import dlItems from "../assets/dlItems.json"

export async function filterItems(setres){
    const res = dlItems
    Object.keys(res).forEach((itemName)=>{

        delete res[itemName]["weapon_info"]
        if(res[itemName]["upgradesFrom"]){
            delete res[itemName]["upgradesFrom"]["weapon_info"]
            
            if(res[itemName]["upgradesFrom"]["upgradesFrom"]){
                delete res[itemName]["upgradesFrom"]["upgradesFrom"]["weapon_info"]
            }
        }
        
    })
    const jsonres = JSON.stringify(res)
    setres(jsonres)
}


export async function genItems(setres){
    const items = await getItems()
    const res = {}
    Object.keys(items).forEach((itemID)=>{
        const item = items[itemID]
        
        if(item.cost==6200){
            item.cost=6000
        }

        //get components
        if(item.component_items && item.component_items.length>0){
            let componentID = item.component_items[0]
            const componentItem = getItemByID(componentID)
            item.upgradeFrom = componentItem
        }

        //get cooldown type
        if(item.properties["AbilityCooldown"]?.value!=0){
            if(item.properties["AbilityCooldown"]?.tooltip_section!="active"){
                item.passiveCooldown = item.properties["AbilityCooldown"].value
            }
            else{
                item.activeCooldown = item.properties["AbilityCooldown"].value
            }
        }

        //get all properties
        const properties = item.properties
        Object.keys(properties).forEach((propName)=>{
            properties[propName].propName = propName
        })

        //GET INNATE ITEM PROPERTIES
        let innateItemProps = Object.values(properties).filter((property)=>
            property.provided_property_type 
            && property.value!="0"
            && property.tooltip_section!="passive"
            && property.tooltip_section!="active"
            && (!globals.innateHiddenProperties.has(property.propName) || property.tooltip_section=="innate")
        )

        innateItemProps = innateItemProps.map((prop)=>{
            const propName = prop.propName
            return( 
                {
                    ...prop,
                    title: globals.itemIDtoNameMap[propName]??propName,
                    units: globals.itemIDtoUnitMap[propName]??{sign:"",units:""}
                }
            )
        })


        //GET PASSIVE ITEM PROPERTIES
        let passiveItemProps = Object.values(properties).filter((property)=>
            (property.tooltip_section=="passive" || property.tooltip_is_important)
            && property.value!="0"
            && property.tooltip_section!="innate"
            && property.tooltip_section!="active"
            && !globals.passiveHiddenProperties.has(property.propName) 
        )

        passiveItemProps = passiveItemProps.map((prop)=>{
            const propName = prop.propName
            return(
                {
                    ...prop,
                    title: globals.itemIDtoNameMapPassive[propName]??globals.itemIDtoNameMap[propName]??propName,
                    units: globals.itemIDtoUnitMapPassive[propName]??globals.itemIDtoUnitMap[propName]??{sign:"",units:""},
                }
            )
        })

        const passiveImportantProps = passiveItemProps.filter((p)=>p.tooltip_is_important)
        const passiveUnimportantProps = passiveItemProps.filter((p)=>!p.tooltip_is_important)

        //GET ACTIVE ITEM PROPERTIES
        let activeItemProps = Object.values(properties).filter((property)=>
            (property.tooltip_section=="active")
            && property.value!="0"
            && property.tooltip_section!="innate"
            && property.tooltip_section!="passive"
            && !globals.activeHiddenProperties.has(property.propName) 
        )

        activeItemProps = activeItemProps.map((prop)=>{
            const propName = prop.propName
            return(
                {
                    ...prop,
                    title: globals.itemIDtoNameMapActive[propName]??globals.itemIDtoNameMap[propName]??propName,
                    units: globals.itemIDtoUnitMapActive[propName]??globals.itemIDtoUnitMap[propName]??{sign:"",units:""},
                }
            )
        })
        const activeImportantProps = activeItemProps.filter((p)=>p.tooltip_is_important)
        const activeUnimportantProps = activeItemProps.filter((p)=>!p.tooltip_is_important)

        res[itemID] = {
            ...item,
            activeImportantProperties: activeImportantProps,
            activeUnimportantProperties: activeUnimportantProps,
            passiveImportantProperties: passiveImportantProps,
            passiveUnimportantProperties: passiveUnimportantProps,
            innateProperties: innateItemProps,
            upgradesTo:null,
        }

    })  
    
    const jsonres = JSON.stringify(res)
    setres(jsonres)
}