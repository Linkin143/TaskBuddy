
const UserCard = ({ userInfo }) => {
  return (
    <div className="p-3 sm:p-4 bg-white rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={userInfo?.profileImageUrl}
            alt={userInfo?.name}
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
          />

          <div className="min-w-0">
            <p className="text-base sm:text-lg font-bold text-gray-800 truncate">
              {userInfo?.name}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 truncate">
              {userInfo?.email}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 mt-4 sm:mt-5">
        <StatCard
          label="Pending"
          count={userInfo?.pendingTasks || 0}
          status="pending"
        />

        <StatCard
          label="In Progress"
          count={userInfo?.inProgressTasks || 0}
          status="in-progress"
        />

        <StatCard
          label="Completed"
          count={userInfo?.completedTasks || 0}
          status="completed"
        />
      </div>
    </div>
  )
}

export default UserCard

const StatCard = ({ label, count, status }) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-100"
      case "in-progress":
        return "bg-blue-50 text-blue-700 border-blue-100"
      case "completed":
        return "bg-green-50 text-green-700 border-green-100"
      default:
        return "bg-gray-50 text-gray-700 border-gray-100"
    }
  }

  return (
    <div
      className={`flex flex-1 items-center justify-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg border text-[10px] sm:text-xs font-bold whitespace-nowrap transition-colors ${getStatusTagColor()}`}
    >
      <span className="text-xs sm:text-sm">{count}</span>
      <span className="opacity-80">{label}</span>
    </div>
  )
}