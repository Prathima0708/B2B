import { FiMinus, FiPlus } from "react-icons/fi";
import React, { useState } from "react";
import hasPermission, { PAGE_PRODUCT_UPDATE } from "../login/hasPermission";

import CircularProgress from "@mui/material/CircularProgress";
import Loading from "../preloader/Loading";
import apiService from "../../utils/apiService";
import { notifyError } from "../../utils/toast";

const CategoryItem = ({ name, mapped, categoryId, productId, update, display }) => {
  const [loading, setLoading] = useState(false);

  const handleAddProductToCategory = async () => {
    setLoading(true);
    await apiService
      .post("b2b", "/category-product", { categoryId, productId })
      .then(() => {
        update((prevData) => {
          return !prevData;
        });
        setLoading(false);
      })
      .catch((err) => {
        notifyError(err.response.data.errorMessage);
        setLoading(false);
      });
  };
  const handleRemoveProductFromCategory = async () => {
    setLoading(true);
    await apiService
      .delete("b2b", `/category-product/${mapped.id}`, null)
      .then(() => {
        update((prevData) => {
          return !prevData;
        });
        setLoading(false);
      })
      .catch((err) => {
        notifyError(err.response.data.errorMessage);
        setLoading(false);
      });
  };
  return (
    <div
      className="h-10 flex-shrink bg-gray-300 m-1 p-2 rounded-md"
      style={{ display: display === false ? "none" : "block" }}
    >
      <div className="flex flex-row">
        <p className=" text-cool-gray-800 mx-1">{name}</p>
        {mapped ? (
          <>
            {hasPermission(PAGE_PRODUCT_UPDATE, "deleteCategory") && (
              <>
                {!loading ? (
                  <span
                    onClick={handleRemoveProductFromCategory}
                    className="self-center ml-2 cursor-pointer rounded-full p-1 text-l text-red-600 hover:bg-red-300"
                  >
                    <FiMinus />
                  </span>
                ) : (
                  <span className="self-center ml-2 cursor-pointer ">
                    <CircularProgress size={10} />
                  </span>
                )}
              </>
            )}
          </>
        ) : (
          <>
            {hasPermission(PAGE_PRODUCT_UPDATE, "addCategory") && (
              <>
                {!loading ? (
                  <span
                    onClick={handleAddProductToCategory}
                    className="self-center ml-2 cursor-pointer rounded-full p-1 text-l text-green-600 hover:bg-green-300"
                  >
                    <FiPlus />
                  </span>
                ) : (
                  <span className="self-center ml-2 cursor-pointer ">
                    <CircularProgress size={10} />
                  </span>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryItem;
