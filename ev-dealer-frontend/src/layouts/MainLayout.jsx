/**
 * Main Layout - Dashboard Layout with Sidebar and Topbar
 * TODO: Implement layout structure for authenticated pages
 */

import { Outlet } from 'react-router-dom'
import Sidebar from '../components/common/Sidebar'
import Topbar from '../components/common/Topbar'

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout

