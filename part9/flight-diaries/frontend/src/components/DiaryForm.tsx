import { useState, type FormEvent } from "react";
import type { DiaryFormData, Weather, Visibility } from "../types";

interface DiaryFormProps {
  onSubmit: (data: DiaryFormData) => void;
  errorMessage?: string | null;
}
export const WeatherValues: Weather[] = [
  "sunny",
  "rainy",
  "cloudy",
  "stormy",
  "windy"
];

export const VisibilityValues: Visibility[] = ["great", "good", "ok", "poor"];

const DiaryForm = ({ onSubmit, errorMessage }: DiaryFormProps) => {
  const [formData, setFormData] = useState<DiaryFormData>({
    date: "",
    visibility: "great",
    weather: "sunny",
    comment: ""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      date: "",
      visibility: "great",
      weather: "sunny",
      comment: ""
    });
  };

  return (
    <div>
      <h3>Add new entry</h3>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          maxWidth: "300px"
        }}
      >
        <label>
          Date:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </label>

        <fieldset>
          <legend>Visibility</legend>
          {VisibilityValues.map((v) => (
            <label key={v}>
              <input
                type="radio"
                name="visibility"
                value={v}
                checked={formData.visibility === v}
                onChange={handleChange}
              />
              {v}
            </label>
          ))}
        </fieldset>

        <fieldset>
          <legend>Weather</legend>
          {WeatherValues.map((w) => (
            <label key={w}>
              <input
                type="radio"
                name="weather"
                value={w}
                checked={formData.weather === w}
                onChange={handleChange}
              />
              {w}
            </label>
          ))}
        </fieldset>

        <label>
          Comment:
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
          />
        </label>

        <button
          type="submit"
          style={{
            maxWidth: "100px"
          }}
        >
          Add Entry
        </button>
      </form>
    </div>
  );
};

export default DiaryForm;
