import { Checkbox, Label, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";

const LoginWh = () => {
  const navigate = useNavigate();
  const unsplashimg = {
    src: "https://source.unsplash.com/1600x900/?random",
    alt: "random unsplash image",
  };

  const onSubmitLogin = () => {
    navigate("/admin/vendor/pending-task", { replace: true });
  };
  return (
    <>
      <div className="grid grid-cols-12 min-h-screen relative font-roboto">
      
        <div
          className="bg-cover bg-no-repeat bg-center relative col-span-8 max-[634px]:hidden max-[1275px]:col-span-6"
          style={{ backgroundImage: `url(${unsplashimg.src})` }}
        ></div>
        <div className="font-roboto bg-white px-20 max-[790px]:px-10 flex flex-col justify-center w-full rounded-sm shadow-sm col-span-4 max-[634px]:col-span-12 max-[1275px]:col-span-6">
          <div className="flex flex-col items-center gap-2">
            <div className="font-semibold text-[#0077b6]">PT KARYA PRIMA UNGGULAN</div>
            <div className="font-semibold mb-10 text-[#0077b6]">LOGIN</div>
          </div>

          <form className="flex flex-col gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email1" value="Your email" />
              </div>
              <TextInput
                id="email1"
                placeholder="name@flowbite.com"
                required
                type="email"
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password1" value="Your password" />
              </div>
              <TextInput id="password1" required type="password" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember">Remember me</Label>
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
              className="bg-[#0077b6] py-3 text-white rounded-md shadow-sm "
              onClick={onSubmitLogin}
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginWh;
