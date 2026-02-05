import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdCloudDownload } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import TaskCard from "../../components/TaskCard";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import axiosInstance from "../../utils/axioInstance";

const MyTask = () => {
  const [allTasks, setAllTasks] = useState([])
  const [tabs, setTabs] = useState([
    { label: "All", count: 0 },
    { label: "Pending", count: 0 },
    { label: "In Progress", count: 0 },
    { label: "Completed", count: 0 },
  ])
  const [filterStatus, setFilterStatus] = useState("All")
  const [isDownloading, setIsDownloading] = useState(false) 

  const navigate = useNavigate()

  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get("/tasks", {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      })

      if (response?.data) {
        setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : [])
      }

      const statusSummary = response.data?.statusSummary || {}

      setTabs([
        { label: "All", count: statusSummary.all || 0 },
        { label: "Pending", count: statusSummary.pendingTasks || 0 },
        { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
        { label: "Completed", count: statusSummary.completedTasks || 0 },
      ])
    } catch (error) {
      console.log("Error fetching tasks: ", error)
    }
  }

  const handleDownloadReport = async () => {
    setIsDownloading(true)
    try {
      const response = await axiosInstance.get("/reports/export/tasks", {
        responseType: "blob",
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "tasks_details.xlsx")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success("Report downloaded successfully!")
    } catch (error) {
      console.log("Error downloading task-details report: ", error)
      toast.error("Error downloading task-details report. Please try again!")
    } finally {
      setIsDownloading(false)
    }
  }

  const handleClick = (taskId) => {
    navigate(`/user/task-details/${taskId}`)
  }

  useEffect(() => {
    getAllTasks(filterStatus)
  }, [filterStatus])

  return (
    <DashboardLayout activeMenu={"My Tasks"}>
      {/* Responsive Container */}
      <div className="min-h-screen py-4 px-4 sm:py-6 sm:px-6 lg:px-8">

        {/* Header Section: Stacks on small screens, side-by-side on extra large */}
        <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-800 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-800">
              My Tasks
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
            {/* Status Tabs: Ensure TaskStatusTabs is also styled for overflow internally */}
            <div className="w-full overflow-x-auto pb-2 md:pb-0">
                <TaskStatusTabs
                  tabs={tabs}
                  activeTab={filterStatus}
                  setActiveTab={setFilterStatus}
                />
            </div>

            <button
              onClick={handleDownloadReport}
              disabled={isDownloading}
              className={`
                group relative flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300
                shadow-[0_4px_10px_-2px_rgba(99,102,241,0.3)] hover:shadow-[0_10px_20px_-5px_rgba(99,102,241,0.4)] hover:-translate-y-0.5
                w-full sm:w-auto
                ${isDownloading
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                  : "bg-white text-indigo-600 border border-indigo-100 hover:border-indigo-300"
                }
              `}
            >
              {isDownloading ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
              ) : (
                <div className="p-1.5 bg-indigo-50 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                  <MdCloudDownload className="text-lg" />
                </div>
              )}
              <span>{isDownloading ? "Downloading..." : "Export Report"}</span>
            </button>
          </div>
        </div>

        {/* Task Grid: Responsive Column Count */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
          {allTasks?.length > 0 ? (
            allTasks?.map((item) => (
              <TaskCard
                key={item._id}
                title={item.title}
                description={item.description}
                priority={item.priority}
                status={item.status}
                assignedTo={item.assignedTo || []}
                createdAt={item.createdAt}
                dueDate={item.dueDate}
                attachmentCount={item.attachments?.length || 0}
                todoChecklist={item.todoChecklist || []}
                completedTodoCount={item.completedTodoCount || 0}
                onClick={() => handleClick(item._id)}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 sm:py-24 text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <span className="text-3xl sm:text-4xl">📝</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-700">No tasks found</h3>
              <p className="text-gray-400 mt-2 text-sm sm:base px-4">Try changing the filter or create a new task.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default MyTask