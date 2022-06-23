import { Avatar, TableBody, TableCell, TableRow } from "@windmill/react-ui";
import hasPermission, { PAGE_BRAND_LIST } from "../login/hasPermission";

import BrandDrawer from "../drawer/BrandDrawer";
import EditDeleteButton from "../table/EditDeleteButton";
import MainDrawer from "../drawer/MainDrawer";
import MainModal from "../modal/MainModal";
import React from "react";
import { defaultImage } from "../../utils/constants";
import useToggleDrawer from "../../hooks/useToggleDrawer";

const BrandTable = ({ brands }) => {
  const { serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();

  return (
    <>
      <MainModal id={serviceId} />
      <MainDrawer>
        <BrandDrawer id={serviceId} />
      </MainDrawer>

      <TableBody>
        {brands?.map((brand) => (
          <TableRow key={brand.id}>
            <TableCell className="font-semibold uppercase text-xs">{brand.id}</TableCell>
            <TableCell>
              <Avatar
                className="hidden mr-3 md:block bg-gray-50 p-1"
                src={brand.imageUrl ? brand.imageUrl : defaultImage}
                alt={brand.name}
              />
            </TableCell>
            <TableCell className="text-sm">{brand.name}</TableCell>
            <TableCell className="text-sm">{brand.description}</TableCell>
            {(hasPermission(PAGE_BRAND_LIST, "update") || hasPermission(PAGE_BRAND_LIST, "delete")) && (
              <TableCell>
                <EditDeleteButton
                  permissionPage={PAGE_BRAND_LIST}
                  id={brand.id}
                  handleUpdate={handleUpdate}
                  handleModalOpen={handleModalOpen}
                />
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default BrandTable;
