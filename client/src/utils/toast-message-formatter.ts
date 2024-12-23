export const toastMessageFormatter = (message: string) => {
  const separatorIndex = message.indexOf(":");
  const title = message.substring(0, separatorIndex).trim();
  const description = message.substring(separatorIndex + 1).trim();

  return { title, description };
};
