import { CircularProgress } from "@mui/material";
import { Checkbox, Label, TextInput } from "flowbite-react";
import Cookies from "js-cookie";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import generateString from "../components/functions/GenerateRandomString";
import { useEffect } from "react";
const api = process.env.REACT_APP_BASEURL;
const LoginWh = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const unsplashimg = {
    src: "https://source.unsplash.com/1600x900/?random",
    alt: "random unsplash image",
  };

  const onSubmitLogin = async () => {
    setLoading(true);
    await fetch(`${api}api/portal-vendor/admin/login`, {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.data.length > 0) {
          Cookies.set("admin_token", generateString(10));
          Cookies.set("admin_id", res.data[0].id);
          setLoading(false);
          navigate("/admin/vendor/pending-task", { replace: true });
          toast.success("Login Success", {
            position: "top-right",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        } else {
          setLoading(false);
          toast.error("Login Failed", {
            position: "top-right",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        }
      })
      .catch((err) => {
        toast.error("Login Failed", {
          position: "top-right",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      });

    setLoading(false);
  };

  useEffect(() => {
    Cookies.remove("admin_token");
    Cookies.remove("admin_id");
  }, []);

  return (
    <>
      <div className="grid grid-cols-12 min-h-screen relative font-roboto">
        <div
          className="bg-cover bg-no-repeat bg-center relative col-span-8 max-[634px]:hidden max-[1275px]:col-span-6"
          style={{ backgroundImage: `url(${unsplashimg.src})` }}
        ></div>
        <div className="font-roboto bg-white px-20 max-[790px]:px-10 flex flex-col justify-center w-full rounded-sm shadow-sm col-span-4 max-[634px]:col-span-12 max-[1275px]:col-span-6">
          <div className="flex flex-col items-center gap-2">
            <div className="font-semibold text-[#0077b6]">
              PT KARYA PRIMA UNGGULAN
            </div>
            <div className="font-semibold mb-10 text-[#0077b6]">LOGIN</div>
          </div>

          <form className="flex flex-col gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email1" value="Username" />
              </div>
              <TextInput
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                id="email1"
                placeholder="name@flowbite.com"
                required
                type="email"
                onKeyDown={(evt) => evt.key === " " && evt.preventDefault()}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password1" value="Password" />
              </div>
              <div className="relative">
                <TextInput
                  id="password1"
                  className="w-full"
                  required
                  type={`${showPassword ? "text" : "password"}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="cursor-pointer absolute top-[50%] right-[10px] translate-y-[-50%]"
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}{" "}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember">Remember me</Label>
                </div>
              </div>
              <Link to="/">
                <div className="text-[12px] text-slate-400 cursor-pointer hover:text-blue-400 hover:underline">
                  Login sebagai vendor
                </div>
              </Link>
              {/* <Link to="/monitor">
                <div className="text-[12px] text-slate-400 cursor-pointer hover:text-blue-400 hover:underline">
                  Login sebagai WH Smith
                </div>
              </Link> */}
            </div>

            <button
              type="submit"
              disabled={loading ? true : false}
              className="bg-[#0077b6] py-3 text-white rounded-md shadow-sm "
              onClick={onSubmitLogin}
            >
              {loading ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : (
                "LOGIN"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginWh;
