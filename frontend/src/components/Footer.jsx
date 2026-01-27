import { Outlet } from "react-router";
import Navbar from "./Navbar";


function Footer() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default Footer;