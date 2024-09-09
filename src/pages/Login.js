import { Checkbox, Label, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import { useEffect } from "react";
import Cookies from "js-cookie";
import generateString from "../components/functions/GenerateRandomString";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { CircularProgress } from "@mui/material";


const api = process.env.REACT_APP_BASEURL;
const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState({})

  const onSubmitLogin = async (e) => {
    setLoading(true);
    e.preventDefault();

    await fetch(`${api}api/portal-vendor/list/users`, {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        if (data.data.length > 0) {
          toast.success("Login Success", {
            position: "top-right",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          Cookies.set("id", data.data[0].id);
          Cookies.set("token", generateString(10));
          Cookies.set("vendor_id", data.data[0].vendor_id);
          Cookies.set("vendoroxy_id", data.data[0].vendoroxy_id);
          navigate(`/vendor/profile`);
          setLoading(false);
        } else {
          toast.error("Login Failed!", {
            position: "top-right",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          setLoading(false);
        }
      })
      .catch((err) => {
        toast.error("Login Failed!", {
          position: "top-right",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        setLoading(false);
      });
  };

  const getCompany = async() => {
    try {
      const response = await fetch(`${api}api/company`)
      if(!response.ok){
        throw new Error(response.statusText)
      }
      const result = await response.json()
      const {data} = result
      setCompany(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    Cookies.remove("id");
    Cookies.remove("token");
    Cookies.remove("vendor_id");
    Cookies.remove("vendoroxy_id");
    getCompany()
  }, []);

  return (
    <>
      <div className="grid grid-cols-12 min-h-screen relative font-roboto">
        {/* <div className="absolute top-0 right-0 py-2 pe-3 text-[24px] font-bold tracking-wide hidden min-[755px]:block">
          PT KARYA PRIMA UNGGULAN
        </div> */}
        <div
          className="bg-cover bg-no-repeat bg-center relative col-span-8 max-[634px]:hidden max-[1275px]:col-span-6 loginImg"
          style={{ backgroundImage: `url(${require('../assets/images/retail.jpg')})` }} 
        ></div>
        <div className="font-roboto bg-white px-20 max-[790px]:px-10 flex flex-col justify-center w-full rounded-sm shadow-sm col-span-4 max-[634px]:col-span-12 max-[1275px]:col-span-6">
          <div className="flex flex-col items-center gap-2">
            <div className="font-semibold text-[#0077b6]">{company?.name}</div>
            <div className="font-semibold mb-10 text-[#0077b6]">Portal Vendor</div>
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
                onKeyDown={(evt) => evt.key === " " && evt.preventDefault()}
                onChange={(e) => setUsername(e.target.value)}
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
                  <Label htmlFor="remember">Ingatkan Saya</Label>
                </div>
                <Link to="/validation-user">
                  <div className="text-[12px] text-slate-400 cursor-pointer hover:text-blue-400 hover:underline">
                    Lupa Password?
                  </div>
                </Link>
              </div>

              <Link to="/admin">
                <div className="text-[12px] text-slate-400 cursor-pointer hover:text-blue-400 hover:underline">
                  Login sebagai Admin
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
              disabled={loading ? true : false}
              className="bg-[#0077b6] py-3 text-white rounded-md shadow-sm "
              onClick={(e) => onSubmitLogin(e)}
            >
              {loading ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : (
                "LOGIN VENDOR"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
