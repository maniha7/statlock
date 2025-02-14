import React, { useState, useEffect, useRef } from 'react';

import {getDamageData} from "../../Util/StatChartUtil.jsx"
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
        console.log("updated!")
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
            Object.values(dataPoint).forEach((val)=>{
                if(val>maxY){
                    maxY = val
                }
            })
        })
        
        drawYAxisTicks(maxY, canvas, context)
        return (canvas.height - innerPaddingY) / maxY
    }

    function drawDataPointDot(context, location, dotColor){
        context.fillStyle = dotColor
        context.beginPath()
        context.arc(...location, 3, 0, 2 * Math.PI)
        context.closePath()
        context.fill()
    }

    function drawDmgVsItemsLines(canvas, context){
        if(!build || !build.hero){return}
        const dmgData = getDamageData(build)
        setDataPoints(dmgData)
        

        //get highest value in graph, to predetermine chart Y limit
        const heightRescale = getChartYLimit(dmgData, canvas, context)


        //graph datapoints
        let canvasFloor = canvas.height-innerPaddingY

        const initPoint = dmgData.splice(0,1)[0]
        const initWeaponY = initPoint.weaponDmg * heightRescale
        const initSpiritY = initPoint.spiritDmg * heightRescale
        let weaponPtLocation = [innerPaddingX, canvasFloor-initWeaponY]
        let spiritPtLocation = [innerPaddingX, canvasFloor-initSpiritY]

        let dataPointsY = []
        
        dmgData.forEach((dataPoint)=>{
            const weaponDmgY = Math.round(dataPoint.weaponDmg * heightRescale)
            const spiritDmgY = Math.round(dataPoint.spiritDmg * heightRescale)
            const newWeaponPt = [weaponPtLocation[0] + tickSizeX, canvasFloor-weaponDmgY]
            const newSpiritPt = [spiritPtLocation[0] + tickSizeX, canvasFloor-spiritDmgY]
            
            dataPointsY.push({weaponDmg: canvasFloor-weaponDmgY, spiritDmg: canvasFloor-spiritDmgY})

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
        const dataPts = dataPointYLocations[lastItemSelected-1]
        //don't undraw the y axis
        if(lastItemSelected!=0){
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
        if(itemNum<0 || itemNum > build.itemOrder.length){
            undrawLastHighlightedSection()
            return
        }
        const dataValY = dataPoints[itemNum] 
        
        const highlightX = innerPaddingX+Math.round(tickSizeX*itemNum)

        //set stats popup item
        setStatsPopup({
            xPos: highlightX+rect.left,
            yPos: mouseY,
            values: dataValY
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
        return(
            <div className="absolute flex flex-col p-2 text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.65)]" style={{backgroundColor:gColors.greyBackground, borderRadius:5, left:statsPopup.xPos??0, top:(statsPopup.yPos??0)+60}}>
                {Object.keys(statsPopup.values).map((key)=>{
                    const val = statsPopup.values[key]
                    return(
                        <div key={key} style={{fontSize:15}}>
                            {"Damage: " + val.toFixed(0)}
                        </div>
                    )
                })}
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
