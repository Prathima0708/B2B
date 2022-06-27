import "../orders.css";

import {
  ASSIGN_DRIVER_B2C,
  ASSIGN_PICKER_B2C,
  GET_ORDERS_LIST_URL_B2C,
  GET_STORE_USER,
  ROLE_ID_DRIVER,
  ROLE_ID_PICKER,
} from "../constants";
import {
  Button,
  Card,
  CardBody,
  Input,
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
  Badge,
} from "@windmill/react-ui";
import { FiSearch, FiTruck, FiUserPlus } from "react-icons/fi";
import React, { useEffect, useState } from "react";
import hasPermission, {
  PAGE_B2C_ORDERS,
} from "../../../components/login/hasPermission";
import { notifyError, notifySuccess } from "../../../utils/toast";
import { useDispatch } from "react-redux";

import Backdrop from "@mui/material/Backdrop";

import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import NotFound from "../../../components/table/NotFound";
import PageTitle from "../../../components/Typography/PageTitle";
import _ from "lodash";
import apiService from "../../../utils/apiService";
import moment from "moment";
import { useHistory } from "react-router-dom";

function MyOrdersB2C(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const history = useHistory();
  const [orders, setorders] = useState([]);
  const dispatch = useDispatch();
  const [storeUsers, setStoreUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignDriverModalOpen, setAssignDriverModalOpen] = useState(false);
  const [selectedPicker, setSelectedPicker] = useState(null);
  const [driver, setDriver] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [filterstatus, setfilterstatus] = useState(null);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    getOrders(currentPage, currentPageSize);
  }, [props.storeSelected, filterstatus]);

  const getOrders = (page, size) => {
    setIsLoading(true);
    let payload = {
      page,
      size,
      "x-store-id": Number(props.storeSelected),
    };
    if (filterstatus != null) {
      payload.status = filterstatus;
    }
    let url = GET_ORDERS_LIST_URL_B2C;
    apiService
      .get("b2b", url, payload)
      .then((response) => {
        if (response.status) {
          setIsLoading(false);
          setorders(response.data.orders.content);
          setTotalElements(response.data.orders.totalElements);
        } else {
          setIsLoading(false);
          notifyError("Something Went Wrong!!");
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const getPicker = (id) => {
    if (storeUsers.length && id != null) {
      let picker = _.find(storeUsers, function (o) {
        return o.user_id === id;
      });
      if (picker) return picker.first_name;
      else return "-";
    } else {
      return "-";
    }
  };

  const getDriver = (id) => {
    if (driver.length && id != null) {
      let drv = _.find(driver, function (o) {
        return o.user_id === id;
      });
      if (drv) return drv.first_name;
      else return "-";
    } else {
      return "-";
    }
  };

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

  useEffect(() => {
    getStoreUsers();
    getDrivers();
    getOrders(currentPage, currentPageSize);
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPicker(null);
    localStorage.removeItem("x-member-id");
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
                      <TableRow
                        key={index}
                        className="cursor-pointer"
                        onClick={async () => {}}
                      >
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
              let orderSOBJ = orders;
              let selectedOrders = [];
              orderSOBJ.map((ord) => {
                if (ord.selected)
                  selectedOrders.push({
                    orderId: parseInt(ord.orderId),
                    requestId: new Date().getTime(),
                  });
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
                      getOrders(currentPage, currentPageSize);
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
                  <TableCell>ROLE</TableCell>
                  <TableCell>{""}</TableCell>
                </tr>
              </TableHeader>
              <TableBody>
                {storeUsers &&
                  storeUsers.map((users, index) => {
                    return (
                      <TableRow
                        key={index}
                        className="cursor-pointer"
                        onClick={async () => {}}
                      >
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
                let url = ASSIGN_PICKER_B2C;
                apiService
                  .post("b2b", url, payload)
                  .then((response) => {
                    if (response.status) {
                      setIsLoading(false);
                      closeModal();
                      notifySuccess(
                        `Picker has been assigned to Selected Orders`
                      );
                      getOrders(currentPage, currentPageSize);
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
          <PageTitle>B2C Orders</PageTitle>
        </Grid>
        <Grid
          item
          sm={6}
          xs={12}
          className="pt-1"
          style={{ marginTop: "2rem" }}
        ></Grid>
      </Grid>
      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <Grid container spacing={3}>
            <Grid item lg={3} md={3} sm={6} xs={12} className="pt-1">
              <Input
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                label="User ID"
                name="userID"
                type="text"
                placeholder="Search"
              />
            </Grid>
            <Grid item lg={3} md={3} sm={6} xs={12} className="pt-1">
              <Select className="h-12" value={""} onChange={() => {}}>
                <option value={""}>{"Payment Method"}</option>
              </Select>
            </Grid>
            <Grid item lg={3} md={3} sm={6} xs={12} className="pt-1">
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

            <Grid item lg={3} md={3} sm={6} xs={12} className="pt-1">
              <Button className="w-full rounded-md h-12">
                <span className="mr-3">
                  <FiSearch />
                </span>
                Search Orders
              </Button>
            </Grid>
            {hasPermission(PAGE_B2C_ORDERS, "assignPicker") && (
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
            {hasPermission(PAGE_B2C_ORDERS, "assignDriver") && (
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
      {orders && orders.length ? (
        <>
          <TableContainer className="mb-8">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>ASSIGN</TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>DELIVERY DATE </TableCell>
                  <TableCell>DELIVERY SLOT </TableCell>
                  <TableCell>PICKER </TableCell>
                  <TableCell>DRIVER</TableCell>
                  <TableCell>DELIVERY ADDRESS</TableCell>
                  <TableCell>PAYMENT MODE</TableCell>
                  <TableCell>STATUS</TableCell>
                </tr>
              </TableHeader>
              <TableBody>
                {orders &&
                  orders.map((users, index) => {
                    return (
                      <TableRow
                        key={index}
                        className="cursor-pointer"
                        onClick={() => {
                          history.push({
                            pathname: "/b2c/myOrders/details",
                            state: { order: users },
                          });
                          dispatch({
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
                            {users.orderId}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold uppercase text-xs">
                          {moment(users.deliveryDate).format("DD-MM-YYYY")}
                        </TableCell>
                        <TableCell className="font-semibold uppercase text-xs">
                          {moment(users.deliverySlotStartTime).format("HH:mm")}{" "}
                          ~ {moment(users.deliverySlotEndTime).format("HH:mm")}
                        </TableCell>
                        <TableCell className="font-semibold uppercase text-xs">
                          {getPicker(users.pickerId)}
                        </TableCell>
                        <TableCell className="font-semibold uppercase text-xs">
                          {getDriver(users.driverId)}
                        </TableCell>
                        <TableCell className="font-semibold uppercase text-xs">
                          {"-"}
                        </TableCell>
                        <TableCell className="font-semibold uppercase text-xs">
                          {users.paymentMode}
                        </TableCell>
                        <TableCell>
                          {users.status === "CANCELLED" ? (
                            <Badge type="danger">{users.status}</Badge>
                          ) : (
                            <Badge type="success">{users.status}</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
            <TableFooter>
              <Pagination
                totalResults={totalElements}
                resultsPerPage={currentPageSize}
                onChange={(e) => {
                  setCurrentPage(e - 1);
                  getOrders(e - 1, currentPageSize);
                }}
                label="Table navigation"
              />
            </TableFooter>
          </TableContainer>
        </>
      ) : (
        <NotFound title="B2C - My Orders" />
      )}
    </>
  );
}
export default MyOrdersB2C;
