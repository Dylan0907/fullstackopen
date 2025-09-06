import { useState } from "react";
import patientService from "../../services/patients";
import { Entry, NewEntry } from "../../types";

type EntryType = "HealthCheck" | "Hospital" | "OccupationalHealthcare";

interface AddEntryFormProps {
  patientId: string | undefined;
  onEntryAdded: (entry: Entry) => void;
}

export const AddEntryForm = ({
  patientId,
  onEntryAdded
}: AddEntryFormProps) => {
  const [type, setType] = useState<EntryType>("HealthCheck");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [description, setDescription] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [healthCheckRating, setHealthCheckRating] = useState(0);
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStart, setSickLeaveStart] = useState("");
  const [sickLeaveEnd, setSickLeaveEnd] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let newEntry: NewEntry;

    switch (type) {
      case "HealthCheck":
        newEntry = {
          type,
          date,
          specialist,
          description,
          diagnosisCodes: diagnosisCodes.length ? diagnosisCodes : undefined,
          healthCheckRating
        };
        break;

      case "Hospital":
        newEntry = {
          type,
          date,
          specialist,
          description,
          diagnosisCodes: diagnosisCodes.length ? diagnosisCodes : undefined,
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria
          }
        };
        break;

      case "OccupationalHealthcare":
        newEntry = {
          type,
          date,
          specialist,
          description,
          diagnosisCodes: diagnosisCodes.length ? diagnosisCodes : undefined,
          employerName,
          sickLeave:
            sickLeaveStart && sickLeaveEnd
              ? { startDate: sickLeaveStart, endDate: sickLeaveEnd }
              : undefined
        };
        break;
    }

    try {
      const entry = await patientService.createNewEntry(newEntry, patientId);
      onEntryAdded(entry);
    } catch (err) {
      console.error(err);
      alert("Failed to add entry");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Type:
        <select
          value={type}
          onChange={(e) => setType(e.target.value as EntryType)}
        >
          <option value="HealthCheck">HealthCheck</option>
          <option value="Hospital">Hospital</option>
          <option value="OccupationalHealthcare">OccupationalHealthcare</option>
        </select>
      </label>

      <label>
        Date:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>

      <label>
        Specialist:
        <input
          type="text"
          value={specialist}
          onChange={(e) => setSpecialist(e.target.value)}
        />
      </label>

      <label>
        Description:
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <label>
        Diagnosis Codes (comma-separated):
        <input
          type="text"
          value={diagnosisCodes.join(",")}
          onChange={(e) =>
            setDiagnosisCodes(e.target.value.split(",").map((s) => s.trim()))
          }
        />
      </label>

      {/* Conditional fields */}
      {type === "HealthCheck" && (
        <label>
          HealthCheck Rating:
          <input
            type="number"
            min={0}
            max={3}
            value={healthCheckRating}
            onChange={(e) => setHealthCheckRating(Number(e.target.value))}
          />
        </label>
      )}

      {type === "Hospital" && (
        <>
          <label>
            Discharge Date:
            <input
              type="date"
              value={dischargeDate}
              onChange={(e) => setDischargeDate(e.target.value)}
            />
          </label>
          <label>
            Discharge Criteria:
            <input
              type="text"
              value={dischargeCriteria}
              onChange={(e) => setDischargeCriteria(e.target.value)}
            />
          </label>
        </>
      )}

      {type === "OccupationalHealthcare" && (
        <>
          <label>
            Employer Name:
            <input
              type="text"
              value={employerName}
              onChange={(e) => setEmployerName(e.target.value)}
            />
          </label>
          <label>
            Sick Leave Start:
            <input
              type="date"
              value={sickLeaveStart}
              onChange={(e) => setSickLeaveStart(e.target.value)}
            />
          </label>
          <label>
            Sick Leave End:
            <input
              type="date"
              value={sickLeaveEnd}
              onChange={(e) => setSickLeaveEnd(e.target.value)}
            />
          </label>
        </>
      )}

      <button type="submit">Add Entry</button>
    </form>
  );
};
