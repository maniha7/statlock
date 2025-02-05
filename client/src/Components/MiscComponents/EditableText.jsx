import React, { useState, useEffect, useRef } from 'react';
import globals from '../../globals';

const gColors = globals.globalColors

export default function EditableText(props) {

    const [editing, setEditing] = useState(false)
    const [value, setValue] = useState(props.initVal)

    const inputRef = useRef(null)

    useEffect(()=>{
        console.log('edit changed')
        if(inputRef.current){
            console.log('ref exists')
            inputRef.current.focus()
        }
    },[editing])

    function saveChange(){
        if(value.length>0){
            props.effect(value)
        }
        else{
            setValue(props.initVal)
            props.effect(props.initVal)
        }
        
        setEditing(false)
    }

    function editValue(newVal){
        setValue(newVal)
    }

    function openInput(){
        setEditing(true)
    }

    function checkEnterPressed(event){
        if (event.key === 'Enter') {
            saveChange();
          }
    }

   return(
    
    (editing?
    <input ref={inputRef} onChange={(event)=>editValue(event.target.value)} onBlur={()=>saveChange()} onKeyDown={checkEnterPressed} onSubmit={()=>saveChange()} value={value} style={{color:"#fff", borderWidth:1, borderRadius:5}}/>
    :
    <div onClick={()=>openInput()} style={{fontSize:16, fontWeight:700, color:"#fff"}}>{value}</div>
    )
    
    
   )
}
