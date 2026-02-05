
const Progress = ({ progress, status }) => {
  const getColor = () => {
    switch (status) {
      case "In Progress":
        return "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.4)]"

      case "Completed":
        return "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]"

      default:
        return "bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.4)]"
    }
  }

  return (
    <div className="w-full h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200/50">
      <div
        className={`${getColor()} h-full rounded-full transition-all duration-700 ease-out`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  )
}

export default Progress