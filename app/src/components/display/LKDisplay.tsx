import React, { useCallback, useEffect, useState } from "react";
import { useSmartcard } from "../../context/smartcard";

import { toBase64Src } from "../../util/to-base64";
import { LKData } from "../../util/types";
import useBridgeContext from "../../util/use-bridge-ctx";

import styles from "./LKDisplay.module.css";

const Data: React.FC<{ data: LKData }> = React.memo(({ data }) => (
  <div className={styles.container}>
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
));
const Error: React.FC<{ message?: string }> = React.memo((props) => {
  return (
    <div className={`${styles.container} ${styles.error}`}>
      <p>{props.message || "An Error occurred!"}</p>
    </div>
  );
});
const Loading: React.FC = React.memo(() => {
  return (
    <div className={styles["lds-facebook"]}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
});
const LKDisplay: React.FC<{ data: LKData; auto?: false } | { auto: true }> = (
  props
) => {
  const celikCtx = useBridgeContext("celik");

  const { device, card } = useSmartcard();

  const [data, setData] = useState<LKData | null>(
    props.auto ? null : props.data
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchHandle = useCallback(async () => {
    if (!card) return;

    try {
      setLoading(true);
      await celikCtx.init(device);
      const res = await celikCtx.getAllData();
      setData(res);
    } catch (e: any) {
      console.log("Error!", e);
      setError(e.toString());
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  }, [celikCtx, card, device]);

  useEffect(() => {
    if (props.auto && !!card) fetchHandle();
  }, [props.auto, card, fetchHandle]);

  if (!card && !!data) setData(null);

  return (
    <div className={styles.scrollable}>
      {!!data && <Data data={data} />}
      {!!error && <Error message={error} />}
      {!!loading && <Loading />}
      {!card && <p className={styles.insertCard}>Insert Card</p>}
    </div>
  );
};
export default LKDisplay;
