import "./Warehouse.css";

import {
  Button,
  Card,
  CardBody,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHeader,
  TableRow,
} from "@windmill/react-ui";
import {
  DEL_WAREHOUSE,
  GET_WAREHOUSE_LIST_URL,
  GOOGLE_MAP_API_KEY,
  POST_WAREHOUSE,
} from "./constants";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import React, { useEffect, useRef, useState } from "react";

import { notifyError, notifySuccess } from "../../utils/toast";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import { FiPlus, FiX } from "react-icons/fi";

import Grid from "@mui/material/Grid";

import NotFound from "../../components/table/NotFound";
import PageTitle from "../../components/Typography/PageTitle";
import ReactGoogleAutocomplete from "react-google-autocomplete";

import Title from "../../components/form/Title";
import Tooltip from "../../components/tooltip/Tooltip";
import apiService from "../../utils/apiService";

const Map = ({ center, zoom, setGLatLng, gLatLng }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [markerData, setMarkerData] = useState({});
  const fetchMarkerData = async (lat, lng) => {
    await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDNgw8gwBZkqlYdvBxs00W2ROJFfmzT63s`
    )
      .then((res) => res.json())
      .then((data) => setMarkerData(data.results[0]));
  };
  useEffect(async () => fetchMarkerData(center.lat, center.lng), []);
  useEffect(() => setTimeout(() => setShowInfo(true), 1000), []);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDNgw8gwBZkqlYdvBxs00W2ROJFfmzT63s",
  });
  const mapRef = useRef(null);
  const [position, setPosition] = useState(center || gLatLng);
  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  function handleLoad(map) {
    mapRef.current = map;
  }

  function handleCenterChanged() {
    if (!mapRef.current) return;
    const newPos = mapRef.current.getCenter().toJSON();
    setGLatLng(newPos);
    setPosition(newPos);
  }
  const fetchPlaceDetails = async () => {
    handleCenterChanged();
    fetchMarkerData(position.lat, position.lng);
  };

  function handleZoomChanged() {
    setPosition(position);
  }

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      onLoad={handleLoad}
      onDrag={handleCenterChanged}
      onDragEnd={fetchPlaceDetails}
      zoom={zoom}
      center={center}
      id="google-map-script"
    >
      <Marker position={position} onClick={() => setShowInfo(true)}>
        {showInfo && (
          <InfoWindow
            position={position}
            zIndex={10}
            onCloseClick={() => setShowInfo(false)}
          >
            <h4>{markerData.formatted_address}</h4>
          </InfoWindow>
        )}
      </Marker>
    </GoogleMap>
  ) : (
    <></>
  );
};

function Warehouse() {
  const [showDrawer, setShowDrawer] = useState(false);
  const [del_warehouse, setDel_warehouse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [warehouseList, setWarehouseList] = useState([]);
  const [edit_warehouse, setEdit_warehouse] = useState(null);
  const [center, setCenter] = useState({ lat: 25.286106, lng: 51.534817 });
  const [shopLatLng, setShopLatLng] = useState(undefined);
  const [gLatLng, setGLatLng] = useState({ lat: 25.286106, lng: 51.534817 });
  const [onLoadOfComponent, setOnLoadOfComponent] = useState(true);
  const [name, setName] = useState("");
  const [address, setAddress] = useState({
    city: "",
    street: "",
    landmark: "",
    locality: "",
    buildingName: "",
    latitude: null,
    longitude: null,
  });

  const getWarehouseList = () => {
    setIsLoading(true);
    apiService
      .get("b2b", GET_WAREHOUSE_LIST_URL, null)
      .then((response) => {
        if (response) {
          setIsLoading(false);
          setWarehouseList(response.data.result);
        } else {
          setIsLoading(false);
          setWarehouseList([]);
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const deleteConfig = () => {
    setIsLoading(true);
    apiService
      .delete("b2b", DEL_WAREHOUSE + del_warehouse, null)
      .then((response) => {
        setShowDrawer(false);
        setShopLatLng(undefined);
        setGLatLng({ lat: null, lng: null });
        setIsLoading(false);
        if (response) {
          setTimeout(() => {
            getWarehouseList();
            setDel_warehouse(false);
            notifySuccess("Warehouse Deleted");
          }, 0);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        setDel_warehouse(false);
        notifyError("Something went wrong!!");
      });
  };

  let getAutoComplete = () => {
    return (
      <ReactGoogleAutocomplete
        className="w-full"
        apiKey={GOOGLE_MAP_API_KEY}
        googleMapsScriptBaseUrl={
          "https://maps.googleapis.com/maps/api/js?key=AIzaSyDNgw8gwBZkqlYdvBxs00W2ROJFfmzT63s&libraries=geometry,drawing,places"
        }
        onPlaceSelected={(place) => {
          let placeSelected = JSON.parse(JSON.stringify(place));
          setCenter({
            lat: placeSelected.geometry.location.lat,
            lng: placeSelected.geometry.location.lng,
          });
        }}
        placeholder={"Search Google Maps"}
        language={"en"}
      />
    );
  };

  useEffect(() => {
    getWarehouseList();
    var d = document.getElementsByClassName("drawer-content");
    if (d && d[0])
      d[0].className += " bg-white dark:bg-gray-800 dark:text-gray-300";
  }, []);

  useEffect(() => {
    if (!showDrawer) reset();
  }, [showDrawer]);

  useEffect(() => {
    if (edit_warehouse != null) {
      let nm = edit_warehouse.name;
      let add = {
        city: edit_warehouse.address.city,
        street: edit_warehouse.address.street,
        landmark: edit_warehouse.address.landmark,
        locality: edit_warehouse.address.locality,
        buildingName: edit_warehouse.address.buildingName,
      };
      setName(nm);
      setAddress(() => ({ ...add }));
      setShopLatLng(() => [edit_warehouse.latitude, edit_warehouse.longitude]);
      setGLatLng({
        lat: edit_warehouse.latitude,
        lng: edit_warehouse.longitude,
      });
    }
  }, [edit_warehouse]);

  const reset = () => {
    setShowDrawer(false);
    setDel_warehouse(false);
    setEdit_warehouse(null);
    setShopLatLng(undefined);
    setGLatLng({ lat: null, lng: null });
    setAddress({
      city: "",
      street: "",
      landmark: "",
      locality: "",
      buildingName: "",
    });
    setName("");
    setCenter({ lat: 25.286106, lng: 51.534817 });
  };

  const onSubmitHandler = (flg) => {
    let payload = {
      name,
      address,
    };
    payload.latitude = gLatLng && gLatLng.lat;
    payload.longitude = gLatLng && gLatLng.lng;
    let url = POST_WAREHOUSE;
    if (flg) {
      url = url + "/" + edit_warehouse.id;
      setIsLoading(true);
      apiService
        .put("b2b", url, payload)
        .then((response) => {
          setIsLoading(false);
          setShowDrawer(false);
          setShopLatLng(undefined);
          setGLatLng({ lat: null, lng: null });
          if (response) {
            getWarehouseList();
            setTimeout(() => {
              notifySuccess("Warehouse Edited !");
            }, 0);
          }
        })
        .catch(() => {
          setIsLoading(false);
          notifyError("Something went wrong!!");
        });
    } else {
      setIsLoading(true);
      apiService
        .post("b2b", url, payload)
        .then((response) => {
          setIsLoading(false);
          setShowDrawer(false);
          setShopLatLng(undefined);
          setGLatLng({ lat: null, lng: null });
          if (response) {
            getWarehouseList();
            setTimeout(() => {
              notifySuccess("Warehouse Added !");
            }, 0);
          }
        })
        .catch(() => {
          setIsLoading(false);
          notifyError("Something went wrong!!");
        });
    }
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/* <Drawer
                open={showDrawer}
                onClose={() => { }}
                parent={null}
                level={null}
                placement={'right'}
            > */}
      {showDrawer && (
        <>
          <br />
          <div className="flex p-6 flex-col  h-full justify-between dark:bg-gray-800 dark:text-gray-300 mt-2  ">
            <div className="w-full relative  bg-white dark:bg-gray-800 dark:text-gray-300">
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <div className="col-span-8 sm:col-span-4">
                  <div className=" top-0 w-full right-0 py-4 lg:py-8 px-6 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex bg-gray-50 border-t border-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    <Title
                      title={
                        edit_warehouse === null
                          ? "Add Warehouse"
                          : "Edit Warehouse"
                      }
                      description={
                        edit_warehouse === null
                          ? "Add your App Config and necessary information from here"
                          : "Edit your App Config and necessary information from here"
                      }
                    />
                    <button
                      onClick={() => {
                        setShowDrawer(false);
                        setShopLatLng(undefined);
                        setGLatLng({ lat: null, lng: null });
                      }}
                      className="absolute focus:outline-none z-50 text-red-500 hover:bg-red-100 hover:text-gray-700 transition-colors duration-150 bg-white shadow-md mr-2 mt-2 right-0 left-auto w-10 h-10 rounded-full block text-center"
                    >
                      <FiX className="mx-auto" />
                    </button>
                  </div>
                </div>
              </div>

              <Grid container spacing={3}>
                <Grid item lg={6} md={12} sm={12} xs={12} className="">
                  <Label>
                    <span>Warehouse Name</span>
                    <Input
                      className="mt-1 border"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Label>
                </Grid>
                <Grid item lg={6} md={12} sm={12} xs={12} className=""></Grid>
                <Grid item lg={6} md={12} sm={12} xs={12} className="">
                  <Label>
                    <span>Location</span>
                    {onLoadOfComponent ? (
                      <>{getAutoComplete()}</>
                    ) : (
                      <div className="mb-2">Loading ...</div>
                    )}
                    <Map
                      zoom={14}
                      center={center}
                      gLatLng={gLatLng}
                      setGLatLng={setGLatLng}
                    />
                  </Label>
                </Grid>
                <Grid item lg={6} md={12} sm={12} xs={12} className=""></Grid>
                <Grid item lg={6} md={12} sm={12} xs={12} className="">
                  <Label>
                    <span>Building Name</span>
                    <Input
                      className="mt-1 border"
                      type="text"
                      name="shopBuildingName"
                      value={address.buildingName}
                      onChange={(e) => {
                        let a = address;
                        a.buildingName = e.target.value;
                        setAddress(() => ({ ...a }));
                      }}
                    />
                  </Label>
                </Grid>

                <Grid item lg={6} md={12} sm={12} xs={12} className="">
                  <Label>
                    <span>Street</span>
                    <Input
                      className="mt-1 border"
                      type="text"
                      name="shopStreet"
                      value={address.street}
                      onChange={(e) => {
                        let a = address;
                        a.street = e.target.value;
                        setAddress(() => ({ ...a }));
                      }}
                    />
                  </Label>
                </Grid>
                <Grid item lg={6} md={12} sm={12} xs={12} className="">
                  <Label>
                    <span>Locality</span>
                    <Input
                      className="mt-1 border"
                      type="text"
                      name="shopLocality"
                      value={address.locality}
                      onChange={(e) => {
                        let a = address;
                        a.locality = e.target.value;
                        setAddress(() => ({ ...a }));
                      }}
                    />
                  </Label>
                </Grid>
                <Grid item lg={3} md={6} sm={12} xs={12} className="">
                  <Label>
                    <span>City</span>
                    <Input
                      className="mt-1 border"
                      type="text"
                      name="shopCity"
                      value={address.city}
                      onChange={(e) => {
                        let a = address;
                        a.city = e.target.value;
                        setAddress(() => ({ ...a }));
                      }}
                    />
                  </Label>
                </Grid>
                <Grid item lg={3} md={6} sm={12} xs={12} className="">
                  <Label>
                    <span>Pin</span>
                    <Input
                      className="mt-1 border"
                      type="number"
                      name="landmark"
                      value={address.landmark}
                      onChange={(e) => {
                        let a = address;
                        a.landmark = e.target.value;
                        setAddress(() => ({ ...a }));
                      }}
                    />
                  </Label>
                </Grid>
              </Grid>
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <div className="col-span-12 sm:col-span-12">
                  <div className="mt-3  grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex bg-gray-50 border-t border-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    <Grid container spacing={3}>
                      <Grid item lg={6} md={6} sm={6} xs={12} className="">
                        <Button
                          onClick={() => {
                            setShowDrawer(false);
                            setShopLatLng(undefined);
                            setGLatLng({ lat: null, lng: null });
                          }}
                          className="h-12 bg-white w-full text-red-500 hover:bg-red-50 hover:border-red-100 hover:text-red-600 dark:bg-gray-700 dark:border-gray-700 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-red-700"
                          layout="outline"
                        >
                          Cancel
                        </Button>
                      </Grid>
                      <Grid item lg={6} md={6} sm={6} xs={12} className="">
                        <Button
                          type="submit"
                          className="w-full h-12"
                          onClick={() => {
                            let editFlag =
                              edit_warehouse != null ? true : false;
                            onSubmitHandler(editFlag);
                          }}
                        >
                          <span>
                            {edit_warehouse === null ? "Add" : "Edit"}{" "}
                          </span>
                        </Button>
                      </Grid>
                    </Grid>
                  </div>
                </div>
              </div>
              {/* </Scrollbars> */}
            </div>
          </div>
        </>
      )}

      {/* </Drawer> */}
      {!showDrawer && (
        <>
          <PageTitle>Warehouse</PageTitle>
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
                    Add Warehouse
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
          {warehouseList.length > 0 ? (
            <>
              <TableContainer className="mb-8">
                <Table>
                  <TableHeader>
                    <tr>
                      <TableCell>ID</TableCell>
                      <TableCell>NAME</TableCell>
                      <TableCell>CITY</TableCell>
                      <TableCell>BUILDING NAME</TableCell>
                      <TableCell /*className="text-right"*/>ACTIONS</TableCell>
                    </tr>
                  </TableHeader>
                  <TableBody>
                    {warehouseList.map((wh, index) => {
                      return (
                        <TableRow
                          key={index}
                          className="cursor-pointer"
                          onClick={() => {
                            setCenter({
                              lat: wh.latitude,
                              lng: wh.longitude,
                            });
                            setShowDrawer(true);
                            setEdit_warehouse(wh);
                          }}
                        >
                          <TableCell className="font-semibold uppercase text-xs">
                            {wh.id}
                          </TableCell>
                          <TableCell className="font-semibold uppercase text-xs">
                            {wh.name}
                          </TableCell>
                          <TableCell className="font-semibold uppercase text-xs">
                            {wh.address.city ? wh.address.city : "-"}
                          </TableCell>
                          <TableCell className="font-semibold uppercase text-xs">
                            {wh.address.buildingName
                              ? wh.address.buildingName
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <div className="flex " /* justify-end text-right*/>
                              <div
                                onClick={() => {
                                  setCenter({
                                    lat: wh.latitude,
                                    lng: wh.longitude,
                                  });
                                  setShowDrawer(true);
                                  setEdit_warehouse(wh);
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

                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDel_warehouse(wh.id);
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
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <>
                <Modal
                  isOpen={del_warehouse}
                  onClose={() => {
                    setDel_warehouse(false);
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
                        setDel_warehouse(false);
                      }}
                    >
                      No, Keep It
                    </Button>
                    <Button
                      onClick={() => {
                        deleteConfig(del_warehouse);
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
      )}
    </>
  );
}

export default Warehouse;
