import { useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react"
import { toast } from "sonner"
import { useAuthStore } from "../store/useAuthStore"
import { useProfileStore } from "@/features/profile/store/useProfileStore"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const LogoutButton = () => {
  const navigate = useNavigate()
  const clearAuth = useAuthStore(state => state.setIsAuthenticated)
  const clearAuthId = useAuthStore(state => state.setId)
  const clearProfile = useProfileStore(state => state.setFirstName)
  const clearLastName = useProfileStore(state => state.setLastName)
  const clearEmail = useProfileStore(state => state.setEmail)
  const clearRole = useProfileStore(state => state.setRole)

  const handleLogout = () => {
    clearAuth(false)
    clearAuthId('')
    clearProfile('')
    clearLastName('')
    clearEmail('')
    clearRole('student')
    toast.success("Logged out successfully")
    navigate('/login', { viewTransition: true })
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={handleLogout}
          className="p-2 rounded-full bg-brand-red/20 hover:bg-brand-red/25 text-brand-red transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Logout</p>
      </TooltipContent>
    </Tooltip>
  )
}

export default LogoutButton