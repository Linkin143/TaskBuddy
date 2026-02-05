import { useEffect } from "react"
import { IoMdClose } from "react-icons/io"

const Modal = ({ children, isOpen, onClose, title }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-white/20 transform transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 sm:px-6 border-b border-gray-100 bg-white">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate pr-4">
            {title}
          </h3>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <IoMdClose className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-5 sm:p-6 text-gray-700 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </div>
  )
}

export default Modal