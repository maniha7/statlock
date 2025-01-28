import { Route, Routes, Outlet } from "react-router-dom";
import './App.css'
import './index.css'

import { Home, Layout, StatsPage } from "./pages"


function App() {
  return (
    <>
      <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/stats" element={<Layout><StatsPage /></Layout>} />
      </Routes>
    </>
  )
}

export default App
