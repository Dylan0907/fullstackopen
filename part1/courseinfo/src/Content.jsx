import Part from "./Part";

const Content = (props) => {
  return (
    <div>
      {props.parts.map((object) => {
        return <Part name={object.name} exercises={object.exercises} />;
      })}
    </div>
  );
};

export default Content;
