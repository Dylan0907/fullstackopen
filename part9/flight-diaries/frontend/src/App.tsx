import { useEffect, useState } from "react";
import axios from "axios";
import Diaries from "./components/Diaries";

import diariesService from "./service/diaries";
import type { DiaryFormData, FlightDiary } from "./types";
import DiaryForm from "./components/DiaryForm";

function App() {
  const [diaries, setDiaries] = useState<FlightDiary[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>();

  useEffect(() => {
    const fetchDairiesList = async () => {
      const diaries = await diariesService.getAll();
      setDiaries(diaries);
    };
    void fetchDairiesList();
  }, []);

  const handleFormSubmit = async (data: DiaryFormData) => {
    try {
      console.log("Form submitted:", data);
      const newDiary: FlightDiary = await diariesService.create(data);
      setDiaries((prev) => prev.concat(newDiary));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data || "Something went wrong");
      } else {
        setErrorMessage("Unexpected error occurred");
      }

      console.error("Error creating diary:", error);
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  return (
    <>
      <DiaryForm onSubmit={handleFormSubmit} errorMessage={errorMessage} />
      <Diaries diaries={diaries} />
    </>
  );
}

export default App;
