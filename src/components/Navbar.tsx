import { logo_big } from "@/assets";
import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";

const Navbar = () => {
  return (
    <nav className="sticky flex items-center justify-between w-[90vw] p-4 m-4 rounded-xl shadow-xl text-primary bg-background">
      <Link to="/">
        <img src={logo_big} alt="logo" className="w-auto h-12" />
      </Link>
      <ul className="flex gap-4 text-lg font-semibold">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
      </ul>
      <Link to="/login">
        <Button>Login</Button>
      </Link>
    </nav>
  );
};

export default Navbar;
