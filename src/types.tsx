export interface Market {
  code: string;
  name: string;
  description: string;
  logo: string;
  dates: string[];
  admins: string[];
  stallCost: number;
  tentCost?: number;
  powerCost?: number;
  stripeAccount?: string;
}

export interface Stall {
  id: string;
  marketCode?: string; // only for market managed stalls...
  email: string;
  phone?: string;
  name: string;
  description: string;
  products: string[];
  size: string;
  isFoodStall: boolean;
  foodBusinessCert?: string;
  foodBusinessInsurance?: string;
  requiresPower: boolean;
  requiresTent: number;
  insuranceExpires?: string;
  created: string;
  updated: string;
}

export type StallParams = Omit<Stall, "id" | "created" | "updated">;

export type StallStatusValues = "pending" | "approved" | "rejected";

export interface StallStatus {
  id: string;
  stallId: string;
  marketCode: string;
  status: StallStatusValues;
  bookingCost: number;
  created: string;
  updated: string;
}

export type StallStatusParams = Omit<
  StallStatus,
  "id" | "status" | "bookingCost" | "created" | "updated"
>;

export interface Booking {
  id: string;
  marketCode: string;
  stall: Stall;
  date: string;
  cost: number;
  isPaid: boolean;
  status: "booked" | "cancelled" | "credited";
  paymentId?: string;
  created: string;
  updated: string;
}

export type BookingParams = Omit<Booking, "id" | "created" | "updated">;
