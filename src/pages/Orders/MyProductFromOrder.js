import "./orders.css";

import {
  Avatar,
  Button,
  Card,
  CardBody,
  Input,
  Label,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHeader,
  TableRow
} from "@windmill/react-ui";
import { FiEdit, FiEye, FiTrash2 } from "react-icons/fi";
import React, { useEffect, useState } from "react";
import { notifyError, notifySuccess } from "../../utils/toast";
import { useDispatch, useSelector } from "react-redux";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { FiSave } from "react-icons/fi";
import { GET_PRODUCT_LIST_OF_STORE_URL } from "./constants";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import Switch from "react-switch";
import Tooltip from "../../components/tooltip/Tooltip";
import _ from "lodash";
import apiService from "../../utils/apiService";
import axios from "axios";
import { useHistory } from "react-router-dom";

function MyProductFromOrder(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);
  const [flg, setFlg] = useState(1);
  const [filter, setFilter] = useState("");
  const [update, setUpdate] = useState(false);
  const [storeProducts, setStoreProducts] = useState([]);
  const property = useSelector((state) => {
    return state;
  });


  const getProductList = () => {
    setIsLoading(true);
    apiService
      .get("b2b", `${GET_PRODUCT_LIST_OF_STORE_URL}${filter}`, {
        "x-store-id": props.storeSelected,
      })
      .then((response) => {
        if (response) {
          const priceState = [];
          setIsLoading(false);
          setData(response.data.result.sort((a, b) => (a.product.id > b.product.id ? 1 : -1)));
          response.data.result.forEach((product) =>
            product.product.variants.forEach((variant) =>
              priceState.push({
                variantId: variant.variant.id,
                sellerPrice: variant.price,
                edit: true,
              })
            )
          );

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
                    image: product.product.resources.find((res) => res.titleName === 'thumbnail_image')?.enValue,
                    mappingId: variant.storeProductVariantMapId,
                    productId: product.product.id,
                    productName: product.product.name,
                    variantId: variant.variant.id,
                    name: variant.variant.name,
                    mrp: variant.variant.resources.find((res) => res.titleName === 'market_price').enValue,
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
  useEffect(() => getProductList, [update]);

  useEffect(() => {
    getProductList();
  }, [props.storeSelected, filter]);

  useEffect(() => {
  }, [storeProducts]);

  const toggleActive = async (storeId, productId, variantId, active) => {
    let payload = { productId, variantId, active };
    setIsLoading(true);
    await apiService
      .put('b2b',`/store-product/toggle-active`, payload, {
        params: {
          "x-store-id": storeId,
        },
      })
      .then(() => {
        setIsLoading(false);
        closeModal();
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
      .post('b2b',"/store-product/edit-stock-price", payload, {
        params: {
          "x-store-id": storeId,
        },
      })
      .then(() => {
        setIsLoading(false);
        closeModal();
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
      .post('b2b',"/store-product/edit-stock-price", payload, {
        params: {
          "x-store-id": storeId,
        },
      })
      .then(() => {
        setIsLoading(false);
        closeModal();
        getProductList();
        notifySuccess("Seller price updated");
        // setUpdate(!update);
      })
      .catch((e) => {
        setIsLoading(false);
        notifyError("Something went wrong!!");
      });
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  function openModal() {
    setIsModalOpen(true);
  }
  function closeModal() {
    setIsModalOpen(false);
    setProductStockPrice(null);
  }

  const [productStockPrice, setProductStockPrice] = useState(null);

  const variantisPresent = (variantId) => {
    if(property.user.myOrder !=null){
      let myOrder = property.user.myOrder.orderItems;
      let flag = _.find(myOrder, { variantId })
      if (flag)
        return "hidden"
      else
        return "";
    } else {
      return "";
    }
    
  }

  const dispatch = useDispatch();
  const history = useHistory();

  return (
    <>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Grid container className="mb-4">
        <Grid item md={12} sm={12} xs={12} className="pt-1">
          <Grid container spacing={3} className="mt-4">
            <Grid item md={12} sm={12} xs={12} className="">
              <h2 className="text-gray-500 dark:text-white text-lg">{"My Products Edit"}</h2>
            </Grid>
          </Grid>
          <Grid container spacing={3} className="pt-4">
            <Grid item md={4} sm={4} xs={12} className="">
              <Label>
                <span>Search</span>
                <Input className="mt-1" />
              </Label>
            </Grid>
            <Grid item md={4} sm={4} xs={12} className="">
              <Label>
                <span>Filters</span>
                <Select className="mt-1" value={filter} onChange={(e) => setFilter(e.target.value)} name="filter">
                  <option value="">All Products</option>
                  <option value="?is-active=true">Active Products</option>
                  <option value="?is-active=false">Inactive Products</option>
                </Select>
              </Label>
            </Grid>

            
          </Grid>
          <Grid container spacing={3} className="mt-4">
            <Grid item md={12} sm={12} xs={12}></Grid>
          </Grid>
          <TableContainer className="mb-8 mt-8 rounded-b-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>Image</TableCell>
                  
                  <TableCell>Variant ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>MRP</TableCell>
                  <TableCell>Seller Price</TableCell>
                  <TableCell>Qty</TableCell>
                  <TableCell>Total Price</TableCell>
                  <TableCell>Action</TableCell>
                </tr>
              </TableHeader>
              <TableBody>
                {storeProducts.map(
                  (
                    prod,
                    i
                  ) => (
                      <TableRow key={i} className={`${prod.background} ` + variantisPresent(prod.variantId)} >
                        <TableCell>
                          <Avatar
                            className="hidden mr-3 md:block bg-gray-50 p-1"
                            src={
                              prod.image
                                ? prod.image
                                : "https://5.imimg.com/data5/SELLER/Default/2021/5/GH/WC/ZY/127199812/fresh-mango-fruits-500x500.jpg"
                            }
                            alt=""
                          />
                        </TableCell>
                        {/* <TableCell>{prod.productId}</TableCell>
                      <TableCell>{prod.productName}</TableCell> */}
                        <TableCell>{prod.variantId}</TableCell>
                        <TableCell>{prod.name}</TableCell>
                        <TableCell>{prod.mrp}</TableCell>
                        <TableCell>{prod.sellerPrice}</TableCell>
                        <TableCell>
                          <div className="flex flex-row ">
                            <Input
                              className="border mr-1 text-sm focus:outline-none block bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                              label=" Seller Price"
                              name="sellerPrice"
                              type="Number"
                              value={prod.qty ? prod.qty : 0}
                              style={{ width: "4rem" }}
                              onChange={(e) => {
                                let p = storeProducts;
                                p[i].qty = parseInt(e.target.value);
                                setCount(count + 1);
                                setStoreProducts(p);
                              }}
                            />
                          </div>
                        </TableCell>
                        <TableCell>{prod.sellerPrice * (prod.qty ? prod.qty : 0)}</TableCell>
                        <TableCell>
                          <Button type="submit" disabled={!prod.qty || prod.add} onClick={() => {
                            let p = storeProducts;
                            p[i].add = p[i].add ? !p[i].add : true;
                            setCount(count + 1);
                            setStoreProducts(p);

                            // let orderItems = property.user.myOrder.orderItems;
                            let orderItems = property.user.myOrder;
                            orderItems.orderItems.push({
                              id: prod.productId,
                              productName: prod.productName,
                              variantName: prod.name,
                              variantId: prod.variantId,
                              productId: prod.productId,
                              quantity: prod.qty ? prod.qty : 0,
                              unitPrice: prod.sellerPrice
                            })
                            dispatch({
                              type: "MY_ORDER_LIST_UPDATE_ADD",
                              payload: orderItems,
                            });
                          }}>
                            Add
                        </Button>
                        </TableCell>
                      </TableRow>
                    )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
}

export default MyProductFromOrder;
