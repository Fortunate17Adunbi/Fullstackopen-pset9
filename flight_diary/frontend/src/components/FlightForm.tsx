import { useState, Fragment } from "react";
import type { FlightEntry, FlightFormProps } from "../types";
import { Weather, Visibility } from "../types";
import Notification from "./Notification";

const FlightForm = ({ addFlight, notis }: FlightFormProps) => {
  const obj = {
    date: "",
    visibility: "",
    weather: "",
    comment: "",
  };

  const [details, setDetails] = useState<FlightEntry>(obj);
  const createEntry = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    addFlight(details);
    setDetails(obj);
  };

  console.log("detaiils ", details);

  return (
    <div>
      <h2>Add new entry</h2>
      <Notification error={notis.error} success={notis.success} />
      <form onSubmit={createEntry}>
        <div>
          <label>date</label>
          <input
            type="date"
            value={details.date}
            onChange={({ target }) =>
              setDetails({ ...details, date: target.value })
            }
          />
        </div>

        <div>
          <label>visibility: </label>

          {Object.values(Visibility).map((v) => {
            return (
              <Fragment key={v}>
                <span>{v} </span>

                <input
                  type="radio"
                  name="visibility"
                  onChange={() => setDetails({ ...details, visibility: v })}
                />
              </Fragment>
            );
          })}
        </div>
        <div>
          <label>weather: </label>
          {Object.values(Weather).map((w) => (
            <Fragment key={w}>
              <span>{w} </span>
              <input
                type="radio"
                name="weather"
                onChange={() => setDetails({ ...details, weather: w })}
              />
            </Fragment>
          ))}
        </div>
        <div>
          <label>comment</label>
          <input
            value={details.comment}
            onChange={({ target }) =>
              setDetails({ ...details, comment: target.value })
            }
          />
        </div>
        <button type="submit">add</button>
      </form>
    </div>
  );
};

export default FlightForm;
