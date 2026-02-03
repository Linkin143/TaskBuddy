import { useEffect, useState } from "react"
import { FaCheck } from "react-icons/fa"
import { MdPersonAdd } from "react-icons/md"
import axiosInstance from "../utils/axioInstance"
import AvatarGroup from "./AvatarGroup"
import Modal from "./Modal"

const ThreeDAvatar = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
    <defs>
      <linearGradient id="gradBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#818cf8", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#c084fc", stopOpacity: 1 }} />
      </linearGradient>
      <linearGradient id="gradHead" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#38bdf8", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#818cf8", stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path d="M20,85 C20,65 35,55 50,55 C65,55 80,65 80,85" fill="url(#gradBody)" />
    <circle cx="50" cy="35" r="20" fill="url(#gradHead)" />
  </svg>
)

const SelectedUsers = ({ selectedUser, setSelectedUser }) => {
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getUsers = async () => {
    try {
      const res = await axiosInstance.get("/users/get-users")

      // If backend returns array → admin
      if (Array.isArray(res.data)) {
        setUsers(res.data)
      } else {
        // user role → auto-assign
        setCurrentUser(res.data)
        setSelectedUser([res.data._id])
      }
    } catch (err) {
      console.log("Error fetching users", err)
    }
  }

  const toggleUser = (id) => {
    setSelectedUser((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    )
  }

  const selectedAvatars = users
    .filter((u) => selectedUser.includes(u._id))
    .map((u) => u.profileImageUrl)

  useEffect(() => {
    getUsers()
  }, [])

 
  if (currentUser) {
    return (
      <div className="mt-2 p-2 bg-indigo-50/50 rounded-xl border border-indigo-100 inline-block">
        <AvatarGroup
          avatars={[currentUser.profileImageUrl]}
          maxVisible={1}
        />
      </div>
    )
  }

  /* ---------------- ADMIN UI ---------------- */
  return (
    <div className="mt-2">
      {/* Trigger Button / Summary View */}
      <div 
        onClick={() => setIsModalOpen(true)}
        className="group cursor-pointer border border-dashed border-indigo-300 rounded-xl p-3 hover:bg-indigo-50 transition-all duration-300 flex items-center gap-3"
      >
        {selectedAvatars.length === 0 ? (
          <div className="flex items-center gap-2 text-gray-500 group-hover:text-indigo-600 transition-colors w-full justify-center py-1">
             <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500">
                <MdPersonAdd className="text-lg" />
             </div>
             <span className="font-medium text-sm">Assign Team Members</span>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <AvatarGroup avatars={selectedAvatars} maxVisible={5} />
            <span className="text-xs font-bold text-indigo-500 bg-indigo-100 px-2 py-1 rounded-md">
                + Edit
            </span>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Assign Team Members"
      >
        <div className="h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          <div className="space-y-3 p-1">
            {users.map((user) => {
              const isSelected = selectedUser.includes(user._id)

              return (
                <label
                  key={user._id}
                  className={`
                    relative flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-300 border
                    ${isSelected 
                        ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 shadow-md transform scale-[1.01]" 
                        : "bg-white border-gray-100 hover:bg-gray-50 hover:shadow-sm"
                    }
                  `}
                >
                 
                  <div className={`relative w-12 h-12 flex-shrink-0 rounded-full overflow-hidden border-2 ${isSelected ? "border-indigo-400" : "border-gray-100"}`}>
                    {user.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                         <ThreeDAvatar />
                      </div>
                    )}
                    
                   
                    {isSelected && (
                        <div className="absolute inset-0 bg-indigo-900/20 flex items-center justify-center backdrop-blur-[1px]">
                             <FaCheck className="text-white text-lg drop-shadow-md" />
                        </div>
                    )}
                  </div>

                  
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold truncate ${isSelected ? "text-indigo-900" : "text-gray-700"}`}>
                        {user.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate font-medium">
                        {user.email}
                    </p>
                  </div>

                  
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleUser(user._id)}
                    className="hidden"
                  />
                  
                  
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                     ${isSelected ? "border-purple-500 bg-purple-500" : "border-gray-300"}
                  `}>
                      {isSelected && <FaCheck className="text-white text-[10px]" />}
                  </div>
                </label>
              )
            })}
          </div>
        </div>

       
        <div className="flex justify-end pt-6 border-t border-gray-100 mt-4">
          <button
            className="px-8 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            onClick={() => setIsModalOpen(false)}
          >
            Done
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default SelectedUsers