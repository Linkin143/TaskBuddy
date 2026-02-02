
const TaskStatusTabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="my-4">
      <div className="inline-flex p-1 bg-gray-100/80 rounded-xl border border-gray-200">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.label

          return (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              type="button"
              className={`
                relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ease-out cursor-pointer
                ${
                  isActive
                    ? "bg-white text-indigo-700 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] ring-1 ring-black/5"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                }
              `}
            >
              {/* Tab Label */}
              <span className="tracking-wide">{tab.label}</span>

              {/* Count Badge */}
              <span
                className={`
                  text-[11px] font-bold px-2 py-0.5 rounded-md transition-colors
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