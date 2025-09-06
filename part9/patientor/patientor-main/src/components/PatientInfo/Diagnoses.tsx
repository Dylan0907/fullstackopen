import { useEffect, useState } from "react";
import diagnosisService from "../../services/diagnoses";
import { Diagnose } from "../../types";

interface DiagnosesProps {
  codes: string[] | undefined;
}

const Diagnoses = ({ codes }: DiagnosesProps) => {
  const [diagnoses, setDiagnoses] = useState<Diagnose[]>();
  useEffect(() => {
    const fetchDiagnosesList = async () => {
      const diagnoses = await diagnosisService.getByCodes(codes);
      setDiagnoses(diagnoses);
    };
    void fetchDiagnosesList();
  }, []);

  return (
    <ul>
      {diagnoses?.map((diagnose) => (
        <li key={diagnose.code}>
          {diagnose.code} {diagnose.name}
        </li>
      ))}
    </ul>
  );
};

export default Diagnoses;
