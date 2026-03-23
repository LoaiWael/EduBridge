import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import ProtectedRoutes from './ProtectedRoutes'

// Auth pages (public)
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import ForgetPassPage from '../pages/ForgetPassPage'
import ResetPassPage from '../pages/ResetPassPage'
import VerificationPage from '../pages/VerificationPage'

// Protected pages
import HomePage from '../pages/HomePage'
import ProfilePage from '../pages/ProfilePage'
import SettingsPage from '../pages/SettingsPage'
import IdeasLibPage from '../pages/IdeasLibPage'
import IdeaDetailsPage from '../pages/IdeaDetailsPage'
import BoardingPage from '../pages/BoardingPage'

// Error pages
import NotFoundPage from '../pages/NotFoundPage'

const routes = createRoutesFromElements(
  <>
    {/* Public auth routes */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/forget-pass" element={<ForgetPassPage />} />
    <Route path="/reset-pass" element={<ResetPassPage />} />
    <Route path="/verify" element={<VerificationPage />} />

    {/* Protected routes */}
    <Route element={<ProtectedRoutes />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/ideas-lib" element={<IdeasLibPage />}>
        <Route path=":idea" element={<IdeaDetailsPage />} />
      </Route>
      <Route path="/boarding" element={<BoardingPage />} />
    </Route>

    {/* 404 fallback */}
    <Route path="*" element={<NotFoundPage />} />
  </>
)

export default createBrowserRouter(routes, { future: { v7_useViewTransition: true } })