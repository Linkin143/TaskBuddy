import moment from "moment"
import { MdArrowForward } from "react-icons/md"
import { useNavigate } from "react-router-dom"

const RecentTasks = ({ tasks, onTaskClick }) => {
  const navigate = useNavigate()

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-[0_4px_10px_-2px_rgba(16,185,129,0.4)]"
      case "In Progress":
        return "bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-[0_4px_10px_-2px_rgba(56,189,248,0.4)]"
      case "Pending":
        return "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-[0_4px_10px_-2px_rgba(251,191,36,0.4)]"
      default:
        return "bg-gray-100 text-gray-500"
    }
  }

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High":
        return "text-rose-600 bg-rose-50 border border-rose-100"
      case "Medium":
        return "text-indigo-600 bg-indigo-50 border border-indigo-100"
      case "Low":
        return "text-sky-600 bg-sky-50 border border-sky-100"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-indigo-50 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full blur-3xl opacity-50 -mr-10 -mt-10 pointer-events-none"></div>

      <div className="p-5 sm:p-8 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 relative z-10">
        <div>
          <h3 className="text-xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-500 bg-clip-text text-transparent">
            Recent Tasks
          </h3>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">Overview of your latest activity</p>
        </div>

        <button
          onClick={() => navigate("/user/tasks")}
          className="group w-fit flex items-center gap-2 text-indigo-600 hover:text-purple-600 font-bold transition-all px-4 py-2 rounded-xl hover:bg-indigo-50 text-sm sm:text-base"
        >
          See More
          <MdArrowForward className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="p-2 sm:p-6">
        {tasks?.length > 0 ? (
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-4 sm:px-6 py-4 text-left text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                      Task Name
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                      Status
                    </th>
                    <th className="hidden md:table-cell px-4 sm:px-6 py-4 text-left text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                      Priority
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                      Created On
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">
                  {tasks.map((task) => (
                    <tr
                      key={task._id}
                      onClick={() => onTaskClick && onTaskClick(task)}
                      className="group transition-all duration-300 hover:bg-gradient-to-r hover:from-indigo-50/40 hover:to-purple-50/40 hover:shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] transform hover:-translate-y-0.5 rounded-xl cursor-pointer"
                    >
                      <td className="px-4 sm:px-6 py-4 sm:py-5 whitespace-nowrap">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-indigo-400 group-hover:bg-purple-500 transition-colors flex-shrink-0"></div>
                          <div className="text-xs sm:text-sm font-bold text-gray-700 group-hover:text-indigo-700 transition-colors truncate max-w-[120px] sm:max-w-xs">
                            {task.title}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 sm:px-6 py-4 sm:py-5 whitespace-nowrap">
                        <span
                          className={`px-2 sm:px-4 py-1 sm:py-1.5 inline-flex text-[10px] sm:text-xs font-bold rounded-lg tracking-wide ${getStatusStyle(
                            task.status
                          )}`}
                        >
                          {task.status}
                        </span>
                      </td>

                      <td className="hidden md:table-cell px-4 sm:px-6 py-4 sm:py-5 whitespace-nowrap">
                        <span
                          className={`px-2 sm:px-3 py-0.5 sm:py-1 inline-flex text-[10px] sm:text-xs font-bold rounded-md uppercase tracking-wider shadow-sm ${getPriorityStyle(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                      </td>

                      <td className="px-4 sm:px-6 py-4 sm:py-5 whitespace-nowrap text-[10px] sm:text-sm font-medium text-gray-500">
                        <span className="sm:hidden">{moment(task.createdAt).format("MMM D")}</span>
                        <span className="hidden sm:inline">{moment(task.createdAt).format("MMM Do, YYYY")}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 sm:py-12 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-inner mb-4">
              <span className="text-2xl sm:text-3xl">📭</span>
            </div>
            <p className="text-gray-500 font-medium text-base sm:text-lg">No recent tasks found</p>
            <p className="text-gray-400 text-xs sm:text-sm">Create a task to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecentTasks;