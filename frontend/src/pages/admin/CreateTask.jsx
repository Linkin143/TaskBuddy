import { useEffect, useState } from "react"
import DatePicker from "react-datepicker"
import { MdDateRange, MdDelete, MdDescription, MdLowPriority, MdOutlineTitle } from "react-icons/md"
import { useLocation, useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/DashboardLayout"

import moment from "moment"
import "react-datepicker/dist/react-datepicker.css"
import toast from "react-hot-toast"
import AddAttachmentsInput from "../../components/AddAttachmentsInput"
import DeleteAlert from "../../components/DeleteAlert"
import Modal from "../../components/Modal"
import SelectedUsers from "../../components/SelectedUsers"
import TodoListInput from "../../components/TodoListInput"
import axiosInstance from "../../utils/axioInstance"

// --- 3D Avatar Component (Use this in your SelectedUsers component) ---
export const ThreeDAvatar = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
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

const CreateTask = () => {
  const location = useLocation()
  const { taskId } = location.state || {}

  const navigate = useNavigate()

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: null,
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  })

  const [currentTask, setCurrentTask] = useState(null)

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false)

  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({
      ...prevData,
      [key]: value,
    }))
  }

  const clearData = () => {
    // reset form data
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: null,
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    })
  }

  // create task
  const createTask = async () => {
    try {
      const todolist = taskData.todoChecklist?.map((item) => ({
        text: item,
        completed: false,
      }))

      const response = await axiosInstance.post("/tasks/create", {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todolist,
      })

      toast.success("Task created successfully!")

      clearData();

      navigate("/user/tasks");

      // console.log(response.data)
    } catch (error) {
      console.log("Error creating task: ", error)
      toast.error("Error creating task!")
    }
  }

  // update task
  const updateTask = async () => {
    try {
      const todolist = taskData.todoChecklist?.map((item) => {
        const prevTodoChecklist = currentTask?.todoChecklist || []
        const matchedTask = prevTodoChecklist.find((task) => task.text === item)

        return {
          text: item,
          completed: matchedTask ? matchedTask.completed : false,
        }
      })

      const response = await axiosInstance.put(`/tasks/${taskId}`, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todolist,
      })

      toast.success("Task updated successfully!")
      
      navigate("/user/tasks")
      console.log(response.data)
    } catch (error) {
      console.log("Error updating task: ", error)
      toast.error("Error updating task!")
    }
  }

  const handleSubmit = async (e) => {
    setError("")

    if (!taskData.title.trim()) {
      setError("Title is required!")
      return
    }

    if (!taskData.description.trim()) {
      setError("Description is required!")
      return
    }

    if (!taskData.dueDate) {
      setError("Due date is required!")
      return
    }

    if (taskData.assignedTo?.length === 0) {
      setError("Task is not assigned to any member!")
      return
    }

    if (taskData.todoChecklist?.length === 0) {
      setError("Add atleast one todo task!")
      return
    }

    if (taskId) {
      updateTask()

      return
    }

    createTask()
  }

  // get task info by id
  const getTaskDetailsById = async () => {
    try {
      const response = await axiosInstance.get(`/tasks/${taskId}`)

      if (response.data) {
        const taskInfo = response.data
        setCurrentTask(taskInfo)

        setTaskData((prevState) => ({
          ...prevState,
          title: taskInfo?.title,
          description: taskInfo?.description,
          priority: taskInfo?.priority,
          dueDate: taskInfo?.dueDate
            ? moment(taskInfo?.dueDate).format("YYYY-MM-DD")
            : null,
          assignedTo: taskInfo?.assignedTo?.map((item) => item?._id || []),
          todoChecklist:
            taskInfo?.todoChecklist?.map((item) => item?.text) || [],
          attachments: taskInfo?.attachments || [],
        }))
      }
    } catch (error) {
      console.log("Error fetching task details: ", error)
    }
  }

  // delete task
  const deleteTask = async () => {
    try {
      await axiosInstance.delete(`/tasks/${taskId}`)

      setOpenDeleteAlert(false)

      toast.success("Task deleted successfully!")

      navigate("/admin/tasks")
    } catch (error) {
      console.log("Error delating task: ", error)
    }
  }

  useEffect(() => {
    if (taskId) {
      getTaskDetailsById(taskId)
    }

    return () => {}
  }, [taskId])

  // Helper styles for inputs - Updated font size to text-sm and simplified classes
  const inputContainerStyle = "relative flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 transition-all duration-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-200 focus-within:border-indigo-400 focus-within:shadow-[0_4px_12px_rgba(99,102,241,0.1)]"
  
  // Standardized Label Style - Semibold for hierarchy, text-sm for classic dashboard feel
  const labelStyle = "block text-sm font-semibold text-gray-700 mb-1.5 ml-1"

  return (
    <DashboardLayout activeMenu={"Create Task"}>
      <div className="p-6 bg-gray-50/50 min-h-screen">
        
        {/* Main Card */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100">
          
          {/* Header */}
          <div className="px-8 py-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-500 flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            
            {/* Standardized Header Font */}
            <h2 className="text-2xl font-bold text-white tracking-wide relative z-10">
              {taskId ? "Update Task Details" : "Create New Task"}
            </h2>

            {taskId && (
              <button
                className="group relative z-10 flex items-center gap-2 bg-white/20 hover:bg-red-500 text-white px-4 py-2 rounded-xl hover:cursor-pointer transition-all duration-300 backdrop-blur-sm border border-white/30 hover:border-red-400"
                onClick={() => setOpenDeleteAlert(true)}
              >
                <MdDelete className="text-xl" /> 
                <span className="font-medium text-sm">Delete</span>
              </button>
            )}
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded-r-lg shadow-sm flex items-center animate-pulse">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-7">
                
                {/* Title Section */}
                <div>
                  <label className={labelStyle}>Task Title <span className="text-red-500">*</span></label>
                  <div className={inputContainerStyle}>
                    <MdOutlineTitle className="text-indigo-400 text-lg mr-3" />
                    <input
                      type="text"
                      placeholder="e.g. Redesign Dashboard UI"
                      // Standardized input font: text-sm, text-gray-900 (darker), font-normal
                      className="w-full bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-400 text-sm"
                      value={taskData.title}
                      onChange={(e) => handleValueChange("title", e.target.value)}
                    />
                  </div>
                </div>

                {/* Description Section */}
                <div>
                  <label className={labelStyle}>Description <span className="text-red-500">*</span></label>
                  <div className={`${inputContainerStyle} items-start`}>
                    <MdDescription className="text-indigo-400 text-lg mr-3 mt-1" />
                    <textarea
                      placeholder="Detailed explanation of the task..."
                      rows={4}
                      className="w-full bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-400 text-sm resize-none"
                      value={taskData.description}
                      onChange={(e) => handleValueChange("description", e.target.value)}
                    />
                  </div>
                </div>

                {/* Grid: Priority & Due Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelStyle}>Priority Level</label>
                    <div className={inputContainerStyle}>
                      <MdLowPriority className="text-indigo-400 text-lg mr-3" />
                      <select
                        className="w-full bg-transparent border-none focus:outline-none text-gray-900 text-sm cursor-pointer"
                        value={taskData.priority}
                        onChange={(e) => handleValueChange("priority", e.target.value)}
                      >
                        <option value="Low">🟢 Low Priority</option>
                        <option value="Medium">🟠 Medium Priority</option>
                        <option value="High">🔴 High Priority</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelStyle}>Due Date <span className="text-red-500">*</span></label>
                    <div className={inputContainerStyle}>
                      <MdDateRange className="text-indigo-400 text-lg mr-3 z-10" />
                      <div className="w-full">
                        <DatePicker
                          selected={taskData.dueDate}
                          onChange={(data) => handleValueChange("dueDate", data)}
                          minDate={new Date()}
                          placeholderText="Select deadline"
                          className="w-full bg-transparent border-none focus:outline-none text-gray-900 text-sm cursor-pointer"
                          dateFormat="MMMM d, yyyy"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assign To Section */}
                <div>
                   <label className={labelStyle}>Assign To Team Members</label>
                   <div className="p-1">
                      <SelectedUsers
                        selectedUser={taskData.assignedTo}
                        setSelectedUser={(value) => handleValueChange("assignedTo", value)}
                      />
                   </div>
                </div>

                {/* Todo Checklist */}
                <div>
                   <label className={labelStyle}>Sub-tasks & Checklist</label>
                   <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                      <TodoListInput
                        todoList={taskData?.todoChecklist}
                        setTodoList={(value) => handleValueChange("todoChecklist", value)}
                      />
                   </div>
                </div>

                {/* Attachments */}
                <div>
                   <label className={labelStyle}>Attachments</label>
                   <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                      <AddAttachmentsInput
                        attachments={taskData?.attachments}
                        setAttachments={(value) => handleValueChange("attachments", value)}
                      />
                   </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    // Updated Button Font: text-base, font-semibold (classic button style)
                    className="w-full py-3.5 hover:cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 text-white text-base font-semibold tracking-wide rounded-xl shadow-[0_10px_20px_-5px_rgba(99,102,241,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(99,102,241,0.5)] transform hover:-translate-y-1 transition-all duration-300"
                    onClick={handleSubmit}
                    type="button"
                  >
                    {taskId ? "Update Task Configuration" : "Create New Task"}
                  </button>
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title={"Delete Task"}
      >
        <DeleteAlert
          content="Are you sure you want to delete this task? This action cannot be undone."
          onDelete={() => deleteTask()}
        />
      </Modal>
    </DashboardLayout>
  )
}

export default CreateTask