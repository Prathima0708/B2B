import React from "react";
import * as dayjs from "dayjs";
import { TableCell, TableBody, TableRow, Avatar } from "@windmill/react-ui";

import MainModal from "../modal/MainModal";
import MainDrawer from "../drawer/MainDrawer";
import StaffDrawer from "../drawer/StaffDrawer";
import useToggleDrawer from "../../hooks/useToggleDrawer";
import EditDeleteButton from "../table/EditDeleteButton";

const StaffTable = ({ staffs }) => {
  const { serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();

  return (
    <>
      <MainModal id={serviceId} />
      <MainDrawer>
        {serviceId ? <StaffDrawer id={serviceId} /> : <StaffDrawer />}
      </MainDrawer>

      <TableBody>
        {staffs?.map((staff) => (
          <TableRow key={staff.id}>
            <TableCell>
              <span className="font-semibold uppercase text-xs">
                {" "}
                {staff.id /*}.substring(20, 24)*/}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <Avatar
                  className="hidden mr-3 md:block bg-gray-50"
                  src={staff.image}
                  alt={staff.name}
                />
                <div>
                  <h2 className="text-sm font-medium">{staff.name}</h2>
                </div>
              </div>
            </TableCell>

            <TableCell>
              <span className="text-sm">{staff.email}</span>{" "}
            </TableCell>
            <TableCell>
              <span className="text-sm ">{staff.phone}</span>
            </TableCell>

            <TableCell>
              <span className="text-sm">
                {dayjs(staff.joiningData).format("MMM D, YYYY")}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-sm font-semibold">{staff.role}</span>
            </TableCell>
            <TableCell>
              <EditDeleteButton
                id={staff.id}
                handleUpdate={handleUpdate}
                handleModalOpen={handleModalOpen}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default StaffTable;
