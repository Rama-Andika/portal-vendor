import { Label, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { CircularProgress } from "@mui/material";
import { toast } from "sonner";

const api = process.env.REACT_APP_BASEURL;
const ForgetPasswordConfirm = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

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
    Cookies.remove("id");
    Cookies.remove("token");
    Cookies.remove("vendor_id");
  }, []);

  const clickResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (email.trim().length === 0) {
      setLoading(false);
      return toast.error("Email cannot be empty!");
    }

    await fetch(`${api}api/portal-vendor/user/validation`, {
      method: "POST",
      body: JSON.stringify({
        email: email,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        if (!res.data) {
          navigate("/forgot-password", { state: { email: email } });
        } else {
          toast.error("Email not registered!");
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Email not registered!");
      });
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
            <div className="font-semibold mb-10 text-[#0077b6]"></div>
          </div>

          <form className="flex flex-col gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Email" />
              </div>
              <div className="relative">
                <TextInput
                  id="email"
                  className="w-full"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Link to="/">
                <div className="text-[12px] text-slate-400 cursor-pointer hover:text-blue-400 hover:underline">
                  Back to login
                </div>
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading ? true : false}
              className="bg-[#0077b6] py-3 text-white rounded-md shadow-sm "
              onClick={clickResetPassword}
            >
              {loading ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgetPasswordConfirm;
