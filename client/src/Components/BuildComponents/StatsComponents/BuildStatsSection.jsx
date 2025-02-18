import React, { useState, useEffect, useRef } from 'react';
import LineChart from './LineChart';
import globals from '../../../globals';

const gColors = globals.globalColors

export default function BuildStats(props) {

    const chartContainerRef = useRef(null)
    const chartYAxisRef = useRef(null)

    const build = props.build
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
        <div className='flex flex-col mt-3' >
            
            <div className="flex flex-wrap p-2" style={{backgroundColor:gColors.darkGrey, borderRadius:5, width:'100%', }}>
                
                <div className='flex flex-col select-none' style={{backgroundColor:gColors.LineChartBackground, width:"100%", alignItems:"center",}}>
                    <h1 className="text-white " style={{fontSize:25, fontWeight:700}}>Build Stats</h1>
                    <div className='flex flex-row pl-5 relative' style={{width:'100%', alignItems:'center'}}>
                        <span ref={chartYAxisRef} className="absolute" style={{left:!chartYAxisRef.current?0:-chartYAxisRef.current.offsetWidth + 165, color:"#fff", fontSize:19, fontStyle:"italic", fontWeight:700,transform:"rotate(270deg)"}}>
                            {renderChartYAxis()}
                        </span>
                        <div className='flex flex-1 flex-col items-center p-5' style={{ width:'100%'}}>
                            <div ref={chartContainerRef} style={{width:"100%"}} >
                                <LineChart build={build} updated={props.updated} chartStyle={"dmgVsItems"} style={{width:chartContainerRef.current?.clientWidth, height:500}}/>
                            </div>
                            <span style={{color:"#fff", fontSize:19, fontStyle:"italic", fontWeight:700}}>{renderChartXAxis()}</span>
                        </div>
                        
                    </div>
                
                </div>
            </div>
        </div>
   )
}
