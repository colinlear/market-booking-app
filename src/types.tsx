export interface Market {
  code: string;
  name: string;
  description: string;
  logo: string;
  dates: string[];
  admins: string[];
  productQuotas?: Record<string, number>;
  enforceQuotas?: boolean;
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
  isFoodStall: boolean;
  foodBusinessCert?: string;
  foodBusinessInsurance?: string;
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
  size: string;
  requiresPower: boolean;
  requiresTent: number;
  notes?: string;
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
  stall: {
    id: string;
    name: string;
    description?: string;
    products?: string[];
  };
  date: string;
  cost: number;
  isPaid: boolean;
  status: "booked" | "cancelled" | "credited";
  requiresPower?: boolean;
  requiresTent?: number;
  paymentId?: string;
  created: string;
  updated: string;
}

export interface BookingWithStall extends Booking {
  stall: Stall;
  stallStatus?: StallStatus;
}

export type BookingParams = Omit<Booking, "id" | "created" | "updated">;
