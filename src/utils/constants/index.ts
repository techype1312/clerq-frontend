import { Country } from "country-state-city";

export const country = ["US", "IN"];

export const countryDropdown = country.map((c) => Country.getCountryByCode(c));

export const allRoles = [
  { id: 3, name: "Account Owner" },
  { id: 4, name: "Account Admin" },
  { id: 5, name: "Accountant" },
  { id: 6, name: "CPA" },
  { id: 7, name: "Lawyer" },
  { id: 8, name: "Agency" },
  { id: 9, name: "Manager" },
];

export const allowedRoles = [
  { id: 4, name: "Account Admin" },
  { id: 5, name: "Accountant" },
  { id: 6, name: "CPA" },
  { id: 7, name: "Lawyer" },
  { id: 8, name: "Agency" },
  { id: 9, name: "Manager" },
];

export const statuses = [
  { id: 1, name: "Active" },
  { id: 2, name: "Inactive" },
];

export const dashboardTitle = [
  "Overview",
  "Transactions",
  "Income statement",
  "Balance sheet",
  "Documents",
  "Settings",
  "Bank accounts",
  "Team",
  "Settings",
  "Profile",
];