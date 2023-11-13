import { Checkbox, Label, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import Api from "../api";
import toast from "react-hot-toast";
import { useState } from "react";
import { useEffect } from "react";
import Cookies from "js-cookie";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [users, setUsers] = useState([]);
  const unsplashimg = {
    src: "https://source.unsplash.com/1600x900/?random",
    alt: "random unsplash image",
  };

  const fetchUser = async () => {
    await Api.get("/users").then((response) => setUsers(response.data));
  };

  const onSubmitLogin = (e) => {
    e.preventDefault();
    // eslint-disable-next-line array-callback-return
    const login = users.filter(
      (user) => user.username === username && user.password === password
    );
    if (login.length > 0) {
      toast.success("Login Success", {
        position: "top-right",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      Cookies.set("token", "grgr464464646hthth56557")
      Cookies.set("vendor_id", login[0].vendor_id)
      navigate(`/vendor/profile`);
    } else {
      toast.error("Login Failed!", {
        position: "top-right",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  useEffect(() => {
    fetchUser();
    Cookies.remove("token")
    Cookies.remove("vendor_id")
  }, []);

  return (
    <>
      <div className="grid grid-cols-12 min-h-screen relative font-roboto">
        {/* <div className="absolute top-0 right-0 py-2 pe-3 text-[24px] font-bold tracking-wide hidden min-[755px]:block">
          PT KARYA PRIMA UNGGULAN
        </div> */}
        <div
          className="bg-cover bg-no-repeat bg-center relative col-span-8 max-[634px]:hidden max-[1275px]:col-span-6"
          style={{ backgroundImage: `url(${unsplashimg.src})` }}
        ></div>
        <div className="font-roboto bg-white px-20 max-[790px]:px-10 flex flex-col justify-center w-full rounded-sm shadow-sm col-span-4 max-[634px]:col-span-12 max-[1275px]:col-span-6">
          <div className="flex flex-col items-center gap-2">
            <div className="font-semibold text-[#0077b6]">SUPPLIER PORTAL</div>
            <div className="font-semibold mb-10 text-[#0077b6]">LOGIN</div>
          </div>

          <form className="flex flex-col gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email1" value="Username" />
              </div>
              <TextInput
                id="email1"
                value={username}
                required
                type="text"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password1" value="Your password" />
              </div>
              <TextInput
                id="password1"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember">Remember me</Label>
              </div>
              <Link to="/wh-smith">
                <div className="text-[12px] text-slate-400 cursor-pointer hover:text-blue-400 hover:underline">
                  Login sebagai WH Smith
                </div>
              </Link>
              <Link to="/registration">
                <div className="text-[12px] text-slate-400">
                  Belum punya akun? Silahkan{" "}
                  <span className="underline text-blue-400 cursor-pointer">
                    Sign Up
                  </span>
                </div>
              </Link>
            </div>

            <button
              type="submit"
              className="bg-[#0077b6] py-3 text-white rounded-md shadow-sm "
              onClick={(e) => onSubmitLogin(e)}
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
