import { useNotificationValue } from "../context/NotificationContext";

const Notification = () => {
  const notification = useNotificationValue();

  if (!notification) return null;

  const baseStyle = "p-4 rounded shadow text-sm font-medium mb-4";
  const typeStyles = {
    success: "bg-green-100 text-green-700 border border-green-300",
    error: "bg-red-100 text-red-700 border border-red-300"
  };

  return (
    <div className={`${baseStyle} ${typeStyles[notification.type] || ""}`}>
      {notification.text}
    </div>
  );
};

export default Notification;
