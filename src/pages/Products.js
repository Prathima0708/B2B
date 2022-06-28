import {
  Button,
  Card,
  CardBody,
  Input,
  Label,
  Pagination,
  Select,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
} from "@windmill/react-ui";
import React, { useEffect, useState } from "react";
import ReactSelect, { components } from "react-select";
import hasPermission, {
  PAGE_PRODUCTS_LIST,
  PAGE_PRODUCT_ADD,
} from "../components/login/hasPermission";

import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import Loading from "../components/preloader/Loading";
import NotFound from "../components/table/NotFound";
import PageTitle from "../components/Typography/PageTitle";
import ProductTable from "../components/product/ProductTable";
import apiService from "../utils/apiService";
import { notifyError } from "../utils/toast";
import useWindowDimensions from "../hooks/useWindowDimensions";

const Products = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfProducts, setNumberOfProducts] = useState(0);
  const [brandsSelected, setBrandsSelected] = useState([]);
  const [categorySelected, setCategorySelected] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [update, setUpdate] = useState(false);
  const pageSizeOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const [currentPageSize, setCurrentPageSize] = useState(pageSizeOptions[1]);

  const [filterText, setFilterText] = useState("");
  const [categoryLess, setCategoryLess] = useState("ALL");
  const [deleted, setDeleted] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);

  const { height, width } = useWindowDimensions();
  const [showFilters, setShowFilters] = useState(width < 700 ? false : true);
  useEffect(() => {
    console.log(height, width);
    if (width < 700) {
      setShowFilters(false);
    } else {
      setShowFilters(true);
    }
  }, [height, width]);
  useEffect(async () => {
    setLoading(true);
    await apiService
      .get("b2b", `/brands`)
      .then(({ data }) =>
        setBrandList(
          data.result.map(({ id, name }) => ({ value: id, label: name }))
        )
      )
      .catch(() => notifyError("Unable to get all brands"));

    await apiService
      .get("b2b", `/categories`)
      .then(({ data }) =>
        setCategoryList(
          data.result.map(({ id, name }) => ({ value: id, label: name }))
        )
      )
      .catch(() => notifyError("Unable to get all categories"));
    setLoading(false);
  }, []);
  useEffect(async () => {
    setFilterLoading(true);
    const params = {
      page: currentPage - 1,
      size: 2,
      sort: "id",
    };
    if (brandsSelected.length > 0)
      params.brandIds = brandsSelected.map(({ value }) => value).join(",");
    if (categorySelected.length > 0)
      params.categoryIds = categorySelected.map(({ value }) => value).join(",");
    if (filterText.length > 0) params.searchQuery = filterText;
    if (categoryLess !== "ALL") params.categoryless = categoryLess;
    if (deleted !== "ALL") params.isDeleted = deleted;
    await apiService.get("b2b", `/products`, params).then((data) => {
      console.log(data.data.result.totalElements);
      setData(data.data.result.content);
      setNumberOfProducts(data.data.result.totalElements);
    });
    setFilterLoading(false);
  }, [currentPage, currentPageSize, update]);
  useEffect(() => console.log(numberOfProducts), [numberOfProducts]);
  const handleBrandSelect = (selected) => {
    setBrandsSelected(selected);
  };

  const handleCategorySelect = (selected) => {
    setCategorySelected(selected);
  };

  const Option = (props) => {
    return (
      <div>
        <components.Option {...props}>
          <input
            type="checkbox"
            checked={props.isSelected}
            onChange={() => null}
          />
          <label>{props.label}</label>
        </components.Option>
      </div>
    );
  };

  return (
    <>
      <PageTitle>Products</PageTitle>
      {showFilters && (
        <div className="flex flex-col justify-between flex-wrap ">
          <div className="flex flex-col md:flex-row gap-2">
            <Label className="w-full flex-grow">
              <span>Select Brands</span>
              <ReactSelect
                options={brandList}
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                components={{
                  Option,
                }}
                onChange={handleBrandSelect}
                allowSelectAll={true}
                value={brandsSelected}
              />
            </Label>
            <Label className="w-full flex-grow">
              <span>Select Categories</span>
              <ReactSelect
                options={categoryList}
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                components={{
                  Option,
                }}
                onChange={handleCategorySelect}
                allowSelectAll={true}
                value={categorySelected}
              />
            </Label>
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <Label className="w-full my-1 flex-grow">
              <span>Category Status</span>
              <Select
                onChange={(e) => setCategoryLess(e.target.value)}
                className=" border h-12 text-sm focus:outline-none block  bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                name="categoryLess"
                value={categoryLess}
              >
                <option value="ALL">All products</option>
                <option value={false}>Products mapped to categories</option>
                <option value={true}>Products not mapped to categories</option>
              </Select>
            </Label>
            <Label className="w-full  my-1 flex-grow">
              <span>Active Status</span>
              <Select
                onChange={(e) => setDeleted(e.target.value)}
                className="  border h-12 text-sm focus:outline-none block  bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                name="deleted"
                value={deleted}
              >
                <option value="ALL">All products</option>
                <option value={false}>Non Deleted Products</option>
                <option value={true}>Deleted Products</option>
              </Select>
            </Label>
            <Label className="w-full  my-1 flex-grow ">
              <span>Products Per Page</span>
              <Select
                onChange={(e) => {
                  setCurrentPageSize(e.target.value);
                }}
                value={currentPageSize}
                className="border h-12 text-sm focus:outline-none block bg-gray-100 border-transparent focus:bg-white"
              >
                {pageSizeOptions.map((opt) => (
                  <option value={opt}>{opt}</option>
                ))}
              </Select>
            </Label>
          </div>
          <Label className=" min-w-64 my-1 flex-grow ">
            <span>Filter By Name</span>
            <Input
              className="border mr-1 h-8 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
              label="Filter"
              name="filterText"
              placeholder="Search products by name"
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </Label>
        </div>
      )}
      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 my-5">
        <CardBody>
          <div className="py-3 flex flex-col md:flex-row gap-2">
            {hasPermission(PAGE_PRODUCT_ADD, "create") && (
              <div className="w-full">
                <Link to="/products/add">
                  <Button className="w-full rounded-md h-12">
                    <span className="mr-3">
                      <FiPlus />
                    </span>
                    Add Product
                  </Button>
                </Link>
              </div>
            )}
            {showFilters ? (
              <>
                {filterLoading ? (
                  <Loading loading={filterLoading} />
                ) : (
                  <Button
                    className="w-full rounded-md h-12"
                    onClick={() => {
                      setUpdate(!update);
                    }}
                  >
                    Apply Filters
                  </Button>
                )}
              </>
            ) : (
              <Button
                onClick={() => setShowFilters(true)}
                className="w-full rounded-md h-12"
              >
                Filter Store Products
              </Button>
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
                <TableCell>Image</TableCell>
                <TableCell>Product name</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>Tags</TableCell>
                {hasPermission(PAGE_PRODUCTS_LIST, "delete") && (
                  <TableCell className="text-center">Deleted</TableCell>
                )}
              </tr>
            </TableHeader>
            <ProductTable products={data} onUpdate={setUpdate} />
          </Table>
          <TableFooter>
            <Pagination
              totalResults={numberOfProducts}
              resultsPerPage={currentPageSize}
              onChange={(e) => setCurrentPage(e)}
              label="Table navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Product" />
      )}
    </>
  );
};

export default Products;
