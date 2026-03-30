import React from "react";
import { useQuery } from "@tanstack/react-query";
import Loader from "../Loader/Loader";
import axios from "axios";
import NotificationCard from "../NotificationCard/NotificationCard";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export default function Notification() {
  function getAllNotifications() {
    return axios.get("https://route-posts.routemisr.com/notifications", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tkn")}`,
      },
    });
  }
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: getAllNotifications,
  });
  function getUnReadNotificationsCount() {
    return axios.get(
      "https://route-posts.routemisr.com/notifications/unread-count",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tkn")}`,
        },
      },
    );
  }
  const { data: unreadCount } = useQuery({
    queryKey: ["Unnotifications"],
    queryFn: getUnReadNotificationsCount,
  });
  const queryClient = useQueryClient();
  function markAllNotificationAsRead() {
    return axios.patch(
      "https://route-posts.routemisr.com/notifications/read-all",
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tkn")}`,
        },
      },
    );
  }

  const { mutate } = useMutation({
    mutationFn: markAllNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center">
        <h1>errrr</h1>
      </div>
    );
  }

  const allNotifications = data.data.data.notifications;

  console.log("allNotification", allNotifications);
  const unReadCount = unreadCount?.data?.data?.count || 0;

  return (
    <div>
      <div className=" w-[90%] md:w-[80%] mx-auto mt-6 p-4 bg-white rounded-xl shadow">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold">Notifications</h2>
            <p className="text-sm text-gray-500">
              Realtime updates for likes, comments, shares, and follows.
            </p>
          </div>
          <button
            onClick={mutate}
            className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-100"
          >
            Mark all as read
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          <button className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">
            All
          </button>
          <button className="px-3 py-1  items-center rounded-full text-sm flex gap-2 bg-[#E2E8F0] hover:bg-[]">
            <p className="text-[#314158] text-[14px] font-bold ">Unread</p>
            <p className="text-[#1877f2] text-[12px] font-bold ">
              {unReadCount}
            </p>
          </button>
        </div>

        {/* Notifications list */}
        <div className="flex flex-col gap-2">
          {allNotifications.map((notifi) => {
            return (
              <NotificationCard
                notification={notifi}
                queryKey={["Unnotifications"]}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
