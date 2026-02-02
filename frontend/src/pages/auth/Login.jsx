import { useState } from "react"
import { FaEye } from "react-icons/fa"
import { FaEyeSlash, FaPeopleGroup } from "react-icons/fa6"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import AuthLayout from "../../components/AuthLayout"
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../redux/slice/userSlice"
import axiosInstance from "../../utils/axioInstance"
import { validateEmail } from "../../utils/helper"

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)

  const { loading } = useSelector((state) => state.user)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    if (!password) {
      setError("Please enter the password")
      return
    }

    setError(null)

    try {
      dispatch(signInStart())

      const response = await axiosInstance.post(
        "/auth/sign-in",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      )

      if (response.data.role === "admin") {
        dispatch(signInSuccess(response.data))
        navigate("/admin/dashboard")
      } else {
        dispatch(signInSuccess(response.data))
        navigate("/user/dashboard")
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message)
        dispatch(signInFailure(error.response.data.message))
      } else {
        setError("Something went wrong. Please try again!")
        dispatch(signInFailure("Something went wrong. Please try again!"))
      }
    }
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md font-sans">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-indigo-500 via-sky-500 to-purple-500"></div>

          <div className="p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center">
                <div className="bg-indigo-50 p-3 rounded-full">
                  <FaPeopleGroup className="text-4xl text-indigo-600" />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-gray-800 mt-4 uppercase tracking-wide">
                Project Flow
              </h1>

              <p className="text-gray-600 mt-1">
                Manage your projects efficiently
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent pr-12 transition-all"
                    placeholder="•••••••"
                    required
                  />

                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-indigo-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

              {loading ? (
                <div className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-bold text-white bg-gradient-to-r from-indigo-500 via-sky-500 to-purple-500 opacity-70 cursor-not-allowed">
                  <span className="animate-pulse">Loading...</span>
                </div>
              ) : (
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-bold text-white 
                    bg-gradient-to-r from-indigo-500 via-sky-500 to-purple-500 
                    hover:from-indigo-600 hover:via-sky-600 hover:to-purple-600 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                    cursor-pointer uppercase transform transition hover:-translate-y-0.5 duration-200"
                  >
                    LOGIN
                  </button>
                </div>
              )}
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                Don't have an accout?{" "}
                <Link
                  to={"/signup"}
                  className="font-bold text-indigo-600 hover:text-purple-600 transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

export default Login