import { createContext, useReducer, useContext } from "react";

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "VOTE_NOTIFICATION":
      return `anecdote '${action.anecdote}' voted`;
    case "CREATE_NOTIFICATION":
      return "new anecdote created!";
    case "CLEAR_NOTIFICATION":
    case "ERROR_NOTIFICATION":
      return action.error;
      return "";
    default:
      return state;
  }
};

const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
  const [message, messageDispatch] = useReducer(notificationReducer, "");

  return (
    <NotificationContext.Provider value={[message, messageDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  );
};
export const useNotificationValue = () => {
  const notificationAndDispatch = useContext(NotificationContext);
  return notificationAndDispatch[0];
};

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(NotificationContext);
  return notificationAndDispatch[1];
};

export default NotificationContext;
