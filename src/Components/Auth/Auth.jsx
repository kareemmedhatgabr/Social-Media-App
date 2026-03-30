import { useState } from "react";
import Login from "../Login/Login";
import Register from "../Register/Register";
export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      <div className="min-h-screen flex justify-center items-center  ">
        <div className="md:w-[82%]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10  min-h-125 p-5 md:p-0">
            <div className="left order-2 md:order-1   ">
              <div className="">
                <h2 className="text-6xl text-[#00298d] font-extrabold">
                  Route Posts
                </h2>

                <p className="text-2xl font-medium mt-4">
                  Connect with friends and the world around you on Route Posts.
                </p>
              </div>

              <div className="bg-white p-5 rounded-[15px] border-2 border-[#becff9] mt-7">
                <p className="text-[14px] font-extrabold text-[#00298d]">
                  About Route Academy
                </p>
                <p className="text-[18px] font-bold mt-2">
                  Egypt's Leading IT Training Center Since 2012
                </p>
                <p className="mt-2 text-[14px] font-normal text-[#314158]">
                  Route Academy is the premier IT training center in Egypt,
                  established in 2012. We specialize in delivering high-quality
                  training courses in programming, web development, and
                  application development. We've identified the unique
                  challenges people may face when learning new technology and
                  made efforts to provide strategies to overcome them.
                </p>

                <div className="grid grid-cols-3 mt-2 gap-3">
                  <div className="bg-[#F2F6FF] p-4 rounded-[10px] border border-[#becff9]">
                    <p className="text-[16px] font-extrabold text-[#00298d]">
                      2012
                    </p>
                    <p className="text-[11px] text-[#45556c] font-bold">
                      FOUNDED
                    </p>
                  </div>
                  <div className="bg-[#F2F6FF] p-4 rounded-lg border border-[#becff9]">
                    <p className="text-[16px] font-extrabold text-[#00298d]">
                      40K+
                    </p>
                    <p className="text-[11px] text-[#45556c] font-bold uppercase">
                      Graduates
                    </p>
                  </div>
                  <div className="bg-[#F2F6FF] p-4 rounded-lg border border-[#becff9]">
                    <p className="text-[16px] font-extrabold text-[#00298d]">
                      50+
                    </p>
                    <p className="text-[11px] text-[#45556c] font-bold uppercase">
                      Partner Companies
                    </p>
                  </div>
                  <div className="bg-[#F2F6FF] p-4 rounded-lg border border-[#becff9]">
                    <p className="text-[16px] font-extrabold text-[#00298d]">
                      5
                    </p>
                    <p className="text-[11px] text-[#45556c] font-bold uppercase">
                      Branches
                    </p>
                  </div>
                  <div className="bg-[#F2F6FF] p-4 rounded-lg border border-[#becff9]">
                    <p className="text-[16px] font-extrabold text-[#00298d]">
                      20
                    </p>
                    <p className="text-[11px] text-[#45556c] font-bold uppercase">
                      Diplomas Available
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="right md:order-2 order-1">
              <div className="w-[90%] mx-auto bg-white p-8 rounded-3xl shadow-lg">
                <div className="bg-[#F1F5F9] p-1 rounded-2xl flex">
                  <button
                    onClick={() => setIsLogin(true)}
                    className={`w-1/2 py-2 rounded-xl font-bold transition cursor-pointer ${
                      isLogin
                        ? "bg-white text-[#00298d] shadow"
                        : "text-gray-500"
                    }`}
                  >
                    Login
                  </button>

                  <button
                    onClick={() => setIsLogin(false)}
                    className={`w-1/2 py-2 rounded-xl font-bold transition cursor-pointer ${
                      !isLogin
                        ? "bg-white text-[#00298d] shadow"
                        : "text-gray-500"
                    }`}
                  >
                    Register
                  </button>
                </div>

                <div className="mt-6">{isLogin ? <Login /> : <Register />}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
