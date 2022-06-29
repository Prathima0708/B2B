import "../orders.css";

import {
  ASSIGN_DRIVER_B2C,
  ASSIGN_PICKER_B2C,
  GET_STORE_USER,
  PUT_ORDER_URL_B2C,
  ROLE_ID_DRIVER,
  ROLE_ID_PICKER,
} from "../constants";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHeader,
  TableRow,
} from "@windmill/react-ui";
import { FiPlus, FiPlusSquare, FiXSquare } from "react-icons/fi";
import React, { useEffect, useState } from "react";
import { notifyError, notifySuccess } from "../../../utils/toast";
import { useDispatch, useSelector } from "react-redux";

import Backdrop from "@mui/material/Backdrop";

import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import PageTitle from "../../../components/Typography/PageTitle";
import apiService from "../../../utils/apiService";
import { useHistory, useLocation } from "react-router-dom";

function MyOrdersDetailsB2C(props) {
  const location = useLocation();
  const dispatch = useDispatch();
  const [count, setCount] = useState(0);
  const [order, setOrder] = useState(null);
  const history = useHistory();
  const property = useSelector((state) => {
    return state;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [assignDriverModalOpen, setAssignDriverModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [driver, setDriver] = useState([]);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {}, [order]);

  useEffect(() => {
    getDrivers();
    let orderDetail = property.user.myOrder;
    if (orderDetail === null) {
      orderDetail = history.location.state.order;
    }
    setOrder(orderDetail);
    getStoreUsers();
  }, []);

  const updateDeliverableQuantity = (index, data) => {
    var orderObj = order;
    orderObj.items[index].quantity = parseInt(data);
    setOrder(orderObj);
    setCount(count + 1);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPicker(null);
    localStorage.removeItem("x-member-id");
  };

  const [selectedPicker, setSelectedPicker] = useState(null);
  const [storeUsers, setStoreUsers] = useState([]);

  const getStoreUsers = () => {
    setIsLoading(true);
    let payload = {
      role_id: ROLE_ID_PICKER,
      "x-store-id": Number(props.storeSelected),
    };
    let url = GET_STORE_USER;
    apiService
      .get("user_service", url, payload)
      .then((response) => {
        if (response.status) {
          setIsLoading(false);
          setStoreUsers(response.data);
        } else {
          setIsLoading(false);
          notifyError("Something Went Wrong!!");
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  };
  const getDrivers = () => {
    setIsLoading(true);
    let payload = {
      role_id: ROLE_ID_DRIVER,
      "x-store-id": Number(props.storeSelected),
    };
    let url = GET_STORE_USER;
    apiService
      .get("user_service", url, payload)
      .then((response) => {
        if (response.status) {
          setIsLoading(false);
          setDriver(response.data);
        } else {
          setIsLoading(false);
          notifyError("Something Went Wrong!!");
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  };
  const closeModalAssignDriverModal = () => {
    setAssignDriverModalOpen(false);
    setSelectedDriver(null);
    localStorage.removeItem("x-member-id");
  };

  return (
    <>
      <Modal
        isOpen={assignDriverModalOpen}
        onClose={closeModalAssignDriverModal}
        className="w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg sm:m-4 sm:max-w-xl custom-modal"
      >
        <ModalHeader>{"Select Driver"}</ModalHeader>
        <ModalBody>
          <TableContainer className="mb-8">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>USER ID</TableCell>
                  <TableCell>FIRST NAME</TableCell>
                  <TableCell>LAST NAME </TableCell>
                  <TableCell>ROLE</TableCell>
                  <TableCell>{""}</TableCell>
                </tr>
              </TableHeader>
              <TableBody>
                {driver &&
                  driver.map((users, index) => {
                    return (
                      <TableRow key={index} className="cursor-pointer">
                        <TableCell className="font-semibold uppercase text-xs">
                          {users.user_id}
                        </TableCell>
                        <TableCell className="font-semibold uppercase text-xs">
                          {users.first_name}
                        </TableCell>
                        <TableCell className="font-semibold uppercase text-xs">
                          {users.last_name}
                        </TableCell>
                        <TableCell className="font-semibold uppercase text-xs">
                          {users.role_name}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="radio"
                            name="selectPicker"
                            value={users.user_id}
                            onChange={(e) => {
                              setSelectedDriver(parseInt(e.target.value));
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </ModalBody>
        <ModalFooter>
          <Button
            className="w-full sm:w-auto"
            layout="outline"
            onClick={closeModalAssignDriverModal}
          >
            Cancel
          </Button>
          <Button
            className="w-full sm:w-auto"
            onClick={() => {
              let selectedOrders = [];
              selectedOrders.push({
                orderId: parseInt(order.orderId),
                requestId: new Date().getTime(),
              });
              if (selectedOrders.length > 0 && selectedDriver != null) {
                setIsLoading(true);
                let payload = selectedOrders;
                localStorage.setItem("x-member-id", selectedDriver);
                let url = ASSIGN_DRIVER_B2C;
                apiService
                  .post("b2b", url, payload)
                  .then((response) => {
                    if (response.status) {
                      setIsLoading(false);
                      closeModalAssignDriverModal();
                      notifySuccess(
                        `Driver has been assigned to Selected Orders`
                      );
                    } else {
                      setIsLoading(false);
                      notifyError("Something Went Wrong!!");
                    }
                  })
                  .catch(() => {
                    setIsLoading(false);
                  });
              }
            }}
          >
            Submit
          </Button>
        </ModalFooter>
      </Modal>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        className="w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg sm:m-4 sm:max-w-xl custom-modal"
      >
        <ModalHeader>{"Select Picker"}</ModalHeader>
        <ModalBody>
          <TableContainer className="mb-8">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>USER ID</TableCell>
                  <TableCell>FIRST NAME</TableCell>
                  <TableCell>LAST NAME </TableCell>
                  {/* <TableCell>ROLE</TableCell> */}
                  <TableCell>{""}</TableCell>
                </tr>
              </TableHeader>
              <TableBody>
                {storeUsers &&
                  storeUsers.map((users, index) => {
                    return (
                      <TableRow key={index} className="cursor-pointer">
                        <TableCell className="font-semibold uppercase text-xs">
                          {users.user_id}
                        </TableCell>
                        <TableCell className="font-semibold uppercase text-xs">
                          {users.first_name}
                        </TableCell>
                        <TableCell className="font-semibold uppercase text-xs">
                          {users.last_name}
                        </TableCell>
                        {/* <TableCell className="font-semibold uppercase text-xs">{users.role_name}</TableCell> */}
                        <TableCell>
                          <Input
                            type="radio"
                            name="selectPicker"
                            value={users.user_id}
                            onChange={(e) =>
                              setSelectedPicker(parseInt(e.target.value))
                            }
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </ModalBody>
        <ModalFooter>
          <Button
            className="w-full sm:w-auto"
            layout="outline"
            onClick={closeModal}
          >
            Cancel
          </Button>
          <Button
            className="w-full sm:w-auto"
            onClick={() => {
              let selectedOrders = [];

              selectedOrders.push({
                orderId: parseInt(order.orderId),
                requestId: new Date().getTime(),
              });
              if (selectedPicker != null) {
                setIsLoading(true);
                let payload = selectedOrders;
                localStorage.setItem("x-member-id", selectedPicker);
                let url = ASSIGN_PICKER_B2C;
                apiService
                  .post("b2b", url, payload)
                  .then((response) => {
                    if (response.status) {
                      setIsLoading(false);
                      notifySuccess(
                        `Order ID : ${order.orderId}, Picker has been assigned`
                      );
                      closeModal();
                    } else {
                      setIsLoading(false);
                      notifyError("Something Went Wrong!!");
                    }
                  })
                  .catch(() => {
                    setIsLoading(false);
                  });
              }
            }}
          >
            Submit
          </Button>
        </ModalFooter>
      </Modal>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container spacing={3}>
        <Grid item sm={7} xs={9} className="pt-1">
          <PageTitle>
            <div className="mask-the-orderId">
              Orders : {order != null ? order.orderId : ""}
            </div>
          </PageTitle>
        </Grid>
        <Grid
          item
          sm={5}
          xs={6}
          className="pt-1 pb-md-0 pb-2 ps-md-0 ps-3"
          style={{ marginTop: "2rem" }}
        >
          <Grid container spacing={3}>
            <Grid xs={6} className="pt-1">
              <Select className="h-12" onChange={() => {}}>
                <option>{"Shipped"}</option>
                <option>{"Pick Ups"}</option>
                <option>{"Returns"}</option>
              </Select>
            </Grid>
            <Grid xs={6} className="pt-1 pl-1">
              <Button type="submit" className="w-full h-12">
                <FiPlus className="me-1" /> Message Customer
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item sm={12} xs={12} className="pt-1">
          <TableContainer className="mb-4">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>ITEM SUMMARY</TableCell>
                  <TableCell>ORDER QTY </TableCell>
                  <TableCell>AVAILABLE QTY </TableCell>
                  <TableCell>PRICE</TableCell>
                  <TableCell>TOTAL PRICE</TableCell>
                  <TableCell>
                    <Button
                      type="submit"
                      onClick={() => {
                        history.push({
                          pathname: "/b2c/myOrders/details/myProduct",
                        });
                      }}
                    >
                      <FiPlusSquare className="me-2" />
                      <span>{"Add / Replace"}</span>
                    </Button>
                  </TableCell>
                </tr>
              </TableHeader>
              <TableBody>
                {order != null
                  ? order.items &&
                    order.items.map((ord, index) => {
                      return (
                        <TableRow key={index} className="cursor-pointer">
                          <TableCell className="font-semibold uppercase text-xs">
                            <div title={ord.productName}>
                              {ord.productName} <br />({ord.variantName})
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold uppercase text-xs">
                            {ord.orderQuantity}
                          </TableCell>
                          <TableCell className="font-semibold uppercase text-xs">
                            <div className="flex flex-row ">
                              <Input
                                className="border mr-1 text-sm focus:outline-none block bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                                label=" Seller Price"
                                name="sellerPrice"
                                type="Number"
                                value={
                                  ord.quantity
                                    ? ord.quantity
                                    : ord.quantity === 0
                                    ? 0
                                    : null
                                }
                                style={{ width: "8rem" }}
                                onChange={(e) => {
                                  updateDeliverableQuantity(
                                    index,
                                    e.target.value
                                  );
                                }}
                              />
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold uppercase text-xs">
                            {ord.unitPrice}
                          </TableCell>
                          <TableCell className="font-semibold uppercase text-xs">
                            {ord.unitPrice *
                              (ord.quantity && ord.quantity != null
                                ? ord.quantity
                                : null)}
                          </TableCell>
                          <TableCell className="text-center text-red-600">
                            <FiXSquare
                              onClick={() => {
                                var orderObj = order;
                                orderObj.items[index].quantity = 0;
                                setOrder(orderObj);
                                setCount(count + 1);
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })
                  : ""}
              </TableBody>
            </Table>
          </TableContainer>

          <Grid container spacing={3} className="mb-4">
            <Grid item sm={4} xs={12} className="pt-1">
              <Button
                type="submit"
                layout="outline"
                className="w-full h-12"
                onClick={() => {
                  setIsModalOpen(true);
                }}
                disabled={
                  order != null &&
                  (order.orderStatus === "COMPLETED" ||
                    order.orderStatus === "REJECTED" ||
                    order.orderStatus === "CANCELLED")
                }
              >
                Assign Picker
              </Button>
            </Grid>
            <Grid item sm={4} xs={12} className="pt-1">
              <Button
                type="submit"
                layout="outline"
                className="w-full h-12"
                onClick={() => {
                  setAssignDriverModalOpen(true);
                }}
                disabled={
                  order != null &&
                  (order.orderStatus === "COMPLETED" ||
                    order.orderStatus === "REJECTED" ||
                    order.orderStatus === "CANCELLED")
                }
              >
                Assign Driver
              </Button>
            </Grid>
            <Grid item sm={4} xs={12} className="pt-1">
              <Button
                type="submit"
                className="w-full h-12"
                onClick={() => {
                  let payload = {};
                  let itemsToAddOrUpdate = [];
                  order.items.map((ord) => {
                    itemsToAddOrUpdate.push({
                      productId: ord.productId,
                      variantId: ord.variantId,
                      quantity: ord.quantity ? ord.quantity : null,
                    });
                  });
                  payload = {
                    itemsToAddOrUpdate,
                    // 'x-store-id': props.storeSelected
                  };
                  setIsLoading(true);

                  let url = PUT_ORDER_URL_B2C + order.orderId;
                  apiService
                    .put("b2b", url, payload)
                    .then((response) => {
                      if (response.status) {
                        history.push({
                          pathname: "/b2c/myOrders",
                        });
                        setIsLoading(false);
                      } else {
                        setIsLoading(false);
                        // notifyError
                      }
                    })
                    .catch((error) => {
                      setIsLoading(false);
                      if (error.response) {
                        // Request made and server responded
                        notifyError(
                          error.response.status + " : Something went wrong !!"
                        );
                      } else if (error.request) {
                        // The request was made but no response was received
                        notifyError(
                          "The request was made but no response was received"
                        );
                      } else {
                        // Something happened in setting up the request that triggered an Error
                        notifyError(
                          "Something happened in setting up the request that triggered an Error"
                        );
                      }
                    });
                }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>

          {/* <TableContainer className="mb-4">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>{"CUSTOMER & ORDER DETAILS"}</TableCell>
                  <TableCell> </TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <FiEdit className="me-1" />
                  </TableCell>
                </tr>
              </TableHeader>
              <TableBody>
                <TableRow className="cursor-pointer">
                  <TableCell className="font-semibold uppercase text-xs">Customer Name</TableCell>
                  <TableCell className="font-semibold uppercase text-xs"></TableCell>
                  <TableCell className="font-semibold uppercase text-xs"></TableCell>
                  <TableCell className="font-semibold uppercase text-xs"></TableCell>
                </TableRow>
                <TableRow className="cursor-pointer">
                  <TableCell className="font-semibold uppercase text-xs">Phone Number</TableCell>
                  <TableCell className="font-semibold uppercase text-xs"></TableCell>
                  <TableCell className="font-semibold uppercase text-xs"></TableCell>
                  <TableCell className="font-semibold uppercase text-xs"></TableCell>
                </TableRow>
                <TableRow className="cursor-pointer">
                  <TableCell className="font-semibold uppercase text-xs">Order Time</TableCell>
                  <TableCell className="font-semibold uppercase text-xs"></TableCell>
                  <TableCell className="font-semibold uppercase text-xs"></TableCell>
                  <TableCell className="font-semibold uppercase text-xs"></TableCell>
                </TableRow>
                <TableRow className="cursor-pointer">
                  <TableCell className="font-semibold uppercase text-xs">Customer Name</TableCell>
                  <TableCell className="font-semibold uppercase text-xs"></TableCell>
                  <TableCell className="font-semibold uppercase text-xs"></TableCell>
                  <TableCell className="font-semibold uppercase text-xs"></TableCell>
                </TableRow>
                <TableRow className="cursor-pointer">
                  <TableCell className="font-semibold uppercase text-xs">Note</TableCell>
                  <TableCell className="font-semibold uppercase text-xs"></TableCell>
                  <TableCell className="font-semibold uppercase text-xs"></TableCell>
                  <TableCell className="font-semibold uppercase text-xs"></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer> */}
        </Grid>
        {/* <Grid item sm={12} xs={12} className="pt-1">
          <TableContainer className="mb-4">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>{"DELIVERY PERSON DETAILS"}</TableCell>
                  <TableCell></TableCell>
                </tr>
              </TableHeader>
              <TableBody>
                <TableRow className="cursor-pointer">
                  <TableCell className="font-semibold uppercase text-xs">{"-"}</TableCell>
                  <TableCell className="font-semibold uppercase text-xs">
                    <Button type="submit" className="w-full h-12" onClick={() => {}}>
                      Track Delivery
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <TableContainer className="mb-4">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>{"DELIVERY ADDRESS"}</TableCell>
                  <TableCell> </TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <FiEdit className="me-1" />
                  </TableCell>
                </tr>
              </TableHeader>
              <TableBody>
                <TableRow className="cursor-pointer">
                  <TableCell className="font-semibold uppercase text-xs">ADDRESS LINE</TableCell>
                  <TableCell className="font-semibold uppercase text-xs"></TableCell>
                  <TableCell className="font-semibold uppercase text-xs"></TableCell>
                  <TableCell className="font-semibold uppercase text-xs"></TableCell>
                </TableRow>
                <TableRow className="cursor-pointer">
                  <TableCell className="font-semibold uppercase text-xs">BUILDING NAME</TableCell>
                  <TableCell className="font-semibold uppercase text-xs"></TableCell>
                  <TableCell className="font-semibold uppercase text-xs"></TableCell>
                  <TableCell className="font-semibold uppercase text-xs"></TableCell>
                </TableRow>
                <TableRow className="cursor-pointer">
                  <TableCell className="font-semibold uppercase text-xs">STREET NAME</TableCell>
                  <TableCell className="font-semibold uppercase text-xs"></TableCell>
                  <TableCell className="font-semibold uppercase text-xs"></TableCell>
                  <TableCell className="font-semibold uppercase text-xs"></TableCell>
                </TableRow>
                <TableRow className="cursor-pointer">
                  <TableCell className="font-semibold uppercase text-xs">POST CODE</TableCell>
                  <TableCell className="font-semibold uppercase text-xs"></TableCell>
                  <TableCell className="font-semibold uppercase text-xs"></TableCell>
                  <TableCell className="font-semibold uppercase text-xs"></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid> */}
      </Grid>
    </>
  );
}
export default MyOrdersDetailsB2C;
