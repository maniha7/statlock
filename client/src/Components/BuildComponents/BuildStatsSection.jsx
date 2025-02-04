import React, { useState, useEffect, useRef } from 'react';
import LineChart from './LineChart';
import globals from '../../globals';

const gColors = globals.globalColors

export default function BuildStats(props) {

    const chartContainerRef = useRef(null)
    const chartYAxisRef = useRef(null)

    const buildChartType = props.chartType
    
    function renderChartXAxis(){
        switch(buildChartType){
            case "DmgVsItemsBought":
            default:
                return(
                    "Items Bought"
                )
        }
    }

    function renderChartYAxis(){
        switch(buildChartType){
            case "DmgVsItemsBought":
            default:
                return(
                    "Damage (Weapon / Spirit / Total)"
                )
        }
    }

   return(
        <div className='flex flex-col' >
            <div className="text-white" style={{fontWeight:'bold'}}>BUILD STATS</div>
            <div className="flex flex-wrap p-2" style={{backgroundColor:gColors.darkGrey, borderRadius:5, width:'100%', }}>
                
                <div className='flex flex-row relative pl-5' style={{backgroundColor:gColors.LineChartBackground, width:"100%", alignItems:"center",}}>
                    <span ref={chartYAxisRef} className="absolute" style={{left:!chartYAxisRef.current?0:-chartYAxisRef.current.offsetWidth + 165, color:"#fff", fontSize:19, fontStyle:"italic", fontWeight:700,transform:"rotate(270deg)"}}>
                        {renderChartYAxis()}
                    </span>
                    <div className='flex flex-1 flex-col items-center p-5' style={{ width:'100%'}}>
                        <div ref={chartContainerRef} style={{width:"100%"}} >
                            <LineChart style={{width:chartContainerRef.current?.clientWidth, height:500}}/>
                        </div>
                        <span style={{color:"#fff", fontSize:19, fontStyle:"italic", fontWeight:700}}>{renderChartXAxis()}</span>
                    </div>
                    
                </div>
                
                
            </div>
        </div>
   )
}
