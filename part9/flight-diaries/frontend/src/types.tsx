export type Weather = "sunny" | "rainy" | "cloudy" | "stormy" | "windy";

export type Visibility = "great" | "good" | "ok" | "poor";

export interface FlightDiary {
  id: string;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment: string;
}
export type DiaryFormData = Omit<FlightDiary, "id">;
