import { useProfileStore } from "@/features/profile";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const TaRoutes = () => {
  const role = useProfileStore(state => state.role);
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== 'ta') {
      navigate("/", { replace: true, viewTransition: true });
    }
  }, [role, navigate]);

  return role === 'ta' ? <Outlet /> : null;
}

export default TaRoutes