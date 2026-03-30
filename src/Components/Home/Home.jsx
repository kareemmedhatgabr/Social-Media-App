import React, { useContext, useState } from "react";
import axios from "axios";
import PostCard from "../PostCard/PostCard";
import { useQuery } from "@tanstack/react-query";
import PostCreation from "../PostCreation/PostCreation";
import FollowSuggestions from "../FollowSuggestions/FollowSuggestions";
import {
  LuNewspaper,
  LuSparkles,
  LuEarth,
  LuUsers,
  LuSearch,
} from "react-icons/lu";
import { FaRegBookmark } from "react-icons/fa";

import Loader from "../Loader/Loader";
import { authContext } from "../../Context/AuthiContext";

export default function Home() {
  const [active, setActive] = useState("feed");
  const [getSpesificPosts, setgetSpesificPosts] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { userId } = useContext(authContext);

  function getSuggestionUsers() {
    return axios.get(
      "https://route-posts.routemisr.com/users/suggestions?limit=10",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tkn")}`,
        },
      },
    );
  }

  const { data: suggestions } = useQuery({
    queryKey: ["suggestions"],
    queryFn: getSuggestionUsers,
  });

  function getAllPosts() {
    return axios.get("https://route-posts.routemisr.com/posts", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tkn")}`,
      },
    });
  }

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["getposts"],
    queryFn: getAllPosts,
  });

  function getSavedPosts() {
    return axios.get("https://route-posts.routemisr.com/users/bookmarks", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tkn")}`,
      },
    });
  }

  const { data: savedPosts } = useQuery({
    queryKey: ["Savedposts"],
    queryFn: getSavedPosts,
  });

  function getMyPosts() {
    return axios.get(
      `https://route-posts.routemisr.com/users/${userId}/posts`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tkn")}`,
        },
      },
    );
  }

  const { data: myPosts } = useQuery({
    queryKey: ["getMyposts"],
    queryFn: getMyPosts,
  });

  function getCommunityPosts() {
    return axios.get(
      "https://route-posts.routemisr.com/posts/feed?only=following&limit=10",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tkn")}`,
        },
      },
    );
  }

  const { data: myCommunityPosts } = useQuery({
    queryKey: ["getMyCommunityposts"],
    queryFn: getCommunityPosts,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center">
        <h1>{error?.message || "Something went wrong"}</h1>
      </div>
    );
  }

  const allPosts = data?.data?.data?.posts || [];
  const myProfilePosts = myPosts?.data?.data?.posts || [];
  const allSuggestions = suggestions?.data?.data?.suggestions || [];
  const allSavedPosts = savedPosts?.data?.data?.bookmarks || [];
  const allCommunityPosts = myCommunityPosts?.data?.data?.posts || [];

  const filteredSuggestions = allSuggestions.filter((sugg) =>
    `${sugg.name || ""} ${sugg.username || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-12">
        <div className="order-1 self-start rounded-2xl bg-white px-4 pb-4 shadow md:order-1 md:col-span-3 md:sticky md:top-20">
          <button
            onClick={() => {
              setActive("feed");
              setgetSpesificPosts("all");
            }}
            className={`mt-4 flex items-center gap-3 rounded-2xl px-4 py-2 border-none ${
              active === "feed"
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-[#F1F5F9]"
            }`}
          >
            <LuNewspaper size={18} />
            <p className="text-[14px] font-bold">Feed</p>
          </button>

          <button
            onClick={() => {
              setActive("myposts");
              setgetSpesificPosts("myPosts");
            }}
            className={`mt-2 flex items-center gap-3 rounded-2xl px-4 py-2 border-none ${
              active === "myposts"
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-[#F1F5F9]"
            }`}
          >
            <LuSparkles size={18} />
            <p className="text-[14px] font-bold">My Posts</p>
          </button>

          <button
            onClick={() => {
              setActive("community");
              setgetSpesificPosts("community");
            }}
            className={`mt-2 flex items-center gap-3 rounded-2xl px-4 py-2 border-none ${
              active === "community"
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-[#F1F5F9]"
            }`}
          >
            <LuEarth size={18} />
            <p className="text-[14px] font-bold">Community</p>
          </button>

          <button
            onClick={() => {
              setActive("saved");
              setgetSpesificPosts("saved");
            }}
            className={`mt-2 flex items-center gap-3 rounded-2xl px-4 py-2 border-none ${
              active === "saved"
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-[#F1F5F9]"
            }`}
          >
            <FaRegBookmark size={18} />
            <p className="text-[14px] font-bold">Saved</p>
          </button>
        </div>

        <div className="order-3 flex min-h-screen flex-col gap-5 rounded-2xl md:order-2 md:col-span-6">
          <PostCreation queryKey={["getposts"]} />

          {getSpesificPosts === "all" &&
            allPosts.map((post) => (
              <PostCard
                key={post.id || post._id}
                postInfo={post}
                queryKey={["getposts"]}
              />
            ))}

          {getSpesificPosts === "saved" &&
            allSavedPosts.map((post) => (
              <PostCard
                key={post.id || post._id}
                postInfo={post}
                queryKey={["Savedposts"]}
              />
            ))}

          {getSpesificPosts === "myPosts" &&
            myProfilePosts.map((post) => (
              <PostCard
                key={post.id || post._id}
                postInfo={post}
                queryKey={["getMyposts"]}
              />
            ))}

          {getSpesificPosts === "community" &&
            allCommunityPosts.map((post) => (
              <PostCard
                key={post.id || post._id}
                postInfo={post}
                queryKey={["getMyCommunityposts"]}
              />
            ))}

          {getSpesificPosts === "saved" && allSavedPosts.length === 0 && (
            <div class="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
              No posts yet. Be the first one to publish.
            </div>
          )}
        </div>

        <div className="order-2 self-start md:order-3 md:col-span-3 md:sticky md:top-20">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <LuUsers size={18} className="text-[#1877f2]" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Suggested Friends
                </h3>
              </div>

              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                {filteredSuggestions.length}
              </span>
            </div>

            <div className="mb-3">
              <label className="relative block">
                <LuSearch
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search friends..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-[#1877f2] focus:bg-white"
                />
              </label>
            </div>

            <div className="space-y-3">
              {filteredSuggestions.slice(0, 5).map((sugg) => (
                <FollowSuggestions
                  key={sugg._id || sugg.id}
                  suggestionFollower={sugg}
                  sugKey={["suggestions"]}
                />
              ))}
            </div>

            <button
              type="button"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
            >
              View more
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
