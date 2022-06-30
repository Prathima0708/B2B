import { Avatar, Badge, WindmillContext } from "@windmill/react-ui";
import {
  IoGridOutline,
  IoLogOutOutline,
  IoMenu,
  IoMoonSharp,
  IoNotificationsSharp,
  IoSettingsOutline,
  IoSunny,
} from "react-icons/io5";
import { Link, useHistory } from "react-router-dom";
import React, { useContext, useEffect, useRef, useState } from "react";

import { AdminContext } from "../../context/AdminContext";
import { BiArrowBack } from "react-icons/bi";
import Scrollbars from "react-custom-scrollbars";
import { SidebarContext } from "../../context/SidebarContext";

import axios from "axios";
import { connect } from "react-redux";
import { deleteUserDetails } from "../../Redux/actions";
import { deleteUserFromLocalStorage } from "../../utils/setLocalStorage";
import { gatewayServiceBaseUrl } from "../../utils/backendUrls";

const Header = (props) => {
  const { toggleSidebar } = useContext(SidebarContext);
  const { state } = useContext(AdminContext);
  const { adminInfo } = state;
  const { mode, toggleMode } = useContext(WindmillContext);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const pRef = useRef();
  const nRef = useRef();
  const history = useHistory();

  const handleLogOut = async () => {
    await axios
      .delete(`${gatewayServiceBaseUrl}/user_device`)
      .catch((err) => console.log(err));
    props.deleteUserDetails();
    deleteUserFromLocalStorage();
    localStorage.removeItem("firebase-token");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!pRef?.current?.contains(e.target)) {
        setProfileOpen(false);
      }
      if (!nRef?.current?.contains(e.target)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  }, [pRef, nRef]);

  const handleNotificationOpen = () => {
    setNotificationOpen(!notificationOpen);
    setProfileOpen(false);
  };
  const handleProfileOpen = () => {
    setProfileOpen(!profileOpen);
    setNotificationOpen(false);
  };

  return (
    <>
      <header className="z-40 py-4 bg-white shadow-sm dark:bg-gray-800">
        <div className="container flex items-center justify-between h-full px-6 mx-auto text-green-500 dark:text-green-500">
          {/* <!-- Mobile hamburger --> */}
          <div>
            <button
              className="p-1  -ml-1 rounded-md lg:hidden focus:outline-none"
              onClick={toggleSidebar}
              aria-label="Menu"
            >
              <IoMenu className="w-6 h-6" aria-hidden="true" />
            </button>
            <button
              className="p-1 mr-5   rounded-md focus:outline-none"
              onClick={() => history.goBack()}
              aria-label="Back"
            >
              <BiArrowBack className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>
          <span></span>

          <ul className="flex justify-end items-center flex-shrink-0 space-x-6">
            {/* <!-- Theme toggler --> */}
            <li className="flex">
              <button
                className="rounded-md focus:outline-none"
                onClick={toggleMode}
                aria-label="Toggle color mode"
              >
                {mode === "dark" ? (
                  <IoSunny className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <IoMoonSharp className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
            </li>

            {/* <!-- Notifications menu --> */}
            <li className="relative inline-block text-left" ref={nRef}>
              <button
                className="relative align-middle rounded-md focus:outline-none"
                onClick={handleNotificationOpen}
              >
                <IoNotificationsSharp className="w-5 h-5" aria-hidden="true" />
                <span
                  aria-hidden="true"
                  className="absolute top-0 right-0 inline-block w-3 h-3 transform translate-x-1 -translate-y-1 bg-red-600 border-2 border-white rounded-full dark:border-gray-800"
                ></span>
              </button>

              {notificationOpen && (
                <div className="origin-top-right absolute right-0 mt-2 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="notification-box">
                    <Scrollbars>
                      <ul className="block text-sm border-t border-gray-100 dark:border-gray-700 rounded-md">
                        <li className="flex justify-between items-center font-serif font-normal text-sm py-3 border-b border-gray-100 dark:border-gray-700 px-3 transition-colors duration-150 hover:bg-gray-50 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100 cursor-pointer">
                          <div className="flex items-center">
                            <Avatar
                              className="p-1 mr-2 md:block bg-gray-50 border border-gray-200"
                              src="https://i.postimg.cc/FstZ49qv/Strawberries-Package-2-25-oz.jpg"
                              alt="image"
                            />

                            <div className="notification-content">
                              <h6 className="font-medium text-gray-500">
                                Strawberries Package
                              </h6>
                              <p className="flex items-center text-xs text-gray-400">
                                <Badge type="danger">Stock Out</Badge>
                                <span className="ml-2">
                                  12 Decembor 2021 - 12:40PM
                                </span>
                              </p>
                            </div>
                          </div>
                        </li>
                        <li className="flex justify-between items-center font-serif font-normal text-sm py-3 border-b border-gray-100 dark:border-gray-700 px-3 transition-colors duration-150 hover:bg-gray-50 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100 cursor-pointer">
                          <div className="flex items-center">
                            <Avatar
                              className="p-1 mr-2 md:block bg-gray-50 border border-gray-200"
                              src="https://i.postimg.cc/Z5yQ47YB/Rainbow-Chard-Package-per-lb.jpg"
                              alt="image"
                            />

                            <div className="notification-content">
                              <h6 className="font-medium text-gray-500">
                                Rainbow Chard
                              </h6>
                              <p className="flex items-center text-xs text-gray-400">
                                <Badge type="danger">Stock Out</Badge>
                                <span className="ml-2">
                                  12 Decembor 2021 - 12:40PM
                                </span>
                              </p>
                            </div>
                          </div>
                        </li>
                        <li className="flex justify-between items-center font-serif font-normal text-sm py-3 border-b border-gray-100 dark:border-gray-700 px-3 transition-colors duration-150 hover:bg-gray-50 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100 cursor-pointer">
                          <div className="flex items-center">
                            <Avatar
                              className="p-1 mr-2 md:block bg-gray-50 border border-gray-200"
                              src="https://i.ibb.co/ZTWbx5z/team-1.jpg"
                              alt="image"
                            />

                            <div className="notification-content">
                              <h6 className="font-medium text-gray-500">
                                Sam L. Place a order{" "}
                                <span className="font-bold">$300</span> USD
                              </h6>
                              <p className="flex items-center text-xs text-gray-400">
                                <Badge type="success">New Order</Badge>
                                <span className="ml-2">
                                  12 December 2021 - 12:40PM
                                </span>
                              </p>
                            </div>
                          </div>
                        </li>
                        <li className="flex justify-between items-center font-serif font-normal text-sm py-3 border-b border-gray-100 dark:border-gray-700 px-3 transition-colors duration-150 hover:bg-gray-50 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100 cursor-pointer">
                          <div className="flex items-center">
                            <Avatar
                              className="p-1 mr-2 md:block bg-gray-50 border border-gray-200"
                              src="https://i.postimg.cc/FstZ49qv/Strawberries-Package-2-25-oz.jpg"
                              alt="image"
                            />

                            <div className="notification-content">
                              <h6 className="font-medium text-gray-500">
                                Strawberries Package
                              </h6>
                              <p className="flex items-center text-xs text-gray-400">
                                <Badge type="danger">Stock Out</Badge>
                                <span className="ml-2">
                                  12 Decembor 2021 - 12:40PM
                                </span>
                              </p>
                            </div>
                          </div>
                        </li>
                        <li className="flex justify-between items-center font-serif font-normal text-sm py-3 border-b border-gray-100 dark:border-gray-700 px-3 transition-colors duration-150 hover:bg-gray-50 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100 cursor-pointer">
                          <div className="flex items-center">
                            <Avatar
                              className="p-1 mr-2 md:block bg-gray-50 border border-gray-200"
                              src="https://i.postimg.cc/Z5yQ47YB/Rainbow-Chard-Package-per-lb.jpg"
                              alt="image"
                            />

                            <div className="notification-content">
                              <h6 className="font-medium text-gray-500">
                                Rainbow Chard
                              </h6>
                              <p className="flex items-center text-xs text-gray-400">
                                <Badge type="danger">Stock Out</Badge>
                                <span className="ml-2">
                                  12 Decembor 2021 - 12:40PM
                                </span>
                              </p>
                            </div>
                          </div>
                        </li>
                        <li className="flex justify-between items-center font-serif font-normal text-sm py-3 border-b border-gray-100 dark:border-gray-700 px-3 transition-colors duration-150 hover:bg-gray-50 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100 cursor-pointer">
                          <div className="flex items-center">
                            <Avatar
                              className="p-1 mr-2 md:block bg-gray-50 border border-gray-200"
                              src="https://i.ibb.co/ZTWbx5z/team-1.jpg"
                              alt="image"
                            />

                            <div className="notification-content">
                              <h6 className="font-medium text-gray-500">
                                Sam L. Place a order{" "}
                                <span className="font-bold">$300</span> USD
                              </h6>
                              <p className="flex items-center text-xs text-gray-400">
                                <Badge type="success">New Order</Badge>
                                <span className="ml-2">
                                  12 Decembor 2021 - 12:40PM
                                </span>
                              </p>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </Scrollbars>
                  </div>
                </div>
              )}
            </li>
            {/* <li className="relative inline-block" style={{ width: "7rem" }}>
              {storeList.length > 0 ? (
                <Select
                  className="dark:basic-single-store-select"
                  classNamePrefix="select"
                  defaultValue={
                    storeList.length > 0
                      ? _.find(storeList, ["value", props.storeIdProps.storeSelected])
                      : null
                  }
                  isLoading={isLoading}
                  isClearable={false}
                  isRtl={false}
                  isSearchable={true}
                  name="color"
                  options={storeList}
                  onChange={async (e) => props.setStoreSelected(parseInt(e.value))}
                />
              ) : null}
            </li> */}
            {/* <!-- Profile menu --> */}
            <li className="relative inline-block text-left" ref={pRef}>
              <button
                className="rounded-full dark:bg-gray-500 bg-green-500 text-white h-8 w-8 font-medium mx-auto focus:outline-none"
                onClick={handleProfileOpen}
              >
                {adminInfo.image ? (
                  <Avatar
                    className="align-middle"
                    src={`${adminInfo.image}`}
                    aria-hidden="true"
                  />
                ) : (
                  <span>{adminInfo.email.toUpperCase()}</span>
                )}
              </button>
              {profileOpen && (
                <ul className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <li className="justify-between font-serif font-medium py-2 pl-4 transition-colors duration-150 hover:bg-gray-100 text-gray-500 hover:text-green-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200">
                    <Link to="/dashboard">
                      <span className="flex items-center text-sm">
                        <IoGridOutline
                          className="w-4 h-4 mr-3"
                          aria-hidden="true"
                        />
                        <span>Dashboard</span>
                      </span>
                    </Link>
                  </li>
                  <li className="justify-between font-serif font-medium py-2 pl-4 transition-colors duration-150 hover:bg-gray-100 text-gray-500 hover:text-green-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200">
                    <Link to="/edit-profile">
                      <span className="flex items-center text-sm">
                        <IoSettingsOutline
                          className="w-4 h-4 mr-3"
                          aria-hidden="true"
                        />
                        <span>Edit Profile</span>
                      </span>
                    </Link>
                  </li>
                  <li
                    onClick={handleLogOut}
                    className="cursor-pointer justify-between font-serif font-medium py-2 pl-4 transition-colors duration-150 hover:bg-gray-100 text-gray-500 hover:text-green-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                  >
                    <span className="flex items-center text-sm">
                      <IoLogOutOutline
                        className="w-4 h-4 mr-3"
                        aria-hidden="true"
                      />
                      <span>Log out</span>
                    </span>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </header>
    </>
  );
};

export default connect(null, { deleteUserDetails })(Header);
