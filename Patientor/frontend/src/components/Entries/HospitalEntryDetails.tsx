import { HospitalEntry } from "../../types";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

interface Props {
  entry: HospitalEntry;
}

const style = {
  paddingTop: 10,
  paddingLeft: 2,
  border: "solid",
  borderWidth: 1,
  marginBottom: 5,
  borderRadius: 8,
};

const HospitalEntryDetails = ({ entry }: Props) => {
  return (
    <div style={style}>
      {entry.date} <LocalHospitalIcon /> <br />
      <i>{entry.description}</i> <br />
      to be discharged {entry.discharge.date} <br />
      with the condition that {entry.discharge.criteria} <br />
      diagnose by {entry.specialist}
    </div>
  );
};

export default HospitalEntryDetails;
