// type Weather = "sunny" | "rainy" | "cloudy" | "stormy" | "windy";
// type Visibility = "great" | "good" | "ok" | "poor";

export enum Weather {
  Sunny = "sunny",
  Rainy = "rainy",
  Cloudy = "cloudy",
  Stormy = "stormy",
  Windy = "windy",
}

export enum Visibility {
  Great = "great",
  Good = "good",
  Ok = "ok",
  Poor = "poor",
}
export interface Flight {
  id: string;
  date: string;
  weather: string;
  visibility: string;
  comment?: string;
}

export type FlightEntry = Omit<Flight, "id">;

export interface DiaryEntryProps {
  flight: Flight;
}

export interface Message {
  success?: string | null;
  error?: string | null;
}

export interface FlightFormProps {
  addFlight: (value: FlightEntry) => Promise<void>;
  notis: Message;
}
