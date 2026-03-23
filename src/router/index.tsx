import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import ProtectedRoutes from './ProtectedRoutes'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import ForgetPassPage from '../pages/ForgetPassPage'
import ResetPassPage from '../pages/ResetPassPage'
import VerificationPage from '../pages/VerificationPage'
import HomePage from '../pages/HomePage'
import ProfilePage from '../pages/ProfilePage'
import SettingsPage from '../pages/SettingsPage'
import IdeasLibPage from '../pages/IdeasLibPage'
import IdeaDetailsPage from '../pages/IdeaDetailsPage'
import BoardingPage from '../pages/BoardingPage'
import NotFoundPage from '../pages/NotFoundPage'
import SettingsProfilePage from '@/pages/SettingsProfilePage'
import SettingsPasswordPage from '@/pages/SettingsPasswordPage'
import SettingsNotificationsPage from '@/pages/SettingsNotificationsPage'
import AuthRoutes from './AuthRoutes'
import StudentRoutes from './StudentRoutes'
import TaRoutes from './TaRoutes'
import TeamsPage from '@/pages/TeamsPage'
import ChatBotPage from '@/pages/ChatBotPage'
import SupervisionRequestsPage from '@/pages/SupervisionRequestsPage'
import MyTeamsPage from '@/pages/MyTeamsPage'
import TeamDetailsPage from '@/pages/TeamDetailsPage'

const routes = createRoutesFromElements(
  <>
    {/* Public auth routes */}
    <Route element={<AuthRoutes />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forget-pass" element={<ForgetPassPage />} />
      <Route path="/reset-pass" element={<ResetPassPage />} />
      <Route path="/verify" element={<VerificationPage />} />
    </Route>

    {/* Protected routes */}
    <Route element={<ProtectedRoutes />}>
      {/* General routes */}
      <Route path="/">
        <Route index element={<HomePage />} />
        <Route path=":userName" element={<ProfilePage />} />

        <Route path="settings">
          <Route index element={<SettingsPage />} />
          <Route path="profile" element={<SettingsProfilePage />} />
          <Route path="password-security" element={<SettingsPasswordPage />} />
          <Route path="notifications" element={<SettingsNotificationsPage />} />
        </Route>

        <Route path="ideas-lib">
          <Route index element={<IdeasLibPage />} />
          <Route path=":idea" element={<IdeaDetailsPage />} />
        </Route>

        <Route path="boarding" element={<BoardingPage />} />
        <Route path='my-teams' element={<MyTeamsPage />} />
        <Route path='team-details/:id' element={<TeamDetailsPage />} />

        {/* Role-based routes */}
        <Route element={<StudentRoutes />}>
          <Route path='teams' element={<TeamsPage />} />
          <Route path='chatbot' element={<ChatBotPage />} />
        </Route>

        <Route element={<TaRoutes />}>
          <Route path='supervision-requests' element={<SupervisionRequestsPage />} />
        </Route>
      </Route>
    </Route>

    {/* 404 fallback */}
    <Route path="*" element={<NotFoundPage />} />
  </>
)

export default createBrowserRouter(routes, { future: { v7_useViewTransition: true } })