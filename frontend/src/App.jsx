import { useSelector } from "react-redux"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import CreateTask from "./pages/admin/CreateTask"
import ManageTasks from "./pages/admin/ManageTasks"
import Login from "./pages/auth/Login"
import SignUp from "./pages/auth/SignUp"
import MyTasks from "./pages/user/MyTasks"
import TaskDetails from "./pages/user/TaskDetails"
import UserDashboard from "./pages/user/UserDashboard"
import PrivateRoute from "./routes/PrivateRoute"

import { Toaster } from "react-hot-toast"

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />


          {/* User Routes */}
          <Route element={<PrivateRoute allowedRoles={["user","admin"]} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/tasks" element={<MyTasks />} />
            <Route path="/user-manage/tasks" element={<ManageTasks />} />
            <Route path="/user/create-task" element={<CreateTask />} />
            <Route path="/user/task-details/:id" element={<TaskDetails />} />
          </Route>

          {/* Default Route */}
          <Route path="/" element={<Root />} />
        </Routes>
      </BrowserRouter>

      <Toaster />
    </div>
  )
}

export default App

const Root = () => {
  const { currentUser } = useSelector((state) => state.user)

  if (!currentUser) {
    return <Navigate to={"/login"} />
  }

  return currentUser.role === "admin" ? (
    <Navigate to={"/admin/dashboard"} />
  ) : (
    <Navigate to={"/user/dashboard"} />
  )
}
