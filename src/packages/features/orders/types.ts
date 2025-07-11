export type CreateOrder = {
  pickup: Record<string, unknown>;
  dropoff: Record<string, unknown>;
  description: string;
  extras: Record<string, unknown>;
  order_type: string;
}