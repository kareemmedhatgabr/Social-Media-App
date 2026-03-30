import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import Loader from "../Loader/Loader";
import { CgUserAdd } from "react-icons/cg";
import PostCard from "../PostCard/PostCard";
import { Link } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { useState } from "react";

export default function UserProfile() {
  const { id } = useParams();
  // console.log('id',id)
  function getUserProfile() {
    return axios.get(`https://route-posts.routemisr.com/users/${id}/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tkn")}`,
      },
    });
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
  });

  function getAllPosts() {
    return axios.get(`https://route-posts.routemisr.com/users/${id}/posts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tkn")}`,
      },
    });
  }

  const { data: userPosts } = useQuery({
    queryKey: ["getposts"],
    queryFn: getAllPosts,
  });

  function handleFollow() {
    return axios.put(
      `https://route-posts.routemisr.com/users/${id}/follow`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tkn")}`,
        },
      },
    );
  }

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: handleFollow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });

  console;

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <h2>Error....</h2>;
  }

  const user = data.data.data.user;
  const { username, photo, name } = user;
  const profilePosts = userPosts?.data?.data?.posts || [];

  console.log("userProfile", user);

  console.log("isFollowing", data.data.data.isFollowing);
  const isFollowing = data.data.data.isFollowing;

  return (
    <div>
      <div className="mt-5 md:w-[84.6%] w-[95%] mx-auto">
        <Link className="" to={"/home"}>
          <div className="flex items-center gap-2 bg-white w-fit px-4 py-2 rounded-lg mb-5">
            {" "}
            <GoArrowLeft />
            Back
          </div>
        </Link>
      </div>

      <div className="min-h-screen">
        <div className="rounded-b-2xl h-75 bg-linear-to-r from-[#0f172a] via-[#1e293b] to-[#7fa1c3] relative w-full md:w-[85%]  mx-auto"></div>

        <div className="w-full  md:w-[83%] mx-auto px-6">
          <div className="bg-white rounded-[40px] shadow-sm -mt-32 relative z-10 p-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex items-center justify-between w-full">
                <div className="relative group flex gap-3 items-center ">
                  <img
                    src={photo}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-[6px] border-white shadow-sm object-cover"
                  />

                  <div>
                    <p className="text-2xl font-black">{name}</p>
                    <p className="text-16px font-semibold text-[#62748e]">
                      {username}
                    </p>
                  </div>
                </div>

                {isFollowing ? (
                  <div
                    onClick={mutate}
                    className="cursor-pointer flex gap-2 bg-[#1877f2] w-fit justify-center items-center h-fit px-3 py-2 rounded-xl"
                  >
                    <p className="text-[14px] font-semibold text-white">
                      Following
                    </p>
                  </div>
                ) : (
                  <div
                    onClick={mutate}
                    className="cursor-pointer flex gap-2 bg-[#1877f2] w-fit justify-center items-center h-fit px-3 py-2 rounded-xl"
                  >
                    <CgUserAdd color="white" size={18} />
                    <p className="text-[14px] font-semibold text-white">
                      Follow
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {profilePosts.length !== 0 ? (
          profilePosts.map((post) => {
            return (
              <div className="w-full md:w-[83%] mx-auto px-6 flex flex-col gap-5 mt-16">
                <PostCard
                  key={post.id}
                  postInfo={post}
                  queryKey={["getposts"]}
                />
              </div>
            );
          })
        ) : (
          <div className="w-full md:w-[80%] mx-auto px-6 flex  gap-5 mt-4 bg-white py-3.5 mb-16 rounded-2xl justify-center">
            <p className="text-[14px] text-[#62748e] font-normal">
              No posts yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
