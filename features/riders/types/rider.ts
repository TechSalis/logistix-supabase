
export type Rider = {
  user_id: string;
  metadata: Record<string, unknown>;
  distance: number;
  is_available: boolean;
}