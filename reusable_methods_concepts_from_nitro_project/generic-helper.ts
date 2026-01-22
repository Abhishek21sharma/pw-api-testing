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

export function getToken(response: any) {
  //IMPORTANT LOGIC HERE
  return response.body.access_token || "";
}

//IMPORTANT see below helper method..
//see no param expected but explictily defined the 'return type'
const generateRandomInt = (): string => {
  const timeStamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1e6)
    .toString()
    .padStart(6, "0");
  return `${timeStamp}${random}`;
};

//IMPORTANT..
const generateByPAttern = (pattern: string): string => {
  return "randomPAtterns..";
};
