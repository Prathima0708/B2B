import React, { useState } from "react";

const CountryCode = () => {
  const [countryCodes, setCountryCodes] = useState();

  return (
    <>
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
