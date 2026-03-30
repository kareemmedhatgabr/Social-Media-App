import React, { useContext, useRef, useState } from "react";
import {
  FaGlobeAmericas,
  FaUsers,
  FaLock,
  FaRegImage,
  FaRegSmile,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Link } from "react-router-dom";
import { authContext } from "../../Context/AuthiContext";

export default function PostCreation({ queryKey }) {
  const { userData } = useContext(authContext);

  const [imagePreview, setImagePreview] = useState(null);
  const [privacy, setPrivacy] = useState("public");

  const captionInput = useRef(null);
  const imageInput = useRef(null);

  const privacyIcons = {
    public: <FaGlobeAmericas size={12} />,
    following: <FaUsers size={12} />,
    only_me: <FaLock size={12} />,
  };

  function handleChangeImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
  }

  function handleClearImage() {
    setImagePreview(null);

    if (imageInput.current) {
      imageInput.current.value = "";
    }
  }

  function handleCreatePost() {
    const postObj = new FormData();

    if (captionInput.current?.value?.trim()) {
      postObj.append("body", captionInput.current.value.trim());
    }

    if (imageInput.current?.files?.[0]) {
      postObj.append("image", imageInput.current.files[0]);
    }

    return axios.post("https://route-posts.routemisr.com/posts", postObj, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tkn")}`,
      },
    });
  }

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: handleCreatePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      handleClearImage();

      if (captionInput.current) {
        captionInput.current.value = "";
      }

      setPrivacy("public");
    },
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start gap-3">
        <Link to="/profile">
          <img
            alt={userData?.name || "User"}
            className="h-11 w-11 rounded-full object-cover"
            src={
              userData?.photo ||
              "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"
            }
          />
        </Link>

        <div className="flex-1">
          <Link to="/profile" className="block">
            <p className="text-base font-extrabold text-slate-900">
              {userData?.name || "User"}
            </p>
          </Link>

          <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
            {privacyIcons[privacy]}

            <select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
              className="bg-transparent outline-none"
            >
              <option value="public">Public</option>
              <option value="following">Followers</option>
              <option value="only_me">Only me</option>
            </select>
          </div>
        </div>
      </div>

      <div className="relative">
        <textarea
          ref={captionInput}
          rows="4"
          placeholder={`What's on your mind, ${
            userData?.name?.split(" ")[0] || "friend"
          }?`}
          className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[17px] leading-relaxed text-slate-800 outline-none transition focus:border-[#1877f2] focus:bg-white"
        />
      </div>

      {imagePreview && (
        <div className="relative mt-3 overflow-hidden rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={handleClearImage}
            className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-1 shadow-sm transition hover:bg-white"
          >
            <IoMdClose size={18} />
          </button>

          <img
            src={imagePreview}
            alt="Preview"
            className="w-full object-cover"
          />
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3">
        <div className="relative flex items-center gap-2">
          <label
            htmlFor="post-image"
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            <FaRegImage size={18} className="text-emerald-600" />
            <span className="hidden sm:inline">Photo/video</span>
          </label>

          <input
            id="post-image"
            accept="image/*"
            className="hidden"
            type="file"
            ref={imageInput}
            onChange={handleChangeImage}
          />

          <button
            type="button"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            <FaRegSmile size={18} className="text-amber-500" />
            <span className="hidden sm:inline">Feeling/activity</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => mutate()}
            disabled={isPending}
            className="flex items-center gap-2 rounded-lg bg-[#1877f2] px-5 py-2 text-sm font-extrabold text-white shadow-sm transition-colors hover:bg-[#166fe5] disabled:opacity-60"
          >
            {isPending ? "Posting..." : "Post"}
            <IoSend size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
