import type { FlightDiary } from "../types";

interface DiariesProps {
  diaries: FlightDiary[];
}
interface DairyProps {
  diary: FlightDiary;
}
const Diaries = ({ diaries }: DiariesProps) => {
  return (
    <div>
      <h3>Diary Entries</h3>
      {diaries.map((diary: FlightDiary) => {
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
