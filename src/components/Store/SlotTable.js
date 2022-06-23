import { Avatar, Badge, TableBody, TableCell, TableRow } from "@windmill/react-ui";
import React, { useContext, useEffect } from "react";
import { TiDeleteOutline, TiTickOutline } from "react-icons/ti";
import hasPermission, { PAGE_STORE_ZONE_SLOT_LIST } from "../login/hasPermission";

import AttributeDrawer from "../drawer/AttributeDrawer";
import BrandDrawer from "../drawer/BrandDrawer";
import CategoryDrawer from "../drawer/CategoryDrawer";
import CategoryServices from "../../services/CategoryServices";
import EditDeleteButton from "../table/EditDeleteButton";
import MainDrawer from "../drawer/MainDrawer";
import MainModal from "../modal/MainModal";
import ShowHideButton from "../table/ShowHideButton";
import { SidebarContext } from "../../context/SidebarContext";
import SlotDrawer from "../drawer/SlotDrawer";
import { Switch } from "@material-ui/core";
import apiService from "../../utils/apiService";
import axios from "axios";
import useAsync from "../../hooks/useAsync";
import useToggleDrawer from "../../hooks/useToggleDrawer";
import { v4 } from "uuid";

const SlotTable = ({ daySlots, day, onUpdate }) => {
  const { serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();
  const handleStatusChange = (slotId) => {
    apiService
      .put("b2b", `/slots/changeStatus/${slotId}`)
      .then(() => onUpdate((prevData) => !prevData))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <MainModal id={serviceId} />
      <MainDrawer>
        {serviceId ? (
          <SlotDrawer
            slotDetails={{ ...daySlots.filter((slot) => slot.slotId === serviceId)[0], day }}
            onUpdate={onUpdate}
            id={serviceId}
          />
        ) : (
          <SlotDrawer selectedDay={day} onUpdate={onUpdate} />
        )}
      </MainDrawer>

      <TableBody>
        {daySlots
          ?.sort((a, b) => (a.slotId > b.slotId ? 1 : -1))
          .map((slot) => (
            <TableRow key={slot.slot.slotId}>
              <TableCell className="font-semibold uppercase text-l">{slot.slotId}</TableCell>
              <TableCell className="text-l">{`${
                String(slot.slot.startTime?.hr).length === 2
                  ? slot.slot.startTime?.hr
                  : `0${slot.slot.startTime?.hr}`
              }:${
                String(slot.slot.startTime?.min).length === 2
                  ? slot.slot.startTime?.min
                  : `0${slot.slot.startTime?.min}`
              }`}</TableCell>
              <TableCell className="text-l">{`${
                String(slot.slot.endTime?.hr).length === 2
                  ? slot.slot.endTime?.hr
                  : `0${slot.slot.endTime?.hr}`
              }:${
                String(slot.slot.endTime?.min).length === 2
                  ? slot.slot.endTime?.min
                  : `0${slot.slot.endTime?.min}`
              }`}</TableCell>
              <TableCell className="text-l">{slot.showSlotMarginMin}</TableCell>
              {hasPermission(PAGE_STORE_ZONE_SLOT_LIST, "toggleStatus") && (
                <TableCell className="text-2xl">
                  <Switch
                    key={slot.slotId}
                    checked={slot.active}
                    color="primary"
                    // onChange={handleShow}
                    onChange={(e) => handleStatusChange(slot.slotId)}
                    // onClick={() => updatePermissionStatus(permission)}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </TableCell>
              )}

              <TableCell>
                <EditDeleteButton
                  permissionPage={PAGE_STORE_ZONE_SLOT_LIST}
                  id={slot.slot.slotId}
                  handleUpdate={handleUpdate}
                  manageRoles
                />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </>
  );
};

export default SlotTable;
