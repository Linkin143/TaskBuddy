const TaskStatusTabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="my-2 sm:my-4 w-full overflow-x-auto no-scrollbar">
      <div className="inline-flex min-w-full sm:min-w-0 p-1 bg-gray-100/80 rounded-xl border border-gray-200">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.label

          return (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              type="button"
              className={`
                relative flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 ease-out cursor-pointer flex-1 sm:flex-none whitespace-nowrap
                ${
                  isActive
                    ? "bg-white text-indigo-700 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] ring-1 ring-black/5"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                }
              `}
            >
              <span className="tracking-wide">{tab.label}</span>

              <span
                className={`
                  text-[9px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md transition-colors
                  ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "bg-gray-200 text-gray-500 group-hover:bg-gray-300"
                  }
                `}
              >
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default TaskStatusTabs