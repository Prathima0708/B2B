import { TableBody, TableCell, TableRow } from "@windmill/react-ui";
import { TiDeleteOutline, TiTickOutline } from "react-icons/ti";
import hasPermission, { PAGE_SCHEMA_LIST } from "../login/hasPermission";

import AttributeDrawer from "../drawer/AttributeDrawer";
import EditDeleteButton from "../table/EditDeleteButton";
import MainDrawer from "../drawer/MainDrawer";
import MainModal from "../modal/MainModal";
import React from "react";
import useToggleDrawer from "../../hooks/useToggleDrawer";

const AttributeTable = ({ attributes }) => {
  const { serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();

  return (
    <>
      <MainModal id={serviceId} />
      <MainDrawer>{serviceId ? <AttributeDrawer id={serviceId} /> : <AttributeDrawer />}</MainDrawer>

      <TableBody>
        {attributes?.map((attr) => (
          <TableRow key={attr.id}>
            <TableCell className="font-semibold uppercase text-xs">{attr.id}</TableCell>
            <TableCell className="text-sm">{attr.displayName}</TableCell>
            <TableCell className="text-sm">{attr.titleName}</TableCell>
            <TableCell className="text-sm">{attr.dataType}</TableCell>
            <TableCell className="text-sm">{attr.description}</TableCell>
            <TableCell className="text-2xl">
              {attr.hidden ? <TiTickOutline /> : <TiDeleteOutline />}
            </TableCell>
            <TableCell className="text-2xl">
              {attr.mandatory ? <TiTickOutline /> : <TiDeleteOutline />}
            </TableCell>
            {(hasPermission(PAGE_SCHEMA_LIST, "update") || hasPermission(PAGE_SCHEMA_LIST, "delete")) && (
              <TableCell>
                <EditDeleteButton
                  permissionPage={PAGE_SCHEMA_LIST}
                  id={attr.id}
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

export default AttributeTable;
