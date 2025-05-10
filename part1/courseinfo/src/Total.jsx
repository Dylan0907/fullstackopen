const Total = (props) => {
  return (
    <p>
      Number of exercises{" "}
      {props.parts.reduce((acc, val) => acc + val.exercises, 0)}
    </p>
  );
};

export default Total;
