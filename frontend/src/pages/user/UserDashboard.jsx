import moment from "moment";
import { useEffect, useState } from "react";
import { MdAutoAwesome, MdCheck, MdClose, MdContentCopy, MdRefresh } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomBarChart from "../../components/CustomBarChart";
import CustomPieChart from "../../components/CustomPieChart";
import DashboardLayout from "../../components/DashboardLayout";
import RecentTasks from "../../components/RecentTasks";
import axiosInstance from "../../utils/axioInstance";

const COLORS = ["#818cf8", "#c084fc", "#38bdf8"];

const UserDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [dashboardData, setDashboardData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  // AI States
  const [showAiDialog, setShowAiDialog] = useState(false);
  const [aiInsight, setAiInsight] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || {};
    const taskPriorityLevels = data?.taskPriorityLevel || {};

    const taskDistributionData = [
      { status: "Pending", count: taskDistribution?.Pending || 0 },
      { status: "In Progress", count: taskDistribution?.InProgress || 0 },
      { status: "Completed", count: taskDistribution?.Completed || 0 },
    ];
    setPieChartData(taskDistributionData);

    const priorityLevelData = [
      { priority: "Low", count: taskPriorityLevels?.Low || 0 },
      { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
      { priority: "High", count: taskPriorityLevels?.High || 0 },
    ];
    setBarChartData(priorityLevelData);
  };

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get("/tasks/user-dashboard-data");
      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts || null);
      }
    } catch (error) {
      console.log("Error fetching user dashboard data: ", error);
    }
  };

  const fetchAiInsights = async () => {
    setAiLoading(true);
    setCopied(false);
    try {
      const response = await axiosInstance.get("/user/get-insights", {
        timeout: 90000 
      });
      setAiInsight(response.data.insight);
    } catch (error) {
      console.error("Frontend Axios Error:", error);
      const message = error.code === 'ECONNABORTED' 
        ? "AI is taking a bit longer to think. Please try again." 
        : "Connection failed";
      setAiInsight(`### Error\n\n${message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const handleCopy = () => {
    if (aiInsight) {
      navigator.clipboard.writeText(aiInsight);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  const handleTaskClick = (task) => {
    if (task?._id) {
      navigate(`/user/task-details/${task._id}`);
    }
  };

  const StatCard = ({ title, count, colorFrom, colorTo, iconPath }) => (
    <div className="relative bg-white rounded-2xl p-5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-3xl font-black text-gray-800">{count}</h3>
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorFrom} ${colorTo} shadow-lg flex items-center justify-center text-white transform rotate-3`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {iconPath}
          </svg>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout activeMenu={"Dashboard"}>
      <div className="p-6 space-y-8 bg-gray-50/50 min-h-screen relative font-sans">

        {/* WELCOME HEADER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-500 p-8 shadow-xl text-white">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-sky-400 opacity-20 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                Hello, {currentUser?.name} 👋
              </h2>
              <p className="text-indigo-100 mt-2 text-lg font-medium opacity-90 font-sans">
                {moment().format("dddd, Do MMMM YYYY")}
              </p>
            </div>

            <button
              onClick={() => navigate('/user/create-task')}
              className="group flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold shadow-lg hover:bg-indigo-50 transition-all duration-200 transform hover:scale-105 active:scale-95 hover:cursor-pointer"
            >
              Create New Task
            </button>
          </div>
        </div>

        {dashboardData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Tasks" count={dashboardData?.charts?.taskDistribution?.All || 0} colorFrom="from-blue-500" colorTo="to-indigo-600" iconPath={<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />} />
              <StatCard title="Pending" count={dashboardData?.charts?.taskDistribution?.Pending || 0} colorFrom="from-yellow-400" colorTo="to-orange-500" iconPath={<path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />} />
              <StatCard title="In Progress" count={dashboardData?.charts?.taskDistribution?.InProgress || 0} colorFrom="from-sky-400" colorTo="to-blue-500" iconPath={<path d="M13 10V3L4 14h7v7l9-11h-7z" />} />
              <StatCard title="Completed" count={dashboardData?.charts?.taskDistribution?.Completed || 0} colorFrom="from-green-400" colorTo="to-emerald-600" iconPath={<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 font-sans">
                  <span className="w-2 h-8 bg-purple-500 rounded-full"></span> Task Distribution
                </h3>
                <div className="h-72 w-full flex justify-center items-center">
                  <CustomPieChart data={pieChartData} label="Total Balance" colors={COLORS} />
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 font-sans">
                  <span className="w-2 h-8 bg-sky-500 rounded-full"></span> Priority Levels
                </h3>
                <div className="h-72 w-full">
                  <CustomBarChart data={barChartData} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-2">
                <RecentTasks tasks={dashboardData?.recentTasks} onTaskClick={handleTaskClick} />
              </div>
            </div>
          </>
        )}

        {/* FLOATING AI BUTTON */}
        <button
          onClick={() => { 
            setShowAiDialog(true); 
            if(!aiInsight) fetchAiInsights(); 
          }}
          className="fixed bottom-8 right-8 z-50 group flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 animate-bounce-slow"
        >
          <MdAutoAwesome className="text-3xl group-hover:rotate-12 transition-transform text-white" />
          <span className="absolute -top-1 -right-1 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-purple-500 border-2 border-white"></span>
          </span>
        </button>

        {/* AI INSIGHT DIALOG */}
        {showAiDialog && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md font-sans">
            <div className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl border border-white/20 overflow-hidden animate-in fade-in zoom-in duration-300">

              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-xl text-yellow-300">
                    <MdAutoAwesome className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">AI Productivity Insights</h3>
                    <p className="text-xs text-indigo-100 font-sans">Powered by Local Ollama</p>
                  </div>
                </div>
                <button onClick={() => setShowAiDialog(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                  <MdClose className="text-2xl text-white" />
                </button>
              </div>

              <div className="p-8 max-h-[80vh] overflow-y-auto bg-slate-50/50">
                {aiLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-6">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                        <MdAutoAwesome className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-indigo-600 animate-pulse" />
                    </div>
                    <p className="text-gray-500 font-black text-xl animate-pulse font-sans">Your AI is analyzing tasks...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-8">
                        <div className="markdown-content font-sans bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                           <ReactMarkdown>
                            {aiInsight}
                           </ReactMarkdown>
                        </div>
                    </div>

                    {/* AI Stats Side Panel */}
                    <div className="md:col-span-4 space-y-6">
                        <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg">
                            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest opacity-80">Efficiency Score</h4>
                            <div className="text-5xl font-black mb-2">84%</div>
                            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                                <div className="bg-white h-full" style={{width: '84%'}}></div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <h4 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2">
                                <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
                                Focus Area
                            </h4>
                            <p className="text-sm text-slate-500 leading-relaxed font-sans">
                                Based on your current "Pending" count, focusing on **High Priority** sub-tasks will increase completion by 20%.
                            </p>
                        </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-5 bg-white border-t border-gray-100 flex justify-between items-center">
                <div className="flex gap-2">
                  <button
                    disabled={aiLoading || !aiInsight}
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-100 transition-all shadow-sm active:scale-95 text-sm font-sans"
                  >
                    {copied ? <MdCheck className="text-green-500" /> : <MdContentCopy />}
                    {copied ? "Copied!" : "Copy Report"}
                  </button>
                </div>
                
                <button
                  disabled={aiLoading}
                  onClick={fetchAiInsights}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg active:scale-95 text-sm font-sans"
                >
                  <MdRefresh className={`text-lg ${aiLoading ? "animate-spin" : ""}`} />
                  Regenerate Analysis
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s infinite ease-in-out;
        }

        .markdown-content :global(h1), 
        .markdown-content :global(h2), 
        .markdown-content :global(h3) {
          background: linear-gradient(to right, #4f46e5, #9333ea);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 900;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          font-size: 1.1rem;
          letter-spacing: 0.05em;
        }

        .markdown-content :global(p) {
          margin-bottom: 1.25rem;
          color: #334155;
          font-size: 1rem;
          line-height: 1.8;
          font-weight: 500;
        }

        .markdown-content :global(ul) {
          list-style-type: none;
          padding-left: 0;
          margin-bottom: 1.5rem;
        }

        .markdown-content :global(li) {
          position: relative;
          padding-left: 1.75rem;
          margin-bottom: 0.75rem;
          color: #475569;
          font-weight: 500;
        }

        .markdown-content :global(li)::before {
          content: "→";
          position: absolute;
          left: 0;
          color: #6366f1;
          font-weight: bold;
        }

        .markdown-content :global(strong) {
          color: #1e293b;
          font-weight: 800;
          background-color: #f1f5f9;
          padding: 0 4px;
          border-radius: 4px;
        }
      `}</style>
    </DashboardLayout>
  );
};

export default UserDashboard;