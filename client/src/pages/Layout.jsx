import { Nav, Footer } from './'

import { useRef, useEffect, useState } from 'react'



const Layout = ({ children }) => {

  const navRef = useRef(null)
  const footerRef = useRef(null)

  const [pageHeightOffset, setPageHeightOffset] = useState(0)

  useEffect(()=>{
    if(navRef.current&&footerRef.current){
      setPageHeightOffset(navRef.current.clientHeight + footerRef.current.clientHeight)
    }
    console.log(pageHeightOffset)
  })

    return (
      <div className="wrapper" style={{height:'100%'}}>
        <Nav r={navRef} />
          <div style={{display:'flex', flex:1, minHeight:100,}}>{children}</div>
        <Footer r={footerRef}/>
      </div>
    )
  }
  
export default Layout