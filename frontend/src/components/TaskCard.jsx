import moment from "moment"
import { FaFileLines } from "react-icons/fa6"
import { MdAccessTime, MdCalendarToday } from "react-icons/md"
import Progress from "./Progress"

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

const TaskCard = ({
  title,
  description,
  priority,
  status,
  createdAt,
  dueDate,
  assignedTo = [],
  attachmentCount,
  todoChecklist = [],
  onClick,
}) => {
  
  
  const totalTodos = todoChecklist?.length || 0;
  const activeCompletedCount = todoChecklist?.filter(todo => todo.completed).length || 0;
  const calculatedProgress = totalTodos > 0 ? (activeCompletedCount / totalTodos) * 100 : 0;

  const getStatusStyle = () => {
    switch (status) {
      case "Pending":
        return "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-[0_4px_10px_-2px_rgba(251,191,36,0.4)]"
      case "In Progress":
        return "bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-[0_4px_10px_-2px_rgba(56,189,248,0.4)]"
      case "Completed":
        return "bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-[0_4px_10px_-2px_rgba(16,185,129,0.4)]"
      default:
        return "bg-gray-200 text-gray-600"
    }
  }

  const getPriorityStyle = () => {
    switch (priority) {
      case "High":
        return "bg-red-50 text-red-600 border border-red-100"
      case "Medium":
        return "bg-orange-50 text-orange-600 border border-orange-100"
      case "Low":
        return "bg-blue-50 text-blue-600 border border-blue-100"
      default:
        return "bg-gray-50 text-gray-600"
    }
  }

  const getBorderColor = () => {
    if (status === "In Progress") return "bg-sky-500"
    if (status === "Completed") return "bg-emerald-500"
    return "bg-amber-500"
  }

  return (
    <div
      className="group relative bg-white rounded-2xl p-5 shadow-[0_10px_20px_-10px_rgba(0,0,0,0.05)] border border-indigo-50 cursor-pointer hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.2)] hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden font-sans"
      onClick={onClick}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${getBorderColor()} group-hover:w-2 transition-all duration-300`}></div>
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${getBorderColor()} blur-sm opacity-50`}></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4 pl-3">
        <div className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${getStatusStyle()}`}>
          {status}
        </div>
        <div className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${getPriorityStyle()}`}>
          {priority}
        </div>
      </div>

      {/* Content */}
      <div className="pl-3 mb-4">
        <h4 className="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {title}
        </h4>
        <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed font-medium">
          {description}
        </p>
      </div>

      
      <div className="pl-3 mb-5">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Progress</span>
          <span className="text-xs font-bold text-indigo-600">
             {activeCompletedCount} / {totalTodos}
          </span>
        </div>
        <Progress progress={calculatedProgress} status={status} />
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4"></div>

      {/* Footer */}
      <div className="pl-3 grid grid-cols-1 gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
             <MdCalendarToday className="text-indigo-400 text-xs" />
             <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Start</span>
                <span className="text-xs font-bold text-gray-700">{moment(createdAt).format("MMM Do")}</span>
             </div>
          </div>

          <div className="flex items-center gap-2">
             <MdAccessTime className="text-red-400 text-xs" />
             <div className="flex flex-col items-end">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Due</span>
                <span className="text-xs font-bold text-gray-700">{moment(dueDate).format("MMM Do")}</span>
             </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex -space-x-3 items-center">
            {assignedTo?.slice(0, 3).map((user, index) => (
              <div 
                key={index} 
                className="w-9 h-9 rounded-full border-2 border-white bg-slate-50 relative z-10 hover:z-20 hover:scale-110 transition-transform duration-200 shadow-sm"
                title={user.name}
              >
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt={user.name} 
                    className="w-full h-full object-cover rounded-full" 
                  />
                ) : (
                  <div className="w-full h-full p-[2px]">
                     <ThreeDAvatar />
                  </div>
                )}
              </div>
            ))}
            {assignedTo?.length > 3 && (
              <div className="w-9 h-9 rounded-full border-2 border-white bg-indigo-50 flex items-center justify-center relative z-0">
                <span className="text-xs font-bold text-indigo-600">+{assignedTo.length - 3}</span>
              </div>
            )}
          </div>

          {attachmentCount > 0 && (
            <div className="flex items-center gap-1.5 bg-white border border-gray-100 px-3 py-1.5 rounded-lg shadow-sm">
              <FaFileLines className="text-sky-500 text-sm" />
              <span className="text-xs font-bold text-gray-600">{attachmentCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskCard