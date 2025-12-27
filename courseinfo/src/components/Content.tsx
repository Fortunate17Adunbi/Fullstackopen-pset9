import type { ContentProps } from "../types";
import Part from "./Part";

const Content = (props: ContentProps) => {
  return props.parts.map(
    (part) => <Part part={part} key={part.name} />
    // <p key={p.name}>
    //   {p.name} {p.exerciseCount}
    // </p>
  );
};

export default Content;
