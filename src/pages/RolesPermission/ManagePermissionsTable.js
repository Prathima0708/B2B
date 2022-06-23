import { Badge, TableBody, TableCell, TableRow } from "@windmill/react-ui";
import React, { useEffect, useState } from "react";
import hasPermission, {
  PAGE_ROLE_PERMISSION_MANAGEMENT,
} from "../../components/login/hasPermission";

import Switch from "@mui/material/Switch";

const ManagePermissionsTable = ({ permissions, setAllowed, filterText, setFilterText }) => {
  const [searchInput, setSearchInput] = useState("");

  const [filteredPermissions, setFilteredPermission] = useState(permissions);
  useEffect(() => {
    setFilterText((prevData) => prevData);
    if (filterText.length === 0) return setFilteredPermission(permissions);
    setFilteredPermission(
      permissions.filter(
        (ap) =>
          ap.end_point.toLowerCase().includes(filterText.toLowerCase()) ||
          ap.name.toLowerCase().includes(filterText.toLowerCase())
      )
    );
  }, [filterText]);
  return (
    <>
      <TableBody>
        {filteredPermissions
          .filter((post) => {
            if (searchInput === "") {
              return post;
            } else if (post.end_point.toLowerCase().includes(searchInput.toLowerCase())) {
              return post;
            }
          })
          .map((permission) => {
            return (
              <>
                <TableRow key={permission.id}>
                  <TableCell>
                    <span className="text-xs uppercase font-semibold">{permission.id}</span>
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
                        <h2 className="text-sm font-medium">{permission.request_type}</h2>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div>
                        <h2 className="text-sm font-medium">{permission.service_name}</h2>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div>
                        <h2 className="text-sm font-medium">{permission.end_point}</h2>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center place-content-center">
                      {/* <input className="toggle-button" type="checkbox" value={showHide} onClick={handleShow} /> */}
                      <Badge type={permission.is_active ? "success" : "danger"}>
                        {permission.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {/* <input className="toggle-button" type="checkbox" value={showHide} onClick={handleShow} /> */}
                      <Switch
                        disabled={
                          hasPermission(PAGE_ROLE_PERMISSION_MANAGEMENT, "setRolePermissions") ? false : true
                        }
                        key={permission.id}
                        checked={permission.isAllowed}
                        onChange={() => setAllowed(permission.id)}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              </>
            );
          })}
      </TableBody>
    </>
  );
};

export default React.memo(ManagePermissionsTable);
