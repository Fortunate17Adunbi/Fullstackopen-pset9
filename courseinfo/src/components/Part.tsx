import type { PartProps } from "../types";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};
const style = {
  paddingTop: 8,
};
const Part = (props: PartProps) => {
  switch (props.part.kind) {
    case "basic": {
      const p = props.part;
      return (
        <div style={style}>
          <b>
            {p.name} {p.exerciseCount}
          </b>
          <br />
          <i>{p.description}</i>
        </div>
      );
    }
    case "group": {
      const p = props.part;
      return (
        <div key={p.name} style={style}>
          <b>
            {p.name} {p.exerciseCount}
          </b>
          <br />
          project exercises {p.groupProjectCount}
        </div>
      );
    }
    case "background": {
      const p = props.part;
      return (
        <div key={p.name} style={style}>
          <b>
            {p.name} {p.exerciseCount}
          </b>
          <br />
          <i>{p.description}</i>
          <br />
          submit to {p.backgroundMaterial}
        </div>
      );
    }

    case "special": {
      const p = props.part;
      return (
        <div key={p.name} style={style}>
          <b>
            {p.name} {p.exerciseCount}
          </b>
          <br />
          <i>{p.description}</i>
          <br />
          required skills: {p.requirements.join(", ")}
        </div>
      );
    }
    default:
      return assertNever(props.part);
  }
};

export default Part;
