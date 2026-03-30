import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
} from "@heroui/react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { AiOutlineLike } from "react-icons/ai";
import { BiRepost } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { GoShareAndroid } from "react-icons/go";
import Comment from "../Comment/Comment";
import { Link } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import { CiBookmark } from "react-icons/ci";
import { MdEdit } from "react-icons/md";
import { MdOutlineDeleteOutline } from "react-icons/md";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import EditPost from "../EditPost/EditPost";
import { authContext } from "../../Context/AuthiContext";

export default function PostCard({ postInfo, queryKey }) {
  const {
    body,
    image,
    user,
    topComment,
    sharesCount,
    likesCount,
    commentsCount,
    id,
    isShare,
    sharedPost,
    bookmarked,
  } = postInfo;

  const { username, photo, name, _id } = user;

  let content, commentCreator;
  if (topComment) {
    content = topComment.content;
    commentCreator = topComment.commentCreator;
  }

  const CommentCreatorPhoto = commentCreator?.photo;
  const CommentCreatorName = commentCreator?.name;

  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [openLikes, setOpenLikes] = useState(false);
  const [openShare, setOpenShare] = useState(false);

  const { userId } = useContext(authContext);

  const queryClient = useQueryClient();

  const isLiked = postInfo.likes?.includes(userId);

  function handlleDeletePost() {
    return axios.delete(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tkn")}`,
      },
    });
  }

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: handlleDeletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ["getposts"] });
      queryClient.invalidateQueries({ queryKey: ["Savedposts"] });
      queryClient.invalidateQueries({ queryKey: ["getMyposts"] });
      queryClient.invalidateQueries({ queryKey: ["getMyCommunityposts"] });
      queryClient.invalidateQueries({ queryKey: ["getProfilePosts", _id] });
    },
  });

  const shareCaption = useRef(null);

  function handleSharePost() {
    const body = {
      body: shareCaption.current?.value || " ",
    };

    return axios.post(
      `https://route-posts.routemisr.com/posts/${id}/share`,
      body,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tkn")}`,
        },
      },
    );
  }

  const { mutate: sharePost } = useMutation({
    mutationFn: handleSharePost,
    onSuccess: () => {
      if (shareCaption.current) {
        shareCaption.current.value = "";
      }
      setOpenShare(false);
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ["getposts"] });
      queryClient.invalidateQueries({ queryKey: ["Savedposts"] });
      queryClient.invalidateQueries({ queryKey: ["getMyposts"] });
      queryClient.invalidateQueries({ queryKey: ["getMyCommunityposts"] });
      queryClient.invalidateQueries({ queryKey: ["getProfilePosts", _id] });
    },
  });

  function handleLikeUnlikePost() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${id}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tkn")}`,
        },
      },
    );
  }

  const { mutate: likeUnlikePost } = useMutation({
    mutationFn: handleLikeUnlikePost,

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (oldData) => {
        if (!oldData?.data?.data?.posts) return oldData;

        const updatedPosts = oldData.data.data.posts.map((post) => {
          const postId = post.id || post._id;
          if (postId !== id) return post;

          const likesArray = post.likes || [];
          const alreadyLiked = likesArray.includes(userId);

          return {
            ...post,
            likes: alreadyLiked
              ? likesArray.filter((likeId) => likeId !== userId)
              : [...likesArray, userId],
            likesCount: alreadyLiked
              ? Math.max((post.likesCount || 1) - 1, 0)
              : (post.likesCount || 0) + 1,
          };
        });

        return {
          ...oldData,
          data: {
            ...oldData.data,
            data: {
              ...oldData.data.data,
              posts: updatedPosts,
            },
          },
        };
      });

      return { previousData };
    },

    onError: (error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ["getposts"] });
      queryClient.invalidateQueries({ queryKey: ["Savedposts"] });
      queryClient.invalidateQueries({ queryKey: ["getMyposts"] });
      queryClient.invalidateQueries({ queryKey: ["getMyCommunityposts"] });
      queryClient.invalidateQueries({ queryKey: ["getProfilePosts", _id] });
    },
  });

  function getPostLikes() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}/likes`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tkn")}`,
      },
    });
  }

  const { data: likesUsers } = useQuery({
    queryKey: ["postLikes", id],
    queryFn: getPostLikes,
    enabled: openLikes,
  });

  function handleBookMark() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${id}/bookmark`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tkn")}`,
        },
      },
    );
  }

  const { mutate: bookMark, isPending: isBookmarkPending } = useMutation({
    mutationFn: handleBookMark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ["getposts"] });
      queryClient.invalidateQueries({ queryKey: ["Savedposts"] });
      queryClient.invalidateQueries({ queryKey: ["getMyposts"] });
      queryClient.invalidateQueries({ queryKey: ["getMyCommunityposts"] });
      queryClient.invalidateQueries({ queryKey: ["getProfilePosts", _id] });
    },
  });

  if (isEditing) {
    return (
      <EditPost
        postInfo={postInfo}
        setIsEditing={setIsEditing}
        queryKey={queryKey}
      />
    );
  }

  return (
    <Card className="full">
      <CardHeader className="flex justify-between">
        {userId === _id ? (
          <Link to="/profile" className="flex gap-3">
            <Image
              alt="user"
              height={40}
              radius="sm"
              src={photo}
              width={40}
              className="rounded-full object-cover"
            />
            <div className="flex flex-col">
              <p className="text-md">{name}</p>
              <p className="text-small text-default-500">{username}</p>
            </div>
          </Link>
        ) : (
          <Link to={`/usrprofile/${_id}`} className="flex gap-3">
            <Image
              alt="user"
              height={40}
              radius="sm"
              src={photo}
              width={40}
              className="rounded-full object-cover"
            />
            <div className="flex flex-col">
              <p className="text-md">{name}</p>
              <p className="text-small text-default-500">{username}</p>
            </div>
          </Link>
        )}

        <div>
          <Dropdown
            className="w-fit"
            isDisabled={isDeleting || isBookmarkPending}
          >
            <DropdownTrigger>
              <button type="button">
                <HiOutlineDotsHorizontal />
              </button>
            </DropdownTrigger>

            {userId === _id ? (
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem key="save" onClick={() => bookMark()}>
                  <div className="flex items-center gap-1">
                    <CiBookmark />
                    <p>{bookmarked ? "Unsave" : "Save"}</p>
                  </div>
                </DropdownItem>

                <DropdownItem key="edit" onClick={() => setIsEditing(true)}>
                  <div className="flex items-center gap-1">
                    <MdEdit />
                    <p>Edit</p>
                  </div>
                </DropdownItem>

                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  onClick={() => deletePost()}
                >
                  <div className="flex items-center gap-1">
                    <MdOutlineDeleteOutline />
                    <p>Delete</p>
                  </div>
                </DropdownItem>
              </DropdownMenu>
            ) : (
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem key="save" onClick={() => bookMark()}>
                  <div className="flex items-center gap-1">
                    <CiBookmark />
                    <p>{bookmarked ? "Unsave" : "Save"}</p>
                  </div>
                </DropdownItem>
              </DropdownMenu>
            )}
          </Dropdown>
        </div>
      </CardHeader>

      <CardBody>
        {(body?.trim() || !isShare) && (
          <div>
            <p>{body}</p>

            {bookmarked && (
              <div className="mt-6 flex w-fit items-center justify-center gap-1 rounded-2xl bg-[#E7F3FF] px-2 py-0.5 text-[11px] font-bold text-[#1877f2]">
                <CiBookmark size={13} />
                Saved
              </div>
            )}
          </div>
        )}

        {image && <img src={image} className="mt-2 rounded-lg" alt="" />}

        {isShare && sharedPost && (
          <div className="mt-3 rounded-xl border border-gray-300 bg-gray-50 p-3">
            <div className="mb-2 flex items-center gap-2">
              <img
                src={sharedPost.user.photo}
                alt={sharedPost.user.name}
                className="h-8 w-8 rounded-full"
              />
              <p className="font-semibold">{sharedPost.user.name}</p>
            </div>
            <p className="text-gray-700">{sharedPost.body}</p>
            {sharedPost.image && (
              <img
                src={sharedPost.image}
                alt=""
                className="mt-2 w-full rounded-lg"
              />
            )}
          </div>
        )}

        <div className="mt-3.5 flex justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1877F2]">
              <AiOutlineLike color="white" />
            </div>

            <p
              onClick={() => {
                if (likesCount > 0) {
                  setOpenLikes(true);
                }
              }}
              className={`text-[14px] font-semibold ${
                likesCount > 0
                  ? "cursor-pointer text-[#62748e] hover:underline"
                  : "cursor-default text-gray-400"
              }`}
            >
              {likesCount} likes
            </p>

            {openLikes && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="max-h-125 w-[90%] overflow-y-auto rounded-xl bg-white p-4 md:w-[40%]">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold">People who reacted</h2>
                    <button type="button" onClick={() => setOpenLikes(false)}>
                      ✕
                    </button>
                  </div>

                  {likesUsers?.data?.data?.likes?.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center gap-3 py-2"
                    >
                      <img
                        src={user.photo}
                        className="h-10 w-10 rounded-full"
                        alt={user.name}
                      />

                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-gray-500">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-[#62748e]">
              <BiRepost />
              <p className="text-[14px] font-normal">{sharesCount} Share</p>
            </div>

            <p className="text-[14px] font-normal text-[#62748e]">
              {commentsCount} Comments
            </p>

            <Link
              to={`/postdetails/${id}`}
              className="ml-auto cursor-pointer rounded-md px-3 py-1.5 text-[12px] font-bold text-[#1877f2] transition hover:bg-[#E7F3FF]"
            >
              View Details
            </Link>
          </div>
        </div>
      </CardBody>

      <Divider />

      <CardFooter>
        <div className="flex w-full justify-center md:justify-around">
          <button
            type="button"
            onClick={() => likeUnlikePost()}
            className={
              isLiked
                ? "flex items-center gap-2 rounded-[10px] bg-[#E7F3FF] px-7 py-2 text-[#1877f2]"
                : "flex items-center gap-2 rounded-[10px] px-7 py-2 text-[#45556c] hover:bg-[#F1F5F9]"
            }
          >
            <AiOutlineLike size={18} />
            <p className="text-[14px] font-semibold">
              {isLiked ? "Unlike" : "Like"}
            </p>
          </button>

          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 rounded-[10px] px-7 py-2 text-[#45556c] hover:bg-[#F1F5F9]"
          >
            <FaRegComment />
            <p className="text-[14px] font-semibold">Comment</p>
          </button>

          <button
            type="button"
            onClick={() => setOpenShare(true)}
            className="flex cursor-pointer items-center gap-2 rounded-[10px] px-7 py-2 text-[#45556c] hover:bg-[#F1F5F9]"
          >
            <GoShareAndroid />
            <p className="text-[14px] font-semibold">Share</p>
          </button>

          {openShare && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="w-125 rounded-2xl bg-white p-4 shadow-lg">
                <div className="flex items-center justify-between border-b pb-3">
                  <h2 className="text-lg font-bold">Share post</h2>
                  <button type="button" onClick={() => setOpenShare(false)}>
                    ✕
                  </button>
                </div>

                <textarea
                  ref={shareCaption}
                  placeholder="Say something about this..."
                  className="mt-4 w-full rounded-xl border p-3 outline-none"
                />

                <div className="mt-4 rounded-xl bg-gray-100 p-3">
                  <p className="font-bold">{name}</p>
                  <p className="text-sm text-gray-500">@{username}</p>
                  <p className="mt-2">{body}</p>

                  {image && (
                    <img
                      src={image}
                      className="mt-3 h-85 w-full rounded-xl"
                      alt=""
                    />
                  )}
                </div>

                <div className="mt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setOpenShare(false)}
                    className="rounded-lg border px-4 py-2"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={() => sharePost()}
                    className="rounded-lg bg-blue-500 px-4 py-2 text-white"
                  >
                    Share now
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardFooter>

      <CardFooter>
        {!showComments && topComment && (
          <div className="w-full rounded-2xl border border-gray-200 bg-[#f1f5f9] p-4">
            <p className="mb-2 text-sm font-semibold uppercase text-gray-500">
              Top Comment
            </p>

            <div className="flex items-start gap-3">
              <img
                src={CommentCreatorPhoto}
                alt="user"
                className="h-10 w-10 rounded-full"
              />

              <div className="flex-1 rounded-2xl bg-white px-4 py-1 shadow-sm">
                <p className="text-sm font-semibold text-gray-800">
                  {CommentCreatorName}
                </p>
                <p className="mt-1 text-sm">{content}</p>
              </div>
            </div>

            <p
              onClick={() => setShowComments(true)}
              className="mt-2 cursor-pointer text-sm font-medium text-[#1877f2] hover:underline"
            >
              View all comments
            </p>
          </div>
        )}

        {showComments && <Comment id={id} />}
      </CardFooter>
    </Card>
  );
}
