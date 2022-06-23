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
import hasPermission, { PAGE_CATEGORY_LIST } from "../components/login/hasPermission";

import CategoryDrawer from "../components/drawer/CategoryDrawer";
import CategoryTable from "../components/category/CategoryTable";
import { FiPlus } from "react-icons/fi";
import Loading from "../components/preloader/Loading";
import MainDrawer from "../components/drawer/MainDrawer";
import NotFound from "../components/table/NotFound";
import PageTitle from "../components/Typography/PageTitle";
import { SidebarContext } from "../context/SidebarContext";
import apiService from "../utils/apiService";
import useFilter from "../hooks/useFilter";

const Category = () => {
  const { toggleDrawer, isUpdate } = useContext(SidebarContext);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filterText, setFilterText] = useState("");
  const { handleChangePage, resultsPerPage, totalResults, dataTable } = useFilter(filteredCategories);

  useEffect(() => {
    setFilteredCategories(
      categories.filter((cat) => cat.name.toLowerCase().includes(filterText.toLowerCase()))
    );
  }, [filterText]);

  const getCategories = async () => {
    setLoading(true);
    await apiService
      .get("b2b", "/categories")
      .then((data) => {
        setCategories([...data.data.result.sort((a, b) => (a.id < b.id ? -1 : 1))]);
        setFilteredCategories([...data.data.result.sort((a, b) => (a.id < b.id ? -1 : 1))]);
      })
      .catch((err) => console.log("Unable to get all category"));
    setLoading(false);
  };
  useEffect(() => {
    getCategories();
  }, [isUpdate]);
  return (
    <>
      <PageTitle>Category</PageTitle>
      <MainDrawer>
        <CategoryDrawer />
      </MainDrawer>
      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <div className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex">
            <div className="w-full md:w-1/2 md:flex-grow lg:flex-grow xl:flex-grow">
              <Input
                className="w-full rounded-md h-12"
                aria-label="Bad"
                placeholder="Search Category"
                onChange={(e) => setFilterText(e.target.value)}
              />
            </div>
            {hasPermission(PAGE_CATEGORY_LIST, "create") && (
              <div className="w-full md:w-1/2 md:flex-grow lg:flex-grow xl:flex-grow ">
                <Button onClick={toggleDrawer} className="w-full rounded-md h-12">
                  <span className="mr-3">
                    <FiPlus />
                  </span>
                  Add Category
                </Button>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {loading ? (
        <Loading loading={loading} />
      ) : categories.length !== 0 ? (
        <TableContainer className="mb-8">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>ID</TableCell>
                <TableCell>ICON</TableCell>
                <TableCell>RANK</TableCell>
                <TableCell>NAME</TableCell>
                <TableCell>SUB CATEGORIES</TableCell>
                {(hasPermission(PAGE_CATEGORY_LIST, "update") ||
                  hasPermission(PAGE_CATEGORY_LIST, "delete")) && <TableCell>ACTIONS</TableCell>}
              </tr>
            </TableHeader>
            <CategoryTable categories={dataTable} />
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
        <NotFound title="Category" />
      )}
    </>
  );
};

export default Category;
