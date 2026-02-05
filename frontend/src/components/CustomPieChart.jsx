import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import CustomLegend from "./CustomLegend"
import CustomTooltip from "./CustomTooltip"

const CustomPieChart = ({ data, colors }) => {
  return (
    <div className="w-full h-[300px] sm:h-[325px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={window.innerWidth < 640 ? 85 : 110}
            innerRadius={window.innerWidth < 640 ? 65 : 85}
            paddingAngle={5}
            fill="#8884d8"
            dataKey="count"
            nameKey="status"
            stroke="none"
          >
            {data?.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]} 
                className="focus:outline-none"
              />
            ))}
          </Pie>

          <Tooltip content={<CustomTooltip />} />

          <Legend 
            content={<CustomLegend />} 
            verticalAlign="bottom"
            align="center"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CustomPieChart