import { Entry } from "../../types";
import Diagnoses from "./Diagnoses";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import { green, yellow, red, grey } from "@mui/material/colors";

const heartColours = {
  0: green[500],
  1: yellow[500],
  2: red[500],
  3: grey[900]
};

const containerStyle = {
  padding: "0.5em",
  borderRadius: "8px",
  border: "2px solid black",
  marginBottom: "1em"
};

interface EntryDetailsProps {
  entry: Entry | undefined;
}

const EntryDetails = ({ entry }: EntryDetailsProps) => {
  switch (entry?.type) {
    case "HealthCheck":
      return (
        <div style={containerStyle}>
          <p>
            {entry.date}
            <MedicalServicesRoundedIcon />
          </p>
          <p>{entry.description}</p>
          <FavoriteRoundedIcon
            sx={{ color: heartColours[entry.healthCheckRating] }}
          />
          {entry.diagnosisCodes && <Diagnoses codes={entry.diagnosisCodes} />}
          <p>Diagnose by {entry.specialist}</p>
        </div>
      );
    case "Hospital":
      return (
        <div style={containerStyle}>
          <p>{entry.date}</p>
          <p>{entry.description}</p>

          {entry.diagnosisCodes && <Diagnoses codes={entry.diagnosisCodes} />}
          <p>
            discharged {entry.discharge.date}: {entry.discharge.criteria}
          </p>
          <p>Diagnose by {entry.specialist}</p>
        </div>
      );
    case "OccupationalHealthcare":
      return (
        <div style={containerStyle}>
          <p>{entry.date}</p>
          <p>{entry.description}</p>
          {entry.diagnosisCodes && <Diagnoses codes={entry.diagnosisCodes} />}
          <p>employer: {entry.employerName}</p>
          <h3>sick leave</h3>
          <p>
            start: {entry.sickLeave?.startDate} end: {entry.sickLeave?.endDate}
          </p>
          <p>Diagnose by {entry.specialist}</p>
        </div>
      );
    default:
      return null; // helps exhaustiveness checking
  }
};

export default EntryDetails;
