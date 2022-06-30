import "./rolesPermissions.css";

import React, { useState } from "react";
import { TableBody, TableCell, TableRow } from "@windmill/react-ui";
import hasPermission, {
  PAGE_PERMISSION_LIST,
} from "../../components/login/hasPermission";

import EditDeleteButton from "../../components/table/EditDeleteButton";

import MainDrawer from "../../components/drawer/MainDrawer";
import MainModal from "../../components/modal/MainModal";
import PermissionsDrawer from "../../components/drawer/PermissionsDrawer";

import Switch from "@mui/material/Switch";
import apiService from "../../utils/apiService";
import useToggleDrawer from "../../hooks/useToggleDrawer";

const PermissionsTable = (props) => {
  const [checkedItems, setCheckedItems] = useState({});
  const { serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();
  const handleShow = (event) => {
    setCheckedItems({
      ...checkedItems,
      [event.target.name]: event.target.checked,
    });
  };
  const { permissions } = props;
  const showCollapsableSection = (id) => {
    let categoryHeader = document.getElementById(id + "-category-by-id-header");

    if (categoryHeader != null) {
      document.getElementById(id + "-category-by-id-header").style.display =
        categoryHeader.style.display === "revert" ? "none" : "revert";
      document.getElementById(id + "-category-by-id-header").style.animation =
        categoryHeader.style.display === "revert" ? "fadeIn 2s" : "fadeOut 2s";
      const nodeList = document.querySelectorAll("#category-by-id" + id);
      for (let i = 0; i < nodeList.length; i++) {
        nodeList[i].style.display =
          nodeList[i].style.display === "revert" ? "none" : "revert";
        nodeList[i].style.animation =
          nodeList[i].style.display === "revert" ? "fadeIn 2s" : "fadeOut 2s";
      }
    }
  };
  const updatePermissionStatus = (permission) => {
    apiService
      .patch("user_service", `/permissions/${permission.id}/status`)
      .then(() => props.onUpdate((prevData) => !prevData))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <MainModal id={serviceId} />
      <MainDrawer>
        {serviceId ? (
          <PermissionsDrawer
            id={serviceId}
            permissionsData={permissions}
            onUpdate={props.onUpdate}
          />
        ) : (
          <PermissionsDrawer onUpdate={props.onUpdate} />
        )}
      </MainDrawer>
      <TableBody>
        {permissions?.map((permission) => {
          return (
            <>
              <TableRow
                key={permission.id}
                onClick={() => {
                  showCollapsableSection(permission.id);
                }}
              >
                <TableCell>
                  <span className="text-xs uppercase font-semibold">
                    {permission.id}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div>
                      <h2 className="text-sm font-medium">{permission.name}</h2>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div>
                      <h2 className="text-sm font-medium">
                        {permission.service_name}
                      </h2>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div>
                      <h2 className="text-sm font-medium">
                        {permission.request_type}
                      </h2>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div>
                      <h2 className="text-sm font-medium">
                        {permission.end_point}
                      </h2>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Switch
                    disabled={
                      hasPermission(PAGE_PERMISSION_LIST, "toggleStatus")
                        ? false
                        : true
                    }
                    key={permission.id}
                    checked={permission.is_active}
                    onClick={() => updatePermissionStatus(permission)}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </TableCell>
                {hasPermission(PAGE_PERMISSION_LIST, "update") && (
                  <TableCell>
                    <div className="flex items-center">
                      <EditDeleteButton
                        permissionPage={PAGE_PERMISSION_LIST}
                        manageRoles={true}
                        permission
                        id={permission.id}
                        handleUpdate={handleUpdate}
                        handleModalOpen={handleModalOpen}
                      />
                    </div>
                  </TableCell>
                )}
              </TableRow>
            </>
          );
        })}
      </TableBody>
    </>
  );
};

export default React.memo(PermissionsTable);
