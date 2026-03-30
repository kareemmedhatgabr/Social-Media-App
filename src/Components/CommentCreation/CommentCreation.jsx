import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { FaRegSmile } from "react-icons/fa";
import { FaRegImage } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
export default function CommentCreation({ id, queryKey }) {
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const [commentValue, setcommentValue] = useState(null);

  function handleComment() {
    const commentObj = {
      content: commentValue,
    };
    return axios.post(
      `https://route-posts.routemisr.com/posts/${id}/comments`,
      commentObj,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tkn")}`,
        },
      },
    );
  }

  const queryClientObj = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: handleComment,
    onSuccess: () => {
      queryClientObj.invalidateQueries({ queryKey: queryKey });
      setcommentValue("");
    },
  });

  return (
    <>
      <div className="flex flex-col gap-2 p-4  w-full max-w-2xl mt-2">
        <div className="flex items-start gap-3">
          {/* Profile Image */}
          <img
            src={userInfo.photo}
            alt="profile"
            className="w-10 h-10 rounded-full object-cover"
          />

          {/* Input Area Container */}
          <div className="grow flex flex-col bg-[#F0F2F5] border-gray-100 rounded-xl p-3 min-h-25 justify-between">
            {/* Textarea */}
            <textarea
              value={commentValue}
              onChange={(e) => setcommentValue(e.target.value)}
              placeholder="Comment here"
              className="w-full resize-none border-none outline-none text-gray-700 placeholder-gray-400 text-base bg-transparent"
              rows={2}
            />

            {/* Bottom Controls */}
            <div className="flex items-center justify-between mt-2">
              {/* Left Icons */}
              <div className="flex items-center gap-4 text-gray-400">
                <button className="hover:text-gray-600 transition">
                  <FaRegImage size={22} />
                </button>
                <button className="hover:text-gray-600 transition">
                  <FaRegSmile size={22} />
                </button>
              </div>

              {/* Send Button */}
              <button
                onClick={isPending ? undefined : mutate}
                className="bg-[#1877F2] hover:bg-blue-600 transition text-white p-2.5 rounded-full shadow-md"
                aria-label="Send comment"
              >
                <IoMdSend size={22} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
