import {
  Button,
  Card,
  CardBody,
  Input,
  Pagination,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
} from "@windmill/react-ui";
import React, { useContext, useEffect, useState } from "react";
import hasPermission, {
  PAGE_ROLES_LIST,
} from "../../components/login/hasPermission";

import { FiPlus } from "react-icons/fi";
import Loading from "../../components/preloader/Loading";
import NotFound from "../../components/table/NotFound";
import PageTitle from "../../components/Typography/PageTitle";
import RolesTable from "./RolesTable";
import { SidebarContext } from "../../context/SidebarContext";
import apiService from "../../utils/apiService";
import useFilter from "../../hooks/useFilter";

const loading = false;

const Roles = () => {
  const { toggleDrawer } = useContext(SidebarContext);

  const [data, setData] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [update, setUpdate] = useState(false);
  const { handleChangePage, resultsPerPage, totalResults, dataTable } =
    useFilter(filteredRoles, 10);

  useEffect(() => {
    apiService.get("user_service", "/roles", null).then((res) => {
      const roleData = res.data.map(
        (role) =>
          (role = {
            ...role,
            children: role.description
              ? role.description
              : "Please update rolePlease update rolePlease update rolePlease update role",
          })
      );
      setData(roleData);
    });
  }, [update]);

  useEffect(() => {
    setFilterText((prevData) => prevData);
    if (filterText.length === 0) return setFilteredRoles(data);
    setFilteredRoles(
      data.filter((ap) =>
        ap.name.toLowerCase().includes(filterText.toLowerCase())
      )
    );
  }, [data, filterText]);

  return (
    <>
      <PageTitle>Roles & Permissions</PageTitle>
      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <div className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex">
            <div className="md:w-2/3 md:flex-grow lg:flex-grow xl:flex-grow">
              <Input
                className="w-full rounded-md h-12"
                aria-label="Bad"
                placeholder="Search Roles"
                onChange={(e) => setFilterText(e.target.value)}
              />
            </div>
            {hasPermission(PAGE_ROLES_LIST, "create") && (
              <div className="md:w-1/3 md:flex-grow lg:flex-grow xl:flex-grow">
                <Button
                  onClick={toggleDrawer}
                  className="w-full rounded-md h-12"
                >
                  <span className="mr-3">
                    <FiPlus />
                  </span>
                  Add Roles
                </Button>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {loading ? (
        <Loading loading={loading} />
      ) : data.length !== 0 ? (
        <TableContainer className="mb-8 rounded-b-lg">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>ID</TableCell>
                <TableCell>Role Key</TableCell>
                <TableCell>Role Name</TableCell>
                <TableCell>Status</TableCell>
                {hasPermission(PAGE_ROLES_LIST, "update") && (
                  <TableCell>Actions</TableCell>
                )}
              </tr>
            </TableHeader>
            <RolesTable rolesData={dataTable} onUpdate={setUpdate} />
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
      ) : (
        <NotFound title="Roles and Permissions" />
      )}
    </>
  );
};

export default Roles;
