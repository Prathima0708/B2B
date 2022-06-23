import React, { useEffect, useState } from "react";

import apiService from "../../utils/apiService";

const ProductBrand = () => {
  const [brands, setBrands] = useState([]);
  useEffect(
    async () => await apiService.get("b2b", "/brands").then(({ data }) => setBrands(data.result)),
    []
  );
  return (
    <>
      {brands.length > 0 &&
        brands.map((parent) => (
          <option key={parent.id} value={parent.id}>
            {parent.name}
          </option>
        ))}
    </>
  );
};

export default ProductBrand;
