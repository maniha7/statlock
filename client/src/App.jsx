import { Route, Routes, Outlet } from "react-router-dom";
import './App.css'
import './index.css'

import { Home, Layout, StatsPage, Builds, Patches, Matches, Rankings, Items } from "./pages"


function App() {
  return (
    <>
      <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/stats" element={<Layout><StatsPage /></Layout>} />
      <Route path="/patchnotes" element={<Layout><Patches /></Layout>} />
      <Route path="/builds" element={<Layout><Builds /></Layout>} />
      <Route path="/matches" element={<Layout><Matches /></Layout>} />
      <Route path="/rankings" element={<Layout><Rankings /></Layout>} />
      <Route path="/items" element={<Layout><Items /></Layout>} />
      </Routes>
    </>
  )
}

export default App
