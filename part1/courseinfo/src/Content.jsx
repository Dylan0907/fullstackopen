import Part from "./Part";

const Content = (props) => {
  return (
    <div>
      {props.parts.map((object) => {
        return <Part part={object.part} excercise={object.excercises} />;
      })}
    </div>
  );
};

export default Content;
