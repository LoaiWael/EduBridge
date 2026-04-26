import { createBrowserRouter, createRoutesFromElements, Route, useLocation, Outlet } from 'react-router-dom'
import { useEffect } from 'react'
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
import RoleSelectionPage from '@/pages/RoleSelectionPage'
import WithoutNavLayout from '@/layouts/WithoutNavLayout'
import RootLayout from '@/layouts/RootLayout'
import ManageTeamsPage from '@/pages/ManageTeamsPage'
import TaTeamsPage from '@/pages/TaTeamsPage'
import AboutUsPage from '@/pages/AboutUsPage'

const GlobalLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return <Outlet />;
};

const routes = createRoutesFromElements(
  <Route element={<GlobalLayout />}>
    {/* Public auth routes */}
    <Route path="/about-us" element={<AboutUsPage />} />
    <Route path="/forget-password" element={<ForgetPassPage />} />
    <Route element={<AuthRoutes />}>
      <Route path="/role-selection" element={<RoleSelectionPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/reset-password" element={<ResetPassPage />} />
      <Route path="/verification" element={<VerificationPage />} />
    </Route>

    {/* Protected routes */}
    <Route element={<ProtectedRoutes />}>
      {/* General routes */}
      <Route path="/">
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="bridge/:userId" element={<ProfilePage />} />
          <Route path="library">
            <Route index element={<IdeasLibPage />} />
            <Route path=":id" element={<IdeaDetailsPage />} />
          </Route>
          <Route element={<StudentRoutes />}>
            <Route path='teams' element={<TeamsPage />} />
          </Route>
        </Route>

        <Route element={<WithoutNavLayout />}>
          <Route path="boarding" element={<BoardingPage />} />
          <Route path="settings">
            <Route index element={<SettingsPage />} />
            <Route path="profile" element={<SettingsProfilePage />} />
            <Route path="password-security" element={<SettingsPasswordPage />} />
            <Route path="notifications" element={<SettingsNotificationsPage />} />
          </Route>
          <Route path='my-teams' element={<MyTeamsPage />} />
          <Route element={<StudentRoutes />}>
            <Route path='bridge/:userId/teams' element={<TaTeamsPage />} />
          </Route>
          <Route path='teams/:id' element={<TeamDetailsPage />} />
          <Route element={<StudentRoutes />}>
            <Route path='chatbot' element={<ChatBotPage />} />
          </Route>
          <Route element={<TaRoutes />}>
            <Route path='supervision-requests' element={<SupervisionRequestsPage />} />
            <Route path='manage-teams' element={<ManageTeamsPage />} />
          </Route>
        </Route>

      </Route>
    </Route>

    {/* 404 fallback */}
    <Route path="*" element={<NotFoundPage />} />
  </Route>
)

export default createBrowserRouter(routes, { future: { v7_useViewTransition: true } })