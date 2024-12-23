import { addMilliseconds } from "date-fns";

// Verify if token expiration threshold has been met
export const isTokenExpired = (exp: number) => {
  const bufferTimeInMilliseconds = 3 * 60 * 1000;
  const currentTime = new Date(Date.now());
  const tokenExpirationTime = new Date(exp * 1000);
  // 3 minutes before tokenExpirationTime
  const expirationThreshold = addMilliseconds(tokenExpirationTime, -bufferTimeInMilliseconds);

  return currentTime >= expirationThreshold;
};
