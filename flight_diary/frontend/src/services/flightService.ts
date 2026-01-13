import axios from "axios";
import type { Flight, FlightEntry } from "../types";

const baseUrl = "/api/diaries/";

const getFlights = async () => {
  const flights = await axios.get<Flight[]>(baseUrl);
  return flights.data;
};

const createFlight = async (object: FlightEntry) => {
  const newEntry = await axios.post<Flight>(baseUrl, object);
  return newEntry.data;
};

export { getFlights, createFlight };
