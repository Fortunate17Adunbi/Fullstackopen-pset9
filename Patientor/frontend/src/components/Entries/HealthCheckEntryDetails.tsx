import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HeartBrokenIcon from "@mui/icons-material/HeartBroken";
import { HealthCheckEntry, HealthCheckRating } from "../../types";

interface Props {
  entry: HealthCheckEntry;
}

const style = {
  paddingTop: 10,
  paddingLeft: 2,
  border: "solid",
  borderWidth: 1,
  marginBottom: 5,
  borderRadius: 8,
};

const HealthCheckEntryDetails = ({ entry }: Props) => {
  const HealthRating = (rating: HealthCheckRating) => {
    switch (rating) {
      case 0:
        return <FavoriteIcon color="success" />;
      case 1:
        return <FavoriteIcon sx={{ color: "yellow" }} />;
      case 2:
        return <FavoriteIcon sx={{ color: "red" }} />;
      case 3:
        return <HeartBrokenIcon sx={{ color: "red" }} />;
    }
  };
  return (
    <div style={style}>
      {entry.date} <MedicalServicesIcon /> <br />
      <i>{entry.description}</i>
      <br />
      {HealthRating(entry.healthCheckRating)} <br />
      diagnose by {entry.specialist}
    </div>
  );
};

export default HealthCheckEntryDetails;
