import React, { useState, useEffect, useRef } from 'react';
import globals from '../globals';

const gColors = globals.globalColors

export default function LineChart(props) {
    const canvasRef = useRef(null);

    const innerPadding = 5
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
    },[canvasWidth])


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

        //draw lines
        drawLines(canvas, context)
  }

    function drawAxes(canvas, context){
        
        context.strokeStyle = "#ddddee"
        context.font = "19px serif";
        context.fillStyle="#ceced4"
        
        context.beginPath()
        context.moveTo(0,0)
        context.lineTo(0, canvas.height)
        context.lineTo(canvas.width, canvas.height)
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
