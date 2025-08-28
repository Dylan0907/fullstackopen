import type { CoursePart } from "../App";

interface ContentProps {
  course: CoursePart;
}

const Part = ({ course }: ContentProps) => {
  switch (course.kind) {
    case "basic":
      return (
        <div>
          <h4>
            {course.name} {course.exerciseCount}
          </h4>
          <p>{course.description}</p>
        </div>
      );
    case "group":
      return (
        <div>
          <h4>
            {course.name} {course.exerciseCount}
          </h4>
          <p>project exercises{course.exerciseCount}</p>
        </div>
      );
    case "background":
      return (
        <div>
          <h4>
            {course.name} {course.exerciseCount}
          </h4>
          <p>{course.description}</p>
          <p>{course.backgroundMaterial}</p>
        </div>
      );
    case "special":
      return (
        <div>
          <h4>
            {course.name} {course.exerciseCount}
          </h4>
          <p>{course.description}</p>
          <p>required skills: {course.requirements.join()}</p>
        </div>
      );
    default:
      break;
  }
};

export default Part;
