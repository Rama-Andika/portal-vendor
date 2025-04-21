import {  Label, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { CircularProgress } from "@mui/material";
import { toast } from "sonner";

const api = process.env.REACT_APP_BASEURL;
const ForgetPassword = () => {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");

  const [showPassword, setShowPassword] = useState([false, false]);
  const [loading, setLoading] = useState(false);

  const { state } = useLocation();
  const [user, setUser] = useState({});

  const unsplashimg = {
    src: "https://source.unsplash.com/1600x900/?random",
    alt: "random unsplash image",
  };
  //   setLoading(true);
  //   e.preventDefault();

  //   await fetch(`${api}api/portal-vendor/list/users`, {
  //     method: "POST",
  //     body: JSON.stringify({
  //       username: username,
  //       password: password,
  //     }),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setLoading(false);
  //       if (data.data.length > 0) {
  //         toast.success("Login Success", {
  //           position: "top-right",
  //           style: {
  //             borderRadius: "10px",
  //             background: "#333",
  //             color: "#fff",
  //           },
  //         });
  //         Cookies.set("id", data.data[0].id);
  //         Cookies.set("token", generateString(10));
  //         Cookies.set("vendor_id", data.data[0].vendor_id);
  //         navigate(`/vendor/profile`);
  //         setLoading(false);
  //       } else {
  //         toast.error("Login Failed!", {
  //           position: "top-right",
  //           style: {
  //             borderRadius: "10px",
  //             background: "#333",
  //             color: "#fff",
  //           },
  //         });
  //         setLoading(false);
  //       }
  //     })
  //     .catch((err) => {
  //       toast.error("Login Failed!", {
  //         position: "top-right",
  //         style: {
  //           borderRadius: "10px",
  //           background: "#333",
  //           color: "#fff",
  //         },
  //       });
  //       setLoading(false);
  //     });
  // };

  useEffect(() => {
    if (state !== null) {
      const getUser = async () => {
        await fetch(`${api}api/portal-vendor/list/users`, {
          method: "POST",
          body: JSON.stringify({
            email: state.email,
          }),
        })
          .then((response) => response.json())
          .then((res) => {
            if (res.data.length > 0) {
              setUser(res.data[0]);
            } else {
              setUser({});
            }
          })
          .catch((err) => {
            setUser({});
          });
      };

      getUser();
    } else {
      navigate("/");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeShowPassword = (index) => {
    const _showPassword = showPassword.map((item, i) => {
      if (i === index) {
        item = !item;
      }
      return item;
    });

    setShowPassword(_showPassword);
  };

  const clickSave = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (newPassword.trim().length === 0 || confPassword.trim().length === 0) {
      setLoading(false);
      return toast.error("Password cannot be empty!");
    }

    if (newPassword.trim() !== confPassword.trim()) {
      setLoading(false);
      return toast.error("Password is not matched!");
    }

    await fetch(`${api}api/portal-vendor/user`, {
      method: "POST",
      body: JSON.stringify({
        id: user.id,
        vendor_id: user.vendor_id,
        email: user.email,
        username: user.username,
        password: newPassword,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.data !== 0) {
          toast.success("Password change success!");
          navigate("/");
        } else {
          toast.error("Password change failed!");
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Password change failed!");
      });

    console.log("save");
  };

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
            <div className="font-semibold mb-10 text-[#0077b6]">
              Forgot Password
            </div>
          </div>

          <form className="flex flex-col gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="pass" value="New Password" />
              </div>
              <div className="relative">
                <TextInput
                  id="pass"
                  className="w-full"
                  required
                  onKeyDown={(evt) => evt.key === " " && evt.preventDefault()}
                  type={`${showPassword[0] ? "text" : "password"}`}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <div
                  onClick={() => changeShowPassword(0)}
                  className="cursor-pointer absolute top-[50%] right-[10px] translate-y-[-50%]"
                >
                  {showPassword[0] ? <FaEye /> : <FaEyeSlash />}{" "}
                </div>
              </div>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="pass2" value="Confirm Password" />
              </div>
              <div className="relative">
                <TextInput
                  id="pass2"
                  className="w-full"
                  required
                  onKeyDown={(evt) => evt.key === " " && evt.preventDefault()}
                  type={`${showPassword[1] ? "text" : "password"}`}
                  value={confPassword}
                  onChange={(e) => setConfPassword(e.target.value)}
                />
                <div
                  onClick={() => changeShowPassword(1)}
                  className="cursor-pointer absolute top-[50%] right-[10px] translate-y-[-50%]"
                >
                  {showPassword[1] ? <FaEye /> : <FaEyeSlash />}{" "}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Link to="/">
                <div className="text-[12px] text-slate-400 cursor-pointer hover:text-blue-400 hover:underline">
                  Back to login
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
              onClick={clickSave}
            >
              {loading ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : (
                "Save"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
