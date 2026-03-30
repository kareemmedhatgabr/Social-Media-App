import React from "react";
import { RiUser3Line } from "react-icons/ri";
import { CiAt } from "react-icons/ci";
import { LuUsers } from "react-icons/lu";
import { CiCalendar } from "react-icons/ci";
import { IoKeyOutline } from "react-icons/io5";
import * as zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { authContext } from "../../Context/AuthiContext";

const registerSchema = zod
  .object({
    name: zod
      .string()
      .min(3, "Fullname must be at least 3 characters")
      .max(13, "Fullname must be maximume 13 characters"),
    username: zod
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(13, "Username must be maximume 13 characters")
      .optional(),
    email: zod.email("Emai is not match"),
    dateOfBirth: zod.coerce
      .date()
      .refine(function (value) {
        return new Date().getFullYear() - value.getFullYear() >= 18;
      }, "Age must be at least 18")
      .transform(function (value) {
        return `${value.getFullYear()}-${value.getMonth() - 1}-${value.getDate()}`;
      }),
    gender: zod.enum(["male", "female"]),
    password: zod
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/,
        "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character",
      ),
    rePassword: zod
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/,
        "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character",
      ),
  })
  .refine(
    function (obj) {
      return obj.rePassword === obj.password;
    },
    { path: "rePassword", error: "Password is inmatch" },
  );

export default function Register() {
  const [successResp, setsuccessResp] = useState(false);
  const [errorMessage, seterrorMessage] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const { setAuthenticatedUser } = useContext(authContext);

  const navigate = useNavigate();
  const { handleSubmit, register, formState } = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: "",
      password: "",
      rePassword: "",
    },
    mode: "onSubmit",
    resolver: zodResolver(registerSchema),
  });

  function myHandleSubmit(values) {
    console.log("valurs", values);

    setisLoading(true);
    axios
      .post("https://route-posts.routemisr.com/users/signup", values)
      .then(function (resp) {
        setAuthenticatedUser(resp.data.data.token);
        localStorage.setItem("tkn", resp.data.data.token);
        localStorage.setItem("user", JSON.stringify(resp.data.data.user));
        console.log("stored user", resp.data.data.user);
        setsuccessResp(true);
        setTimeout(() => {
          setsuccessResp(false);
          navigate("/home");
        }, 2000);
      })
      .catch(function (err) {
        console.log("error", err.response.data.message);
        seterrorMessage(err.response.data.message);
        setTimeout(() => {
          seterrorMessage(null);
        }, 4000);
      })
      .finally(function () {
        setisLoading(false);
      });
  }
  return (
    <>
      <div>
        <div>
          <p className="text-3xl font-extrabold text-[#0f172a] mt-3">
            Create a new account
          </p>
          <p className="text-sm text-[#64748b] mt-1">It is quick and easy.</p>
        </div>

        <form
          onSubmit={handleSubmit(myHandleSubmit)}
          className="mt-6 space-y-4"
        >
          <div className="relative">
            <RiUser3Line
              className="absolute left-3 top-1/2 -translate-y-1/2  text-[#90A1B9]"
              strokeWidth={0.8}
              size={18}
            />
            <input
              {...register("name")}
              type="text"
              placeholder="Full name"
              className={`w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl ps-10 h-12 focus:outline-none focus:border-[#00298d]`}
            />

            {formState.errors.name && formState.touchedFields.name && (
              <p className="text-[12px] font-semibold text-[#eb0040]">
                {formState.errors.name?.message}
              </p>
            )}
          </div>

          <div className="relative">
            <CiAt
              strokeWidth={0.8}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#90A1B9]"
              size={18}
            />
            <input
              type="text"
              {...register("username")}
              placeholder="Username (optional)"
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl ps-10 h-12 focus:outline-none focus:border-[#00298d]"
            />
            {formState.errors.username && formState.touchedFields.username && (
              <p className="text-[12px] font-semibold text-[#eb0040]">
                {formState.errors.username?.message}
              </p>
            )}
          </div>

          <div className="relative">
            <CiAt
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#90A1B9]"
              strokeWidth={0.8}
              size={18}
            />
            <input
              type="email"
              {...register("email")}
              placeholder="Email address"
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl ps-10 h-12 focus:outline-none focus:border-[#00298d]"
            />
            {formState.errors.email && formState.touchedFields.email && (
              <p className="text-[12px] font-semibold text-[#eb0040]">
                {formState.errors.email?.message}
              </p>
            )}
          </div>

          <div className="relative">
            <LuUsers
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#90A1B9]"
              size={18}
              strokeWidth={2}
            />
            <select
              {...register("gender")}
              className="w-full  bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl ps-10 h-12 focus:outline-none focus:border-[#00298d]"
            >
              <option>Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {formState.errors.gender && formState.errors.gender && (
              <p className="text-[12px] font-semibold text-[#eb0040]">
                {formState.errors.gender?.message}
              </p>
            )}
          </div>

          <div className="relative">
            <CiCalendar
              strokeWidth={0.8}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#90A1B9]"
              size={18}
            />
            <input
              type="date"
              {...register("dateOfBirth")}
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl ps-10 h-12 focus:outline-none focus:border-[#00298d]"
            />

            {formState.errors.dateOfBirth &&
              formState.touchedFields.dateOfBirth && (
                <p className="text-[12px] font-semibold text-[#eb0040]">
                  {formState.errors.dateOfBirth?.message}
                </p>
              )}
          </div>

          <div className="relative">
            <IoKeyOutline
              strokeWidth={0.8}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#90A1B9]"
              size={18}
            />
            <input
              type="password"
              {...register("password")}
              placeholder="Password"
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl ps-10 h-12 focus:outline-none focus:border-[#00298d]"
            />
            {formState.errors.password && formState.touchedFields.password && (
              <p className="text-[12px] font-semibold text-[#eb0040]">
                {formState.errors.password?.message}
              </p>
            )}
          </div>

          <div className="relative">
            <IoKeyOutline
              strokeWidth={0.8}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#90A1B9]"
              size={18}
            />
            <input
              type="password"
              {...register("rePassword")}
              placeholder="Confirm password"
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl ps-10 h-12 focus:outline-none focus:border-[#00298d]"
            />
            {formState.errors.rePassword &&
              formState.touchedFields.rePassword && (
                <p className="text-[12px] font-semibold text-[#eb0040]">
                  {formState.errors.rePassword?.message}
                </p>
              )}
          </div>

          <button
            disabled={isLoading}
            className={`w-full h-12 
  ${
    isLoading
      ? "bg-[#92a1c6] cursor-not-allowed"
      : "bg-[#00298d] hover:bg-[#001f6b]"
  } 
  text-white rounded-xl font-bold mt-2 transition`}
          >
            {isLoading ? "Please Wait" : "Create New Account"}
          </button>
        </form>
        {successResp && (
          <div className="bg-[#f6fff1] py-3 mt-3 rounded-2xl border border-[#50d25d]">
            <p className="ms-6 text-[14px] text-[#50d25d] font-semibold">
              Congratolations
            </p>
          </div>
        )}
        {errorMessage && (
          <div className="bg-[#FFF1F2] py-3 mt-3 rounded-2xl border border-[#fa205a]">
            <p className="ms-6 text-[14px] text-[#c60036] font-semibold">
              {errorMessage}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
