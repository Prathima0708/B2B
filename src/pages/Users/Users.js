import {
  Button,
  Card,
  CardBody,
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
import { FiTrash2 } from "react-icons/fi";
import { GET_ROLES_URL, GET_USER_LIST_URL } from "./constants";
import React, { useEffect, useState } from "react";
import hasPermission, {
  PAGE_ROLES_LIST,
  PAGE_USER_DETAILS,
} from "../../components/login/hasPermission";
import { notifyError, notifySuccess } from "../../utils/toast";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import NotFound from "../../components/table/NotFound";
import PageTitle from "../../components/Typography/PageTitle";
import apiService from "../../utils/apiService";
import { useHistory } from "react-router-dom";

function UsersRole() {
  // Declare a new state variable, which we'll call "count"

  const [userList, setUserList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(15);
  const [numberOfUsers, setNumberOfUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [userEdit, setUserEdit] = useState(null);
  const [roles, setRoles] = useState([]);
  const [roleId, setRoleId] = useState(null);
  const history = useHistory();

  const reset = () => {
    setRoleId(null);
    setUserEdit(null);
    setUserId("");
  };

  const editUserDetails = () => {
    let payload = null;
    let url = GET_USER_LIST_URL + "/" + userEdit.id + "/roles/" + roleId;
    apiService
      .patch("user_service", url, payload)
      .then((response) => {
        if (response) {
          setIsLoading(false);
          notifySuccess("User Edited");
          reset();
          getUsers(currentPage, currentPageSize);
        } else {
          setIsLoading(false);
          notifyError("Something Went Wrong!!");
        }
      })
      .catch(() => {
        setIsLoading(false);
        notifyError("Something Went Wrong!!");
      });
  };

  const getRoles = () => {
    setIsLoading(true);
    apiService
      .get("user_service", GET_ROLES_URL, null)
      .then((response) => {
        setIsLoading(false);
        setRoles(response.data);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const getUserOnSearch = () => {
    setIsLoading(true);
    let id = userId ? userId : "";
    if (id) {
      apiService
        .get("user_service", GET_USER_LIST_URL + "/" + id, null)
        .then((response) => {
          setIsLoading(false);
          if (response) {
            setUserList([response.data]);
            setNumberOfUsers(1);
          } else {
            getUsers(currentPage, currentPageSize);
          }
        })
        .catch(() => {
          setIsLoading(false);
        });
    } else {
      getUsers(currentPage, currentPageSize);
    }
  };

  let getUsers = (page, size) => {
    setIsLoading(true);
    apiService
      .get("user_service", GET_USER_LIST_URL, {
        page,
        size,
      })
      .then((response) => {
        setIsLoading(false);
        if (response) {
          setUserList(response.data.results);
          setNumberOfUsers(response.data.count);
          setCurrentPage(parseInt(response.data.page));
        } else {
          setUserList([]);
          setNumberOfUsers(0);
        }
      })
      .catch((error) => {
        setIsLoading(false);

        if (error.response) {
          // Request made and server responded
          notifyError(error.response.data.message);
        } else if (error.request) {
          // The request was made but no response was received
          notifyError("The request was made but no response was received");
        } else {
          // Something happened in setting up the request that triggered an Error
          notifyError(
            "Something happened in setting up the request that triggered an Error"
          );
        }
      });
  };

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    getUsers(currentPage, currentPageSize);
    if (hasPermission(PAGE_ROLES_LIST, "page")) getRoles();
  }, []);

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <PageTitle>Users</PageTitle>
      {hasPermission(PAGE_ROLES_LIST, "page") && (
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <CardBody>
            <Grid item lg={4} md={4} sm={6} xs={12} className="pt-1">
              <Select
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                value={roleId}
                onChange={(e) => {
                  // setRoleId(e.target.value);
                  setIsLoading(true);
                  let id = e.target.value;
                  if (id) {
                    apiService
                      .get(
                        "user_service",
                        GET_USER_LIST_URL + "?page=0&size=15&role id=" + id,
                        null
                      )
                      .then((response) => {
                        setIsLoading(false);
                        if (response) {
                          setUserList([...response.data.results]);
                          setNumberOfUsers(1);
                        } else {
                          getUsers(currentPage, currentPageSize);
                        }
                      })
                      .catch(() => {
                        setIsLoading(false);
                      });
                  } else {
                    getUsers(currentPage, currentPageSize);
                  }
                }}
              >
                <option key={null} value={""}>
                  {"-- All Roles --"}
                </option>
                {roles.map((rol, index) => {
                  return (
                    <option key={index} value={rol.id}>
                      {rol.name}
                    </option>
                  );
                })}
              </Select>
            </Grid>
          </CardBody>
        </Card>
      )}
      {userList.length > 0 ? (
        <>
          <TableContainer className="mb-8">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>ID</TableCell>
                  <TableCell>FIRST NAME</TableCell>
                  <TableCell>LAST NAME</TableCell>
                  <TableCell>EMAIL</TableCell>
                  <TableCell>ROLE</TableCell>
                  <TableCell>MOBILE NUMBER</TableCell>
                </tr>
              </TableHeader>
              <TableBody>
                {userList.map((users, index) => {
                  return (
                    <TableRow
                      key={index}
                      className={
                        hasPermission(PAGE_USER_DETAILS, "page")
                          ? "cursor-pointer"
                          : "cursor-default"
                      }
                      onClick={() => {
                        if (!hasPermission(PAGE_USER_DETAILS, "page")) return;
                        history.push(`/users/${users.id}/details`);
                      }}
                    >
                      <TableCell className="font-semibold uppercase text-xs">
                        {users.id}
                      </TableCell>
                      <TableCell className="font-semibold uppercase text-xs">
                        {users.first_name}
                      </TableCell>
                      <TableCell className="font-semibold uppercase text-xs">
                        {users.last_name}
                      </TableCell>
                      <TableCell className="font-semibold uppercase text-xs">
                        {users.email}
                      </TableCell>
                      <TableCell className="font-semibold uppercase text-xs">
                        {users.role && users.role != null
                          ? users.role.name
                          : "-"}
                      </TableCell>
                      <TableCell className="font-semibold uppercase text-xs">
                        {users.mobile_number}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <TableFooter>
              <Pagination
                totalResults={numberOfUsers}
                resultsPerPage={currentPageSize}
                onChange={(e) => {
                  setCurrentPage(e - 1);
                  getUsers(e - 1, currentPageSize);
                }}
                label="Table navigation"
              />
            </TableFooter>
          </TableContainer>

          <>
            <Modal isOpen={false}>
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
                >
                  No, Keep It
                </Button>
                <Button className="w-full sm:w-auto">Yes, Delete It</Button>
              </ModalFooter>
            </Modal>
          </>
        </>
      ) : (
        <NotFound title="Users List " />
      )}
    </>
  );
}

export default UsersRole;
