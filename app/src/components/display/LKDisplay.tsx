import React from "react";

import { toBase64Src } from "../../util/to-base64";
import { LKData } from "../../util/types";

const LKDisplay: React.FC<{ data: LKData }> = ({ data }) => {
  return (
    <div
      style={{
        background: "whitesmoke",
        color: "darkblue",
        fontSize: "1rem",
        padding: "5px 1rem 1rem",
        margin: "1rem 2rem",
      }}
    >
      <p>{data.sex}</p>
      <img
        width={120}
        src={toBase64Src(data.portrait)}
        alt={data.givenName + " " + data.surname}
      />
      <p>
        {data.givenName} ({data.parentGivenName}) {data.surname}
      </p>
      <p>
        {data.dateOfBirth} {data.communityOfBirth}, {data.placeOfBirth},{" "}
        {data.stateOfBirth}
      </p>
      <p>
        {data.street} {data.houseNumber}
        {data.houseLetter}, {data.apartmentNumber} <br />
        {data.community}, {data.place} ({data.state})
      </p>
      <p>{data.docRegNo}</p>
      <p>{data.personalNumber}</p>
      <p>{data.issuingAuthority}</p>
      <p>
        {data.issuingDate} - {data.expiryDate}
      </p>
    </div>
  );
};
export default React.memo(LKDisplay);
