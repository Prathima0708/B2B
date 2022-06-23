/* eslint-disable jsx-a11y/anchor-is-valid */

import { Button, WindmillContext } from "@windmill/react-ui";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { NavLink, Route } from "react-router-dom";
import React, { useContext, useState } from "react";

import { AdminContext } from "../../context/AdminContext";
import { Collapse } from "react-collapse";

import { IoLogOutOutline } from "react-icons/io5";
import axios from "axios";
import { connect } from "react-redux";
import { deleteUserDetails } from "../../Redux/actions";
import { deleteUserFromLocalStorage } from "../../utils/setLocalStorage";
import { gatewayServiceBaseUrl } from "../../utils/backendUrls";
import logoDark from "../../assets/img/logo/logo-dark.svg";
import logoLight from "../../assets/img/logo/logo-light.svg";
import sidebar from "../../routes/sidebar";

const SidebarContent = (props) => {
  const { mode } = useContext(WindmillContext);
  const { dispatch } = useContext(AdminContext);
  const [myStoreFlg, setMyStoreFlg] = useState(false);
  const [permissionFlg, setPermissionFlg] = useState(false);

  const handleLogOut = async () => {
    await axios
      .delete(`${gatewayServiceBaseUrl}/user_device`)
      .catch((err) => console.log(err));
    props.deleteUserDetails();
    deleteUserFromLocalStorage();
    localStorage.removeItem("firebase-token");
  };

  return (
    <div className="py-4 text-gray-500 dark:text-gray-400">
      <a className=" text-gray-900 dark:text-gray-200" href="/dashboard">
        {mode === "dark" ? (
          <img src={logoLight} alt="dashtar" width="135" className="pl-6" />
        ) : (
          <img src={logoDark} alt="dashtar" width="135" className="pl-6" />
        )}
      </a>
      <ul className="mt-8">
        {sidebar.map((route) => {
          if (route.name === "My Store") {
            return (
              <>
                <li
                  class="relative cursor-pointer"
                  onClick={() => {
                    setMyStoreFlg(!myStoreFlg);
                    setPermissionFlg(false);
                  }}
                >
                  <a
                    aria-current="page"
                    class="px-6 py-4 inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-green-700 dark:hover:text-gray-200"
                  >
                    <span
                      class="absolute inset-y-0 left-0 w-1 rounded-tr-lg rounded-br-lg"
                      aria-hidden="true"
                    ></span>
                    <svg
                      stroke="currentColor"
                      fill="none"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="w-5 h-5"
                      aria-hidden="true"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                    <span class="ml-4">{route.name}</span>
                    <span class="ml-5">
                      <svg
                        stroke="currentColor"
                        fill="none"
                        stroke-width="2"
                        viewBox="0 0 24 24"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </span>
                  </a>
                </li>
                <li>
                  <Collapse isOpened={myStoreFlg}>
                    {route.subMenu.map((subMenu) => {
                      return (
                        <li
                          className={
                            myStoreFlg ? "relative" : "relative hidden"
                          }
                          id="sub-menu-custom"
                          key={subMenu.name}
                        >
                          <NavLink
                            exact
                            to={subMenu.path}
                            className="px-6 py-4 inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-green-700 dark:hover:text-gray-200"
                            activeClassName="text-green-500 dark:text-gray-100"
                          >
                            <Route path={subMenu.path} exact={subMenu.exact}>
                              <span
                                className="absolute inset-y-0 left-0 w-1 bg-green-500 rounded-tr-lg rounded-br-lg"
                                aria-hidden="true"
                              ></span>
                            </Route>
                            {/* <route.icon className="w-5 h-5" aria-hidden="true" /> */}
                            <span className="ml-5 pl-5">{subMenu.name}</span>
                          </NavLink>
                        </li>
                      );
                    })}
                  </Collapse>
                </li>
                <br />
                <br />
                <br />
              </>
            );
          } else if (route.name === "Roles & Permission") {
            return (
              <>
                <li
                  class="relative cursor-pointer"
                  onClick={() => {
                    setPermissionFlg(!permissionFlg);
                    setMyStoreFlg(false);
                  }}
                >
                  <a
                    aria-current="page"
                    class="px-6 py-4 inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-green-700 dark:hover:text-gray-200"
                  >
                    <span
                      class="absolute inset-y-0 left-0 w-1 rounded-tr-lg rounded-br-lg"
                      aria-hidden="true"
                    ></span>
                    <route.icon className="w-5 h-5" aria-hidden="true" />
                    <span class="ml-4">{route.name}</span>
                    <span class="ml-5">
                      {permissionFlg ? <FiChevronDown /> : <FiChevronRight />}
                    </span>
                  </a>
                </li>
                <li>
                  <Collapse isOpened={permissionFlg}>
                    {route.subMenu.map((subMenu) => {
                      return (
                        <li
                          className={
                            permissionFlg ? "relative" : "relative hidden"
                          }
                          id="sub-menu-custom"
                          key={subMenu.name}
                        >
                          <NavLink
                            exact
                            to={subMenu.path}
                            className="px-6 py-4 inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-green-700 dark:hover:text-gray-200"
                            activeClassName="text-green-500 dark:text-gray-100"
                          >
                            <Route path={subMenu.path} exact={subMenu.exact}>
                              <span
                                className="absolute inset-y-0 left-0 w-1 bg-green-500 rounded-tr-lg rounded-br-lg"
                                aria-hidden="true"
                              ></span>
                            </Route>
                            {/* <route.icon className="w-5 h-5" aria-hidden="true" /> */}
                            <span className="ml-5 pl-5">{subMenu.name}</span>
                          </NavLink>
                        </li>
                      );
                    })}
                  </Collapse>
                </li>
              </>
            );
          } else {
            return (
              <li
                className="relative"
                key={route.name}
                onClick={() => {
                  setMyStoreFlg(false);
                  setPermissionFlg(false);
                }}
              >
                <NavLink
                  exact
                  to={route.path}
                  className="px-6 py-4 inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-green-700 dark:hover:text-gray-200"
                  activeClassName="text-green-500 dark:text-gray-100"
                >
                  <Route path={route.path} exact={route.exact}>
                    <span
                      className="absolute inset-y-0 left-0 w-1 bg-green-500 rounded-tr-lg rounded-br-lg"
                      aria-hidden="true"
                    ></span>
                  </Route>
                  <route.icon className="w-5 h-5" aria-hidden="true" />
                  <span className="ml-4">{route.name}</span>
                </NavLink>
              </li>
            );
          }
        })}
      </ul>
      <span className="lg:fixed bottom-0 px-6 py-6 w-64 mx-auto relative mt-3 block">
        <Button onClick={handleLogOut} size="large" className="w-full">
          <span className="flex items-center">
            <IoLogOutOutline className="mr-3 text-lg" />
            <span className="text-sm">Log out</span>
          </span>
        </Button>
      </span>
    </div>
  );
};

export default connect(null, { deleteUserDetails })(SidebarContent);
