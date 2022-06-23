/* eslint-disable react-hooks/exhaustive-deps */

import "./product.css";

import {
  Avatar,
  Button,
  Input,
  Label,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHeader,
  TableRow,
} from "@windmill/react-ui";
import { FiEdit, FiEye, FiTrash2 } from "react-icons/fi";
import { Link, useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import ReactSelect, { components } from "react-select";
import hasPermission, { PAGE_MY_STORE_PRODUCT } from "../../components/login/hasPermission";
import { notifyError, notifySuccess } from "../../utils/toast";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { FiSave } from "react-icons/fi";
import { GET_PRODUCT_LIST_OF_STORE_URL } from "./constants";
import PageTitle from "../../components/Typography/PageTitle";
import Switch from "react-switch";
import apiService from "../../utils/apiService";
import useWindowDimensions from "../../hooks/useWindowDimensions";

function MyProduct(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [flg, setFlg] = useState(1);
  const [filter, setFilter] = useState("");
  const [update, setUpdate] = useState(false);
  const [storeProducts, setStoreProducts] = useState([]);
  const [brandsSelected, setBrandsSelected] = useState(null);
  const [categorySelected, setCategorySelected] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [filterText, setFilterText] = useState("");
  const history = useHistory();
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
  const handleBrandSelect = (selected) => {
    setBrandsSelected(selected);
  };

  const handleCategorySelect = (selected) => {
    setCategorySelected(selected);
  };

  useEffect(() => {}, [brandList, categoryList]);

  useEffect(async () => {
    await apiService
      .get("b2b", `/brands`)
      .then(({ data }) => setBrandList(data.result.map(({ id, name }) => ({ value: id, label: name }))))
      .catch((err) => notifyError("Unable to get all brands"));

    await apiService
      .get("b2b", `/categories`)
      .then(({ data }) => setCategoryList(data.result.map(({ id, name }) => ({ value: id, label: name }))))
      .catch((err) => notifyError("Unable to get all categories"));
  }, []);

  const getProductList = () => {
    setIsLoading(true);
    apiService
      .get("b2b", `${GET_PRODUCT_LIST_OF_STORE_URL}${filter}`, {
        "x-store-id": props.storeSelected,
      })
      .then((response) => {
        if (response) {
          setIsLoading(false);
          const { result: products } = response.data;
          const sp = [];
          products
            .sort((a, b) => (a.product.id > b.product.id ? 1 : -1))
            .forEach((product, i) => {
              const { variants } = product.product;
              variants
                .sort((c, d) => (c.variant.id > d.variant.id ? 1 : -1))
                .forEach((variant) =>
                  sp.push({
                    image: product.product.thumbnailImage,
                    productBrand: product.product.brand.name,
                    productBrandId: product.product.brand.id,
                    mappingId: variant.storeProductVariantMapId,
                    productId: product.product.id,
                    productName: product.product.name,
                    variantId: variant.variant.id,
                    name: variant.variant.name,
                    marketPrice: variant.variant.marketPrice,
                    sellerPrice: variant.price,
                    originalSellerPrice: variant.price,
                    active: variant.active,
                    inStock: variant.inStock,
                    storeId: product.storeId,
                    background:
                      i % 2 === 0
                        ? "bg-cool-gray-200 dark:bg-cool-gray-800"
                        : "bg-cool-gray-300 dark:bg-cool-gray-900",
                  })
                );
            });
          setStoreProducts(sp);
        } else {
          setIsLoading(false);
          setData([]);
        }
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => [update]);

  useEffect(() => {
    getProductList();
  }, [props.storeSelected]);

  const handleApplyFilters = () => {
    if (filter && brandsSelected && categorySelected && filterText) return;

    const bids = brandsSelected && brandsSelected.map(({ value }) => value).join(",");
    const cids = categorySelected && categorySelected.map(({ value }) => value).join(",");

    apiService
      .get("b2b", `${GET_PRODUCT_LIST_OF_STORE_URL}`, {
        "x-store-id": props.storeSelected,
        "is-active": filter,
        categoryIds: cids,
        brandIds: bids,
        searchQuery: filterText,
      })
      .then((response) => {
        if (response) {
          setIsLoading(false);
          const { result: products } = response.data;
          const sp = [];
          products
            .sort((a, b) => (a.product.id > b.product.id ? 1 : -1))
            .forEach((product, i) => {
              const { variants } = product.product;
              variants
                .sort((c, d) => (c.variant.id > d.variant.id ? 1 : -1))
                .forEach((variant) =>
                  sp.push({
                    image: product.product.thumbnailImage,
                    productBrand: product.product.brand.name,
                    productBrandId: product.product.brand.id,
                    mappingId: variant.storeProductVariantMapId,
                    productId: product.product.id,
                    productName: product.product.name,
                    variantId: variant.variant.id,
                    name: variant.variant.name,
                    marketPrice: variant.variant.marketPrice,
                    sellerPrice: variant.price,
                    originalSellerPrice: variant.price,
                    active: variant.active,
                    inStock: variant.inStock,
                    storeId: product.storeId,
                    background:
                      i % 2 === 0
                        ? "bg-cool-gray-200 dark:bg-cool-gray-800"
                        : "bg-cool-gray-300 dark:bg-cool-gray-900",
                  })
                );
            });
          setStoreProducts(sp);
        } else {
          setIsLoading(false);
          setData([]);
        }
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const toggleActive = async (storeId, productId, variantId, active) => {
    let payload = { productId, variantId, active };
    setIsLoading(true);
    await apiService
      .put("b2b", `/store-product/toggle-active`, payload, {
        params: {
          "x-store-id": storeId,
        },
      })
      .then(() => {
        setIsLoading(false);
        getProductList();
        notifySuccess(`Product status set to ${active ? "Active" : "Inactive"}`);
      })
      .catch(() => {
        setIsLoading(false);
        notifyError("Something went wrong!!");
      });
  };

  const toggleInStock = async (storeId, productId, variantId, inStock, price) => {
    let payload = { productId, variantId, inStock, price };
    setIsLoading(true);
    await apiService
      .post("b2b", "/store-product/edit-stock-price", payload, {
        params: {
          "x-store-id": storeId,
        },
      })
      .then(() => {
        setIsLoading(false);
        getProductList();
        notifySuccess("Product status changes");
      })
      .catch((e) => {
        setIsLoading(false);
        notifyError("Something went wrong!!");
      });
  };

  const updateSellerPrice = async (storeId, productId, variantId, inStock, price) => {
    let payload = { productId, variantId, inStock, price };
    setIsLoading(true);
    await apiService
      .post("b2b", "/store-product/edit-stock-price", payload, {
        params: {
          "x-store-id": storeId,
        },
      })
      .then(() => {
        setIsLoading(false);
        getProductList();
        notifySuccess("Seller price updated");
      })
      .catch((e) => {
        setIsLoading(false);
        console.log(e.response.data.errorMessage);
        notifyError(e.response.data.errorMessage || "Something went wrong!!");
      });
  };

  const Option = (props) => {
    return (
      <div>
        <components.Option {...props}>
          <input type="checkbox" checked={props.isSelected} onChange={() => null} />
          <label>{props.label}</label>
        </components.Option>
      </div>
    );
  };

  return (
    <>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <PageTitle>My Store Products</PageTitle>
      {showFilters ? (
        <>
          <div className="flex flex-col justify-between flex-wrap ">
            <div className="flex flex-col md:flex-row gap-2">
              <Label className="w-full flex-grow">
                <span>Active Status</span>
                <Select value={filter} onChange={(e) => setFilter(e.target.value)} name="filter">
                  <option value="">All Products</option>
                  <option value="true">Active Products</option>
                  <option value="false">Inactive Products</option>
                </Select>
              </Label>
              <Label className="w-full flex-grow">
                <span>Filter By Name</span>
                <Input
                  className="border mr-1 h-8 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                  label="Filter"
                  name="filterText"
                  placeholder="Search product by name"
                  type="text"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
              </Label>
            </div>
            <div className="flex flex-col my-1 md:flex-row gap-2">
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
          </div>
          <Button onClick={handleApplyFilters} className="  min-w-64 my-2 flex-grow">
            Apply Filters
          </Button>
        </>
      ) : (
        <Button onClick={() => setShowFilters(true)} className="  min-w-64 my-2 flex-grow">
          Filter Store Products
        </Button>
      )}

      <TableContainer className="w-3/5 rounded-b-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Image</TableCell>
              <TableCell>Brand (ID)</TableCell>
              <TableCell>Product Name (ID)</TableCell>
              <TableCell>Variant Name (ID)</TableCell>
              <TableCell>Market Price</TableCell>
              <TableCell>Seller Price</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>In Stock</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {storeProducts.map(
              (
                {
                  mappingId,
                  image,
                  productBrand,
                  productBrandId,
                  productId,
                  productName,
                  variantId,
                  name,
                  marketPrice,
                  sellerPrice,
                  originalSellerPrice,
                  active,
                  inStock,
                  storeId,
                  background,
                },
                i
              ) => (
                <TableRow
                  key={mappingId}
                  className={`${background} cursor-pointer`}
                  onClick={() => history.push(`/products/${productId}`)}
                >
                  <TableCell>
                    <Avatar
                      className="mr-3 md:block bg-gray-50 p-1"
                      src={
                        image
                          ? image
                          : "https://5.imimg.com/data5/SELLER/Default/2021/5/GH/WC/ZY/127199812/fresh-mango-fruits-500x500.jpg"
                      }
                      alt=""
                    />
                  </TableCell>
                  <TableCell>{`${productBrand} (${productBrandId})`}</TableCell>
                  <TableCell>{`${productName} (${productId})`}</TableCell>
                  <TableCell>{`${name} (${variantId})`}</TableCell>
                  <TableCell>{marketPrice}</TableCell>
                  <TableCell className=" cursor-default" onClick={(e) => e.stopPropagation()}>
                    <div className="flex flex-row ">
                      <Input
                        disabled={hasPermission(PAGE_MY_STORE_PRODUCT, "update") ? false : true}
                        className="border mr-1 h-8 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                        label=" Seller Price"
                        name="sellerPrice"
                        type="text"
                        value={sellerPrice}
                        onChange={(e) =>
                          setStoreProducts((prevData) => {
                            prevData[i].sellerPrice = e.target.value.replace(/[^0-9]/gi, "");
                            return [...prevData];
                          })
                        }
                      />
                      {hasPermission(PAGE_MY_STORE_PRODUCT, "update") && (
                        <FiSave
                          className={`ml-1  self-center ${
                            originalSellerPrice == sellerPrice
                              ? ` to-gray-600 text-2xl`
                              : `text-green-500 cursor-pointer text-3xl`
                          }`}
                          onClick={() => {
                            if (originalSellerPrice === sellerPrice) return;
                            updateSellerPrice(storeId, productId, variantId, inStock, Number(sellerPrice));
                          }}
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className=" cursor-default" onClick={(e) => e.stopPropagation()}>
                    <Switch
                      className=""
                      disabled={hasPermission(PAGE_MY_STORE_PRODUCT, "updateStatus") ? false : true}
                      offColor="#f05252"
                      checkedIcon={false}
                      uncheckedIcon={false}
                      onChange={(e) => {
                        toggleActive(storeId, productId, variantId, e);
                      }}
                      checked={active != null ? active : true}
                    />
                  </TableCell>
                  <TableCell className=" cursor-default" onClick={(e) => e.stopPropagation()}>
                    <Switch
                      disabled={hasPermission(PAGE_MY_STORE_PRODUCT, "update") ? false : true}
                      className=""
                      onColor="#ACB992"
                      checkedIcon={true}
                      uncheckedIcon={true}
                      onChange={(e) => {
                        toggleInStock(storeId, productId, variantId, e, sellerPrice);
                      }}
                      checked={inStock != null ? inStock : true}
                    />
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default MyProduct;
