import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import useAsync from "../../hooks/useAsync";
import BrandService from "../../services/BrandService";

const CountryCode = () => {
  const [countryCodes, setCountryCodes] = useState();
  // useEffect(() => {
  //   axios.get("https://countriesnow.space/api/v0.1/countries/codes").then((data) => {
  //     const reqCode = data.data.data.filter((country) => country.code === "IN" || country.code === "QA");
  //     setCountryCodes(reqCode);
  //   });
  // }, []);
  return (
    <>
      {/* {countryCodes &&
        countryCodes.map((country) => (
          <option
            key={country.code}
            value={country.dial_code}
          >{`${country.name} (${country.dial_code})`}</option>
        ))} */}
      <option key="IN" value="+91">
        India (+91)
      </option>
      <option key="QA" value="+974">
        Qatar (+974)
      </option>
    </>
  );
};

export default CountryCode;
