import type { Message } from "../types.ts";

const Notification = (props: Message) => {
  const style = {
    color: "red",
  };
  if (props.error) {
    return <span style={style}>{props.error}</span>;
  }
  if (props.success) {
    return <span>{props.success}</span>;
  }
};

export default Notification;
