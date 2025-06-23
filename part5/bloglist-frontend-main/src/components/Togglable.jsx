import { useState, forwardRef, useImperativeHandle } from "react";

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    };
  });

  return (
    <div className="mb-6">
      {!visible && (
        <button
          onClick={toggleVisibility}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {props.buttonLabel}
        </button>
      )}

      {visible && (
        <div className="mt-4 p-4 bg-white">
          {props.children}
          <div className="mt-4">
            <button
              onClick={toggleVisibility}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default Togglable;
