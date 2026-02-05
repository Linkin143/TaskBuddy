import { useEffect, useState } from "react";
import { MdClose, MdMenu } from "react-icons/md";
import SideMenu from "./SideMenu";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  useEffect(() => {
    if (openSideMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [openSideMenu]);

  return (
    <div className="sticky top-0 z-50 w-full">
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-slate-900/90 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-indigo-500/20 shadow-lg">
            <span className="text-white font-black text-xs italic">TB</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-black tracking-tight text-base leading-none">
              Task Buddy
            </span>
            <span className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">
              Dashboard
            </span>
          </div>
        </div>

        <button
          onClick={() => setOpenSideMenu(!openSideMenu)}
          className="
            relative z-[70]
            w-11 h-11 flex items-center justify-center rounded-xl
            bg-white/10 border border-white/10
            hover:bg-white/20 active:scale-90
            transition-all duration-300
          "
        >
          {openSideMenu ? (
            <MdClose className="text-2xl text-white" />
          ) : (
            <MdMenu className="text-2xl text-white" />
          )}
        </button>
      </div>

      {openSideMenu && (
        <div className="fixed inset-0 z-[60] flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-500"
            onClick={() => setOpenSideMenu(false)}
          />

          <div
            className="
              relative z-[65] w-[85%] max-w-sm h-full
              bg-white border-r border-indigo-50
              shadow-[25px_0_50px_-12px_rgba(0,0,0,0.25)]
              flex flex-col animate-in slide-in-from-left duration-300
            "
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            
            <div className="flex-1 overflow-y-auto pt-4 relative z-10 no-scrollbar">
              <div className="px-4 mb-2">
                 <div className="flex items-center justify-between p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-600 font-black">
                      Navigation Menu
                    </p>
                    <div className="flex gap-1">
                       <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                       <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse delay-75" />
                    </div>
                 </div>
              </div>
              
              <div className="side-menu-mobile-wrapper">
                <SideMenu activeMenu={activeMenu} />
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100">
               <button 
                  onClick={() => setOpenSideMenu(false)}
                  className="w-full py-3 bg-white border border-gray-200 text-gray-500 rounded-xl font-bold text-sm shadow-sm active:bg-gray-100 transition-colors"
               >
                  Close Menu
               </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .side-menu-mobile-wrapper :global(.sticky) {
          position: relative !important;
          height: auto !important;
          width: 100% !important;
          border-right: none !important;
          box-shadow: none !important;
        }
      `}</style>
    </div>
  );
};

export default Navbar;