const Notification = ({ message }) => {
  if (!message) return null;

  return <div className={`message ${message.color}`}>{message.text}</div>;
};

export default Notification;
