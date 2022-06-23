import React, { useEffect, useState } from "react";

import Grid from "@mui/material/Grid";
import Select from "react-select";
import _ from "lodash";
import { useLocation } from "react-router-dom";

const Main = ({ children, storeIdProps, setStoreSelected }) => {
  const location = useLocation();

  let path = location.pathname;
  const [isLoading, setIsLoading] = useState(false);
  const [storeList, setStoreList] = useState([]);
  const updateStoreList = () => {
    let strList = [];
    if (storeIdProps.storeList && storeIdProps.storeList.length > 0) {
      storeIdProps.storeList.map((str) => {
        strList.push({
          value: str.store_id,
          label: `${str.store_data.name} (Store ID: ${str.store_id}, Store Type: ${str.store_data.storeType})`,
        });
      });

      setStoreList(() => [...strList]);
    }
  };
  useEffect(() => {
    updateStoreList();
  }, [storeIdProps.storeList]);
  return (
    <main className="h-full overflow-y-auto">
      {path === "/add/product/store" ||
      path === "/my/products" ||
      path === "/myOrders" ||
      path === "/b2c/myOrders" ||
      path === "/b2b/sellerOrder" ? (
        <Grid container spacing={3} className="p-3">
          <Grid item md={12}>
            <Grid container spacing={3} className="p-3">
              <Grid item md={2}>
                <h1 class="my-1 text-lg font-bold text-gray-700 dark:text-gray-300">
                  {"Select Store "}
                </h1>
              </Grid>
              <Grid item md={10}>
                {storeList && storeList.length > 0 && (
                  <Select
                    className="dark:basic-single-store-select"
                    classNamePrefix="select"
                    value={
                      storeList.length > 0
                        ? _.find(storeList, [
                            "value",
                            storeIdProps.storeSelected,
                          ])
                        : null
                    }
                    isLoading={isLoading}
                    isClearable={false}
                    isRtl={false}
                    isSearchable={true}
                    name="color"
                    options={storeList}
                    onChange={async (e) => {
                      setStoreSelected(parseInt(e.value));
                    }}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <></>
      )}

      <div className="container grid px-6 mx-auto">{children}</div>
    </main>
  );
};

export default Main;
