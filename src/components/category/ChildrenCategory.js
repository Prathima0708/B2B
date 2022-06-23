import React, { useEffect, useState } from "react";

import useAsync from "../../hooks/useAsync";
import CategoryServices from "../../services/CategoryServices";
import { category } from "../../util/category";

const ChildrenCategory = ({ value }) => {
  const [categories, setCategories] = useState([]);

  // const { data } = useAsync(CategoryServices.getAllCategory);

  const data = category;

  useEffect(() => {
    if (value) {
      const result = data.filter((parent) => parent.parent.toLowerCase().includes(value.toLowerCase()));
      setCategories(result);
    } else {
      setCategories(data);
    }
  }, [data, value]);

  return (
    <>
      {categories.map((parent) => {
        return parent.children.map((children) => (
          <option key={children} value={children}>
            {children}
          </option>
        ));
      })}
    </>
  );
};

export default ChildrenCategory;
