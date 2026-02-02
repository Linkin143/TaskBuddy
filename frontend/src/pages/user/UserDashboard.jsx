import moment from "moment"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import CustomBarChart from "../../components/CustomBarChart"
import CustomPieChart from "../../components/CustomPieChart"
import DashboardLayout from "../../components/DashboardLayout"
import RecentTasks from "../../components/RecentTasks"
import axiosInstance from "../../utils/axioInstance"

const COLORS = ["#818cf8", "#c084fc", "#38bdf8"]

const UserDashboard = () => {
  const navigate = useNavigate()

  const { currentUser } = useSelector((state) => state.user)

  const [dashboardData, setDashboardData] = useState([])
  const [pieChartData, setPieChartData] = useState([])
  const [barChartData, setBarChartData] = useState([])

  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || {}
    const taskPriorityLevels = data?.taskPriorityLevel || {}

    const taskDistributionData = [
      { status: "Pending", count: taskDistribution?.Pending || 0 },
      { status: "In Progress", count: taskDistribution?.InProgress || 0 },
      { status: "Completed", count: taskDistribution?.Completed || 0 },
    ]

    setPieChartData(taskDistributionData)

    const priorityLevelData = [
      { priority: "Low", count: taskPriorityLevels?.Low || 0 },
      { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
      { priority: "High", count: taskPriorityLevels?.High || 0 },
    ]

    setBarChartData(priorityLevelData)
  }

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get("/tasks/user-dashboard-data")

      if (response.data) {
        setDashboardData(response.data)
        prepareChartData(response.data?.charts || null)
      }
    } catch (error) {
      console.log("Error fetching user dashboard data: ", error)
    }
  }

  useEffect(() => {
    getDashboardData()

    return () => {}
  }, [])

  const handleTaskClick = (task) => {
    if (task?._id) {
      navigate(`/user/task-details/${task._id}`)
    }
  }

  const StatCard = ({ title, count, colorFrom, colorTo, iconPath }) => (
    <div className="relative bg-white rounded-2xl p-5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-3xl font-black text-gray-800">{count}</h3>
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorFrom} ${colorTo} shadow-lg flex items-center justify-center text-white transform rotate-3`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {iconPath}
          </svg>
        </div>
      </div>
    </div>
  )

  return (
    <DashboardLayout activeMenu={"Dashboard"}>
      <div className="p-6 space-y-8 bg-gray-50/50 min-h-screen">
        
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-500 p-8 shadow-xl text-white">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-sky-400 opacity-20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Hello, {currentUser?.name} 👋
              </h2>
              <p className="text-indigo-100 mt-2 text-lg font-medium opacity-90">
                {moment().format("dddd, Do MMMM YYYY")}
              </p>
            </div>
            
            <button 
              onClick={() => navigate('/user/create-task')}
              className="group flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold shadow-lg hover:bg-indigo-50 transition-all duration-200 transform hover:scale-105 active:scale-95 hover:cursor-pointer"
            >
              <span className="bg-indigo-100 p-1 rounded-md group-hover:bg-indigo-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </span>
              Create New Task
            </button>
          </div>
        </div>

        {dashboardData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Total Tasks" 
                count={dashboardData?.charts?.taskDistribution?.All || 0}
                colorFrom="from-blue-500"
                colorTo="to-indigo-600"
                iconPath={<path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />}
              />
              <StatCard 
                title="Pending" 
                count={dashboardData?.charts?.taskDistribution?.Pending || 0}
                colorFrom="from-yellow-400"
                colorTo="to-orange-500"
                iconPath={<path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
              />
              <StatCard 
                title="In Progress" 
                count={dashboardData?.charts?.taskDistribution?.InProgress || 0}
                colorFrom="from-sky-400"
                colorTo="to-blue-500"
                iconPath={<path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />}
              />
              <StatCard 
                title="Completed" 
                count={dashboardData?.charts?.taskDistribution?.Completed || 0}
                colorFrom="from-green-400"
                colorTo="to-emerald-600"
                iconPath={<path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-[0_20px_50px_rgb(0,0,0,0.1)] border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 rounded-full blur-2xl opacity-60 -mr-10 -mt-10"></div>
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
                  Task Distribution
                </h3>
                <div className="h-72 w-full flex justify-center items-center">
                  <CustomPieChart
                    data={pieChartData}
                    label="Total Balance"
                    colors={COLORS}
                  />
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-[0_20px_50px_rgb(0,0,0,0.1)] border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-sky-100 rounded-full blur-2xl opacity-60 -mr-10 -mt-10"></div>
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span className="w-2 h-8 bg-sky-500 rounded-full"></span>
                  Priority Levels
                </h3>
                <div className="h-72 w-full">
                  <CustomBarChart data={barChartData} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-2">
                 <RecentTasks 
                   tasks={dashboardData?.recentTasks} 
                   onTaskClick={handleTaskClick}
                 />
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

export default UserDashboard