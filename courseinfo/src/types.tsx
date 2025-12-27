interface CoursePartBase {
  name: string;
  exerciseCount: number;
}
interface MutualAttribute extends CoursePartBase {
  description: string;
}
interface CoursePartBasic extends MutualAttribute {
  kind: "basic";
}
interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group";
}
interface CoursePartBackground extends MutualAttribute {
  backgroundMaterial: string;
  kind: "background";
}
interface CoursePartSpecial extends MutualAttribute {
  requirements: Array<string>;
  kind: "special";
}

export type CoursePart =
  | CoursePartBasic
  | CoursePartGroup
  | CoursePartBackground
  | CoursePartSpecial;

export interface CourseEntry {
  name: string;
  exerciseCount: number;
}

export interface HeaderProps {
  name: string;
}
export interface TotalProps {
  count: number;
}
export interface ContentProps {
  parts: CoursePart[];
}
export interface PartProps {
  part: CoursePart;
}
