import React, { useState, useEffect, useRef } from 'react';

import {getDamageData} from "../../Util/StatChartUtil.jsx"
import ShopItem from './ShopItem';
import souls from "../../assets/souls.png"
import globals from '../../globals';

const gColors = globals.globalColors

let lastItemSelected = null
let tickSizeX = 0


export default function LineChart(props) {
    const canvasRef = useRef(null);
    const build = props.build
    const innerPaddingX = 54
    const innerPaddingY = 24
    const numTicks = build.itemOrder.length

    const [canvasWidth, setCanvasWidth] = useState(0)
    const [dataPoints, setDataPoints] = useState([])
    const [dataPointYLocations, setDataPointYLocations] = useState([])
    const [statsPopup, setStatsPopup] = useState(null)


    //update width changes
    useEffect(() => {
        if(props.style.width!=canvasWidth){
            setCanvasWidth(props.style.width)
        }
    });

    useEffect(()=>{
        if(!build.hero){return}
        fullRender()
    },[build.itemOrder.length,canvasWidth, props.updated])



    function fullRender(){
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.style.width = "100%";
        canvas.width = canvas.offsetWidth;

        //fill background
        context.fillStyle = gColors.LineChartBackground;
        context.fillRect(0, 0, canvas.width, canvas.height); 

        //draw axes
        drawAxes(canvas, context)

        drawXAxisTicks(canvas, context)

        //draw data lines
        drawLines(canvas, context)
    }


    function drawXAxisTicks(canvas, context){
        
        context.strokeStyle = "#8b8ba7"
        context.fillStyle="#b6b6c8"
        let tickSize = (canvas.width - innerPaddingX*2 - 20) / (numTicks)
        tickSizeX = tickSize
        let tickLocation = innerPaddingX
        context.textAlign="center"
        context.fillText(0, tickLocation, canvas.height)
        tickLocation += tickSize
        build.itemOrder.forEach((_,index)=>{
            const itemNum = index+1
            context.beginPath()
            context.moveTo(tickLocation,canvas.height - innerPaddingY)
            context.lineTo(tickLocation, canvas.height - innerPaddingY+10)
            context.stroke()
            
            context.fillText(itemNum, tickLocation, canvas.height)
            tickLocation += tickSize

        })
    }

    function drawAxes(canvas, context){
        
        context.strokeStyle = "#ddddee"
        context.font = "19px serif";
        context.fillStyle="#ceced4"
        
        context.beginPath()
        context.moveTo(innerPaddingX,0)
        context.lineTo(innerPaddingX, canvas.height-innerPaddingY)
        context.lineTo(canvas.width-innerPaddingX, canvas.height-innerPaddingY)
        context.stroke()
        
    }

    function drawLines(canvas, context){
        switch(props.chartStyle){
            case "dmgVsItems":
                drawDmgVsItemsLines(canvas, context)
                break;

            default:
                break;
                
        }
    }

    function drawYAxisTicks(yLimit, canvas, context){
        context.strokeStyle = "#8b8ba7"
        context.fillStyle="#b6b6c8"
        context.textAlign="center"
        const numTicks = 10
        const tickSize = (canvas.height - innerPaddingY) / numTicks
        let tickLabel = 0
        const tickLabelIncrease = yLimit / numTicks
        let tickLocation = canvas.height - innerPaddingY

        context.fillText(tickLabel, innerPaddingX/2, tickLocation)
        tickLocation -= tickSize
        tickLabel+=tickLabelIncrease
        for(let i =1; i<numTicks; i++){
            context.beginPath()
            context.moveTo(innerPaddingX-8,tickLocation)
            context.lineTo(innerPaddingX, tickLocation)
            context.stroke()
            
            context.fillText(tickLabel.toFixed(1), innerPaddingX/2, tickLocation+5)
            tickLocation -= tickSize
            tickLabel+=tickLabelIncrease
        }
    }

    function getChartYLimit(dataPoints, canvas, context){
        let maxY = 0
        dataPoints.forEach((dataPoint)=>{
            Object.keys(dataPoint).forEach((key)=>{
                const val = dataPoint[key]
                if(key!="totalCost" && val>maxY){
                    maxY = val
                }
            })
        })

        if(maxY<500){maxY=500}
        else if(maxY<1000){maxY=1000}
        else if(maxY<1500){maxY=1500}
        else if(maxY<2000){maxY=2000}
        else{maxY+=100}
        
        drawYAxisTicks(maxY, canvas, context)
        return (canvas.height - innerPaddingY) / maxY
    }

    function drawDataPointDot(context, location, dotColor){
        context.fillStyle = dotColor
        context.beginPath()
        context.arc(Math.round(location[0]), Math.round(location[1]), 3, 0, 2 * Math.PI)
        context.closePath()
        context.fill()
    }

    function drawDmgVsItemsLines(canvas, context){
        if(!build || !build.hero){return}
        const dmgData = getDamageData(build)
        setDataPoints([...dmgData])

        //get highest value in graph, to predetermine chart Y limit
        const heightRescale = getChartYLimit(dmgData, canvas, context)


        //set initial point
        let canvasFloor = canvas.height-innerPaddingY
        const initPoint = dmgData.splice(0,1)[0]
        const initWeaponY = initPoint.weaponDmg * heightRescale
        const initSpiritY = initPoint.spiritDmg * heightRescale
        let weaponPtLocation = [innerPaddingX, canvasFloor-initWeaponY]
        let spiritPtLocation = [innerPaddingX, canvasFloor-initSpiritY]

        //draw initial point
        let dataPointsY = [{weaponDmg: canvasFloor-initWeaponY, spiritDmg: canvasFloor-initSpiritY, totalCost:0}]
        drawDataPointDot(context, weaponPtLocation, globals.itemColors.weapon.base)
        drawDataPointDot(context, spiritPtLocation, globals.itemColors.spirit.base)
        
        //connect all following points
        dmgData.forEach((dataPoint)=>{
            const weaponDmgY = Math.round(dataPoint.weaponDmg * heightRescale)
            const spiritDmgY = Math.round(dataPoint.spiritDmg * heightRescale)
            const newWeaponPt = [weaponPtLocation[0] + tickSizeX, canvasFloor-weaponDmgY]
            const newSpiritPt = [spiritPtLocation[0] + tickSizeX, canvasFloor-spiritDmgY]
            
            dataPointsY.push({weaponDmg: canvasFloor-weaponDmgY, spiritDmg: canvasFloor-spiritDmgY, totalCost: dataPoint.totalCost})
            
            //draw weapon line
            context.strokeStyle = globals.itemColors.weapon.base
            context.beginPath()
            context.moveTo(...weaponPtLocation)
            context.lineTo(...newWeaponPt)
            context.stroke()
            weaponPtLocation = newWeaponPt
            //draw the circle for this datapoint
            let dotColor = globals.itemColors.weapon.base
            drawDataPointDot(context, newWeaponPt, dotColor)

            //draw spirit line
            context.strokeStyle = globals.itemColors.spirit.base
            context.beginPath()
            context.moveTo(...spiritPtLocation)
            context.lineTo(...newSpiritPt)
            context.stroke()
            spiritPtLocation = newSpiritPt
            //draw the circle for this datapoint
            dotColor = globals.itemColors.spirit.base
            drawDataPointDot(context, newSpiritPt, dotColor)

            
        })
        
        setDataPointYLocations(dataPointsY)
    }

    function undrawLastHighlightedSection(){
        if(!lastItemSelected){return}
        const canvas = canvasRef.current
        const context = canvas.getContext('2d');
        const highlightX = innerPaddingX+Math.round(tickSizeX*(lastItemSelected))
        const dataPts = dataPointYLocations[lastItemSelected]
        //don't undraw the y axis
        if(highlightX!=innerPaddingX){
            //undraw line
            context.fillStyle = gColors.LineChartBackground
            context.beginPath()
            context.rect(highlightX-1, 0, 2, canvas.height - innerPaddingY -2)
            context.closePath()
            context.fill()
            //redraw datapoint dots
            if(dataPts){
                Object.keys(dataPts).forEach((type)=>{
                    let dotColor = globals.itemColors.weapon.base
                    
                    switch(type){
                        case "spiritDmg":
                            dotColor = globals.itemColors.spirit.base
                            break;
                        default:
                            dotColor = globals.itemColors.weapon.base
                            break;
                    }
                    //draw the circle for this datapoint
                    drawDataPointDot(context, [highlightX, dataPts[type]], gColors.LineChartBackground)
                    drawDataPointDot(context, [highlightX, dataPts[type]], dotColor)
                    

                })
            }
        }
        lastItemSelected = null
    }

    function handleMouse(event){
        const canvas = canvasRef.current
        const context = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect()
        const mouseX = event.clientX - rect.left - innerPaddingX
        const mouseY = event.clientY -rect.top - innerPaddingY
        const itemNum = Math.round((mouseX ) / tickSizeX)
        const isInRange = tickSizeX*.28 >15? Math.abs(itemNum*tickSizeX - mouseX) < tickSizeX*.28 : true
        if(itemNum<0 || itemNum > build.itemOrder.length+1 || !isInRange){
            undrawLastHighlightedSection()
            if(!isInRange){setStatsPopup(null)}
            return
        }

        const dataValY = dataPoints[itemNum] 
        
        const highlightX = innerPaddingX+Math.round(tickSizeX*(itemNum))

        //set stats popup item
        setStatsPopup({
            xPos: highlightX+rect.left,
            yPos: mouseY,
            values: dataValY,
            index: itemNum-1,
        })

        if(lastItemSelected){
            //if mouse is in same region, change nothing
            if(lastItemSelected==itemNum){
                
                return
            }
            //otherwise undraw last region (redraw line with background color, then replace datapoint dot)
            undrawLastHighlightedSection()
        }        

        //draw newly selected region
        context.fillStyle = "#8b8ba7"
        context.beginPath()
        context.rect(highlightX-1, 0, 2, canvas.height - innerPaddingY -2)
        
        context.closePath()
        context.fill()

        lastItemSelected = itemNum
    }

    function renderStatsPopup(){
        if(!statsPopup.values || statsPopup.values.length == 0){return null}
        let purchasedItem = null
        let lastWeaponDps = null
        let lastSpiritDps = null
        const currentWeaponDps = statsPopup.values.weaponDmg.toFixed(0)
        const currentSpiritDps = statsPopup.values.spiritDmg.toFixed(0)
        let weaponDpsChange = null
        let spiritDpsChange = null
        if(statsPopup.index>=0){
            purchasedItem = build.itemOrder[statsPopup.index]
            const lastStats = dataPoints[statsPopup.index]
            lastWeaponDps = lastStats.weaponDmg
            lastSpiritDps = lastStats.spiritDmg
            weaponDpsChange = (currentWeaponDps - lastWeaponDps).toFixed(0)
            spiritDpsChange = (currentSpiritDps - lastSpiritDps).toFixed(0)
        }
        return(
            <div className="absolute flex flex-col p-2 text-white text-center drop-shadow-[0_4px_4px_rgba(0,0,0,0.65)] select-none opacityAppear" style={{backgroundColor:gColors.greyBackground, minWidth:250, zIndex:2, borderRadius:5, left:statsPopup.xPos??0, top:(statsPopup.yPos??0)+60}}>
                {purchasedItem?
                    <div className="flex flex-col p-2 text-center items-center mb-2" style={{backgroundColor:gColors.mediumGrey, borderRadius:5}}>
                        
                            <div className="flex flex-row mb-2 text-center items-center" style={{fontSize:16, fontWeight:600, lineHeight:1, width:"100%"}}>
                                <div className="flex flex-0">
                                    <ShopItem item={purchasedItem} hover={()=>null} unhover={()=>null} click={()=>null} widthOverride={72} heightOverride={80}/>
                                </div>
                                
                                <div className="flex flex-1 flex-col mb-1 text-center" style={{fontSize:16, fontWeight:600, lineHeight:1}}>
                                    {"Build Cost: "}
                                    <div className="flex flex-row items-center justify-center">
                                        <img className="mr-1" style={{height:14, width:'auto'}} src={souls}/>
                                        <div style={{color: gColors.itemCost}}>{statsPopup.values.totalCost.toFixed(0)}</div>
                                    </div>
                                    
                                </div>
                                
                            </div>
                    
                        
                    </div>
                    
                    :
                    <div className="mb-1 text-center" style={{fontSize:16, fontWeight:600, lineHeight:1}}>
                        Base Stats:
                    </div>
                }
                
                {/* WEAPON DPS */}
                <div style={{fontSize:15}}>
                    <span>
                        <span style={{color:globals.itemColors.weapon.base, fontWeight:700}}>Weapon DPS: </span>
                        {currentWeaponDps}
                        {weaponDpsChange&&
                            <span style={{color:weaponDpsChange>=0?gColors.successGreen:gColors.errorRed}}> {"("}{weaponDpsChange>=0&&"+"}{weaponDpsChange+")"}</span>
                        }
                    </span>
                </div>

                {/* SPIRIT DPS */}
                <div style={{fontSize:15}}>
                    <span>
                        <span style={{color:globals.itemColors.spirit.base, fontWeight:700}}>Spirit DPS: </span>
                        {currentSpiritDps}
                        {spiritDpsChange&&
                            <span style={{color:spiritDpsChange>=0?gColors.successGreen:gColors.errorRed}}> {"("}{spiritDpsChange>=0&&"+"}{spiritDpsChange+")"}</span>
                        }
                    </span>
                </div>
            </div>
        )
    }

    
    return (
        <div>
            <canvas style={{...props.style}} ref={canvasRef} width={props.style.width}  height={props.style.height} onMouseLeave={()=>{undrawLastHighlightedSection();setStatsPopup(null);}} onMouseMove={(event)=>handleMouse(event)}/>
            {
                statsPopup&&
                renderStatsPopup()
            }
        </div>
    )
}
