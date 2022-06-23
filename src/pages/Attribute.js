import {
  Button,
  Card,
  CardBody,
  Pagination,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
} from "@windmill/react-ui";
import React, { useContext, useEffect, useState } from "react";
import hasPermission, {
  PAGE_SCHEMA_LIST,
} from "../components/login/hasPermission";

import AttributeDrawer from "../components/drawer/AttributeDrawer";

import AttributeTable from "../components/Attribute/AttributeTable";
import { FiPlus } from "react-icons/fi";
import Loading from "../components/preloader/Loading";
import MainDrawer from "../components/drawer/MainDrawer";
import NotFound from "../components/table/NotFound";
import PageTitle from "../components/Typography/PageTitle";
import { SidebarContext } from "../context/SidebarContext";
import apiService from "../utils/apiService";

import useFilter from "../hooks/useFilter";

const Attribute = () => {
  const { toggleDrawer, isUpdate } = useContext(SidebarContext);
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { handleChangePage } = useFilter(attributes);
  useEffect(async () => {
    setLoading(true);
    await apiService
      .get("b2b", "/schema")
      .then((data) => setAttributes([...data.data.result]))
      .catch(() => console.log("Unable to get all attributes"));
    setLoading(false);
  }, [isUpdate]);
  return (
    <>
      <PageTitle>Attribute</PageTitle>
      <MainDrawer>
        <AttributeDrawer />
      </MainDrawer>
      {hasPermission(PAGE_SCHEMA_LIST, "create") && (
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <CardBody>
            <div className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex">
              <div
                className="w-full md:w-56 lg:w-56 xl:w-56"
                style={{ width: "100%" }}
              >
                <Button
                  onClick={toggleDrawer}
                  className="w-full rounded-md h-12"
                >
                  <span className="mr-3">
                    <FiPlus />
                  </span>
                  Add Attribute
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {loading ? (
        <Loading loading={loading} />
      ) : attributes.length !== 0 ? (
        <TableContainer className="mb-8">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Data Type</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Hidden</TableCell>
                <TableCell>Mandatory</TableCell>
                {(hasPermission(PAGE_SCHEMA_LIST, "update") ||
                  hasPermission(PAGE_SCHEMA_LIST, "delete")) && (
                  <TableCell>Actions</TableCell>
                )}
              </tr>
            </TableHeader>
            <AttributeTable
              attributes={attributes.sort((a, b) => (a.id < b.id ? -1 : 1))}
            />
          </Table>
          <TableFooter>
            <Pagination
              totalResults={attributes.length}
              resultsPerPage={10}
              onChange={handleChangePage}
              label="Table navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Attribute" />
      )}
    </>
  );
};

export default Attribute;
