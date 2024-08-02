"use client";
import React from "react";
import CompanyProfileItem, { rowData } from "./item";

const CompanyProfileRowContainer = ({
  profileData,
}: {
  profileData: rowData[];
}) => {
  return (
    <div className="flex flex-col">
      {profileData.map((data, index) => (
        <div className="border-b p-4 pl-0" key={index}>
          <CompanyProfileItem rowData={data} />
        </div>
      ))}
    </div>
  );
};

export default CompanyProfileRowContainer;
