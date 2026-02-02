import { useState } from "react";
import { MdClose, MdMenu } from "react-icons/md";
import SideMenu from "./SideMenu";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <div className="sticky top-0 z-50">
      <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">TB</span>
          </div>
          <span className="text-white font-bold tracking-tight text-lg">
            Task Buddy
          </span>
        </div>

        <button
          onClick={() => setOpenSideMenu(!openSideMenu)}
          className="
            relative z-[70]
            w-12 h-12 flex items-center justify-center rounded-2xl
            bg-gradient-to-br from-indigo-500 to-purple-600
            shadow-[0_4px_15px_rgba(79,70,229,0.4)]
            hover:scale-105 active:scale-95
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
            className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
            onClick={() => setOpenSideMenu(false)}
          />

          <div
            className="
              relative z-[65] w-80 h-full
              bg-slate-900 border-r border-white/10
              shadow-[20px_0_50px_rgba(0,0,0,0.5)]
              flex flex-col
            "
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage:
                  "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"140\" height=\"140\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.7\" numOctaves=\"2\"/></filter><rect width=\"140\" height=\"140\" filter=\"url(%23n)\"/></svg>')",
              }}
            />

            <div className="flex-1 overflow-y-auto pt-20 pb-10 px-6 relative z-10 custom-scrollbar">
              <div className="mb-8 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                  Main Navigation
                </p>
              </div>
              
              <SideMenu activeMenu={activeMenu} />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default Navbar;