export interface Location {
  id?: number;
  address: string;
  city: string;
  latitude: number;
  name: string;
  longitude: number;
  time_offset_from_start: number | null;
}
