import {
  Button,
  Card,
  CardBody,
  Input,
  Pagination,
  Select,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
} from "@windmill/react-ui";
import React, { useContext, useEffect, useState } from "react";
import hasPermission, {
  PAGE_PERMISSION_LIST,
  PAGE_ROLE_PERMISSION_MANAGEMENT,
} from "../../components/login/hasPermission";

import Loading from "../../components/preloader/Loading";
import PageTitle from "../../components/Typography/PageTitle";
import PermissionsTable from "./PermissionsTable";
import { SidebarContext } from "../../context/SidebarContext";
import apiService from "../../utils/apiService";
import useFilter from "../../hooks/useFilter";
import { useHistory } from "react-router-dom";

const Permissions = () => {
  const loading = false;
  const { toggleDrawer } = useContext(SidebarContext);
  const [data, setData] = useState([]);
  const [filteredPermissions, setFilteredPermission] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [update, setUpdate] = useState(true);
  const history = useHistory();
  const { handleChangePage, resultsPerPage, totalResults, dataTable } = useFilter(filteredPermissions, 20);
  const [filterText, setFilterText] = useState("");
  useEffect(() => {
    setFilterText((prevData) => prevData);
    if (filterText.length === 0) return setFilteredPermission(data);
    setFilteredPermission([
      ...data.filter(
        (ap) =>
          ap.end_point.toLowerCase().includes(filterText.toLowerCase()) ||
          ap.name.toLowerCase().includes(filterText.toLowerCase())
      ),
    ]);
  }, [filterText]);

  useEffect(() => {
    apiService.get("user_service", "/roles", null).then((res) => {
      const roleData = res.data?.map(
        (role) =>
          (role = {
            ...role,
            children: role.description ? role.description : "Description not added to role",
          })
      );
      setRoleData(roleData);
    });
    apiService.get("user_service", "/permissions", null).then((res) => {
      const permissionData = res.data.sort((a, b) => (a.id < b.id ? -1 : 1));
      setData(permissionData);
      setFilteredPermission(permissionData);
    });
  }, [toggleDrawer, update]);

  return (
    <>
      <PageTitle> Permissions Main</PageTitle>
      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <div className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex">
            {hasPermission(PAGE_ROLE_PERMISSION_MANAGEMENT, "page") && (
              <div className="w-full md:w-2/3 md:flex-grow lg:flex-grow xl:flex-grow">
                <Select
                  onChange={(e) => history.push(`permission/role/${e.target.value}`)}
                  className="border h-12 text-sm focus:outline-none block bg-gray-100 border-transparent focus:bg-white"
                >
                  <option defaultValue hidden>
                    Select a role to Assign permissions
                  </option>
                  {roleData.map((opt) => (
                    <option value={opt.id}>{opt.role_key}</option>
                  ))}
                </Select>
              </div>
            )}
            <div className="w-full md:w-2/4 md:flex-grow lg:flex-grow xl:flex-grow">
              <Input
                className="w-full rounded-md h-12"
                aria-label="Bad"
                placeholder="Search Permissions"
                onChange={(e) => setFilterText(e.target.value)}
              />
            </div>
            {hasPermission(PAGE_PERMISSION_LIST, "create") && (
              <div className="w-full md:w-1/3 md:flex-grow lg:flex-grow xl:flex-grow">
                <Button onClick={toggleDrawer} className="w-full rounded-md h-12">
                  Add Permission
                </Button>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {loading ? (
        <Loading loading={loading} />
      ) : (
        <TableContainer className="mb-8 rounded-b-lg">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>ID</TableCell>
                <TableCell>Permission Name</TableCell>
                <TableCell>Service Type</TableCell>
                <TableCell>Request Type</TableCell>
                <TableCell>End Point</TableCell>
                <TableCell>Status</TableCell>
                {hasPermission(PAGE_PERMISSION_LIST, "update") && <TableCell>Actions</TableCell>}
              </tr>
            </TableHeader>
            <PermissionsTable permissions={dataTable} onUpdate={setUpdate} />
          </Table>
          <TableFooter>
            <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              onChange={handleChangePage}
              label="Table navigation"
            />
          </TableFooter>
        </TableContainer>
      )}
    </>
  );
};

export default Permissions;
