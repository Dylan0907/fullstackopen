import { useNotificationValue } from "../context/NotificationContext";

const Notification = () => {
  const message = useNotificationValue();
  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  };

  return message && <div style={style}>{message}</div>;
};

export default Notification;
