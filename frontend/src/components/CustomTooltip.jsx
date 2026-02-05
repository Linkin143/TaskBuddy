
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 sm:p-3 shadow-xl rounded-xl border border-indigo-50 min-w-[100px]">
        <p className="text-[10px] sm:text-xs font-bold text-indigo-600 mb-1 uppercase tracking-wider">
          {payload[0].name}
        </p>

        <p className="text-xs sm:text-sm text-gray-500 font-medium flex items-center justify-between gap-4">
          Count:{" "}
          <span className="text-sm sm:text-base font-black text-gray-900">
            {payload[0].value}
          </span>
        </p>
      </div>
    )
  }

  return null
}

export default CustomTooltip