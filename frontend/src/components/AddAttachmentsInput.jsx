import { useState } from "react"
import { ImAttachment } from "react-icons/im"
import { IoMdAdd } from "react-icons/io"
import { MdDelete } from "react-icons/md"

const AddAttachmentsInput = ({ attachments, setAttachments }) => {
  const [option, setOption] = useState("")

  const handleAddOption = () => {
    if (option.trim() !== "") {
      setAttachments([...attachments, option.trim()])
      setOption("")
    }
  }

  const handleDeleteOption = (index) => {
    const updatedArray = attachments.filter((_, i) => i !== index)
    setAttachments(updatedArray)
  }

  return (
    <div className="w-full">
      {attachments.map((item, index) => (
        <div
          key={`${item}-${index}`}
          className="flex items-center justify-between bg-gray-50 border border-gray-100 px-3 py-2.5 rounded-xl mb-3 shadow-sm"
        >
          <div className="flex-1 flex items-center gap-3 min-w-0">
            <ImAttachment className="text-indigo-400 flex-shrink-0" />
            <p className="text-sm text-gray-700 truncate pr-2">
              {item}
            </p>
          </div>

          <button
            type="button"
            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
            onClick={() => handleDeleteOption(index)}
          >
            <MdDelete className="text-xl text-red-500" />
          </button>
        </div>
      ))}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
        <div className="flex-1 flex items-center gap-3 bg-white border border-gray-200 px-3 py-1 rounded-xl focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-400 transition-all shadow-sm">
          <ImAttachment className="text-gray-400 ml-1 flex-shrink-0" />
          <input
            type="text"
            placeholder="Add File Link"
            value={option}
            onChange={(e) => setOption(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOption())}
            className="w-full py-2.5 text-sm text-black outline-none bg-transparent placeholder:text-gray-400"
          />
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-100 transition-all active:scale-95 cursor-pointer"
          onClick={handleAddOption}
        >
          <IoMdAdd className="text-xl" />
          <span>Add</span>
        </button>
      </div>
    </div>
  )
}

export default AddAttachmentsInput