import { useEffect, useState } from "react";
import Diaries from "./components/Diaries";

import diariesService from "./service/diaries";
import type { FlightDiaries } from "./types";
import DiaryForm from "./components/DiaryForm";
function App() {
  const [diaries, setDiaries] = useState<FlightDiaries[]>([]);

  useEffect(() => {
    const fetchDairiesList = async () => {
      const diaries = await diariesService.getAll();
      setDiaries(diaries);
    };
    void fetchDairiesList();
  }, []);
  console.log(diaries);

  return (
    <>
      <DiaryForm />
      <Diaries diaries={diaries} />
    </>
  );
}

export default App;
