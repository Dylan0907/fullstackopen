import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import patientService from "../../services/patients";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";

import { Entry, Gender, Patient } from "../../types";
import Entries from "./Entries";
import { AddEntryForm } from "./AddEntryForm";

const PatientPersonalInfo = () => {
  let { patientId } = useParams();
  const [patient, setPatient] = useState<Patient>();

  useEffect(() => {
    const fetchPatientList = async () => {
      const patient = await patientService.getById(patientId);
      setPatient(patient);
    };
    void fetchPatientList();
  }, []);

  const getGenderIcon = (gender?: Gender): JSX.Element | null => {
    switch (gender) {
      case Gender.Male:
        return <MaleIcon />;
      case Gender.Female:
        return <FemaleIcon />;
      case Gender.Other:
        return <TransgenderIcon />;
      default:
        return null;
    }
  };
  const onEntryAdded = (newEntry: Entry) => {
    if (patient) {
      patient?.entries.push(newEntry);
    }
  };

  return (
    <div>
      <div>
        <h2>
          {patient?.name}
          {getGenderIcon(patient?.gender)}
        </h2>
        <p>ssh: {patient?.ssn}</p>
        <p>Ocuppation: {patient?.occupation}</p>
      </div>
      <AddEntryForm patientId={patient?.id} onEntryAdded={onEntryAdded} />
      <Entries entries={patient?.entries} />
    </div>
  );
};

export default PatientPersonalInfo;
