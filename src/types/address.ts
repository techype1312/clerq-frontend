export interface IAddress {
  address_line_1: string;
  address_line_2?: string | null;
  country: string;
  city: string;
  state: string;
  postal_code: string;
  latitude?: number;
  longitude?: number;
  id?: string;
}
