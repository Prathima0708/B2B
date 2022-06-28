/* eslint-disable react-hooks/exhaustive-deps */

import {
  Button,
  Card,
  CardBody,
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
import React, { useEffect, useState } from "react";
import hasPermission, {
  PAGE_STORE_ADD,
  PAGE_STORE_LIST,
  PAGE_STORE_UPDATE,
} from "../components/login/hasPermission";

import { FiPlus } from "react-icons/fi";
import NotFound from "../components/table/NotFound";
import PageTitle from "../components/Typography/PageTitle";
import { Switch } from "@mui/material";
import _ from "lodash";
import apiService from "../utils/apiService";
import axios from "axios";
import { coreServiceBaseUrl } from "../utils/backendUrls";
import useFilter from "../hooks/useFilter";
import { useHistory } from "react-router-dom";

const Store = (props) => {
  const history = useHistory();
  return (
    <>
      {props.storeList.length
        ? props.storeList
            .sort((a, b) => (a.id < b.id ? -1 : 1))
            .map((store, index) => {
              return (
                <TableRow
                  key={index}
                  className={
                    hasPermission(PAGE_STORE_UPDATE, "page")
                      ? "cursor-pointer"
                      : "cursor-default"
                  }
                  onClick={() => {
                    if (!hasPermission(PAGE_STORE_UPDATE, "page")) return;
                    history.push(`/store/${store.id}`);
                  }}
                >
                  <TableCell className="font-semibold uppercase text-xs">
                    {store.id}
                  </TableCell>
                  <TableCell className="font-semibold uppercase text-xs">
                    {store.name}
                  </TableCell>
                  <TableCell className="font-semibold uppercase text-xs">
                    {store.authorizedPerson}
                  </TableCell>
                  <TableCell className="font-semibold uppercase text-xs">
                    {store.authorizedPersonEmail}
                  </TableCell>
                  <TableCell className="font-semibold uppercase text-xs">
                    {store.storeType}
                  </TableCell>
                  <TableCell>
                    <div className=" flex items-center place-content-center">
                      <Switch
                        color={
                          hasPermission(PAGE_STORE_LIST, "update")
                            ? "primary"
                            : "default"
                        }
                        checked={props.verified}
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (!hasPermission(PAGE_STORE_LIST, "update")) return;
                          await axios
                            .put(
                              `${coreServiceBaseUrl}/admin/verify-store`,
                              null,
                              {
                                params: {
                                  "x-store-id": store.id,
                                },
                              }
                            )
                            .then(() => {
                              props.setLoading(false);
                              props.setUpdate((prevData) => !prevData);
                            })
                            .catch(() => {
                              props.setLoading(false);
                            });
                        }}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    </div>{" "}
                  </TableCell>
                </TableRow>
              );
            })
        : null}
    </>
  );
};

function StoreList() {
  const [storeList, setStoreList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [verified, setVerified] = useState(true);
  const [zone, setZone] = useState();
  const [zoneList, setZoneList] = useState([]);
  const GET_STORE_LIST = `/admin/all-stores`;
  const history = useHistory();
  const [update, setUpdate] = useState(true);
  const storeTypeOptions = ["ALL", "SUPPLIER", "SELLER"];
  const [storeType, setStoreType] = useState(
    process.env.REACT_APP_PRODUCT_ENV === "B2C" ? "SELLER" : "ALL"
  );
  const { handleChangePage, resultsPerPage, totalResults, dataTable } =
    useFilter(storeList, 20);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    (() => {
      setIsLoading(true);
      const params = {
        verifiedStatus: verified,
      };
      if (process.env.REACT_APP_PRODUCT_ENV === "B2C") {
        params.storeType = "SELLER";
      } else {
        if (storeType !== "ALL") {
          params.storeType = storeType;
        }
      }
      if (zone !== "false") params.zoneId = zone;
      apiService
        .get("b2b", GET_STORE_LIST, params)
        .then((response) => {
          let res = _.get(response, "data.result", {});
          setStoreList(res);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    })();
  }, [verified, update, storeType, zone]);
  useEffect(async () => {
    await apiService
      .get("b2b", "/location/getAllZones?activeStatus=true")
      .then((res) => {
        setZoneList(res.data.zones);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  return (
    <>
      <PageTitle>Store</PageTitle>
      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        {process.env.REACT_APP_PRODUCT_ENV === "B2C" ? (
          <CardBody>
            <form className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex">
              <div className="w-full flex flex-col md:flex-row gap-3">
                {hasPermission(PAGE_STORE_ADD, "page") && (
                  <Button
                    className="w-full md:w-4/6 rounded-md h-12"
                    onClick={() => {
                      history.push("/store/add");
                    }}
                  >
                    <span className="mr-3">
                      <FiPlus />
                    </span>
                    Add Store
                  </Button>
                )}
                <Select
                  onChange={(e) => setZone(e.target.value)}
                  className={`w-full flex-grow border h-12 text-sm focus:outline-none block  bg-gray-100 dark:bg-white border-transparent focus:bg-white`}
                  name="zone"
                  value={zone}
                >
                  <option defaultValue hidden>
                    Filter by Zone
                  </option>
                  {zoneList.map(({ zone_id, name }) => (
                    <option value={zone_id}>{`${name} (${zone_id})`}</option>
                  ))}
                  <option value={false}>None</option>
                </Select>
                <div
                  className="w-full flex-grow rounded-md h-12 border-green-500 border-2 flex items-center justify-between px-4 cursor-pointer"
                  onClick={() => setVerified(!verified)}
                >
                  <div className="">
                    <span className="text-gray-700 dark:text-gray-300">
                      Verified
                    </span>
                  </div>
                  <Switch
                    checked={verified}
                    onClick={() => setVerified(!verified)}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </div>
              </div>
            </form>
          </CardBody>
        ) : (
          <CardBody>
            <form className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex">
              <div className="w-full flex flex-col md:flex-row gap-3">
                {hasPermission(PAGE_STORE_ADD, "page") && (
                  <Button
                    className="w-full md:w-4/6 rounded-md h-12"
                    onClick={() => {
                      history.push("/store/add");
                    }}
                  >
                    <span className="mr-3">
                      <FiPlus />
                    </span>
                    Add Store
                  </Button>
                )}
                <Select
                  onChange={(e) => setStoreType(e.target.value)}
                  className={`w-full flex-grow border h-12 text-sm focus:outline-none block  bg-gray-100 dark:bg-white border-transparent focus:bg-white`}
                  name="storeType"
                  value={storeType}
                >
                  <option value="ALL">All Stores</option>
                  <option value="SUPPLIER">SUPPLIER</option>
                  <option value="SELLER">SELLER</option>
                </Select>
                <Select
                  onChange={(e) => setZone(e.target.value)}
                  className={`w-full flex-grow border h-12 text-sm focus:outline-none block  bg-gray-100 dark:bg-white border-transparent focus:bg-white`}
                  name="zone"
                  value={zone}
                >
                  <option defaultValue hidden>
                    Filter by Zone
                  </option>
                  {zoneList.map(({ zone_id, name }) => (
                    <option value={zone_id}>{`${name} (${zone_id})`}</option>
                  ))}
                  <option value={false}>All Zones</option>
                </Select>
                <div
                  className={`w-full flex-grow rounded-md h-12 border-green-500 border-2 flex items-center justify-between px-4 cursor-pointer`}
                  onClick={() => setVerified(!verified)}
                >
                  <div className="">
                    <span className="text-gray-700 dark:text-gray-300">
                      Verified
                    </span>
                  </div>
                  <Switch
                    checked={verified}
                    onClick={() => setVerified(!verified)}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </div>
              </div>
            </form>
          </CardBody>
        )}
      </Card>
      <>
        <TableContainer className="mb-8">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>ID</TableCell>
                <TableCell>STORE NAME</TableCell>
                <TableCell>AUTHORIZED PERSON</TableCell>
                <TableCell>EMAIL</TableCell>
                <TableCell>STORE TYPE</TableCell>
                <TableCell className="text-center">VERIFIED STATUS</TableCell>
              </tr>
            </TableHeader>
            {storeList.length > 0 ? (
              <TableBody>
                <Store
                  storeList={dataTable}
                  verified={verified}
                  setUpdate={setUpdate}
                  setLoading={setIsLoading}
                />
              </TableBody>
            ) : (
              <NotFound title="Brand" />
            )}
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
      </>
    </>
  );
}

export default StoreList;
