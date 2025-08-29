import type { FlightDiaries } from "../types";

interface DiariesProps {
  diaries: FlightDiaries[];
}
interface DairyProps {
  diary: FlightDiaries;
}
const Diaries = ({ diaries }: DiariesProps) => {
  return (
    <div>
      <h3>Diary Entries</h3>
      {diaries.map((diary: FlightDiaries) => {
        return <Diary diary={diary} key={diary.id} />;
      })}
    </div>
  );
};

const Diary = ({ diary }: DairyProps) => {
  return (
    <div>
      <h4>{diary.date}</h4>
      <p>visibility: {diary.visibility}</p>
      <p>weather: {diary.weather}</p>
    </div>
  );
};
export default Diaries;
