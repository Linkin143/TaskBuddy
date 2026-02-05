
const AvatarGroup = ({ avatars, maxVisible = 3 }) => {
  return (
    <div className="flex items-center">
      <div className="flex -space-x-2 sm:-space-x-3 overflow-hidden">
        {avatars.slice(0, maxVisible).map((avatar, index) => (
          <div 
            key={index}
            className="relative inline-block"
          >
            <img
              src={avatar}
              alt={`Avatar-${index + 1}`}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white object-cover shadow-sm bg-gray-100"
            />
          </div>
        ))}

        {avatars.length > maxVisible && (
          <div className="relative inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-indigo-50 rounded-full border-2 border-white shadow-sm flex-shrink-0">
            <span className="text-[10px] sm:text-xs font-bold text-indigo-600">
              +{avatars.length - maxVisible}
            </span>
          </div>
        )}
      </div>
      
      {avatars.length > maxVisible && (
        <span className="hidden md:inline-block ml-2 text-[10px] font-bold text-gray-400 uppercase tracking-tight">
          more
        </span>
      )}
    </div>
  )
}

export default AvatarGroup