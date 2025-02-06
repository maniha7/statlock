import React, { useState, useEffect, useRef } from 'react';
import globals from '../../globals';

const gColors = globals.globalColors

export default function LineChart(props) {
    const canvasRef = useRef(null);
    const data = props.data
    const innerPadding = 15
    const textSize = 30

    const [canvasWidth, setCanvasWidth] = useState(0)

    //update width changes
    useEffect(() => {
        if(props.style.width!=canvasWidth){
            setCanvasWidth(props.style.width)
        }
    });

    useEffect(()=>{
        fullRender()
    },[data.length])


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

        drawAxisTicks(canvas, context)

        //draw data lines
        drawLines(canvas, context)
    }

    function drawAxisTicks(canvas, context){
        
        context.strokeStyle = "#8b8ba7"
        const numTicks = data.length
        const tickSize = (canvas.width - innerPadding*2 - 20) / (numTicks)
        let tickLocation = innerPadding + tickSize
        data.forEach((_,index)=>{
            const itemNum = index+1
            context.beginPath()
            context.moveTo(tickLocation,canvas.height - innerPadding-8)
            context.lineTo(tickLocation, canvas.height - innerPadding+8)
            context.stroke()
            tickLocation += tickSize
        })
    }

    function drawAxes(canvas, context){
        
        context.strokeStyle = "#ddddee"
        context.font = "19px serif";
        context.fillStyle="#ceced4"
        
        context.beginPath()
        context.moveTo(innerPadding,0)
        context.lineTo(innerPadding, canvas.height-innerPadding)
        context.lineTo(canvas.width-innerPadding, canvas.height-innerPadding)
        context.stroke()
        
    }

    function drawLines(canvas, context){
        switch(props.chartStyle){
            case "dmgVsResistances":
                drawDmgVsResistancesLines()
                break;

            default:
                break;
                
        }
    }

    function drawDmgVsResistancesLines(){

    }

    return <canvas style={{...props.style}} ref={canvasRef} width={props.style.width}  height={props.style.height} />;
}
