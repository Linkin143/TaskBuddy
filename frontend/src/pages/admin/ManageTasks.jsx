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
  const [tabs, setTabs] = useState("All")
  const [filterStatus, setFilterStatus] = useState("All")
  const [isDownloading, setIsDownloading] = useState(false)

  console.log(tabs)

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

  // --- REPORT DOWNLOAD LOGIC ---
  const handleDownloadReport = async () => {
    setIsDownloading(true)
    try {
      const response = await axiosInstance.get("/reports/export/tasks", {
        responseType: "blob",
      })

      // create a url for the blob
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

    return () => { }
  }, [filterStatus])

  return (
    <DashboardLayout activeMenu={"Manage Task"}>
      <div className="my-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <div className="flex items-center justify-between gap-4 w-full md:w-auto ">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Manage Tasks
            </h2>

            <button
              className="md:hidden px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium shadow-sm hover:shadow-md cursor-pointer"
              onClick={handleDownloadReport}
              type="button"
            >
              Download
            </button>
          </div>

          {allTasks?.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />

              {/* Download Button */}
              <button
                onClick={handleDownloadReport}
                disabled={isDownloading}
                className={`
                              group relative flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300
                              shadow-[0_4px_10px_-2px_rgba(99,102,241,0.3)] hover:shadow-[0_10px_20px_-5px_rgba(99,102,241,0.4)] hover:-translate-y-0.5 hover:cursor-pointer
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
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allTasks?.map((item, index) => (
            <TaskCard
              key={item._id}
              title={item.title}
              description={item.description}
              priority={item.priority}
              status={item.status}
              progress={item.progress}
              createdAt={item.createdAt}
              dueDate={item.dueDate}
              assignedTo={item.assignedTo?.map((item) => item.profileImageUrl)}
              attachmentCount={item.attachments?.length || 0}
              completedTodoCount={item.completedTodoCount || 0}
              todoChecklist={item.todoChecklist || []}
              onClick={() => handleClick(item)}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ManageTasks
