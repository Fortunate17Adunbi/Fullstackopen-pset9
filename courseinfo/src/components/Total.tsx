import type { TotalProps } from "../types";

const Total = (props: TotalProps) => {
  return <p>Number of exercises {props.count}</p>;
};

export default Total;
