import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { MdAssignment, MdAutoAwesome, MdCheck, MdCheckCircle, MdClose, MdContentCopy, MdHourglassEmpty, MdPendingActions, MdRefresh } from "react-icons/md";
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

  const [showAiDialog, setShowAiDialog] = useState(false);
  const [aiInsight, setAiInsight] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const cacheTimerRef = useRef(null);

  const totalTasks = dashboardData?.charts?.taskDistribution?.All || 0;
  const pendingTasks = dashboardData?.charts?.taskDistribution?.Pending || 0;
  const inProgressTasks = dashboardData?.charts?.taskDistribution?.InProgress || 0;
  const completedTasks = dashboardData?.charts?.taskDistribution?.Completed || 0;
  const currentEfficiency = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getFocusArea = () => {
    if (!aiInsight) return "Analyze tasks to generate your focus strategy.";
    const match = aiInsight.match(/FOCUS_START([\s\S]*?)FOCUS_END/);
    return match ? match[1].trim() : "Focus on high-priority tasks to boost your efficiency.";
  };

  const cleanInsightText = aiInsight.replace(/FOCUS_START[\s\S]*?FOCUS_END/, "");

  const handleCopy = () => {
    if (aiInsight) {
      navigator.clipboard.writeText(cleanInsightText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get("/tasks/user-dashboard-data");
      if (response.data) {
        setDashboardData(response.data);
        const charts = response.data.charts || {};
        setPieChartData([
          { status: "Pending", count: charts.taskDistribution?.Pending || 0 },
          { status: "In Progress", count: charts.taskDistribution?.InProgress || 0 },
          { status: "Completed", count: charts.taskDistribution?.Completed || 0 },
        ]);
        setBarChartData([
          { priority: "Low", count: charts.taskPriorityLevel?.Low || 0 },
          { priority: "Medium", count: charts.taskPriorityLevel?.Medium || 0 },
          { priority: "High", count: charts.taskPriorityLevel?.High || 0 },
        ]);
      }
    } catch (e) { console.log("Dashboard fetch error:", e); }
  };

  const fetchAiInsights = async () => {
    if (aiLoading) return;
    setAiLoading(true);
    setCopied(false);
    if (cacheTimerRef.current) clearTimeout(cacheTimerRef.current);
    try {
      const res = await axiosInstance.get("/user/get-insights", { timeout: 90000 });
      setAiInsight(res.data.insight);
      if (!showAiDialog && Notification.permission === "granted") {
        new Notification("Task Buddy", { body: "Your AI productivity analysis is ready!" });
      }
    } catch (err) { 
      setAiInsight("### Connection Error\nCheck if Docker is running."); 
    } finally { 
      setAiLoading(false); 
    }
  };

  const handleClose = () => {
    setShowAiDialog(false);
    cacheTimerRef.current = setTimeout(() => setAiInsight(""), 5 * 60 * 1000);
  };

  const handleOpen = () => {
    setShowAiDialog(true);
    if (cacheTimerRef.current) clearTimeout(cacheTimerRef.current);
    if (!aiInsight && !aiLoading) fetchAiInsights();
  };

  useEffect(() => { 
    getDashboardData(); 
    return () => { if (cacheTimerRef.current) clearTimeout(cacheTimerRef.current); };
  }, []);

  const TaskStatCard = ({ title, count, icon, bgColor, textColor }) => (
    <div className={`flex items-center p-4 sm:p-6 bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md font-sans`}>
      <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${bgColor} ${textColor} mr-3 sm:mr-4 text-xl sm:text-2xl flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] sm:text-sm font-bold text-slate-500 uppercase tracking-wider truncate">{title}</p>
        <p className="text-xl sm:text-2xl font-black text-slate-800">{count}</p>
      </div>
    </div>
  );

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 bg-gray-50/50 min-h-screen relative font-sans">
        
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-500 p-6 sm:p-8 shadow-xl text-white font-sans">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 font-sans">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-sans text-white">Hello, {currentUser?.name} 👋</h2>
              <p className="opacity-90 font-sans text-sm sm:text-base text-white">{moment().format("dddd, Do MMMM YYYY")}</p>
            </div>
            <button onClick={() => navigate('/user/create-task')} className="w-full sm:w-auto px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold shadow-lg transform hover:scale-105 transition-all font-sans text-sm sm:text-base">
              Create New Task
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 font-sans">
          <TaskStatCard 
            title="Total Tasks" 
            count={totalTasks} 
            icon={<MdAssignment />} 
            bgColor="bg-indigo-50" 
            textColor="text-indigo-600" 
          />
          <TaskStatCard 
            title="Pending" 
            count={pendingTasks} 
            icon={<MdPendingActions />} 
            bgColor="bg-amber-50" 
            textColor="text-amber-600" 
          />
          <TaskStatCard 
            title="In Progress" 
            count={inProgressTasks} 
            icon={<MdHourglassEmpty />} 
            bgColor="bg-sky-50" 
            textColor="text-sky-600" 
          />
          <TaskStatCard 
            title="Completed" 
            count={completedTasks} 
            icon={<MdCheckCircle />} 
            bgColor="bg-emerald-50" 
            textColor="text-emerald-600" 
          />
        </div>

        <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 flex flex-col items-end gap-2 group font-sans">
          <span className="hidden sm:block bg-white px-3 py-1 rounded-lg text-xs font-black shadow-xl border border-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity font-sans">
            Get AI Insights
          </span>
          <button onClick={handleOpen} className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all animate-bounce-slow flex items-center justify-center relative">
            <MdAutoAwesome className="text-2xl sm:text-3xl text-white" />
            {aiLoading && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative h-4 w-4 rounded-full bg-sky-500 border-2 border-white"></span>
              </span>
            )}
          </button>
        </div>

        {dashboardData && (
          <div className="space-y-6 sm:space-y-8 font-sans">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 font-sans">
                <div className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm font-sans overflow-hidden">
                  <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 font-sans">
                    <span className="w-1.5 h-5 sm:w-2 sm:h-6 bg-indigo-500 rounded-full inline-block mr-2 align-middle font-sans"></span>
                    Distribution
                  </h3>
                  <div className="h-[250px] sm:h-auto">
                    <CustomPieChart data={pieChartData} colors={COLORS} />
                  </div>
                </div>
                <div className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm font-sans overflow-hidden">
                  <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 font-sans">
                    <span className="w-1.5 h-5 sm:w-2 sm:h-6 bg-sky-500 rounded-full inline-block mr-2 align-middle font-sans"></span>
                    Priority
                  </h3>
                  <div className="h-[250px] sm:h-auto">
                    <CustomBarChart data={barChartData} />
                  </div>
                </div>
            </div>
            <RecentTasks tasks={dashboardData.recentTasks} onTaskClick={(t) => navigate(`/user/task-details/${t._id}`)} />
          </div>
        )}

        {showAiDialog && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md font-sans">
            <div className="relative w-full max-w-5xl bg-white rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl overflow-hidden font-sans h-[90vh] sm:h-auto flex flex-col">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 sm:p-6 flex items-center justify-between text-white font-sans flex-shrink-0">
                <div className="flex items-center gap-3 font-sans">
                  <MdAutoAwesome className="text-2xl sm:text-3xl text-yellow-300" />
                  <h3 className="font-bold text-lg sm:text-xl tracking-tight font-sans text-white">AI Productivity Analysis</h3>
                </div>
                <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-full"><MdClose className="text-xl sm:text-2xl text-white" /></button>
              </div>

              <div className="p-5 sm:p-8 overflow-y-auto bg-slate-50/30 font-sans flex-1">
                {aiLoading && !aiInsight ? (
                  <div className="flex flex-col items-center justify-center py-12 sm:py-20 animate-pulse font-sans">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="font-bold text-gray-500 font-sans text-sm sm:text-base text-center">Crunching your task data...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 font-sans">
                    <div className="lg:col-span-8 bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 markdown-content font-sans overflow-x-hidden">
                      <ReactMarkdown>{cleanInsightText}</ReactMarkdown>
                    </div>

                    <div className="lg:col-span-4 space-y-4 sm:space-y-6 font-sans">
                      <div className="bg-indigo-600 p-6 sm:p-8 rounded-2xl sm:rounded-3xl text-white shadow-xl font-sans">
                        <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-70 mb-2 font-sans text-white">Efficiency</h4>
                        <div className="text-4xl sm:text-6xl font-black mb-4 font-sans text-white">{currentEfficiency}%</div>
                        <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden font-sans">
                          <div className="bg-white h-full transition-all duration-1000" style={{ width: `${currentEfficiency}%` }}></div>
                        </div>
                      </div>
                      <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 font-sans">
                        <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-xs sm:text-sm uppercase font-sans">
                          <span className="w-1 h-4 bg-purple-500 rounded-full"></span> Focus Area
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic font-sans">{aiLoading ? "Calculating strategy..." : getFocusArea()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-6 bg-white border-t flex flex-col sm:flex-row gap-3 sm:justify-between font-sans flex-shrink-0">
                <button onClick={handleCopy} disabled={!aiInsight} className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all text-sm font-sans order-2 sm:order-1">
                  {copied ? <MdCheck className="text-green-600 font-sans" /> : <MdContentCopy className="font-sans" />} {copied ? "Copied!" : "Copy Report"}
                </button>
                <button onClick={fetchAiInsights} disabled={aiLoading} className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 font-sans transition-all order-1 sm:order-2 ${aiLoading ? 'bg-slate-300 cursor-not-allowed text-slate-500' : 'bg-indigo-600 text-white hover:opacity-90'}`}>
                  <MdRefresh className={aiLoading ? "animate-spin" : ""} /> {aiLoading ? "Thinking..." : "Regenerate Analysis"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-bounce-slow { animation: bounce-slow 4s infinite ease-in-out; }
        .markdown-content :global(h3) { background: linear-gradient(to right, #4f46e5, #9333ea); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 900; margin-top: 1.5rem; text-transform: uppercase; font-size: 0.875rem; font-family: sans-serif; }
        .markdown-content :global(p) { margin: 0.75rem 0; color: #334155; line-height: 1.6; font-family: sans-serif; font-size: 0.875rem; }
        .markdown-content :global(li) { position: relative; padding-left: 1.25rem; margin-bottom: 0.5rem; color: #475569; font-family: sans-serif; font-size: 0.875rem; }
        .markdown-content :global(li)::before { content: "→"; position: absolute; left: 0; color: #6366f1; font-weight: bold; }
        .markdown-content :global(strong) { color: #1e293b; font-weight: 800; background: #f1f5f9; padding: 0 4px; border-radius: 4px; }
        
        @media (min-width: 640px) {
          .markdown-content :global(h3) { font-size: 1rem; }
          .markdown-content :global(p), .markdown-content :global(li) { font-size: 1rem; }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default UserDashboard;