import { useEffect, useState } from "react";
import axios from "axios";
import type { Flight, Message, FlightEntry } from "./types";
import { getFlights, createFlight } from "./services/flightService";

import DiaryEntry from "./components/DiaryEntry";
import FlightForm from "./components/FlightForm";

const App = () => {
  const mes = {
    error: null,
    success: null,
  };
  const [flights, setFlights] = useState<Flight[]>([]);
  const [message, setMessage] = useState<Message>(mes);

  useEffect(() => {
    getFlights().then((data) => {
      setFlights(data);
    });
  }, []);

  console.log(flights);

  const addFlight = async (createdFlight: FlightEntry) => {
    try {
      const addedEntry = await createFlight(createdFlight);
      setFlights((latest) => latest.concat(addedEntry));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage({ ...message, error: error.response?.data });
        setTimeout(() => {
          setMessage(mes);
        }, 5000);
      } else {
        setMessage({ ...message, error: "something went wrong" });
        setTimeout(() => {
          setMessage(mes);
        }, 5000);
      }
    }
  };

  return (
    <>
      <FlightForm addFlight={addFlight} notis={message} />
      <h2>Diary Entry</h2>
      {flights.map((flight) => (
        <DiaryEntry flight={flight} key={flight.id} />
      ))}
    </>
  );
};

export default App;
