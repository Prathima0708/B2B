import {
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
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
  DEL_USER_STORE_FROM_LIST,
  GET_ALL_VARIFIED_STORE,
  GET_USER_STORES_URL,
  POST_USER_STORES_URL,
} from "./constants";
import { FiEdit, FiSearch, FiTrash2 } from "react-icons/fi";
import React, { useContext, useEffect, useState } from "react";
import hasPermission, { PAGE_USERS_STORES } from "../../components/login/hasPermission";
import { notifyError, notifySuccess } from "../../utils/toast";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Drawer from "rc-drawer";
import { FiPlus } from "react-icons/fi";
import { FiX } from "react-icons/fi";
import Grid from "@mui/material/Grid";
import LabelArea from "../../components/form/LabelArea";
import NotFound from "../../components/table/NotFound";
import PageTitle from "../../components/Typography/PageTitle";
import Scrollbars from "react-custom-scrollbars";
import Title from "../../components/form/Title";
import Tooltip from "../../components/tooltip/Tooltip";
import apiService from "../../utils/apiService";
import useFilter from "../../hooks/useFilter";

// import { SidebarContext } from "../../context/SidebarContext";
function UserStore(props) {
  // Declare a new state variable, which we'll call "count"
  const [showDrawer, setShowDrawer] = useState(false);
  const [emailId, setEmailId] = useState(null);
  const [emailValidation, setEmailValidation] = useState(false);
  const [edit_userState, setEdit_userState] = useState(null);
  const [del_config, setDel_config] = useState(false);
  const [storeIds, setStoreIds] = useState([]);
  const [store, setStore] = useState(null);
  const [searchEmailId, setSearchEmailId] = useState(null);
  const [searchUserId, setSearchUserId] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [userStoreList, setUserStoreList] = useState([]);
  const { handleChangePage, resultsPerPage, totalResults, dataTable } = useFilter(userStoreList, 20);

  const GET_STORE_LIST = `/admin/all-stores`;
  const reset = () => {
    setEmailId("");
    setEmailValidation(false);
    setEdit_userState(null);
    setDel_config(false);
  };

  const getUserStoreList = () => {
    setIsLoading(true);
    apiService
      .get("user_service", GET_USER_STORES_URL, {
        email: searchEmailId,
        user_id: searchUserId,
      })
      .then((response) => {
        if (response) {
          setIsLoading(false);
          setUserStoreList(response.data);
        } else {
          setIsLoading(false);
          setUserStoreList([]);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        notifyError("Something Went Wrong!!");
      });
  };

  const addAppConfig = (flg) => {
    let payload = {
      email: emailId,
      store_id: parseInt(store),
    };
    setShowDrawer(false);
    let url = POST_USER_STORES_URL;
    if (flg) {
      url = url + "/" + edit_userState.id;
      apiService
        .put("user_service", url, payload)
        .then((response) => {
          if (response) {
            setIsLoading(false);
            notifySuccess("User Store Added");
            getUserStoreList();
          } else {
            setIsLoading(false);
            notifyError("Something Went Wrong!!");
          }
        })
        .catch((e) => {
          setIsLoading(false);
          notifyError("Something Went Wrong!!");
        });
    } else {
      apiService
        .post("user_service", url, payload)
        .then((response) => {
          if (response) {
            setIsLoading(false);
            notifySuccess("User Store Added");
            getUserStoreList();
          } else {
            setIsLoading(false);
            notifyError("Something Went Wrong!!");
          }
        })
        .catch((e) => {
          setIsLoading(false);
          notifyError("Something Went Wrong!!");
        });
    }
  };

  const onEditUserStore = (userStore) => {
    setStore(userStore.store_id);
    setEmailId(userStore.user.email);
    setShowDrawer(true);
  };

  const deleteConfig = (index) => {
    let URL = DEL_USER_STORE_FROM_LIST + index;
    setIsLoading(true);
    apiService
      .delete("user_service", URL, null)
      .then((response) => {
        if (response) {
          setIsLoading(false);
          notifySuccess("User Store Deleted");
          getUserStoreList();
          setDel_config(false);
        } else {
          setIsLoading(false);
          setUserStoreList([]);
          notifyError("Something Went Wrong!!");
          setDel_config(false);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        notifyError("Something Went Wrong!!");
        setDel_config(false);
      });
  };

  const getStoreList = () => {
    apiService
      .get("b2b", GET_STORE_LIST, { verifiedStatus: true })
      .then((response) => {
        if (response) {
          setStoreIds(response.data.result);
          if (response.data.result.length > 0) {
            setStore(response.data.result[0].id);
          }
        } else {
          notifyError("Something went wrong !!");
        }
      })
      .catch((e) => {
        notifyError("Something went wrong !!");
      });
  };

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    getUserStoreList();
    getStoreList();
  }, []);

  useEffect(() => {
    if (!showDrawer) reset();
  }, [showDrawer]);

  return (
    <>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Drawer open={showDrawer} onClose={() => {}} parent={null} level={null} placement={"right"}>
        <div className="flex p-6 flex-col w-full h-full justify-between dark:bg-gray-800 dark:text-gray-300">
          <div className="w-full relative  bg-white dark:bg-gray-800 dark:text-gray-300">
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <div className="col-span-8 sm:col-span-4">
                <div className="fixed top-0 w-full right-0 py-4 lg:py-8 px-6 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex bg-gray-50 border-t border-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  <Title
                    title={edit_userState === null ? "Add Users Store" : "Edit Users Store"}
                    description={
                      edit_userState === null
                        ? "Add your Users Store and necessary information from here"
                        : "Edit your Users Store and necessary information from here"
                    }
                  />
                  <button
                    onClick={() => {
                      setShowDrawer(false);
                    }}
                    className="absolute focus:outline-none z-50 text-red-500 hover:bg-red-100 hover:text-gray-700 transition-colors duration-150 bg-white shadow-md mr-6 mt-2 right-0 left-auto w-10 h-10 rounded-full block text-center"
                  >
                    <FiX className="mx-auto" />
                  </button>
                </div>
              </div>
            </div>
            <br />
            <br />
            <br />
            <Scrollbars className="w-full  relative mt-6" style={{ height: "90vh" }}>
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Key" />
                <div className="col-span-8 sm:col-span-4">
                  <Input
                    className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                    label="Emaild ID"
                    name="emailId"
                    type="text"
                    placeholder="Email ID"
                    value={emailId}
                    valid={emailValidation}
                    onChange={(e) => {
                      var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
                      setEmailId(e.target.value);
                      if (e.target.value.match(validRegex)) {
                        setEmailValidation(true);
                      } else {
                        setEmailValidation(false);
                      }
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="store Id" />
                <div className="col-span-8 sm:col-span-4">
                  <Select
                    className="mt-1"
                    value={store}
                    onChange={(e) => {
                      setStore(e.target.value);
                    }}
                  >
                    {storeIds.map((str, i) => {
                      return (
                        <option value={str.id} key={i}>
                          {`${str.name} (Store ID: ${str.id}, Store Type: ${str.storeType})`}
                        </option>
                      );
                    })}
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <div className="col-span-8 sm:col-span-4">
                  <div className="fixed bottom-0 w-full right-0 py-4 lg:py-8 px-6 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex bg-gray-50 border-t border-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                      <Button
                        onClick={() => {
                          setShowDrawer(false);
                        }}
                        className="h-12 bg-white w-full text-red-500 hover:bg-red-50 hover:border-red-100 hover:text-red-600 dark:bg-gray-700 dark:border-gray-700 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-red-700"
                        layout="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                    <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                      <Button
                        type="submit"
                        className="w-full h-12"
                        onClick={() => {
                          let editFlag = edit_userState != null ? true : false;
                          addAppConfig(editFlag);
                        }}
                      >
                        {" "}
                        <span>{edit_userState === null ? "Add" : "Edit"} </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Scrollbars>
          </div>
        </div>
      </Drawer>
      <PageTitle>User Store</PageTitle>
      {hasPermission(PAGE_USERS_STORES, "create") && (
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <CardBody>
            <form
              onSubmit={() => {
                // handleSubmitCategory
              }}
              className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
            >
              <div className="w-full md:w-56 lg:w-56 xl:w-56" style={{ width: "100%" }}>
                <Button
                  onClick={() => {
                    setShowDrawer(true);
                  }}
                  className="w-full rounded-md h-12"
                >
                  <span className="mr-3">
                    <FiPlus />
                  </span>
                  Add Users Store
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}
      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <Grid container spacing={3}>
            <Grid item lg={4} md={4} sm={6} xs={12} className="pt-1">
              <Input
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                label="Emaild ID"
                name="emailId"
                type="text"
                placeholder="Email ID"
                value={searchEmailId}
                onChange={(e) => {
                  setSearchEmailId(e.target.value);
                }}
              />
            </Grid>
            <Grid item lg={4} md={4} sm={6} xs={12} className="pt-1">
              <Input
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                label="User ID"
                name="userId"
                type="number"
                placeholder="User ID"
                value={searchUserId}
                onChange={(e) => {
                  setSearchUserId(e.target.value);
                }}
              />
            </Grid>
            <Grid item lg={4} md={4} sm={6} xs={12} className="pt-1">
              <Button
                onClick={() => {
                  getUserStoreList();
                }}
                className="w-full rounded-md h-12"
              >
                <span className="mr-3">
                  <FiSearch />
                </span>
                Search Users Store
              </Button>
            </Grid>
          </Grid>
        </CardBody>
      </Card>
      {dataTable.length > 0 ? (
        <>
          <TableContainer className="mb-8">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>ID</TableCell>
                  <TableCell>EMAIL</TableCell>
                  <TableCell>STORE TYPE</TableCell>
                  <TableCell>STORE NAME (ID)</TableCell>
                  <TableCell>USER NAME(ID)</TableCell>
                  {/* <TableCell>USER ROLE</TableCell> */}
                  {(hasPermission(PAGE_USERS_STORES, "update") ||
                    hasPermission(PAGE_USERS_STORES, "delete")) && <TableCell>ACTIONS</TableCell>}
                </tr>
              </TableHeader>
              <TableBody>
                {dataTable.map((userStr, index) => {
                  return (
                    <TableRow key={index} className="cursor-pointer">
                      <TableCell className="font-semibold uppercase text-xs">{userStr.id}</TableCell>
                      <TableCell className="font-semibold uppercase text-xs">
                        {userStr.user && userStr.user.email}
                      </TableCell>
                      <TableCell className="font-semibold uppercase text-xs">
                        {userStr.store_data.storeType}
                      </TableCell>
                      <TableCell className="font-semibold uppercase text-xs">{`${userStr.store_data.name} (${userStr.store_id})`}</TableCell>
                      <TableCell className="font-semibold uppercase text-xs">{`${userStr.user.first_name} ${userStr.user.last_name} (${userStr.user_id})`}</TableCell>
                      {(hasPermission(PAGE_USERS_STORES, "update") ||
                        hasPermission(PAGE_USERS_STORES, "delete")) && (
                        <TableCell>
                          <div className="flex " /* justify-end text-right*/>
                            {hasPermission(PAGE_USERS_STORES, "update") && (
                              <div
                                onClick={() => {
                                  setEdit_userState(userStr);
                                  onEditUserStore(userStr);
                                }}
                                className="p-2 cursor-pointer text-gray-400 hover:text-green-600"
                              >
                                <Tooltip id="edit" Icon={FiEdit} title="Edit" bgColor="#10B981" />
                              </div>
                            )}

                            {hasPermission(PAGE_USERS_STORES, "delete") && (
                              <div
                                onClick={() => {
                                  setDel_config(userStr.id);
                                }}
                                className="p-2 cursor-pointer text-gray-400 hover:text-red-600"
                              >
                                <Tooltip id="delete" Icon={FiTrash2} title="Delete" bgColor="#EF4444" />
                              </div>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
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
          <>
            <Modal
              isOpen={del_config}
              onClose={() => {
                setDel_config(false);
              }}
            >
              <ModalBody className="text-center custom-modal px-8 pt-6 pb-4">
                <span className="flex justify-center text-3xl mb-6 text-red-500">
                  <FiTrash2 />
                </span>
                <h2 className="text-xl font-medium mb-1">Are You Sure! Want to Delete This Record?</h2>
                <p>
                  Do you really want to delete these records? You can't view this in your list anymore if you
                  delete!
                </p>
              </ModalBody>
              <ModalFooter className="justify-center">
                <Button
                  className="w-full sm:w-auto hover:bg-white hover:border-gray-50"
                  layout="outline"
                  onClick={() => {
                    setDel_config(false);
                  }}
                >
                  No, Keep It
                </Button>
                <Button
                  onClick={() => {
                    deleteConfig(del_config);
                  }}
                  className="w-full sm:w-auto"
                >
                  Yes, Delete It
                </Button>
              </ModalFooter>
            </Modal>
          </>
        </>
      ) : (
        <NotFound title="App ConFig" />
      )}
    </>
  );
}

export default UserStore;
