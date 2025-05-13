const Notification = ({ message, color }) => {
  if (!message) return null;

  return <div className={`message ${color}`}>{message}</div>;
};

export default Notification;
