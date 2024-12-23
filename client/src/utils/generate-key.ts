export const generateKey = (str: string) => {
  let formattedString;

  formattedString = str.slice(0, 32).toLowerCase();
  formattedString = formattedString.split(" ").join("-");

  return formattedString;
};
