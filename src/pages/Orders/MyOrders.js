/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import "./orders.css";

import {
  ASSIGN_DRIVER_B2B_SELLER,
  ASSIGN_DRIVER_B2B_VENDOR,
  ASSIGN_PICKER,
  GET_ORDERS_LIST_SELLER_URL,
  GET_ORDERS_LIST_URL,
  GET_STORE_USER,
  GET_WAREHOUSE_LIST_URL,
  ROLE_ID_DRIVER,
  ROLE_ID_PICKER,
} from "./constants";
import {
  Button,
  Card,
  CardBody,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Pagination,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
  TableRow,
} from "@windmill/react-ui";
import {
  FiPlus,
  FiPrinter,
  FiSearch,
  FiTruck,
  FiUserPlus,
} from "react-icons/fi";
import React, { useEffect, useState } from "react";
import { SERVER_HOST_LINK, SERVER_HOST_LINK2 } from "./../../utils/constants";
import hasPermission, {
  PAGE_MY_ORDERS,
} from "../../components/login/hasPermission";
import { notifyError, notifySuccess } from "../../utils/toast";
import { useDispatch, useSelector } from "react-redux";

import Backdrop from "@mui/material/Backdrop";
import { Badge } from "@windmill/react-ui";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import NotFound from "../../components/table/NotFound";
import PageTitle from "../../components/Typography/PageTitle";
import ReactTooltip from "react-tooltip";
import apiService from "../../utils/apiService";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";

function MyOrders(props) {
  const location = useLocation();
  let typeFlg = location.pathname === "/myOrders" ? "vendor" : "seller";
  const [isLoading, setIsLoading] = useState(false);
  const [currentPageSize, setCurrentPageSize] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [numberOfUsers, setNumberOfUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const history = useHistory();
  const [orders, setorders] = useState([]);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [storeUsers, setStoreUsers] = useState([]);
  const [driver, setDriver] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [assignDriverModalOpen, setAssignDriverModalOpen] = useState(false);
  const [warehouseList, setWarehouseList] = useState([]);
  const [warehouse, setWarehouse] = useState(null);
  const [filterstatus, setfilterstatus] = useState(null);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    getOrders();
    getStoreUsers();
    getDrivers();
  }, [props.storeSelected]);

  const getStoreUsers = () => {
    setIsLoading(true);
    let payload = {
      // role: PICKER_STRING,
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
      .catch((e) => {
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
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const getWarehouseList = () => {
    setIsLoading(true);
    apiService
      .get("b2b", GET_WAREHOUSE_LIST_URL, null)
      .then((response) => {
        if (response) {
          setIsLoading(false);
          setWarehouseList(response.data.result);
          setWarehouse(response.data.result[0].id);
        } else {
          setIsLoading(false);
          setWarehouseList([]);
        }
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    getOrders();
  }, [props.storeSelected, currentPage, filterstatus]);

  const getOrders = () => {
    setIsLoading(true);
    const params = {
      page: currentPage - 1,
      size: currentPageSize,
      sort: "id",
    };
    if (filterstatus != null) {
      params.status = filterstatus;
    }
    let url =
      location.pathname === "/myOrders"
        ? GET_ORDERS_LIST_URL
        : GET_ORDERS_LIST_SELLER_URL;
    apiService
      .get("b2b", url, params)
      .then((response) => {
        if (response.status) {
          setIsLoading(false);
          setorders(response.data.result.content);
          setNumberOfUsers(response.data.result.numberOfElements);
          setTotalResults(response.data.result.totalElements);
        } else {
          setIsLoading(false);
          notifyError("Something Went Wrong!!");
        }
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getStoreUsers();
    getDrivers();
    getWarehouseList();
    getOrders();
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPicker(null);
    localStorage.removeItem("x-member-id");
  };
  const [selectedPicker, setSelectedPicker] = useState(null);

  const closeModalAssignDriverModal = () => {
    setAssignDriverModalOpen(false);
    setSelectedDriver(null);
    localStorage.removeItem("x-member-id");
  };

  const getDeliveryStoreName = (user) => {
    let dlvryAddress = JSON.parse(user.deliveryAddress);
    if (dlvryAddress && dlvryAddress != null) {
      let strName =
        dlvryAddress.store_data && dlvryAddress.store_data.name
          ? dlvryAddress.store_data.name
          : "";

      return strName;
    } else {
      return "-";
    }
  };

  const getDeliveryAddress = (user) => {
    let dlvryAddress = JSON.parse(user.deliveryAddress);
    if (dlvryAddress && dlvryAddress != null) {
      let strName =
        dlvryAddress.store_data && dlvryAddress.store_data.name
          ? dlvryAddress.store_data.name
          : "";
      let address = "";
      if (dlvryAddress.store_data && dlvryAddress.store_data.address) {
        let add = JSON.parse(dlvryAddress.store_data.address);
        address = add.buildingName + ", " + add.street + ", " + add.city;
      }
      return address;
    } else {
      return "-";
    }
  };

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Modal
        isOpen={assignDriverModalOpen}
        onClose={closeModalAssignDriverModal}
        className="w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg sm:m-4 sm:max-w-xl custom-modal"
      >
        <ModalHeader>
          <Grid container spacing={3}>
            <Grid item sm={12} xs={12} className="pt-1">
              {"Select Driver"}
            </Grid>
            <Grid item sm={12} xs={12} className="pt-1">
              {typeFlg === "vendor" && (
                <Label className=" min-w-64  my-2  flex-grow  ">
                  <span>Select Warehouse</span>
                  <Select
                    className="mt-1"
                    value={warehouse}
                    onChange={(e) => setWarehouse(e.target.value)}
                    name="filter"
                  >
                    {warehouseList.map((wr) => {
                      return <option value={wr.id}>{wr.name}</option>;
                    })}
                  </Select>
                </Label>
              )}
            </Grid>
          </Grid>
        </ModalHeader>
        <ModalBody>
          {driver.length ? (
            <>
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
            </>
          ) : (
            <NotFound title="Driver List " />
          )}
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
              let orderSOBJ = orders;
              let selectedOrders = [];
              orderSOBJ.map((ord) => {
                if (ord.selected) {
                  if (typeFlg === "vendor") {
                    selectedOrders.push({
                      orderId: parseInt(ord.orderId),
                      requestId: new Date().getTime(),
                      warehouseId: parseInt(warehouse),
                    });
                  } else {
                    selectedOrders.push({
                      orderId: parseInt(ord.orderId),
                      requestId: new Date().getTime(),
                    });
                  }
                }
              });
              if (selectedOrders.length > 0 && selectedDriver != null) {
                setIsLoading(true);
                let payload = selectedOrders;
                localStorage.setItem("x-member-id", selectedDriver);
                let url =
                  typeFlg === "vendor"
                    ? ASSIGN_DRIVER_B2B_VENDOR
                    : ASSIGN_DRIVER_B2B_SELLER;
                apiService
                  .post("b2b", url, payload)
                  .then((response) => {
                    if (response.status) {
                      setIsLoading(false);
                      closeModalAssignDriverModal();
                      notifySuccess(
                        `Driver has been assigned to Selected Orders`
                      );
                      getOrders();
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
          {storeUsers && storeUsers.length ? (
            <>
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
                                onChange={(e) => {
                                  setSelectedPicker(parseInt(e.target.value));
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <NotFound title="Users List " />
          )}
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
              let orderSOBJ = orders;
              let selectedOrders = [];
              orderSOBJ.map((ord) => {
                if (ord.selected)
                  selectedOrders.push({
                    orderId: parseInt(ord.orderId),
                    requestId: new Date().getTime(),
                  });
              });

              if (selectedOrders.length > 0 && selectedPicker != null) {
                setIsLoading(true);
                let payload = selectedOrders;
                localStorage.setItem("x-member-id", selectedPicker);
                let url = ASSIGN_PICKER;
                apiService
                  .post("b2b", url, payload)
                  .then((response) => {
                    if (response.status) {
                      setIsLoading(false);
                      closeModal();
                      getOrders();
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
        <Grid item sm={6} xs={12} className="pt-1">
          <PageTitle>My Orders</PageTitle>
        </Grid>
        <Grid
          item
          sm={6}
          xs={12}
          className="pt-1"
          style={{ marginTop: "2rem" }}
        >
          <Grid container spacing={3}>
            <Grid xs={6} className="pt-1">
              <Button
                className="h-12 bg-white w-full text-green-500 hover:bg-green-50 hover:border-green-100 hover:text-green-600 dark:bg-gray-700 dark:border-gray-700 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-green-700"
                layout="outline"
              >
                <FiPrinter className="me-1" /> Print
              </Button>
            </Grid>
            <Grid xs={6} className="pt-1 pl-1">
              <Button type="submit" className="w-full h-12">
                <FiPlus className="me-1" /> Create New Orders
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <Grid container spacing={3}>
            <Grid item lg={3} md={4} sm={6} xs={12} className="pt-1">
              <Input
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                label="User ID"
                name="userID"
                type="text"
                placeholder="Search"
              />
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={12} className="pt-1">
              <Select className="h-12" value={""}>
                <option value={""}>{"Payment Method"}</option>
              </Select>
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={12} className="pt-1">
              <Select
                className="h-12"
                value={filterstatus}
                onChange={(e) => {
                  setfilterstatus(e.target.value);
                }}
              >
                <option value={""}>{"--Status(All)--"}</option>
                <option value={"PLACED"}>{"Placed"}</option>
                <option value={"ACCEPTED"}>{"Accepted"}</option>
                <option value={"IN_TRANSITION"}>{"In Transition"}</option>
                <option value={"COMPLETED"}>{"Completed"}</option>
                <option value={"REJECTED"}>{"Rejected"}</option>
                <option value={"CANCELLED"}>{"Cancelled"}</option>
              </Select>
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={12} className="pt-1">
              <Select className="h-12" value={""}>
                <option value={""}>{"Lorem Ipsum"}</option>
              </Select>
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={12} className="pt-1">
              <Select className="h-12" value={""}>
                <option value={""}>{"More Filters"}</option>
              </Select>
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={12} className="pt-1">
              <Select className="h-12">
                <option>{"All"}</option>
                <option>{"Pick Ups"}</option>
                <option>{"Returns"}</option>
              </Select>
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={12} className="pt-1">
              <Button className="w-full rounded-md h-12">
                <span className="mr-3">
                  <FiSearch />
                </span>
                Search Orders
              </Button>
            </Grid>
            {hasPermission(PAGE_MY_ORDERS, "assignPicker") && (
              <Grid item lg={3} md={4} sm={6} xs={12} className="pt-1">
                <Button
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                  className="w-full rounded-md h-12"
                >
                  <span className="mr-3">
                    <FiUserPlus />
                  </span>
                  Assign Picker
                </Button>
              </Grid>
            )}
            {hasPermission(PAGE_MY_ORDERS, "assignDriver") && (
              <Grid item lg={3} md={4} sm={6} xs={12} className="pt-1">
                <Button
                  onClick={() => {
                    setAssignDriverModalOpen(true);
                  }}
                  className="w-full rounded-md h-12"
                >
                  <span className="mr-3">
                    <FiTruck />
                  </span>
                  Assign Driver
                </Button>
              </Grid>
            )}
          </Grid>
        </CardBody>
      </Card>
      {orders.length ? (
        <>
          <TableContainer className="mb-8">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>ASSIGN</TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>ORDER TIME </TableCell>
                  <TableCell>DELIVERY ADDRESS</TableCell>
                  <TableCell>PHONE</TableCell>
                  <TableCell>LINK</TableCell>
                  <TableCell>DELIVERY NOTE</TableCell>
                  <TableCell>PAYMENT MODE</TableCell>
                  <TableCell>ORDER AMOUNT</TableCell>
                  <TableCell>STATUS</TableCell>
                </tr>
              </TableHeader>
              <TableBody>
                {orders.map((users, index) => {
                  return (
                    <TableRow
                      key={index}
                      className="cursor-pointer"
                      onClick={async () => {
                        await history.push({
                          pathname: "/myOrders/details",
                          state: { order: users },
                        });
                        await dispatch({
                          type: "MY_ORDER_LIST_UPDATE_ADD",
                          payload: users,
                        });
                      }}
                    >
                      <TableCell className="font-semibold uppercase text-xs text-center">
                        <Input
                          type="checkbox"
                          checked={users.selected ? users.selected : false}
                          disabled={
                            users.orderStatus === "COMPLETED" ||
                            users.orderStatus === "REJECTED" ||
                            users.orderStatus === "CANCELLED"
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsLoading(true);
                            let ordersArray = orders;
                            ordersArray[index].selected = ordersArray[index]
                              .selected
                              ? !ordersArray[index].selected
                              : true;

                            setTimeout(() => {
                              setIsLoading(false);
                              setorders(ordersArray);
                            }, 0);
                          }}
                        />
                      </TableCell>
                      <TableCell className="font-semibold uppercase text-xs">
                        <div title={users.orderId} className="mask-the-field">
                          {users.id}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold uppercase text-xs">
                        {moment(users.orderTime).format("HH:mm, DD-MM-YYYY")}
                      </TableCell>
                      <TableCell className="font-semibold uppercase text-xs">
                        <p>{getDeliveryStoreName(users)}</p>
                        <p>{getDeliveryAddress(users)}</p>
                      </TableCell>
                      <TableCell className="font-semibold uppercase text-xs">
                        {"-"}
                      </TableCell>
                      <TableCell
                        className="font-semibold uppercase text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        {typeFlg === "vendor" ? (
                          <Select
                            className="h-12"
                            style={{ width: "120px" }}
                            onChange={(e) => {
                              e.stopPropagation();
                              console.log(e.target.value);
                              if (e.target.value !== "-Select-")
                                openInNewTab(
                                  SERVER_HOST_LINK +
                                    "?vendor-order-id=" +
                                    users.id +
                                    "&doc-type=" +
                                    e.target.value
                                );
                            }}
                          >
                            <option value={null}>{"-Select-"}</option>
                            <option>{"PO"}</option>
                            <option>{"DN"}</option>
                          </Select>
                        ) : (
                          <Select
                            className="h-12"
                            style={{ width: "120px" }}
                            onChange={(e) => {
                              e.stopPropagation();
                              if (e.target.value !== "-Select-")
                                openInNewTab(
                                  SERVER_HOST_LINK2 +
                                    "?vendor-order-id=" +
                                    users.id +
                                    "&doc-type=" +
                                    e.target.value
                                );
                            }}
                          >
                            <option value={null}>{"-Select-"}</option>
                            <option>{"IN"}</option>
                          </Select>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold uppercase text-xs">
                        {users.deliveryNote?.length > 0 ? (
                          <>
                            <p data-tip>{`${users.deliveryNote.slice(
                              0,
                              30
                            )}...`}</p>
                            <ReactTooltip backgroundColor="#10B981">
                              <span className="text-sm font-medium">
                                {users.deliveryNote}
                              </span>
                            </ReactTooltip>
                          </>
                        ) : (
                          users.deliveryNote
                        )}
                      </TableCell>
                      <TableCell className="font-semibold uppercase text-xs">
                        {users.paymentMode}
                      </TableCell>
                      <TableCell className="font-semibold uppercase text-xs">
                        {users.totalAmount}
                      </TableCell>
                      <TableCell>
                        {users.orderStatus === "CANCELLED" ? (
                          <Badge type="danger">{users.orderStatus}</Badge>
                        ) : (
                          <Badge type="success">{users.orderStatus}</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <TableFooter>
              <Pagination
                totalResults={totalResults}
                resultsPerPage={currentPageSize}
                onChange={(e) => setCurrentPage(e)}
                label="Table navigation"
              />
            </TableFooter>
          </TableContainer>
        </>
      ) : (
        <NotFound title="Orders List " />
      )}
    </>
  );
}
export default MyOrders;
