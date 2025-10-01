import { OrderType } from "../../../core/db/types.ts";

type Address = {
  name: string;
  coordinates?: Coordinates;
}

type Coordinates = {
  lat: number;
  lng: number;
}

export type CreateOrder = {
  pickup?: Address;
  dropoff?: Address;
  description: string;
  extras?: Record<string, unknown>;
  order_type: OrderType;
}
export type CreateBulkOrder = {
  pickup: Address;
  description: string;
  order_type: 'bulk';
  extras: {
    pickup_contact: string;
    deliveries: number;
    entries: {
      item_name: string;
      quantity: number;
      address: Address;
      contact: string;
      note: string;
    };
  };
}

