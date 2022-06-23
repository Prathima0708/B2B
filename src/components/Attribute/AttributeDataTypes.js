import React from "react";

const AttributeDataTypes = () => {
  const dataTypes = [
    "INTEGER",
    "FLOAT",
    "STRING",
    "DATE",
    "JSON_OBJ",
    "JSON_LIST",
    "IMAGE_TYPE",
    "PDF_FILE_TYPE ",
  ];
  return (
    <>
      {dataTypes.map((type, i) => (
        <option key={i} value={type}>
          {type}
        </option>
      ))}
    </>
  );
};

export default AttributeDataTypes;
