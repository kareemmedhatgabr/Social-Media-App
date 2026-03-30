import React, { useState } from "react";
import axios from "axios";

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setSuccessMsg("");
    setErrorMsg("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSuccessMsg("");
    setErrorMsg("");

    if (
      !formData.password ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      setErrorMsg("All fields are required.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMsg("New password and confirm password do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("tkn");

      const { data } = await axios.patch(
        "https://route-posts.routemisr.com/users/change-password",
        {
          password: formData.password,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (data?.token) {
        localStorage.setItem("tkn", data.token);
      }

      setSuccessMsg("Password changed successfully.");
      setErrorMsg("");

      setFormData({
        password: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setSuccessMsg("");
      setErrorMsg(
        error?.response?.data?.message || "Failed to change password.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 max-w-md mx-auto mt-10">
      <div className="mb-5 flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e7f3ff] text-[#1877f2]">
          🔑
        </span>

        <div>
          <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
            Change Password
          </h1>

          <p className="text-sm text-slate-500">
            Keep your account secure by using a strong password.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {successMsg && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
            {errorMsg}
          </div>
        )}

        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-slate-700">
            Current password
          </span>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter current password"
            className="w-full rounded-xl border bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition border-slate-200 focus:border-[#1877f2] focus:bg-white"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-slate-700">
            New password
          </span>

          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
            className="w-full rounded-xl border bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition border-slate-200 focus:border-[#1877f2] focus:bg-white"
          />

          <span className="mt-1 block text-xs text-slate-500">
            At least 8 characters with uppercase, lowercase, number, and special
            character.
          </span>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-slate-700">
            Confirm new password
          </span>

          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter new password"
            className="w-full rounded-xl border bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition border-slate-200 focus:border-[#1877f2] focus:bg-white"
          />
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center rounded-xl bg-[#1877f2] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#166fe5] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Updating..." : "Update password"}
        </button>
      </form>
    </section>
  );
}
