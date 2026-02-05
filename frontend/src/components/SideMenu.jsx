import { useEffect, useState } from "react"
import { FaPeopleGroup } from "react-icons/fa6"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { signOutSuccess } from "../redux/slice/userSlice"
import axiosInstance from "../utils/axioInstance"
import { USER_SIDE_MENU_DATA } from "../utils/data"

const SideMenu = ({ activeMenu }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [SideMenuData, setSideMenuData] = useState([])
  const { currentUser } = useSelector((state) => state.user)

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogut()
      return
    }
    navigate(route)
  }

  const handleLogut = async () => {
    try {
      const response = await axiosInstance.post("/auth/sign-out")
      if (response.data) {
        dispatch(signOutSuccess())
        navigate("/login")
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (currentUser) {
      setSideMenuData(
        currentUser?.role === "admin" ? SIDE_MENU_DATA : USER_SIDE_MENU_DATA
      )
    }
    return () => {}
  }, [currentUser])

  const ThreeDAvatar = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
      <defs>
        <linearGradient id="gradBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#818cf8", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#c084fc", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="gradHead" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#38bdf8", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#818cf8", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path d="M20,85 C20,65 35,55 50,55 C65,55 80,65 80,85" fill="url(#gradBody)" />
      <circle cx="50" cy="35" r="20" fill="url(#gradHead)" />
    </svg>
  )

  return (
    <div className="sticky top-0 left-0 z-50 w-72 h-screen flex flex-col bg-white border-r border-indigo-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300 font-sans">
      
      <div 
        onClick={() => navigate("/")}
        className="p-6 flex items-center justify-center gap-3 cursor-pointer group border-b border-indigo-50/50 hover:bg-indigo-50/30 transition-colors"
      >
        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-sky-500 p-2.5 rounded-xl shadow-lg shadow-indigo-200 group-hover:shadow-indigo-300 transition-all duration-300 group-hover:scale-110">
           <FaPeopleGroup className="text-white text-xl" />
        </div>
        <h1 className="text-xl font-black tracking-tight text-gray-800 uppercase group-hover:text-indigo-600 transition-colors">
          Task Buddy
        </h1>
      </div>

      <div className="flex flex-col items-center justify-center py-8">
        <div className="relative group cursor-pointer" onClick={() => navigate("/user/dashboard")}>
          <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500 via-purple-500 to-sky-500 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
          <div className="relative w-24 h-24 rounded-full p-1 bg-white ring-2 ring-indigo-50 overflow-hidden">
            {currentUser?.profileImageUrl ? (
              <img
                src={currentUser?.profileImageUrl}
                alt="Profile"
                className="w-full h-full object-cover rounded-full shadow-inner"
              />
            ) : (
              <div className="w-full h-full bg-slate-50 flex items-center justify-center rounded-full">
                 <ThreeDAvatar />
              </div>
            )}
          </div>
          
          {currentUser?.role === "admin" && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-lg border-2 border-white tracking-widest">
              ADMIN
            </div>
          )}
        </div>

        <div className="mt-5 text-center px-4">
          <h5 className="text-lg font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 tracking-tight">
            {currentUser?.name || "User"}
          </h5>
          <p className="text-xs font-semibold text-indigo-500 mt-1 bg-indigo-50 px-3 py-1 rounded-lg inline-block">
            {currentUser?.email || ""}
          </p>
        </div>
      </div>

      <div className="flex-1 px-4 space-y-3 overflow-y-auto custom-scrollbar pb-4">
        {SideMenuData.map((item, index) => {
          const isActive = activeMenu === item.label
          
          return (
            <button
              key={`menu_${index}`}
              onClick={() => handleClick(item.path)}
              className={`
                group relative w-full flex items-center gap-4 text-sm font-bold py-3.5 px-6 rounded-2xl transition-all duration-300 ease-out cursor-pointer
                ${
                  isActive
                    ? "text-white shadow-[0_10px_20px_-10px_rgba(99,102,241,0.5)] translate-x-1"
                    : "text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 hover:translate-x-1"
                }
              `}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-400 rounded-2xl -z-10"></div>
              )}

              <div className={`
                flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300
                ${isActive ? "bg-white/20 backdrop-blur-sm" : "bg-white shadow-sm group-hover:shadow-md group-hover:scale-110"}
              `}>
                <item.icon className={`text-lg ${isActive ? "text-white" : "text-indigo-400 group-hover:text-indigo-600"}`} />
              </div>

              <span className="tracking-wide">{item.label}</span>

              {isActive && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse shadow-lg"></div>
              )}
            </button>
          )
        })}
      </div>

      <div className="p-4 mt-auto">
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 rounded-full opacity-20"></div>
      </div>
    </div>
  )
}

export default SideMenu