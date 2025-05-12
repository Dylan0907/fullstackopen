import Part from "./Part";

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map((part) => {
        return (
          <Part key={part.id} name={part.name} exercises={part.exercises} />
        );
      })}
      total of {parts.reduce((acc, val) => acc + val.exercises, 0)} exercises
    </div>
  );
};

export default Content;
