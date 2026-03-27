import NavBar from "@/components/NavBar"
import { Outlet } from "react-router-dom"

const RootLayout = () => {
  return (
    <>
      <Outlet />
      <NavBar />
    </>
  )
}

export default RootLayout