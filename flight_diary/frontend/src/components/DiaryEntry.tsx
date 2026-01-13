import type { DiaryEntryProps } from "../types";

const DiaryEntry = (props: DiaryEntryProps) => {
  const style = {
    padding: 8,
  };
  const flight = props.flight;
  return (
    <div style={style}>
      <h3>{flight.date}</h3>
      visibility: {flight.visibility} <br />
      weather: {flight.weather}
    </div>
  );
};

export default DiaryEntry;
