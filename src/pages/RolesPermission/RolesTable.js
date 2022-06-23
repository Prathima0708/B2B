import "./rolesPermissions.css";

import { TableBody, TableCell, TableRow } from "@windmill/react-ui";
import hasPermission, { PAGE_ROLES_LIST } from "../../components/login/hasPermission";

import EditDeleteButton from "../../components/table/EditDeleteButton";
import LabelArea from "../../components/form/LabelArea";
import MainDrawer from "../../components/drawer/MainDrawer";
import MainModal from "../../components/modal/MainModal";
import React from "react";
import RolesDrawer from "../../components/drawer/RoleDrawer";
import { Switch } from "@material-ui/core";
import apiService from "../../utils/apiService";
import useToggleDrawer from "../../hooks/useToggleDrawer";

const RolesTable = (props) => {
  const { serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();
  const { rolesData } = props;
  const showCollapsableSection = (id) => {
    let categoryHeader = document.getElementById(id + "-category-by-id-header");

    if (categoryHeader != null) {
      document.getElementById(id + "-category-by-id-header").style.display =
        categoryHeader.style.display === "revert" ? "none" : "revert";
      document.getElementById(id + "-category-by-id-header").style.animation =
        categoryHeader.style.display === "revert" ? "fadeIn 2s" : "fadeOut 2s";
      const nodeList = document.querySelectorAll("#category-by-id" + id);
      for (let i = 0; i < nodeList.length; i++) {
        nodeList[i].style.display = nodeList[i].style.display === "revert" ? "none" : "revert";
        nodeList[i].style.animation = nodeList[i].style.display === "revert" ? "fadeIn 2s" : "fadeOut 2s";
      }
    }
  };
  const updateRoleStatus = (role) => {
    apiService
      .patch("user_service", `/roles/${role.id}/status`)
      .then(() => props.onUpdate((prevData) => !prevData))
      .catch((err) => console.log(err));
  };
  return (
    <>
      <MainModal id={serviceId} />
      <MainDrawer>
        {serviceId ? (
          <RolesDrawer id={serviceId} rolesData={rolesData} onUpdate={props.onUpdate} />
        ) : (
          <RolesDrawer onUpdate={props.onUpdate} />
        )}
      </MainDrawer>
      <TableBody>
        {rolesData?.map((role) => {
          return (
            <>
              <TableRow
                key={role.id}
                onClick={() => {
                  showCollapsableSection(role.id);
                }}
                className="cursor-pointer"
              >
                <TableCell>
                  <span className="text-xs uppercase font-semibold">{role.id}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div>
                      <h2 className="text-sm font-medium">{role.role_key}</h2>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div>
                      <h2 className="text-sm font-medium">{role.name}</h2>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Switch
                    disabled={hasPermission(PAGE_ROLES_LIST, "toggleStatus") ? false : true}
                    key={role.id}
                    checked={role.is_active}
                    onClick={(e) => {
                      e.stopPropagation();
                      updateRoleStatus(role);
                    }}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </TableCell>
                {hasPermission(PAGE_ROLES_LIST, "update") && (
                  <TableCell
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <EditDeleteButton
                      permissionPage={PAGE_ROLES_LIST}
                      manageRoles
                      id={role.id}
                      handleUpdate={handleUpdate}
                      handleModalOpen={handleModalOpen}
                    />
                  </TableCell>
                )}
              </TableRow>

              {role.children ? (
                <TableRow
                  id={role.id + "-category-by-id-header"}
                  className={"text-xs hidden delay-150 " + role.id + "-category-by-id"}
                >
                  <TableCell>{""}</TableCell>
                  <TableCell>
                    <LabelArea label={"Description:"} />
                    <div className="break-words description">{role.children}</div>
                  </TableCell>
                  <TableCell>{""}</TableCell>
                  <TableCell>{""}</TableCell>
                  <TableCell>{""}</TableCell>
                </TableRow>
              ) : null}
            </>
          );
        })}
      </TableBody>
    </>
  );
};

export default React.memo(RolesTable);
