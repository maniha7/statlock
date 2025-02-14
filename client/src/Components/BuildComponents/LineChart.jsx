import React, { useState, useEffect, useRef } from 'react';

import {getDamageData} from "../../Util/StatChartUtil.jsx"
import globals from '../../globals';

const gColors = globals.globalColors

export default function LineChart(props) {
    const canvasRef = useRef(null);
    const build = props.build
    const innerPaddingX = 54
    const innerPaddingY = 24
    const numTicks = build.itemOrder.length

    const [canvasWidth, setCanvasWidth] = useState(0)

    //update width changes
    useEffect(() => {
        if(props.style.width!=canvasWidth){
            setCanvasWidth(props.style.width)
        }
    });

    useEffect(()=>{
        fullRender()
    },[build.itemOrder.length,canvasWidth])



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

    function getTickSizeX(canvas){
        return (canvas.width - innerPaddingX*2 - 20) / (numTicks)
    }

    function drawXAxisTicks(canvas, context){
        
        context.strokeStyle = "#8b8ba7"
        context.fillStyle="#b6b6c8"
        
        const tickSize = getTickSizeX(canvas)
        let tickLocation = innerPaddingX
        context.textAlign="center"
        context.fillText(0, tickLocation, canvas.height)
        tickLocation += tickSize
        build.itemOrder.forEach((_,index)=>{
            const itemNum = index+1
            context.beginPath()
            context.moveTo(tickLocation,canvas.height - innerPaddingY-8)
            context.lineTo(tickLocation, canvas.height - innerPaddingY+8)
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
        const tickSize = (canvas.height - innerPaddingY - 20) / numTicks
        let tickLabel = 0
        const tickLabelIncrease = Math.floor(yLimit / numTicks)
        let tickLocation = canvas.height - innerPaddingY

        context.fillText(tickLabel, innerPaddingX/2, tickLocation)
        tickLocation -= tickSize
        tickLabel+=tickLabelIncrease
        for(let i =1; i<numTicks-1; i++){
            context.beginPath()
            context.moveTo(innerPaddingX-8,tickLocation)
            context.lineTo(innerPaddingX+8, tickLocation)
            context.stroke()
            
            context.fillText(tickLabel, innerPaddingX/2, tickLocation+5)
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
        maxY+=20
        drawYAxisTicks(maxY, canvas, context)
        return (canvas.height - innerPaddingY) / maxY
    }

    function drawDmgVsItemsLines(canvas, context){
        if(!build || !build.hero){return}
        const dmgData = getDamageData(build)

        

        //get highest value in graph, to predetermine chart Y limit
        const heightRescale = getChartYLimit(dmgData, canvas, context)


        //graph datapoints
        const tickSize = getTickSizeX(canvas)
        let canvasFloor = canvas.height-innerPaddingY

        const initPoint = dmgData.splice(0,1)[0]
        const initWeaponY = initPoint.weaponDmg * heightRescale
        const initSpiritY = initPoint.spiritDmg * heightRescale
        let weaponPtLocation = [innerPaddingX, canvasFloor-initWeaponY]
        let spiritPtLocation = [innerPaddingX, canvasFloor-initSpiritY]
        
        dmgData.forEach((dataPoint)=>{
            const weaponDmgY = dataPoint.weaponDmg * heightRescale
            const spiritDmgY = dataPoint.spiritDmg * heightRescale
            const newWeaponPt = [weaponPtLocation[0] + tickSize, canvasFloor-weaponDmgY]
            const newSpiritPt = [spiritPtLocation[0] + tickSize, canvasFloor-spiritDmgY]

            //draw weapon line
            context.strokeStyle = globals.itemColors.weapon.base
            context.beginPath()
            context.moveTo(...weaponPtLocation)
            context.lineTo(...newWeaponPt)
            context.stroke()
            weaponPtLocation = newWeaponPt

            //draw spirit line
            context.strokeStyle = globals.itemColors.spirit.base
            context.beginPath()
            context.moveTo(...spiritPtLocation)
            context.lineTo(...newSpiritPt)
            context.stroke()
            spiritPtLocation = newSpiritPt

        })
    }

    return <canvas style={{...props.style}} ref={canvasRef} width={props.style.width}  height={props.style.height} />;
}
