// Application types. In a mature project you would generate the Database
// type from Supabase (`supabase gen types typescript`). This is a hand
// written version matching supabase/schema.sql, kept small and readable.

export type UserRole = "member" | "admin" | "media";
export type MediaType = "audio" | "video";
export type PrayerStatus = "open" | "answered" | "archived";
export type DonationStatus = "pending" | "succeeded" | "failed" | "refunded";

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}

export interface Fund {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  description: string | null;
  scripture: string | null;
  series: string | null;
  media_type: MediaType;
  media_url: string;
  thumbnail_url: string | null;
  duration_seconds: number | null;
  preached_on: string;
  published: boolean;
  created_at: string;
}

export interface ChurchEvent {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  category: string | null;
  image_url: string | null;
  starts_at: string;
  ends_at: string | null;
  capacity: number | null;
  published: boolean;
  created_at: string;
}

export interface PrayerRequest {
  id: string;
  user_id: string;
  title: string;
  body: string;
  is_anonymous: boolean;
  is_public: boolean;
  status: PrayerStatus;
  created_at: string;
  pray_count?: number;
}

export interface Donation {
  id: string;
  user_id: string | null;
  fund_id: string | null;
  amount_cents: number;
  currency: string;
  status: DonationStatus;
  provider_reference: string | null;
  provider_transaction: string | null;
  donor_email: string | null;
  created_at: string;
}

// Minimal Database type so the Supabase generic has something to bind to.
// Broadened to keep the codebase readable without full generated types.
export type Database = any;

export interface GalleryItem {
  id: string;
  title: string;
  caption: string | null;
  category: string;
  image_url: string;
  storage_path: string | null;
  created_by: string | null;
  published: boolean;
  created_at: string;
}

// Uniform result shape for server actions called from client components.
export type ActionResult = { error?: string; ok?: boolean };

export interface Announcement {
  id: string;
  message: string;
  active: boolean;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  body: string;
  handled: boolean;
  created_at: string;
}

export interface Member {
  id: string;
  photo_url: string | null;
  photo_path: string | null;
  name: string;
  date_of_birth: string | null;
  place_of_birth: string | null;
  contact1: string | null;
  contact2: string | null;
  nationality: string | null;
  language_spoken: string | null;
  home_town: string | null;
  region: string | null;
  marital_status: string | null;
  marriage_date: string | null;
  marriage_type: string | null;
  spouse_name: string | null;
  spouse_status: string | null;
  father_name: string | null;
  father_status: string | null;
  father_membership: string | null;
  father_contact: string | null;
  mother_name: string | null;
  mother_status: string | null;
  mother_membership: string | null;
  mother_contact: string | null;
  postal_address: string | null;
  email: string | null;
  location_city: string | null;
  locality_street: string | null;
  gps_address: string | null;
  employment_type: string | null;
  work_nature: string | null;
  business_name_location: string | null;
  school_name_location: string | null;
  education_level: string | null;
  baptized: string | null;
  baptism_date: string | null;
  baptism_type: string | null;
  tithe_card_no: string | null;
  welfare_card_no: string | null;
  areas_of_ministry: string[] | null;
  sunday_school: string | null;
  house_fellowship: string | null;
  committee: string | null;
  committee_other: string | null;
  created_at: string;
}
