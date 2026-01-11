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

export interface Item {
  id: number;
  user_id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  profiles: Profile;
  barangay: string;
  created_at: Date;
  city: string;
  status: ItemStatus;
}
