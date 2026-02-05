import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const CustomBarChart = ({ data }) => {
  const getBarColor = (entry) => {
    switch (entry?.priority) {
      case "Low":
        return "#4CAF50"
      case "Medium":
        return "#FF9800"
      case "High":
        return "#F44336"
      default:
        return "#4CAF50"
    }
  }

  const CustomToolTip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-md rounded-lg border border-gray-300">
          <p className="text-xs font-semibold text-purple-800 mb-1">
            {payload[0].payload.priority}
          </p>

          <p className="text-sm text-gray-600">
            Count:{" "}
            <span className="text-sm font-medium text-gray-900">
              {payload[0].payload.count}
            </span>
          </p>
        </div>
      )
    }

    return null
  }

  return (
    <div className="bg-white mt-4 sm:mt-6 w-full">
      <div className="h-[250px] sm:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid stroke="none" />

            <XAxis
              dataKey="priority"
              tick={{ fill: "#64748b", fontSize: 11 }}
              stroke="none"
              interval={0}
            />

            <YAxis 
              tick={{ fill: "#64748b", fontSize: 11 }} 
              stroke="none" 
            />

            <Tooltip
              content={<CustomToolTip />}
              cursor={{ fill: "#f8fafc" }}
            />

            <Bar
              dataKey="count"
              name={"priority"}
              fill="#FF8042"
              radius={[6, 6, 0, 0]}
              barSize={window.innerWidth < 640 ? 30 : 45}
            >
              {data?.map((entry, index) => (
                <Cell key={index} fill={getBarColor(entry)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default CustomBarChart