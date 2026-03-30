import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../Loader/Loader";
import axios from "axios";
import PostCard from "../PostCard/PostCard";
import { GoArrowLeft } from "react-icons/go";

export default function PostDetails() {
  const { id } = useParams();

  function getPostDetails() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tkn")}`,
      },
    });
  }

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["getPostDetails", id],
    queryFn: getPostDetails,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center">
        <h1>{error?.message}</h1>
      </div>
    );
  }

  const post = data.data.data.post;

  return (
    <div className="mt-5 md:w-[50%] w-[95%] mx-auto">
      <Link className="" to={"/home"}>
        <div className="flex items-center gap-2 bg-white w-fit px-4 py-2 rounded-lg mb-5">
          {" "}
          <GoArrowLeft />
          Back
        </div>
      </Link>
      <PostCard postInfo={post} />
    </div>
  );
}
