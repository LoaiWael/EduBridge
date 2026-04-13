import { Link } from "react-router-dom"
import { Pencil } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const EditProfileButton = () => {
  return (
    <Tooltip >
      <TooltipTrigger asChild>
        <Link
          to="/settings/profile"
          viewTransition
          className='inline-flex items-center gap-2 px-4 py-2 bg-brand-pink/36 rounded-brand-card text-brand-text-primary text-sm font-medium hover:bg-brand-pink/60 transition-colors focus-visible:ring-2 focus-visible:ring-brand-text-primary'
        >
          <Pencil className="w-4 h-4" />
          Edit Profile
        </Link>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={4}>
        <p>Update your profile information</p>
      </TooltipContent>
    </Tooltip>
  )
}

export default EditProfileButton
