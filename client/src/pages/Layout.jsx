import { Nav, Footer } from './'



const Layout = ({ children }) => {
    return (
      <div className="wrapper">
        <Nav />
        <div style={{display:'flex',flex:1}}>{children}</div>
        <Footer />
      </div>
    )
  }
  
export default Layout