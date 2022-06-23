import { Avatar, TableBody, TableCell, TableRow } from "@windmill/react-ui";
import hasPermission, {
  PAGE_PRODUCTS_LIST,
  PAGE_PRODUCT_UPDATE,
} from "../login/hasPermission";

import React from "react";
import { Switch } from "@mui/material";
import axios from "axios";
import { coreServiceBaseUrl } from "../../utils/backendUrls";
import { defaultImage } from "../../utils/constants";
import { useHistory } from "react-router-dom";

const ProductTable = ({ products, onUpdate }) => {
  const history = useHistory();

  return (
    <>
      <TableBody>
        {products?.map((product) => (
          <TableRow
            key={product.id}
            onClick={() => {
              if (!hasPermission(PAGE_PRODUCT_UPDATE, "page")) {
                return;
              }
              history.push(`/products/${product.id}`);
            }}
            className={
              hasPermission(PAGE_PRODUCT_UPDATE, "page")
                ? "cursor-pointer"
                : "cursor-default"
            }
          >
            <TableCell>
              <span className="text-xs uppercase font-semibold">
                {product.id}
              </span>
            </TableCell>
            <TableCell>
              <Avatar
                className="hidden mr-3 md:block bg-gray-50 p-1"
                src={
                  product.thumbnailImage ? product.thumbnailImage : defaultImage
                }
                alt={product.name}
              />
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <div>
                  <h2 className="text-sm font-medium">{product.name}</h2>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm">{product.brand?.name}</span>
            </TableCell>

            <TableCell>
              <span className="text-sm">{product.tags}</span>
            </TableCell>
            {hasPermission(PAGE_PRODUCTS_LIST, "delete") && (
              <TableCell onClick={(e) => e.stopPropagation()}>
                <div className=" flex items-center place-content-center">
                  <Switch
                    checked={product.deleted}
                    onClick={async () => {
                      await axios
                        .put(
                          `${coreServiceBaseUrl}/products/toggle-delete/${product.id}`
                        )
                        .then(() => {
                          onUpdate((prevData) => !prevData);
                        })
                        .catch((err) => console.log(err));
                    }}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </div>{" "}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default React.memo(ProductTable);
