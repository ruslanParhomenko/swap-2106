export const shortName = (name: string) => {
  const [first, second] = name.split(" ");
  return `${first} ${second?.[0] ?? ""}`;
};
