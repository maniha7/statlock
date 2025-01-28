import { Nav, Footer } from "./"

import { Outlet, useLocation, useOutletContext } from "react-router-dom";



export default function PageWrapper(){


    return (
        <div style={{width:"100%", height:"100vh", display:'flex', flexDirection:"column",}}>
          <div style={{width:"80%", display:'flex', flexDirection:'column',flex:1}}>
            {/**HEad */}
    
            {
              
              location.pathname!="/"?
                <Outlet context={uid}/>
                :
                null
              
            }
            
    
            {/**Foot */}
          </div>
          
        </div>
      );

}