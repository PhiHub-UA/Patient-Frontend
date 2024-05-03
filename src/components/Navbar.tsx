import { logo_big } from "@/assets";
import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";
import { useUserStore } from "@/stores/userStore";
import { useQuery } from "@tanstack/react-query";
import axios from "@/api/axios";


const Navbar = () => {

  const login = useUserStore((state) => state.login) || false;

  const _ = useQuery({
    queryKey: ["user"],
    queryFn: () => {
      axios.get("/users/me", 
      {
        headers: {
          Authorization: localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : undefined,
        },
      }
    ).then((res) => {
        login(res.data.username);
      }); // Add closing parenthesis here
      return null;
    },
    enabled: !!localStorage.getItem("token"),
  });

  const user = useUserStore((state: { username: string }) => state.username);
  const logout = useUserStore((state: { logout: () => void }) => state.logout);


  return (
    <nav className="sticky flex items-center  w-[90vw] p-4 m-4 rounded-xl shadow-xl text-primary bg-background">
      <Link to="/">
        <img src={logo_big} alt="logo" className="w-auto h-12" />
      </Link>
      <ul className="flex ml-[30rem] gap-4 text-lg font-semibold">
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
      {user ? (
        <>
        <h6 className=" ml-[35rem] pr-[2rem]">{user}</h6>
          <Button onClick={() => logout() }>
            Logout
          </Button>
        </>
      ) : (
        <Link to="/login" className=" ml-[35rem] pr-[2rem]">
          <Button>Login</Button>
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
