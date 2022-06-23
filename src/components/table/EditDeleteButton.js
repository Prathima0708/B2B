import { FiEdit, FiTrash2 } from "react-icons/fi";

import React from "react";
import Tooltip from "../tooltip/Tooltip";
import hasPermission from "../login/hasPermission";

const EditDeleteButton = ({
  id,
  handleUpdate,
  handleModalOpen,
  product,
  parentId,
  manageRoles,
  permissionPage,
}) => {
  return (
    <>
      <div className="flex" /* justify-end text-right*/>
        {!product && hasPermission(permissionPage, "update") && (
          <div
            onClick={() => handleUpdate(id, parentId)}
            className="p-2 cursor-pointer text-gray-400 hover:text-green-600"
          >
            <Tooltip id="edit" Icon={FiEdit} title="Edit" bgColor="#10B981" />
          </div>
        )}
        {!manageRoles && hasPermission(permissionPage, "delete") && (
          <div
            onClick={() => handleModalOpen(id, parentId)}
            className="p-2 cursor-pointer text-gray-400 hover:text-red-600"
          >
            <Tooltip id="delete" Icon={FiTrash2} title="Delete" bgColor="#EF4444" />
          </div>
        )}
      </div>
    </>
  );
};

export default EditDeleteButton;
