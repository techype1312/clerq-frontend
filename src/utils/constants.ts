import { Country } from "country-state-city";

export const country = ['US', 'IN'];

export const countryDropdown = country.map((c) => Country.getCountryByCode(c));