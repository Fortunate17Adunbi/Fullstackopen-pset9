import { OccupationalHealthcareEntry } from "../../types";
import WorkIcon from "@mui/icons-material/Work";

interface Props {
  entry: OccupationalHealthcareEntry;
}
const style = {
  paddingTop: 10,
  paddingLeft: 2,
  border: "solid",
  borderWidth: 1,
  marginBottom: 5,
  borderRadius: 8,
};
const OccupationalHealthcareEntryDetails = ({ entry }: Props) => {
  return (
    <div style={style}>
      {entry.date} <WorkIcon /> {entry.employerName} <br />
      <i>{entry.description}</i> <br />
      diagnose by {entry.specialist}
    </div>
  );
};

export default OccupationalHealthcareEntryDetails;
