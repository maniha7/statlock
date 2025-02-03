import { Nav, Footer } from './'

import { useRef, useEffect, useState } from 'react'



const Layout = ({ children }) => {


    return (
      <div className="wrapper" style={{height:'100%'}}>
        <Nav/>
          <div style={{display:'flex', }}>{children}</div>
        <Footer/>
      </div>
    )
  }
  
export default Layout