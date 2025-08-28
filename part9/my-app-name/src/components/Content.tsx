import type { CoursePart } from "../App";
import Part from "./Part";

interface ContentProps {
  courses: CoursePart[];
}

const Content = ({ courses }: ContentProps) => {
  return (
    <div>
      {courses.map((course) => {
        return <Part course={course} key={course.name} />;
      })}
    </div>
  );
};

export default Content;
