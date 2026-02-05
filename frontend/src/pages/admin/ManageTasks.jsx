import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdCloudDownload } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import TaskCard from "../../components/TaskCard";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import axiosInstance from "../../utils/axioInstance";

const ManageTasks = () => {
  const [allTasks, setAllTasks] = useState([])
  const [tabs, setTabs] = useState([])
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

      const statusArray = [
        { label: "All", count: statusSummary.all || 0 },
        { label: "Pending", count: statusSummary.pendingTasks || 0 },
        { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
        { label: "Completed", count: statusSummary.completedTasks || 0 },
      ]

      setTabs(statusArray)
    } catch (error) {
      console.log("Error fetching tasks: ", error)
    }
  }

  const handleClick = (taskData) => {
    navigate("/user/create-task", { state: { taskId: taskData._id } })
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

  useEffect(() => {
    getAllTasks(filterStatus)
  }, [filterStatus])

  return (
    <DashboardLayout activeMenu={"Manage Task"}>
      <div className="my-4 md:my-6 px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">
              Manage Tasks
            </h2>

            {/* Export Button for Desktop/Tablet */}
            <button
              onClick={handleDownloadReport}
              disabled={isDownloading}
              className={`
                hidden sm:flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300
                shadow-[0_4px_10px_-2px_rgba(99,102,241,0.3)] hover:shadow-[0_10px_20px_-5px_rgba(99,102,241,0.4)] hover:-translate-y-0.5
                ${isDownloading
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                  : "bg-white text-indigo-600 border border-indigo-100 hover:border-indigo-300"
                }
              `}
            >
              {isDownloading ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
              ) : (
                <MdCloudDownload className="text-xl" />
              )}
              <span>{isDownloading ? "Downloading..." : "Export Report"}</span>
            </button>
          </div>

          {/* Filters and Mobile Action */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />
            </div>

            {/* Export Button for Mobile (Full Width) */}
            <button
              onClick={handleDownloadReport}
              disabled={isDownloading}
              className={`
                sm:hidden flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm transition-all
                ${isDownloading
                  ? "bg-gray-100 text-gray-400"
                  : "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                }
              `}
            >
              {isDownloading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <MdCloudDownload className="text-xl" />
              )}
              {isDownloading ? "Downloading..." : "Export Report"}
            </button>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {allTasks?.length > 0 ? (
            allTasks.map((item) => (
              <TaskCard
                key={item._id}
                title={item.title}
                description={item.description}
                priority={item.priority}
                status={item.status}
                progress={item.progress}
                createdAt={item.createdAt}
                dueDate={item.dueDate}
                assignedTo={item.assignedTo?.map((u) => u.profileImageUrl)}
                attachmentCount={item.attachments?.length || 0}
                completedTodoCount={item.completedTodoCount || 0}
                todoChecklist={item.todoChecklist || []}
                onClick={() => handleClick(item)}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
              <div className="text-5xl mb-4 opacity-20">📂</div>
              <h3 className="text-lg font-bold text-gray-600">No tasks found</h3>
              <p className="text-gray-400">Try adjusting your filters or create a new task.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ManageTasks;