import { format } from "date-fns";

export const today = () => format(new Date(), "yyyy-MM-dd");
