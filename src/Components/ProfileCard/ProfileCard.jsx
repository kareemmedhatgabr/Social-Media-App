import React, { useRef, useState } from "react";
import { HiOutlineMail } from "react-icons/hi";
import { FiUser } from "react-icons/fi";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import Loader from "../Loader/Loader";
import PostCard from "../PostCard/PostCard";
import {
  LuCamera,
  LuExpand,
  LuUsers,
  LuFileText,
  LuBookmark,
} from "react-icons/lu";

export default function ProfileCard({ user }) {
  const {
    photo,
    name,
    username,
    followersCount,
    followingCount,
    email,
    bookmarksCount,
    _id,
  } = user;

  const [previewImage, setPreviewImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  const changedImage = useRef(null);

  function handleImageChange(e) {
    const image = e.target.files[0];

    if (image) {
      const imageUrl = URL.createObjectURL(image);
      setPreviewImage(imageUrl);
      setShowModal(true);
    }
  }

  function handleProfileChange() {
    const postObj = new FormData();

    if (changedImage.current?.files?.[0]) {
      postObj.append("photo", changedImage.current.files[0]);
    }

    return axios.put(
      "https://route-posts.routemisr.com/users/upload-photo",
      postObj,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tkn")}`,
        },
      },
    );
  }

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: handleProfileChange,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getProfile"] });
      setShowModal(false);
    },
  });

  function getAllPosts() {
    return axios.get(`https://route-posts.routemisr.com/users/${_id}/posts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tkn")}`,
      },
    });
  }

  function getSavedPosts() {
    return axios.get("https://route-posts.routemisr.com/users/bookmarks", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tkn")}`,
      },
    });
  }

  const {
    data: postsData,
    isError: postsError,
    error: postsErrorMessage,
    isLoading: postsLoading,
  } = useQuery({
    queryKey: ["getProfilePosts", _id],
    queryFn: getAllPosts,
  });

  const { data: savedData } = useQuery({
    queryKey: ["Savedposts"],
    queryFn: getSavedPosts,
  });

  if (postsLoading) {
    return <Loader />;
  }

  if (postsError) {
    return (
      <div className="flex items-center justify-center">
        <h1>{postsErrorMessage?.message || "Something went wrong"}</h1>
      </div>
    );
  }

  const profilePosts = postsData?.data?.data?.posts || [];
  const savedPosts = savedData?.data?.data?.bookmarks || [];

  const shownPosts = activeTab === "posts" ? profilePosts : savedPosts;
  const shownCount =
    activeTab === "posts" ? profilePosts.length : savedPosts.length;

  return (
    <div className="mx-auto max-w-7xl px-3 py-3.5">
      <main className="min-w-0">
        <div className="space-y-5 sm:space-y-6">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.06)] sm:rounded-[28px]">
            <div className="group/cover relative h-44 bg-[linear-gradient(112deg,#0f172a_0%,#1e3a5f_36%,#2b5178_72%,#5f8fb8_100%)] sm:h-52 lg:h-60">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_24%,rgba(255,255,255,.14)_0%,rgba(255,255,255,0)_36%)]"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_86%_12%,rgba(186,230,253,.22)_0%,rgba(186,230,253,0)_44%)]"></div>
              <div className="absolute -left-16 top-10 h-36 w-36 rounded-full bg-white/8 blur-3xl"></div>
              <div className="absolute right-8 top-6 h-48 w-48 rounded-full bg-[#c7e6ff]/10 blur-3xl"></div>
              <div className="absolute inset-x-0 bottom-0 h-20  from-black/25 to-transparent"></div>

              <div className="pointer-events-none absolute right-2 top-2 z-10 flex max-w-[90%] flex-wrap items-center justify-end gap-1.5 opacity-100 transition duration-200 sm:right-3 sm:top-3 sm:max-w-none sm:gap-2 sm:opacity-0 sm:group-hover/cover:opacity-100 sm:group-focus-within/cover:opacity-100">
                <label className="pointer-events-auto inline-flex cursor-pointer items-center gap-1 rounded-lg bg-black/45 px-2 py-1 text-[11px] font-bold text-white backdrop-blur transition hover:bg-black/60 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs">
                  <LuCamera size={13} />
                  Add cover
                  <input accept="image/*" className="hidden" type="file" />
                </label>
              </div>
            </div>

            <div className="relative -mt-12 px-3 pb-5 sm:-mt-16 sm:px-8 sm:pb-6">
              <div className="rounded-3xl border border-white/60 bg-white/92 p-5 backdrop-blur-xl sm:p-7">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-end gap-4">
                      <div className="group/avatar relative shrink-0">
                        <button
                          type="button"
                          className="cursor-zoom-in rounded-full"
                        >
                          <img
                            alt={name}
                            className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md ring-2 ring-[#dbeafe]"
                            src={
                              photo ||
                              "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"
                            }
                          />
                        </button>

                        <button
                          type="button"
                          className="absolute bottom-1 left-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-[#1877f2] opacity-100 shadow-sm ring-1 ring-slate-200 transition duration-200 hover:bg-slate-50 sm:opacity-0 sm:group-hover/avatar:opacity-100 sm:group-focus-within/avatar:opacity-100"
                          title="View profile photo"
                          aria-label="View profile photo"
                          onClick={() => {
                            setPreviewImage(
                              photo ||
                                "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png",
                            );
                            setShowModal(true);
                          }}
                        >
                          <LuExpand size={16} />
                        </button>

                        <label className="absolute bottom-1 right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#1877f2] text-white opacity-100 shadow-sm transition duration-200 hover:bg-[#166fe5] sm:opacity-0 sm:group-hover/avatar:opacity-100 sm:group-focus-within/avatar:opacity-100">
                          <LuCamera size={17} />
                          <input
                            accept="image/*"
                            className="hidden"
                            type="file"
                            ref={changedImage}
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>

                      <div className="min-w-0 pb-1">
                        <h2 className="truncate text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">
                          {name}
                        </h2>

                        <p className="mt-1 text-lg font-semibold text-slate-500 sm:text-xl">
                          @{username}
                        </p>

                        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#d7e7ff] bg-[#eef6ff] px-3 py-1 text-xs font-bold text-[#0b57d0]">
                          <LuUsers size={13} />
                          Route Posts member
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid w-full grid-cols-3 gap-2 w-lg-125">
                    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center sm:px-4 sm:py-4">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">
                        Followers
                      </p>
                      <p className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                        {followersCount ?? 0}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center sm:px-4 sm:py-4">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">
                        Following
                      </p>
                      <p className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                        {followingCount ?? 0}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center sm:px-4 sm:py-4">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">
                        Bookmarks
                      </p>
                      <p className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                        {bookmarksCount ?? 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <h3 className="text-sm font-extrabold text-slate-800">
                      About
                    </h3>

                    <div className="mt-3 space-y-2 text-sm text-slate-600">
                      <p className="flex items-center gap-2">
                        <HiOutlineMail className="text-slate-500" size={15} />
                        {email}
                      </p>

                      <p className="flex items-center gap-2">
                        <FiUser className="text-slate-500" size={15} />
                        Active on Route Posts
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    <div className="rounded-2xl border border-[#dbeafe] bg-[#f6faff] px-4 py-3">
                      <p className="text-xs font-bold uppercase tracking-wide text-[#1f4f96]">
                        My posts
                      </p>
                      <p className="mt-1 text-2xl font-black text-slate-900">
                        {profilePosts.length}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[#dbeafe] bg-[#f6faff] px-4 py-3">
                      <p className="text-xs font-bold uppercase tracking-wide text-[#1f4f96]">
                        Saved posts
                      </p>
                      <p className="mt-1 text-2xl font-black text-slate-900">
                        {savedPosts.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="grid w-full grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1.5 sm:inline-flex sm:w-auto sm:gap-0">
                <button
                  type="button"
                  onClick={() => setActiveTab("posts")}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${
                    activeTab === "posts"
                      ? "bg-white text-[#1877f2] shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <LuFileText size={15} />
                  My Posts
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("saved")}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${
                    activeTab === "saved"
                      ? "bg-white text-[#1877f2] shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <LuBookmark size={15} />
                  Saved
                </button>
              </div>

              <span className="rounded-full bg-[#e7f3ff] px-3 py-1 text-xs font-bold text-[#1877f2]">
                {shownCount}
              </span>
            </div>

            <div className="space-y-3">
              {shownPosts.length > 0 ? (
                shownPosts.map((post) => (
                  <PostCard
                    key={post.id || post._id}
                    postInfo={post}
                    queryKey={
                      activeTab === "posts"
                        ? ["getProfilePosts", _id]
                        : ["Savedposts"]
                    }
                  />
                ))
              ) : (
                <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  {activeTab === "posts"
                    ? "You have not posted yet."
                    : "You have no saved posts yet."}
                </p>
              )}
            </div>
          </section>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-5 md:p-6">
              <h2 className="mb-4 text-lg font-bold md:text-xl">
                Adjust profile photo
              </h2>

              <div className="mb-6 flex justify-center">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="h-48 w-48 rounded-full object-cover md:h-72 md:w-72"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    if (changedImage.current) {
                      changedImage.current.value = "";
                    }
                  }}
                  className="rounded-lg border px-4 py-2"
                >
                  Cancel
                </button>

                <button
                  disabled={isPending}
                  onClick={() => mutate()}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
                >
                  {isPending ? "Saving..." : "Save photo"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
