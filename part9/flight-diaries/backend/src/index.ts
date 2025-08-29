import express from "express";
const app = express();
import diaryRouter from "./routes/diaries";
app.use(express.json());
import cors from "cors";

const PORT = 3000;

app.use(cors({ origin: "http://localhost:5173" }));

app.use("/api/diaries", diaryRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
