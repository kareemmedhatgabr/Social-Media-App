import React, { useState, useRef } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FaGlobeAmericas, FaRegImage, FaRegSmile } from "react-icons/fa";
import { IoIosArrowDown, IoMdClose } from "react-icons/io";
import { IoSend } from "react-icons/io5";

export default function EditPost({ postInfo, queryKey, setIsEditing }) {
  if (!postInfo) return null;

  const { id, user, body, image } = postInfo;
  const captionInput = useRef(null);
  const imageInput = useRef(null);

  const [imagePreview, setImagePreview] = useState(image || null);
  const [removeImage, setRemoveImage] = useState(false);
  const queryClient = useQueryClient();

  const firstName = user?.name ? user.name.split(" ")[0] : "friend";
  const photoInputId = `edit-photo-${id}`;

  function handleChangeImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setRemoveImage(false);
  }

  function handleClearImage() {
    setImagePreview(null);
    setRemoveImage(true);

    if (imageInput.current) {
      imageInput.current.value = "";
    }
  }

  function handleCancel() {
    if (captionInput.current) {
      captionInput.current.value = body || "";
    }

    setImagePreview(image || null);
    setRemoveImage(false);

    if (imageInput.current) {
      imageInput.current.value = "";
    }

    setIsEditing(false);
  }

  async function handleUpdatePost() {
    const formData = new FormData();

    if (captionInput.current?.value?.trim()) {
      formData.append("body", captionInput.current.value.trim());
    } else {
      formData.append("body", "");
    }

    const file = imageInput.current?.files?.[0];
    if (file) {
      formData.append("image", file);
    }

    if (removeImage) {
      formData.append("removeImage", "true");
    }

    const token = localStorage.getItem("tkn");

    return axios.put(
      `https://route-posts.routemisr.com/posts/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  const {
    mutate: updateMutation,
    isPending,
    error,
    isError,
  } = useMutation({
    mutationFn: handleUpdatePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ["getposts"] });
      queryClient.invalidateQueries({ queryKey: ["Savedposts"] });
      queryClient.invalidateQueries({ queryKey: ["getMyposts"] });
      queryClient.invalidateQueries({ queryKey: ["getMyCommunityposts"] });
      setIsEditing(false);
    },
  });

  return (
    <div className="w-full rounded-xl border border-gray-300 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <img
          src={
            user?.photo ||
            "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"
          }
          alt="User avatar"
          className="h-11 w-11 rounded-full object-cover"
        />

        <div className="flex flex-col">
          <span className="text-[17px] font-bold">{user?.name || "User"}</span>

          <button
            type="button"
            className="flex items-center gap-1 rounded-md bg-[#e4e6eb] px-2 py-0.5 text-[13px]"
          >
            <FaGlobeAmericas size={12} />
            <span>Public</span>
            <IoIosArrowDown size={14} />
          </button>
        </div>
      </div>

      <div className="mb-3 rounded-2xl border bg-[#F8FAFC] p-2.5">
        <textarea
          ref={captionInput}
          defaultValue={body || ""}
          placeholder={`What's on your mind, ${firstName}?`}
          className="min-h-24 w-full resize-none border-none bg-transparent text-[20px] outline-none"
        />
      </div>

      {imagePreview && (
        <div className="relative mb-4">
          <button
            type="button"
            onClick={handleClearImage}
            className="absolute right-2 top-2 rounded-full bg-white p-1 shadow"
          >
            <IoMdClose size={20} />
          </button>

          <img
            src={imagePreview}
            alt="Preview"
            className="h-64 w-full rounded-lg border object-cover"
          />
        </div>
      )}

      {isError && (
        <p className="mb-3 text-sm font-semibold text-red-600">
          {error?.response?.data?.message || error?.message || "Update failed"}
        </p>
      )}

      <hr className="mb-3" />

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <label
            htmlFor={photoInputId}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100"
          >
            <FaRegImage className="text-[#45bd62]" size={20} />
            <span className="text-[15px]">Photo/video</span>
          </label>

          <input
            type="file"
            id={photoInputId}
            hidden
            ref={imageInput}
            onChange={handleChangeImage}
            accept="image/*"
          />

          <button
            type="button"
            className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100"
          >
            <FaRegSmile className="text-[#f7b928]" size={20} />
            <span className="text-[15px]">Feeling/activity</span>
          </button>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-lg bg-gray-200 px-6 py-2 font-semibold hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => updateMutation()}
            disabled={isPending}
            className="flex items-center gap-2 rounded-lg bg-[#1b74e4] px-8 py-2 font-bold text-white disabled:opacity-60"
          >
            {isPending ? "Updating..." : "Update"}
            <IoSend size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
