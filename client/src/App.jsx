import { Route, Routes } from "react-router-dom";
import './App.css'
import './index.css'

import { Home, Layout, Wiki, Builds, Patches, Matches, Rankings, Skins, Privacy, Support, About, Contact, Upload, Profile, Install } from "./pages"


function App() {
  return (

      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/wiki" element={<Layout><Wiki /></Layout>} />
        <Route path="/patchnotes" element={<Layout><Patches /></Layout>} />
        <Route path="/builds" element={<Layout><Builds /></Layout>} />
        <Route path="/matches" element={<Layout><Matches /></Layout>} />
        <Route path="/rankings" element={<Layout><Rankings /></Layout>} />
        <Route path="/skins" element={<Layout><Skins /></Layout>} />
          <Route path="/modupload" element={<Layout><Upload /></Layout>} />
          <Route path="/modinstall" element={<Layout><Install /></Layout>} />
        <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
        <Route path="/support" element={<Layout><Support /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
      </Routes>

  )
}

export default App
