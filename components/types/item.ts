export type ItemStatus = "available" | "reserved" | "claimed";

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  verified: boolean;
  barangay: string | null;
  bio: string | null;
  city: string | null;
  created_at: string;
}

export interface Claim {
  id: number;
  item_id: number;
  user_id: string;
  status: string;
  created_at: string;
  items: Item;
}

export interface Item {
  id: number;
  user_id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  city: string;
  barangay: string;
  status: ItemStatus;
  created_at: Date;
  deleted_at: Date;
  claimed_by: string | null;
  claims: Claim[];
  profiles: Profile;
}
