import { useProfileStore } from "@/features/profile";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const StudentRoutes = () => {
  const role = useProfileStore(state => state.role);
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== 'student') {
      navigate("/", { replace: true, viewTransition: true });
    }
  }, [role, navigate]);

  return role === 'student' ? <Outlet /> : null;
}

export default StudentRoutes