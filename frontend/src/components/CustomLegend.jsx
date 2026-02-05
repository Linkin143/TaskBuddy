
const CustomLegend = ({ payload }) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-4 px-2">
      {payload?.map((entry, index) => (
        <div className="flex items-center gap-2" key={`legend-${index}`}>
          <div
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          ></div>

          <span className="text-[10px] sm:text-xs text-gray-700 font-bold uppercase tracking-wider whitespace-nowrap">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export default CustomLegend