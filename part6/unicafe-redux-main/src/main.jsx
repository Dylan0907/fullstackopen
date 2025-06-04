import React from "react";
import ReactDOM from "react-dom/client";

import { createStore } from "redux";
import reducer from "./reducer";

const store = createStore(reducer);

const App = () => {
  const handlechange = (e) => {
    const value = e.target.value;
    if (value === "good__button") {
      store.dispatch({
        type: "GOOD"
      });
    } else if (value === "ok__button") {
      store.dispatch({
        type: "OK"
      });
    } else if (value === "bad__button") {
      store.dispatch({
        type: "BAD"
      });
    } else if (value === "reset__button") {
      store.dispatch({
        type: "ZERO"
      });
    }
  };

  return (
    <div>
      <button onClick={handlechange} value={"good__button"}>
        good
      </button>
      <button onClick={handlechange} value={"ok__button"}>
        ok
      </button>
      <button onClick={handlechange} value={"bad__button"}>
        bad
      </button>
      <button onClick={handlechange} value={"reset__button"}>
        reset stats
      </button>
      <div>good {store.getState().good}</div>
      <div>ok {store.getState().ok}</div>
      <div>bad {store.getState().bad}</div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));

const renderApp = () => {
  root.render(<App />);
};

renderApp();
store.subscribe(renderApp);
