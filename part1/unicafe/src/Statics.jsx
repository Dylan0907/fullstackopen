const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const Statics = ({ feedback }) => {
  return (
    <div>
      <h1>Statics</h1>
      {feedback.totalCollected > 0 ? (
        <table>
          <tbody>
            <StatisticLine key={"good"} text={"good"} value={feedback.good} />
            <StatisticLine
              key={"neutral"}
              text={"neutral"}
              value={feedback.neutral}
            />
            <StatisticLine key={"bad"} text={"bad"} value={feedback.bad} />
            <StatisticLine
              key={"all"}
              text={"all"}
              value={feedback.totalCollected}
            />
            <StatisticLine
              key={"average"}
              text={"average"}
              value={feedback.score / feedback.totalCollected}
            />
            <StatisticLine
              key={"porsitive"}
              text={"positive"}
              value={`${(feedback.good / feedback.totalCollected) * 100} %`}
            />
          </tbody>
        </table>
      ) : (
        <p>No feedback given</p>
      )}
    </div>
  );
};

export default Statics;
