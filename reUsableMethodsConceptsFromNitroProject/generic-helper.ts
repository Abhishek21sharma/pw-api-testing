export function capitalizeFirstLetter(input: string, delimeter: string) {
  if (!input) return input;

  if (delimeter === "") {
    return input[0].toUpperCase() + input.slice(1);
  }

  //IMPORTANT LOGIC (LINE) ::
  return input
    .split(delimeter)
    .map((s) => (s ? s[0].toUpperCase() + s.slice(1) : s))
    .join(delimeter);
}
