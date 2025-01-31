import { Route, Routes, Outlet } from "react-router-dom";
import './App.css'
import './index.css'

import { Home, Layout, StatsPage, Builds, Patches, Matches, Rankings, Items, Privacy, Support, About, Contact } from "./pages"


function App() {
  return (

      <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/stats" element={<Layout><StatsPage /></Layout>} />
      <Route path="/patchnotes" element={<Layout><Patches /></Layout>} />
      <Route path="/builds" element={<Layout><Builds /></Layout>} />
      <Route path="/matches" element={<Layout><Matches /></Layout>} />
      <Route path="/rankings" element={<Layout><Rankings /></Layout>} />
      <Route path="/items" element={<Layout><Items /></Layout>} />
      <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
      <Route path="/support" element={<Layout><Support /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />
      </Routes>

  )
}

export default App
