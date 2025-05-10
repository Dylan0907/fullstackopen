import Header from "./Header";
import Content from "./Content";
import Total from "./Total";

const App = () => {
  const course = "Half Stack application development";
  const part1 = "Fundamentals of React";
  const exercises1 = 10;
  const part2 = "Using props to pass data";
  const exercises2 = 7;
  const part3 = "State of a component";
  const exercises3 = 14;
  const partsArray = [
    { part: part1, excercises: exercises1 },
    { part: part2, excercises: exercises2 },
    { part: part3, excercises: exercises3 }
  ];

  return (
    <div>
      <Header title={course} />
      <Content parts={partsArray} />
      <Total total={exercises1 + exercises2 + exercises3} />
    </div>
  );
};

export default App;
