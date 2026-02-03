import { useEffect, useState } from "react";
import { useSocket } from "../context/socketContext";
import { fetchNotifications, markAsRead } from "../services/Notification.api.js";

const NotificationBell = () => {
  const socket = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.length;

  useEffect(() => {
    fetchNotifications().then(setNotifications);
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("notification");
    };
  }, [socket]);

  const handleRead = async (id) => {
    try {
      await markAsRead(id);

      // ✅ remove from UI immediately
      setNotifications((prev) =>
        prev.filter((n) => n._id !== id)
      );
    } catch (err) {
      console.error("Failed to mark notification as read");
    }
  };

  return (
    <div className="relative">
      {/* Bell */}
      <button
        onClick={() => setOpen(!open)}
        className="relative text-xl flex items-center"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-96 bg-white shadow-xl rounded-lg border z-50">
          <div className="px-4 py-3 font-semibold border-b text-gray-800">
            Notifications
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-sm text-gray-500 text-center">
                No new notifications
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleRead(n._id)}
                  className="px-4 py-3 text-sm cursor-pointer border-b last:border-b-0 hover:bg-gray-100 transition"
                >
                  <p className="text-gray-800 leading-snug">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
