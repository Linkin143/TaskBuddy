import moment from "moment"
import { useEffect, useState } from "react"
import { FaCheck, FaExternalLinkAlt } from "react-icons/fa"
import { MdAssignment, MdAttachFile, MdCalendarToday, MdDescription, MdPerson } from "react-icons/md"
import { useParams } from "react-router-dom"
import DashboardLayout from "../../components/DashboardLayout"
import axiosInstance from "../../utils/axioInstance"

// --- 3D Avatar Component ---
const ThreeDAvatar = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
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

const TaskDetails = () => {
  const { id } = useParams()
  const [task, setTask] = useState(null)

  // 3D/Gradient Status Styles
  const getStatusStyle = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-[0_4px_10px_-2px_rgba(56,189,248,0.4)]"
      case "Completed":
        return "bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-[0_4px_10px_-2px_rgba(16,185,129,0.4)]"
      default: // Pending
        return "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-[0_4px_10px_-2px_rgba(251,191,36,0.4)]"
    }
  }

  const getTaskDetailsById = async () => {
    try {
      const response = await axiosInstance.get(`/tasks/${id}`)
      if (response.data) {
        setTask(response.data)
      }
    } catch (error) {
      console.log("Error fetching task details: ", error)
    }
  }

  const updateTodoChecklist = async (index) => {
    const todoChecklist = [...task?.todoChecklist]
    
    if (todoChecklist && todoChecklist[index]) {
      todoChecklist[index].completed = !todoChecklist[index].completed

      try {
        const response = await axiosInstance.put(`/tasks/${id}/todo`, {
          todoChecklist,
        })

        if (response.status === 200) {
          setTask(response.data?.task || task)
        } else {
          // Revert if failed
          todoChecklist[index].completed = !todoChecklist[index].completed
        }
      } catch (error) {
        // Revert on error
        todoChecklist[index].completed = !todoChecklist[index].completed
      }
    }
  }

  const handleLinkClick = (link) => {
    if (!/^https?:\/\//i.test(link)) {
      link = "https://" + link
    }
    window.open(link, "_blank")
  }

  useEffect(() => {
    if (id) {
      getTaskDetailsById()
    }
  }, [id])

  return (
    <DashboardLayout activeMenu={"My Tasks"}>
      <div className="p-6 bg-gray-50/50 min-h-screen">
        {task && (
          <div className="max-w-5xl mx-auto space-y-6">
            
            {/* Main Card */}
            <div className="bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden border border-indigo-50">
              
              {/* Header Gradient */}
              <div className="relative px-8 py-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-500">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                       <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${getStatusStyle(task?.status)}`}>
                          {task?.status}
                       </span>
                       <span className="text-indigo-100 text-xs font-semibold bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                          ID: {task?._id?.slice(-6)}
                       </span>
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight leading-tight">
                      {task?.title}
                    </h2>
                  </div>
                  
                  {/* Priority Badge (3D Look) */}
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-xl flex flex-col items-center min-w-[100px]">
                      <span className="text-indigo-100 text-[10px] font-bold uppercase tracking-wider mb-1">Priority</span>
                      <span className={`text-lg font-black ${
                        task?.priority === 'High' ? 'text-rose-300' : 
                        task?.priority === 'Medium' ? 'text-amber-300' : 'text-emerald-300'
                      }`}>
                        {task?.priority}
                      </span>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {/* Description Section */}
                <div className="mb-8">
                   <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
                      <MdDescription className="text-indigo-500 text-xl" />
                      Description
                   </h3>
                   <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-gray-600 leading-relaxed font-medium shadow-inner">
                      {task?.description}
                   </div>
                </div>

                {/* Grid Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                   
                   {/* Due Date Card */}
                   <InfoBox 
                      icon={<MdCalendarToday className="text-sky-500" />}
                      label="Due Date"
                      value={task?.dueDate ? moment(task?.dueDate).format("dddd, Do MMMM YYYY") : "N/A"}
                      color="bg-sky-50 border-sky-100"
                   />

                   {/* Assigned To Card */}
                   <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                         <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                            <MdPerson />
                         </div>
                         <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">Assigned To</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {task?.assignedTo?.map((user, idx) => (
                           <div key={idx} className="flex items-center gap-2 bg-white pr-4 rounded-full border border-indigo-100 shadow-sm p-1">
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100">
                                 {user?.profileImageUrl ? (
                                    <img src={user.profileImageUrl} alt="user" className="w-full h-full object-cover" />
                                 ) : (
                                    <ThreeDAvatar />
                                 )}
                              </div>
                              <span className="text-sm font-bold text-gray-700">{user?.name}</span>
                           </div>
                        ))}
                        {(!task?.assignedTo || task?.assignedTo.length === 0) && (
                           <span className="text-sm text-gray-400 font-medium italic">No members assigned</span>
                        )}
                      </div>
                   </div>
                </div>

                {/* Checklist Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                       <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800">
                          <MdAssignment className="text-purple-500 text-xl" />
                          Checklist
                       </h3>
                       <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                          {task?.todoChecklist?.filter(t => t.completed).length} / {task?.todoChecklist?.length} Done
                       </span>
                    </div>

                    <div className="space-y-3">
                      {task?.todoChecklist?.map((item, index) => (
                        <TodoCheckList
                          key={`todo_${index}`}
                          text={item.text}
                          isChecked={item?.completed}
                          onChange={() => updateTodoChecklist(index)}
                        />
                      ))}
                      {task?.todoChecklist?.length === 0 && (
                         <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-400 font-medium">
                            No sub-tasks added
                         </div>
                      )}
                    </div>
                </div>

                {/* Attachments Section */}
                {task?.attachments?.length > 0 && (
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
                       <MdAttachFile className="text-orange-500 text-xl" />
                       Attachments
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {task?.attachments?.map((link, index) => (
                        <Attachment
                          key={`link_${index}`}
                          link={link}
                          index={index}
                          onClick={() => handleLinkClick(link)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

// --- Sub-Components ---

const InfoBox = ({ icon, label, value, color }) => {
  return (
    <div className={`${color} rounded-2xl p-5 shadow-sm transition-transform hover:scale-[1.02] duration-300`}>
       <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-white rounded-lg shadow-sm">
             {icon}
          </div>
          <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">{label}</span>
       </div>
       <p className="text-lg font-bold text-gray-800 pl-1">{value}</p>
    </div>
  )
}

const TodoCheckList = ({ text, isChecked, onChange }) => {
  return (
    <div 
      onClick={onChange}
      className={`
        flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 cursor-pointer group
        ${isChecked 
            ? "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 shadow-inner" 
            : "bg-white border-gray-200 shadow-[0_4px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md hover:border-indigo-200"
        }
      `}
    >
      {/* Custom 3D Checkbox */}
      <div className={`
         w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300 border-2
         ${isChecked 
            ? "bg-emerald-500 border-emerald-500 shadow-[0_2px_5px_rgba(16,185,129,0.4)]" 
            : "bg-white border-gray-300 group-hover:border-indigo-400"
         }
      `}>
         {isChecked && <FaCheck className="text-white text-xs" />}
      </div>

      <p className={`text-sm font-semibold transition-colors duration-300 ${isChecked ? "text-emerald-700 line-through opacity-70" : "text-gray-700"}`}>
         {text}
      </p>
    </div>
  )
}

const Attachment = ({ link, index, onClick }) => {
  return (
    <div
      className="group flex items-center justify-between bg-white border border-gray-200 p-4 rounded-xl cursor-pointer shadow-sm hover:shadow-[0_10px_20px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:border-indigo-200 transition-all duration-300"
      onClick={onClick}
    >
      <div className="flex items-center gap-4 overflow-hidden">
        <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 font-bold shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-colors">
           {index + 1}
        </div>
        <div className="flex flex-col min-w-0">
           <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">File</span>
           <p className="text-sm font-semibold text-gray-700 truncate w-full group-hover:text-indigo-600 transition-colors">
             {link}
           </p>
        </div>
      </div>

      <div className="p-2 bg-gray-50 rounded-full group-hover:bg-indigo-50 transition-colors">
         <FaExternalLinkAlt className="text-gray-400 text-xs group-hover:text-indigo-500" />
      </div>
    </div>
  )
}

export default TaskDetails