import React, { useEffect, useState } from "react";

import apiService from "../../utils/apiService";

const ParentCategory = () => {
  const [categories, setCategories] = useState([]);
  useEffect(async () => {
    await apiService
      .get("b2b", "/categories")
      .then((data) => setCategories([...data.data.result]))
      .catch((err) => console.log("Unable to get all category"));
  }, []);

  return (
    <>
      {categories.length &&
        categories
          .filter((parent) => !parent.parent)
          .map((parent) => (
            <option key={parent.id} value={parent.id}>
              {parent.name}
            </option>
          ))}
    </>
  );
};

export default ParentCategory;
