import React from "react";
import { GoCheck } from "react-icons/go";
import { FaRegComment } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { BiRepost } from "react-icons/bi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import { QueryClient } from "./../../../node_modules/@tanstack/query-core/src/queryClient";
import { CgUserAdd } from "react-icons/cg";

export default function NotificationCard({ notification, queryKey }) {
  const { isRead, actor, _id, type } = notification;
  const { name, photo } = actor;

  const [markRead, setmarkRead] = useState(false);

  const queryClient = useQueryClient();

  function markNotificationAsRead() {
    return axios.patch(
      `https://route-posts.routemisr.com/notifications/${_id}/read`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tkn")}`,
        },
      },
    );
  }

  const { mutate } = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });

  return (
    <div>
      {" "}
      <div className=" p-3 mt-3 rounded-xl bg-blue-50">
        <div className="flex items-center gap-3">
          <img src={photo} alt="Dai Morse" className="w-10 h-10 rounded-full" />
          <div className="flex gap-2 items-center">
            <p className="text-[16px] font-normal">{name}</p>
            <p className="text-[14px] font-normal">{type}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <div>
            {type === "comment_post" && (
              <div className="w-8 h-8 bg-white flex justify-center items-center rounded-full">
                <FaRegComment size={15} color="#1877f2" />
              </div>
            )}
            {type === "like_post" && (
              <div className="w-8 h-8 bg-white flex justify-center items-center rounded-full">
                <CiHeart size={18} color="#FF2056" />
              </div>
            )}
            {type === "share_post" && (
              <div className="w-8 h-8 bg-white flex justify-center items-center rounded-full">
                <BiRepost size={18} color="green" />
              </div>
            )}
            {type === "follow_user" && (
              <div className="w-8 h-8 bg-white flex justify-center items-center rounded-full">
                <CgUserAdd size={18} color="#7F22FE" />
              </div>
            )}
          </div>
          <button
            onClick={() => {
              mutate;
              setmarkRead(true);
            }}
            className={
              markRead || isRead
                ? "px-2 py-1 text-[12px] font-bold text-[#096] bg-white rounded  flex items-center gap-1"
                : "px-2 py-1 text-[12px] font-bold text-[#1877f2] bg-white rounded hover:bg-[#E7F3FF] flex items-center gap-1"
            }
          >
            <GoCheck /> {markRead || isRead ? "Read" : "Mark as read"}
          </button>
        </div>
      </div>
    </div>
  );
}
