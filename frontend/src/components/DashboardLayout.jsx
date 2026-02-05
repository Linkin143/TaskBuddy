import { useState } from "react"
import { MdClose } from "react-icons/md"
import { useSelector } from "react-redux"
import Navbar from "./Navbar"
import SideMenu from "./SideMenu"

const DashboardLayout = ({ children, activeMenu }) => {
  const { currentUser } = useSelector((state) => state.user)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Navbar activeMenu={activeMenu} toggleMobileMenu={toggleMobileMenu} />

      {currentUser && (
        <div className="flex flex-1 relative">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-64 flex-shrink-0 border-r border-gray-100 bg-white">
            <SideMenu activeMenu={activeMenu} />
          </div>

          {/* Mobile Sidebar Overlay */}
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
              onClick={toggleMobileMenu}
            ></div>
          )}

          {/* Mobile Sidebar Drawer */}
          <div className={`
            fixed inset-y-0 left-0 z-50 w-72 bg-white transform transition-transform duration-300 ease-in-out lg:hidden
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          `}>
            <div className="flex items-center justify-between p-4 border-b lg:hidden">
              <span className="font-bold text-indigo-600">Navigation</span>
              <button 
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <MdClose className="text-2xl text-gray-600" />
              </button>
            </div>
            <SideMenu activeMenu={activeMenu} />
          </div>

          {/* Main Content Area */}
          <main className="flex-1 w-full min-w-0 overflow-x-hidden">
            <div className="px-3 py-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      )}
    </div>
  )
}

export default DashboardLayout