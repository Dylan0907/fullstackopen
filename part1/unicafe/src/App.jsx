import { useState } from "react";
import Statics from "./Statics";

const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>;
};

const App = () => {
  const [feedback, setFeedback] = useState({
    good: 0,
    neutral: 0,
    bad: 0,
    totalCollected: 0,
    score: 0
  });

  const handleGoodFeedback = () =>
    setFeedback({
      ...feedback,
      good: feedback.good + 1,
      totalCollected: feedback.totalCollected + 1,
      score: feedback.score + 1
    });

  const handleNeutralFeedback = () =>
    setFeedback({
      ...feedback,
      neutral: feedback.neutral + 1,
      totalCollected: feedback.totalCollected + 1
    });

  const handleBadFeedback = () =>
    setFeedback({
      ...feedback,
      bad: feedback.bad + 1,
      totalCollected: feedback.totalCollected + 1,
      score: feedback.score - 1
    });

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button onClick={handleGoodFeedback} text={"good"} />
      <Button onClick={handleNeutralFeedback} text={"neutral"} />
      <Button onClick={handleBadFeedback} text={"bad"} />
      <Statics feedback={feedback} />
    </div>
  );
};

export default App;
