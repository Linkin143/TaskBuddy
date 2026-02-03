import {
  MdDashboardCustomize,
  MdLogout,
  MdManageHistory,
  MdOutlineTaskAlt
} from "react-icons/md"



export const USER_SIDE_MENU_DATA = [
  {
    id: 1,
    label: "Dashboard",
    icon: MdDashboardCustomize,
    path: "/user/dashboard",
  },
  {
    id: 2,
    label: "My Tasks",
    icon: MdOutlineTaskAlt,
    path: "/user/tasks",
  },
  {
    id: 3,
    label: "Update/Delete Tasks",
    icon: MdManageHistory,
    path: "/user-manage/tasks",
  },
  {
    id: 4,
    label: "Logout",
    icon: MdLogout,
    path: "logout",
  },
]


export const PRIORITY_DATA = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
]

export const STATUS_DATA = [
  { label: "Pending", value: "Pending" },
  { label: "In Progress", value: "In Progress" },
  { label: "Completed", value: "Completed" },
]
