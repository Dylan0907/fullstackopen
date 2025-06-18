import { useNotificationValue } from "../context/NotificationContext";

const Notification = () => {
  const notification = useNotificationValue();

  if (!notification) return null;

  return (
    <div className={`message ${notification.color_text}`}>
      {notification.text}
    </div>
  );
};

export default Notification;
