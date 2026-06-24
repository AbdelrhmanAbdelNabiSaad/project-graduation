
import { Route, Routes } from 'react-router-dom'
import './App.css'

import Footer from './Components/Footer/Footer'

import Header from './Components/Header/Header'
import Layout from './Components/Layout/Layout'
import HomePage from './Pages/HomePage'
import Register from './Components/Register/Register'
import Login from './Components/Login/Login'
import RegisterPage from './Pages/RegisterPage'
import AboutPage from './Pages/AboutPage'
import Jobs from './Pages/Jobs'
import LayoutUser from './Components/LayoutUser/LayoutUser'
import ProfileUser from './Pages/ProfileUser'
import DashboardUser from './Components/DashboardUser/DashboardUser'
import MyApplication from './Components/MyApplication/MyApplication'
import LayoutDashboard from './Components/LayoutDashboard/LayoutDashboard'
import CreateJob from './Components/CreateJob/CreateJob'
import ForgetPassword from './Components/forgetPassword/forgetPassword'
import MyJobs from './Components/MyJobs/MyJobs'
import Candidates from './Components/Candidates/Candidates'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>
        <Route path="" element={<LayoutUser />}>
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/profile" element={<ProfileUser />} />
          <Route path="/applications" element={<MyApplication />} />
        </Route>
        <Route path="" element={<LayoutDashboard />}>
          <Route path="/dashboard" element={<DashboardUser />} />
          <Route path="/createjob" element={<CreateJob />} />
          <Route path="/myjobs" element={<MyJobs />} />
          <Route path="/candidates" element={<Candidates />} />
        </Route>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgetPassword" element={<ForgetPassword />} />
      </Routes>
    </>
  );
}

export default App
