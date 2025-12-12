export const parseData = (args: string[]): number[] => {
  const data = [];
  for (let i = 2; i < args.length; i++) {
    data.push(Number(args[i]));
  }
  if (data.includes(NaN)) {
    throw new Error("Argument include data that is not a number");
  }
  return data;
};
