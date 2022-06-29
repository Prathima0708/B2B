import {
  ADD_CONFIG_TO_LIST_URL,
  DEL_CONFIG_FROM_LIST_URL,
  GET_CONFIG_LIST_URL,
} from "./constants";
import {
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHeader,
  TableRow,
  Textarea,
} from "@windmill/react-ui";
import { FiEdit, FiTrash2, FiPlus, FiX } from "react-icons/fi";
import React, { useEffect, useState } from "react";
import hasPermission, {
  PAGE_APP_CONFIG,
} from "../../components/login/hasPermission";
import { notifyError, notifySuccess } from "../../utils/toast";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Drawer from "rc-drawer";

import JSONInput from "react-json-editor-ajrm";
import LabelArea from "../../components/form/LabelArea";
import NotFound from "../../components/table/NotFound";
import PageTitle from "../../components/Typography/PageTitle";
import Scrollbars from "react-custom-scrollbars";
import Title from "../../components/form/Title";
import Tooltip from "../../components/tooltip/Tooltip";
import apiService from "../../utils/apiService";
import locale from "react-json-editor-ajrm/locale/en";

function AppConfig() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);
  const [showDrawer, setShowDrawer] = useState(false);
  const [keys, setKeys] = useState(null);
  const [dataType, setDataType] = useState("TEXT");
  const [json_value, setJson_value] = useState({});
  const [json_value_temp, setJson_value_temp] = useState({});
  const [text_value, setText_value] = useState(null);
  const [edit_config, setEdit_config] = useState(null);
  const [del_config, setDel_config] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [configList, setConfigList] = useState([]);

  const getConfigList = () => {
    setIsLoading(true);
    apiService
      .get("user_service", GET_CONFIG_LIST_URL, null)
      .then((response) => {
        if (response) {
          setIsLoading(false);
          setConfigList(response.data);
        } else {
          setIsLoading(false);
          setConfigList([]);
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const addAppConfig = (flg) => {
    let payload = {
      key: keys,
      datatype: dataType,
    };
    if (dataType === "TEXT") {
      payload.text_value = text_value;
    } else {
      payload.json_value = json_value_temp;
    }

    let url = ADD_CONFIG_TO_LIST_URL;
    setShowDrawer(false);
    if (flg) {
      url = url + "/" + edit_config.id;
      setIsLoading(true);
      apiService
        .put("user_service", url, payload)
        .then((response) => {
          if (response) {
            setTimeout(() => {
              setIsLoading(false);
              notifySuccess("Config Edited");
              getConfigList();
            }, 0);
          } else {
            setIsLoading(false);
          }
        })
        .catch(() => {
          setIsLoading(false);
          notifyError("Something went wrong!!");
        });
    } else {
      setIsLoading(true);
      apiService
        .post("user_service", url, payload)
        .then((response) => {
          if (response) {
            setTimeout(() => {
              setIsLoading(false);
              notifySuccess("Config Added");
              getConfigList();
            }, 0);
          } else {
            setIsLoading(false);
          }
        })
        .catch(() => {
          setIsLoading(false);
          notifyError("Something went wrong!!");
        });
    }
  };

  const deleteConfig = (index) => {
    setIsLoading(true);
    apiService
      .delete("user_service", DEL_CONFIG_FROM_LIST_URL + index, null)
      .then((response) => {
        setShowDrawer(false);
        if (response) {
          setTimeout(() => {
            setIsLoading(false);
            setDel_config(false);
            notifySuccess("Config Deleted");
            getConfigList();
          }, 0);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setDel_config(false);
        notifyError("Something went wrong!!");
      });
  };

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    getConfigList();
  }, []);

  useEffect(() => {
    if (!showDrawer) reset();
  }, [showDrawer]);

  useEffect(() => {
    if (edit_config != null) {
      setKeys(edit_config.key);
      setDataType(edit_config.datatype);
      setJson_value(edit_config.json_value);
      setJson_value_temp(edit_config.json_value);
      setText_value(edit_config.text_value);
    }
  }, [edit_config]);

  const reset = () => {
    setShowDrawer(false);
    setKeys("");
    setDataType("TEXT");
    setJson_value({});
    setJson_value_temp({});
    setText_value("");
    setEdit_config(null);
    setDel_config(false);
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Drawer open={showDrawer} parent={null} level={null} placement={"right"}>
        <div className="flex p-6 flex-col w-full h-full justify-between dark:bg-gray-800 dark:text-gray-300">
          <div className="w-full relative  bg-white dark:bg-gray-800 dark:text-gray-300">
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <div className="col-span-8 sm:col-span-4">
                <div className="fixed top-0 w-full right-0 py-4 lg:py-8 px-6 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex bg-gray-50 border-t border-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  <Title
                    title={edit_config === null ? "Add Config" : "Edit Config"}
                    description={
                      edit_config === null
                        ? "Add your App Config and necessary information from here"
                        : "Edit your App Config and necessary information from here"
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
            <Scrollbars
              className="w-full  relative mt-6"
              style={{ height: "90vh" }}
            >
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Key" />
                <div className="col-span-8 sm:col-span-4">
                  <Input
                    className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                    label="Key Value"
                    name="keyName"
                    type="text"
                    placeholder="Key Name"
                    value={keys}
                    onChange={(e) => setKeys(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Data Type" />
                <div className="col-span-8 sm:col-span-4">
                  <Select
                    className="mt-1"
                    value={dataType}
                    onChange={(e) => {
                      setDataType(e.target.value);
                    }}
                  >
                    <option value="JSON">{"JSON"}</option>
                    <option value="TEXT">{"Text"}</option>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Data type value" />
                <div className="col-span-8 sm:col-span-4">
                  {dataType === "TEXT" ? (
                    <Textarea
                      className="mt-1"
                      rows="3"
                      placeholder="Enter content here."
                      value={text_value}
                      onChange={(e) => {
                        setText_value(e.target.value);
                      }}
                    />
                  ) : (
                    <JSONInput
                      id="a_unique_id"
                      locale={locale}
                      height="250px"
                      placeholder={json_value}
                      onChange={(e) => setJson_value_temp(e.jsObject)}
                    />
                  )}
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
                          let editFlag = edit_config != null ? true : false;
                          addAppConfig(editFlag);
                        }}
                      >
                        {" "}
                        <span>{edit_config === null ? "Add" : "Edit"} </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Scrollbars>
          </div>
        </div>
      </Drawer>
      <PageTitle>App Config</PageTitle>
      {hasPermission(PAGE_APP_CONFIG, "create") && (
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <CardBody>
            <form
              onSubmit={() => {
                // handleSubmitCategory
              }}
              className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
            >
              <div
                className="w-full md:w-56 lg:w-56 xl:w-56"
                style={{ width: "100%" }}
              >
                <Button
                  onClick={() => {
                    setShowDrawer(true);
                  }}
                  className="w-full rounded-md h-12"
                >
                  <span className="mr-3">
                    <FiPlus />
                  </span>
                  Add App Config
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}
      {configList.length > 0 ? (
        <>
          <TableContainer className="mb-8">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>ID</TableCell>
                  <TableCell>KEY</TableCell>
                  <TableCell>DATA TYPE</TableCell>
                  {(hasPermission(PAGE_APP_CONFIG, "update") ||
                    hasPermission(PAGE_APP_CONFIG, "delete")) && (
                    <TableCell>ACTIONS</TableCell>
                  )}
                </tr>
              </TableHeader>
              <TableBody>
                {configList.map((config, index) => {
                  return (
                    <TableRow key={index} className="cursor-pointer">
                      <TableCell className="font-semibold uppercase text-xs">
                        {config.id}
                      </TableCell>
                      <TableCell className="font-semibold uppercase text-xs">
                        {config.key}
                      </TableCell>
                      <TableCell className="font-semibold uppercase text-xs">
                        {config.datatype}
                      </TableCell>
                      {(hasPermission(PAGE_APP_CONFIG, "update") ||
                        hasPermission(PAGE_APP_CONFIG, "delete")) && (
                        <TableCell>
                          <div className="flex " /* justify-end text-right*/>
                            {hasPermission(PAGE_APP_CONFIG, "update") && (
                              <div
                                onClick={() => {
                                  setEdit_config(config);
                                  setShowDrawer(true);
                                }}
                                className="p-2 cursor-pointer text-gray-400 hover:text-green-600"
                              >
                                <Tooltip
                                  id="edit"
                                  Icon={FiEdit}
                                  title="Edit"
                                  bgColor="#10B981"
                                />
                              </div>
                            )}
                            {hasPermission(PAGE_APP_CONFIG, "delete") && (
                              <div
                                onClick={() => {
                                  setDel_config(config.id);
                                }}
                                className="p-2 cursor-pointer text-gray-400 hover:text-red-600"
                              >
                                <Tooltip
                                  id="delete"
                                  Icon={FiTrash2}
                                  title="Delete"
                                  bgColor="#EF4444"
                                />
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
                <h2 className="text-xl font-medium mb-1">
                  Are You Sure! Want to Delete This Record?
                </h2>
                <p>
                  Do you really want to delete these records? You can't view
                  this in your list anymore if you delete!
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

export default AppConfig;
