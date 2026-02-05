import { useState } from "react"
import { IoMdAdd } from "react-icons/io"
import { MdDelete } from "react-icons/md"

const TodoListInput = ({ todoList, setTodoList }) => {
  const [option, setOption] = useState("")

  const handleAddOption = () => {
    if (option.trim() !== "") {
      setTodoList([...todoList, option.trim()])
      setOption("")
    }
  }

  const handleDeleteOption = (index) => {
    const updatedArray = todoList.filter((_, i) => i !== index)
    setTodoList(updatedArray)
  }

  return (
    <div className="w-full">
      {todoList.map((item, index) => (
        <div
          key={`${item}-${index}`}
          className="flex items-center justify-between bg-gray-50 border border-gray-100 px-3 py-2.5 rounded-lg mb-2 shadow-sm transition-all"
        >
          <div className="flex items-center min-w-0 flex-1 mr-3">
            <span className="text-[11px] sm:text-xs text-gray-400 font-bold mr-3 flex-shrink-0">
              {index < 9 ? `0${index + 1}` : index + 1}
            </span>
            <p className="text-sm text-gray-700 truncate">
              {item}
            </p>
          </div>

          <button
            type="button"
            className="p-1.5 hover:bg-red-50 rounded-md transition-colors flex-shrink-0 cursor-pointer"
            onClick={() => handleDeleteOption(index)}
          >
            <MdDelete className="text-lg text-red-500" />
          </button>
        </div>
      ))}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Add a new task"
            value={option}
            onChange={(e) => setOption(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOption())}
            className="w-full text-sm text-black outline-none bg-white border border-gray-200 px-4 py-2.5 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-gray-400 shadow-sm"
          />
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-100 transition-all active:scale-95 cursor-pointer"
          onClick={handleAddOption}
        >
          <IoMdAdd className="text-lg" />
          <span>Add</span>
        </button>
      </div>
    </div>
  )
}

export default TodoListInput