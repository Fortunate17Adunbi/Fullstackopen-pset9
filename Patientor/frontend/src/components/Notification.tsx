import { Alert } from "@mui/material";

interface NotificationProps {
  success?: string | undefined;
  error?: string | undefined;
}

const Notification = ({ success, error }: NotificationProps) => {
  if (!error && !success) {
    return null;
  } else {
    return (
      <div>
        {success && <Alert severity="success">{success}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </div>
    );
  }
};

export default Notification;
