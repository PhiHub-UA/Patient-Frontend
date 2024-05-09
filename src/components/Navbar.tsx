import { logo_big } from "@/assets";
import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";
import { useUserStore } from "@/stores/userStore";
import { useQuery } from "@tanstack/react-query";
import axios from "@/api/axios";
import { UserIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { useNavigate } from "@tanstack/react-router";

const Navbar = () => {
  const navigate = useNavigate();
  const login = useUserStore((state) => state.login) || false;

  const _ = useQuery({
    queryKey: ["user"],
    queryFn: () => {
      axios
        .get("/users/me", {
          headers: {
            Authorization: localStorage.getItem("token")
              ? `Bearer ${localStorage.getItem("token")}`
              : undefined,
          },
        })
        .then((res) => {
          login(res.data.username);
        })
        .catch((err) => {
          console.log(err);
        });
      return null;
    },
  });

  const user = useUserStore((state: { username: string }) => state.username);
  const logout = useUserStore((state: { logout: () => void }) => state.logout);

  return (
    <nav className="sticky flex items-center w-[90vw] p-4 m-4 rounded-xl shadow-xl text-primary bg-background">
      <Link to="/" className="mr-8">
        <img src={logo_big} alt="logo" className="w-auto h-12" />
      </Link>
      <div className="flex flex-row gap-6 items-center text-lg font-semibold w-full">
        <span>
          <Link to="/">Home</Link>
        </span>
        <span>
          <Link to="/about">About</Link>
        </span>
        <span>
          <Link to="/contact">Contact</Link>
        </span>
        <div className="items-center flex flex-row w-full gap-6 justify-end">
          {user ? (
            <>
              <span>
                <Link to="/appointments">My Appointments</Link>
              </span>
              <span>
                <Link to="/mark_appointment">Mark Appointment</Link>
              </span>

              <Badge
                variant={"outline"}
                className="ml-3 font-bold border-2 border-ghost"
              >
                {user}
              </Badge>
              <UserIcon className="h-6 w-6" />
              <Button
                onClick={() => {
                  logout();
                  navigate({ to: "/" });
                }}
                variant={"link"}
              >
                Logout
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
