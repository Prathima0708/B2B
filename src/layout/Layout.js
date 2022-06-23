import React, { Suspense, lazy, useContext, useEffect, useState } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";

import Category from "../pages/Category";
import Header from "../components/header/Header";
import Main from "./Main";
import Sidebar from "../components/sidebar/Sidebar";
import { SidebarContext } from "../context/SidebarContext";
import ThemeSuspense from "../components/theme/ThemeSuspense";
import apiService from "../utils/apiService";
import { notifyError } from "../utils/toast";
import routes from "../routes";

const Page404 = lazy(() => import("../pages/404"));

// const url = "/stores/verified-status";


const Layout = (props) => {
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);

  const [storeList, setStoreList] = useState([]);
  const [storeSelected, setStoreSelected] = useState(null);
  let location = useLocation();
  
  const url = `/users/my-stores?storeType=${
    (process.env.REACT_APP_PRODUCT_ENV === "B2B" && location.pathname!=='/b2b/sellerOrder') ? "SUPPLIER" : "SELLER"
  }`;
  const getStoreList = () => {
    apiService
      .get("user_service", url, null)
      .then((response) => {
        if (response) {
          
          if(response.data.length){
            setStoreList(response.data);
            setStoreSelected(
              Number( Number(response.data[0].store_id)
            ))
          }
        } else {
          notifyError("Something went wrong !!");
        }
      })
  };

  useEffect(() => {
    getStoreList();
    
  }, [location.pathname]);

  useEffect(() => {
    // getStoreList();
    const selectedStore = window.localStorage.getItem("x-store-id");
    if (selectedStore) setStoreSelected(Number(selectedStore));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    window.localStorage.setItem("x-store-id", storeSelected);
  }, [storeSelected]);

  useEffect(() => {
    closeSidebar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${isSidebarOpen && "overflow-hidden"}`}>
      <Sidebar />

      <div className="flex flex-col flex-1 w-full">
        <Header />
        <Main storeIdProps={{ storeList, storeSelected }} setStoreSelected={setStoreSelected}>
          <Suspense fallback={<ThemeSuspense />}>
            <Switch>
              {routes.map((route, i) => {
                return route.component ? (
                  <Route
                    key={i}
                    exact={true}
                    path={`${route.path}`}
                    render={(props) => <route.component storeSelected={storeSelected} {...props} />}
                  />
                ) : null;
              })}
              <Redirect exact from="/" to="/dashboard" />
              <Route component={Page404} />
            </Switch>
          </Suspense>
        </Main>
      </div>
    </div>
  );
};

export default Layout;
