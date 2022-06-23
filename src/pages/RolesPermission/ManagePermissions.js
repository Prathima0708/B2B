import {
  Button,
  Card,
  CardBody,
  Input,
  Table,
  TableCell,
  TableContainer,
  TableHeader,
} from "@windmill/react-ui";
import React, { useEffect, useState } from "react";
import hasPermission, { PAGE_ROLE_PERMISSION_MANAGEMENT } from "../../components/login/hasPermission";

import Loading from "../../components/preloader/Loading";
import ManagePermissionsTable from "./ManagePermissionsTable";
import PageTitle from "../../components/Typography/PageTitle";
import apiService from "../../utils/apiService";
import { useParams } from "react-router-dom";

const ManagePermissions = () => {
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);
  const [role, setRole] = useState();
  const [filterText, setFilterText] = useState("");
  const [update, setUpdate] = useState(false);
  const { id } = useParams();

  useEffect(async () => {
    setLoading(true);
    await apiService.get("user_service", "/permissions", null).then((data) => {
      const permissions = data.data;
      permissions.forEach((permission) => {
        permission.isAllowed = false;
        permission.roles.some((role) => {
          if (role.id === parseInt(id)) {
            permission.isAllowed = true;
          }
        });
      });
      permissions.sort((a, b) =>
        a.isAllowed < b.isAllowed ? 1 : a.isAllowed === b.isAllowed ? (a.id > b.id ? 1 : -1) : -1
      );
      setPermissions(permissions);
    });
    await apiService.get("user_service", `/roles/${id}`, null).then((data) => {
      setRole(data.data);
    });
    setLoading(false);
  }, [update]);

  // const setIsAllowed = (index) => {
  //   const allowed = permissions[index].isAllowed;
  //   setPermissions((prevData) => {
  //     prevData[index].isAllowed = !allowed;
  //     return [...prevData];
  //   });
  // };

  const setIsAllowed = (id) => {
    const allowed = permissions.find((perm) => perm.id === id).isAllowed;
    setPermissions((prevData) => {
      permissions.find((perm) => perm.id === id).isAllowed = !allowed;
      return [...prevData];
    });
  };
  const updatePermissions = () => {
    setFilterText("");
    const permission_ids = [];
    permissions.forEach((permission) => {
      if (permission.isAllowed === true) permission_ids.push(permission.id);
    });
    apiService
      .post("user_service", `/roles/${id}/permissions`, {
        permission_ids,
      })
      .then(() => {
        setUpdate(!update);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {loading ? (
        <Loading loading={loading} />
      ) : (
        <>
          <PageTitle>{role.name} -- Role Permissions</PageTitle>
          <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
            <CardBody>
              <div className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex">
                <div className="w-full md:w-2/4 md:flex-grow lg:flex-grow xl:flex-grow">
                  <Input
                    className="w-full rounded-md h-12"
                    aria-label="Bad"
                    placeholder="Search Permissions"
                    onChange={(e) => setFilterText(e.target.value)}
                  />
                </div>
                {hasPermission(PAGE_ROLE_PERMISSION_MANAGEMENT, "setRolePermissions") && (
                  <div className="md:w-1/4 md:flex-grow lg:flex-grow xl:flex-grow">
                    <Button onClick={updatePermissions} className="w-full rounded-md h-12">
                      Save
                    </Button>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
          <TableContainer className="mb-8 rounded-b-lg">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Request Type</TableCell>
                  <TableCell>Service Type</TableCell>
                  <TableCell>End Point</TableCell>
                  <TableCell>Permission Status</TableCell>
                  <TableCell>Allowed</TableCell>
                </tr>
              </TableHeader>
              <ManagePermissionsTable
                filterText={filterText}
                setFilterText={setFilterText}
                permissions={permissions}
                setAllowed={setIsAllowed}
              />
            </Table>
          </TableContainer>
        </>
      )}
    </>
  );
};
export default ManagePermissions;
