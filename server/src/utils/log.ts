import { format } from "date-fns";
import logger from "pino";

export const log = logger({
  transport: {
    target: "pino-pretty",
  },
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${format(new Date(), "MM/d/yyyy - hh:mm:ss a")}"`,
});
