/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import {
  Avatar,
  Input,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
  TableRow,
} from "@windmill/react-ui";
import { GET_PRODUCT_LIST_OF_STORE_URL, GET_PRODUCT_LIST_URL } from "./constants";
import React, { useEffect, useState } from "react";
import hasPermission, { PAGE_ADD_PRODUCT_TO_STORE } from "../../components/login/hasPermission";
import { notifyError, notifySuccess } from "../../utils/toast";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { FiSave } from "react-icons/fi";
import PageTitle from "../../components/Typography/PageTitle";
import apiService from "../../utils/apiService";
import axios from "axios";
import { useHistory } from "react-router-dom";

function AddProductStore(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [numberOfProducts, setNumberOfProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [productsToAdd, setProductsToAdd] = useState([]);

  const [update, setUpdate] = useState(true);
  useEffect(() => console.log(productsToAdd), [productsToAdd]);
  useEffect(async () => {
    setIsLoading(true);
    await axios
      .get(
        `https://b2b.baqaala.com/core/api/v1/store-product/to-add?page=${
          currentPage - 1
        }&size=${currentPageSize}`
      )
      .then(({ data }) => {
        setProductsToAdd(
          data.content
            .filter((prod) => prod.variants?.length > 0)
            .sort((a, b) => (a.id > b.id ? 1 : -1))
            .map((product, i) => {
              const { variants } = product;
              return variants
                .sort((c, d) => (c.id > d.id ? 1 : -1))
                .map((variant) => {
                  return {
                    image: product.thumbnailImage,
                    productName: product.name,
                    productId: product.id,
                    productBrand: product.brand.name,
                    productBrandId: product.brand.id,
                    variantName: variant.name,
                    variantId: variant.id,
                    marketPrice: variant.marketPrice,
                    background:
                      i % 2 === 0
                        ? "bg-cool-gray-200 dark:bg-cool-gray-800"
                        : "bg-cool-gray-300 dark:bg-cool-gray-900",
                  };
                });
            })
            .flat()
        );
        setNumberOfProducts(data.totalElements);
      })
      .catch((err) => setIsLoading(false));
    setIsLoading(false);
  }, [props.storeSelected, update, currentPage]);
  const addProductToStore = async (productId, variantId, price) => {
    let payload = {
      productId,
      variantId,
      inStock: true,
      price,
      discount: 0,
      requestId: `${Date.now()}`,
    };

    setIsLoading(true);
    await apiService
      .post(
        "b2b",
        `${GET_PRODUCT_LIST_OF_STORE_URL}?storeType=${
          process.env.REACT_APP_PRODUCT_ENV === "B2C" ? "SELLER" : "SUPPLIER"
        }`,
        payload
      )
      .then((response) => {
        notifySuccess("Product successfully added to store");
        setUpdate(!update);
      })
      .catch((e) => {
        setIsLoading(false);
        notifyError(e.response.data.errorMessage);
      });
  };
  const history = useHistory();

  return (
    <>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <PageTitle>Add Product to Store</PageTitle>
      <p className=" text-gray-700 dark:text-gray-300 text-xs -mt-6">
        **Only products mapped to category are shown
      </p>
      <TableContainer className="mb-8 mt-8 rounded-b-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Image</TableCell>
              <TableCell>Brand (ID)</TableCell>
              <TableCell>Product Name (ID)</TableCell>
              <TableCell>Variant Name (ID)</TableCell>
              <TableCell>Market Price</TableCell>
              {hasPermission(PAGE_ADD_PRODUCT_TO_STORE, "create") && <TableCell>Selling Price</TableCell>}
            </tr>
          </TableHeader>
          <TableBody>
            {productsToAdd.map(
              (
                {
                  image,
                  productName,
                  productId,
                  productBrand,
                  productBrandId,
                  variantName,
                  variantId,
                  marketPrice,
                  background,
                  sellingPrice = "",
                },
                i
              ) => (
                <TableRow
                  key={variantId}
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
                  <TableCell>{`${productName}  (${productId})`}</TableCell>
                  <TableCell>{`${variantName}  (${variantId})`}</TableCell>
                  <TableCell>{marketPrice}</TableCell>
                  {hasPermission(PAGE_ADD_PRODUCT_TO_STORE, "create") && (
                    <TableCell className=" cursor-default" onClick={(e) => e.stopPropagation()}>
                      <div className="flex flex-row ">
                        <Input
                          className="border mr-1 h-8 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                          label=" Selling Price"
                          name="sellingPrice"
                          type="number"
                          value={sellingPrice}
                          onChange={(e) =>
                            setProductsToAdd((prevData) => {
                              prevData[i].sellingPrice = e.target.value;
                              return [...prevData];
                            })
                          }
                        />
                        <FiSave
                          className={`ml-1  self-center ${
                            sellingPrice === ""
                              ? "to-gray-600 text-2xl"
                              : "text-green-500 cursor-pointer text-3xl"
                          }`}
                          onClick={() => {
                            if (sellingPrice === "") return;
                            addProductToStore(productId, variantId, Number(sellingPrice));
                          }}
                        />
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              )
            )}
          </TableBody>
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
    </>
  );
}

export default AddProductStore;
