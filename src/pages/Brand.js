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
import hasPermission, { PAGE_BRAND_LIST } from "../components/login/hasPermission";

import BrandDrawer from "../components/drawer/BrandDrawer";
import BrandTable from "../components/brand/BrandTable";
import { FiPlus } from "react-icons/fi";
import Loading from "../components/preloader/Loading";
import MainDrawer from "../components/drawer/MainDrawer";
import NotFound from "../components/table/NotFound";
import PageTitle from "../components/Typography/PageTitle";
import { SidebarContext } from "../context/SidebarContext";
import apiService from "../utils/apiService";
import useFilter from "../hooks/useFilter";

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toggleDrawer, isUpdate } = useContext(SidebarContext);
  const [filterText, setFilterText] = useState("");
  const [filteredBrands, setFilteredBrands] = useState([]);
  const { handleChangePage, resultsPerPage, totalResults, dataTable } = useFilter(filteredBrands);
  useEffect(() => {
    setFilteredBrands(brands.filter((brand) => brand.name.toLowerCase().includes(filterText.toLowerCase())));
  }, [filterText]);
  const getBrands = async () => {
    setLoading(true);
    await apiService
      .get("b2b", "/brands")
      .then((data) => {
        setBrands([...data.data.result.sort((a, b) => (a.id < b.id ? -1 : 1))]);
        setFilteredBrands([...data.data.result.sort((a, b) => (a.id < b.id ? -1 : 1))]);
      })
      .catch((err) => console.log("Unable to get all brands"));
    setLoading(false);
  };

  useEffect(() => {
    getBrands();
  }, [isUpdate]);

  return (
    <>
      <PageTitle>Brands</PageTitle>
      <MainDrawer>
        <BrandDrawer />
      </MainDrawer>
      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <div className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex">
            <div className="w-full md:w-1/2 md:flex-grow lg:flex-grow xl:flex-grow">
              <Input
                className="w-full rounded-md h-12"
                aria-label="Bad"
                placeholder="Search Brand"
                onChange={(e) => setFilterText(e.target.value)}
              />
            </div>
            {hasPermission(PAGE_BRAND_LIST, "create") && (
              <div className="w-full md:w-1/2 md:flex-grow lg:flex-grow xl:flex-grow ">
                <Button onClick={toggleDrawer} className="w-full rounded-md h-12">
                  <span className="mr-3">
                    <FiPlus />
                  </span>
                  Add Brand
                </Button>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {loading ? (
        <Loading loading={loading} />
      ) : brands.length !== 0 ? (
        <TableContainer className="mb-8">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>ID</TableCell>
                <TableCell>Icon</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                {(hasPermission(PAGE_BRAND_LIST, "update") || hasPermission(PAGE_BRAND_LIST, "delete")) && (
                  <TableCell>Actions</TableCell>
                )}
              </tr>
            </TableHeader>
            <BrandTable brands={dataTable} />
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
        <NotFound title="Brand" />
      )}
    </>
  );
};

export default Brand;
