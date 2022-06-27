import "./zone.css";

import {
  ADD_ZONE_TO_LIST_URL,
  DEL_ZONE_FROM_LIST_URL,
  GET_ZONE_LIST_URL,
  GOOGLE_MAP_API_KEY,
  MAP_ID_CONST,
  STATUS_UPDATE_ZONE_FROM_LIST_URL,
} from "./constants";
import {
  Badge,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
  TableRow,
} from "@windmill/react-ui";
import {
  GoogleMap,
  Polygon,
  withGoogleMap,
  withScriptjs,
} from "react-google-maps";
import { MapContainer, TileLayer } from "react-leaflet";
import React, { useEffect, useRef, useState } from "react";
import { compose, withProps } from "recompose";
import hasPermission, {
  PAGE_ZONE_LIST,
} from "../../components/login/hasPermission";
import { notifyError, notifySuccess } from "../../utils/toast";

import Autocomplete from "react-google-autocomplete";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { FiEdit, FiTrash2 } from "react-icons/fi";

import Grid from "@mui/material/Grid";
import Loading from "../../components/preloader/Loading";
import Switch from "react-switch";
import Tooltip from "../../components/tooltip/Tooltip";
import _ from "lodash";
import apiService from "../../utils/apiService";
import moment from "moment";
import useFilter from "../../hooks/useFilter";

function ZoneList(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [zoneList, setZoneList] = useState([]);
  const [zoneSearchList, setZoneSearchList] = useState("");
  const google = window.google;
  const { handleChangePage, resultsPerPage, totalResults, dataTable } =
    useFilter(zoneList, 10);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    setZoneList(props.zones);
  }, [props.zones]);
  useEffect(() => {
    setZoneList(
      props.zones.filter((zone) =>
        zone.name.toLowerCase().includes(zoneSearchList.toLowerCase())
      )
    );
  }, [zoneSearchList]);

  const updateZone = (editId) => {
    setIsLoading(true);
    apiService
      .put("b2b", STATUS_UPDATE_ZONE_FROM_LIST_URL + editId, null)
      .then(() => {
        setIsLoading(false);
        props.getZoneList();
        notifySuccess("Zone Edited");
      })
      .catch(() => {
        notifyError("Something went wrong !!");
      });
    setIsLoading(false);
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container className="overflow-y-scroll" style={{ height: "90vh" }}>
        <Grid item md={12} className="pt-1">
          <h2 className="text-gray-300 text-lg">{"Zones"}</h2>
          <input
            class="block w-full px-3 py-1 text-sm 
                        focus:outline-none dark:text-gray-300 
                        leading-5 rounded-md focus:border-gray-200 
                        border-gray-200 dark:border-gray-600 focus:ring 
                        focus:ring-green-300 dark:focus:border-gray-500 
                        dark:focus:ring-gray-300 dark:bg-gray-700 mt-2"
            type="search"
            aria-label="Bad"
            placeholder="Find Address"
            value={zoneSearchList}
            onChange={(e) => setZoneSearchList(e.target.value)}
          ></input>
          <br />
          <TableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Zone Name</TableCell>
                  <TableCell>Status</TableCell>
                  {hasPermission(PAGE_ZONE_LIST, "update") && (
                    <TableCell>Edit</TableCell>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody className="bg-scroll-custom overflow-y-scroll">
                {dataTable.map((zone, index) => {
                  if (
                    zoneSearchList === "" ||
                    zone.name
                      .toLowerCase()
                      .includes(zoneSearchList.toLowerCase())
                  ) {
                    return (
                      <TableRow
                        className="cursor-pointer"
                        key={index}
                        onClick={() => {
                          const zoneBounds = new google.maps.LatLngBounds();
                          const zoneCoords = [];
                          zone.points.forEach((point) =>
                            zoneCoords.push(
                              new google.maps.LatLng(point.lat, point.long)
                            )
                          );
                          zoneCoords.forEach((coord) => {
                            zoneBounds.extend(coord);
                          });
                          props.setZoneCenter([
                            zoneBounds.getCenter().lat(),
                            zoneBounds.getCenter().lng(),
                          ]);
                          props.setCenter({
                            lat: zoneBounds.getCenter().lat(),
                            lng: zoneBounds.getCenter().lng(),
                          });
                        }}
                      >
                        <TableCell className="block items-center " width="200">
                          <Grid container>
                            <Grid item md={6} className="pt-1">
                              <h4 className="text-dark dark:text-white">
                                {zone.name}
                              </h4>
                              <div
                                className="w-50"
                                style={{
                                  whiteSpace: "initial",
                                  width: "170px",
                                }}
                              >
                                {zone.lastUpdated
                                  ? moment(zone.lastUpdated).format("LLL")
                                  : ""}
                              </div>
                            </Grid>
                            <Grid item md={6} className="pt-1"></Grid>
                          </Grid>
                        </TableCell>
                        <TableCell
                          className={
                            hasPermission(PAGE_ZONE_LIST, "update")
                              ? `cursor-pointer`
                              : `cursor-default`
                          }
                        >
                          <Badge
                            onClick={async (e) => {
                              if (!hasPermission(PAGE_ZONE_LIST, "update"))
                                return;
                              e.stopPropagation();
                              updateZone(zone.zone_id);
                            }}
                            type={zone.active ? "success" : "danger"}
                          >
                            {zone.active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        {hasPermission(PAGE_ZONE_LIST, "update") && (
                          <TableCell
                            className="cursor-pointer"
                            onClick={async (e) => {
                              e.stopPropagation();

                              await props.setZoneName(zone.name);
                              await props.setStatus(zone.active);
                              await props.openModal(true, zone.zone_id);
                            }}
                          >
                            <div
                              // onClick={() => handleUpdate(id, parentId)}
                              className="p-2 cursor-pointer text-gray-400 hover:text-green-600"
                            >
                              <Tooltip
                                id="edit"
                                Icon={FiEdit}
                                title="Edit"
                                bgColor="#10B981"
                              />
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  }
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
        </Grid>
      </Grid>
    </>
  );
}

function Zone() {
  const [isLoading, setIsLoading] = useState(false);
  const [zones, setZones] = useState([]);
  const google = window.google;
  const [zoneCenter, setZoneCenter] = useState([51.509674, -0.193036]);

  const getZoneList = async () => {
    setIsLoading(true);
    apiService
      .get("b2b", GET_ZONE_LIST_URL, null)
      .then((response) => {
        let res = _.get(response, "data.zones", {});
        setZones(res);
        const firstZoneBounds = new google.maps.LatLngBounds();
        const firstZoneCoords = [];
        res[0]?.points.forEach((point) =>
          firstZoneCoords.push(new google.maps.LatLng(point.lat, point.long))
        );
        firstZoneCoords.forEach((coord) => {
          firstZoneBounds.extend(coord);
        });
        setZoneCenter([
          firstZoneBounds.getCenter().lat(),
          firstZoneBounds.getCenter().lng(),
        ]);
        setIsLoading(false);
        makeid();
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    getZoneList();

    navigator.geolocation.getCurrentPosition(function (position) {
      setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setZoom(16);
    });
    setTimeout(() => {
      setOnLoadOfComponent(true);
    }, 2500);
    // lat: props.center[0], lng: props.center[1]
    setTimeout(() => {
      var node2 = document.querySelector('[title="Draw a shape"]');
      var node1 = document.querySelector('[title="Stop drawing"]');
      if (node1 && node2) {
        node2.className = "custom-google-polygon-btn";
        node1.className = "custom-google-drag-btn";
      }
    }, 5000);
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoneName, setZoneName] = useState("");
  const [status, setStatus] = useState(true);
  const [zoneId, setZoneId] = useState(null);
  const [editFlg, seteditFlg] = useState(false);
  const [editId, seteditId] = useState(null);
  const [mapLayers, setMapLayers] = useState([]);
  const [mapLayer, setMapLayer] = useState([]);

  const openModal = (flg, id) => {
    seteditFlg(flg);
    if (id && id != null) seteditId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setZoneName("");
    setStatus(true);
    setZoneId(null);
    seteditFlg(false);
    seteditId(null);
  };

  const addZone = async () => {
    setIsLoading(true);

    let payload = {
      name: zoneName,
      active: status,
      zone_points: mapLayers,
    };
    apiService
      .post("b2b", ADD_ZONE_TO_LIST_URL, payload)
      .then((response) => {
        let res = _.get(response, "data.polygons", {});
        notifySuccess("Zone Added");
        setIsLoading(false);
        getZoneList();
        closeModal();
      })
      .catch(() => {
        notifyError("Zone is not added!, Something went wrong !!");
        setIsLoading(false);
      });
  };

  const updateZone = () => {
    setIsLoading(true);
    apiService
      .put("b2b", STATUS_UPDATE_ZONE_FROM_LIST_URL + editId, null)
      .then(() => {
        notifySuccess("Zone Edited");
        setIsLoading(false);
        getZoneList();
        closeModal();
      })
      .catch(() => {
        notifyError("Something went wrong !!");
        setIsLoading(false);
      });
  };

  const deleteZone = () => {
    apiService
      .delete("b2b", DEL_ZONE_FROM_LIST_URL + editId, null)
      .then(() => {
        notifySuccess("Zone Deleted");
        setIsLoading(false);
        getZoneList();
        closeModal();
      })
      .catch(() => {
        notifyError("Zone is not Deleted!, Something went wrong !!");
        setIsLoading(false);
      });
  };

  const createZone = () => {
    editId != null ? updateZone() : addZone();
  };

  const mapRef = useRef();

  const getPolygon = (pts, status) => {
    var i;
    var latlngs = [];
    for (i = 0; i < pts.length; i++) {
      latlngs.push({ lat: pts[i].lat, lng: pts[i].long });
    }

    return (
      <Polygon
        path={latlngs}
        // key={i}
        options={{
          fillColor: status ? "#59a57d" : "red",
          fillOpacity: 0.4,
          strokeColor: status ? "#347a55" : "red",
          strokeOpacity: 0.8,
          strokeWeight: 3,
        }}
      />
    );
  };

  const makeid = () => {
    var result = "";
    var characters = MAP_ID_CONST;
    var charactersLength = characters.length;
    for (var i = 0; i < 5; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    setIsMap(result);
  };

  const [isMap, setIsMap] = useState(true);
  const [zoom, setZoom] = useState(12);
  const [center, setCenter] = useState({
    lat: 51.505,
    lng: -0.09,
  });

  const {
    DrawingManager,
  } = require("react-google-maps/lib/components/drawing/DrawingManager");

  const mapContainerStyle = {
    height: "900px",
    width: "800px",
  };

  const onLoad = (drawingManager) => {
    console.log(drawingManager);
  };

  const onPolygonComplete = (polygon) => {
    let polygonCoordsArray = [];
    let coords = polygon.getPath().getArray();

    for (let i = 0; i < coords.length; i++) {
      polygonCoordsArray.push(coords[i].lat() + "," + coords[i].lng());
    }

    let latlngs = [];
    polygonCoordsArray.map((cords) => {
      let coordsArraySplit = cords.split(",");
      latlngs.push({
        lat: coordsArraySplit[0],
        long: coordsArraySplit[1],
      });
    });
    setMapLayers(latlngs);
    openModal(false);
  };

  const option = {
    disableDefaultUI: true,
    zoomControl: true,
  };

  const returnStaticMap = ({ center = [79.059308, 66.419569] }) => {
    return (
      <MapContainer
        center={{ lat: center[0], lng: center[1] }}
        zoom={4}
        scrollWheelZoom={false}
        style={{ height: "90vh", width: "50wh", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    );
  };

  const DrawingManagerWrapper = compose(
    withProps({
      googleMapURL:
        `https://maps.googleapis.com/maps/api/js?key=` +
        GOOGLE_MAP_API_KEY +
        `&v=3.exp&libraries=geometry,drawing,places`,
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div className="google-map-custom-height" />,
      mapElement: <div className="google-map-custom-height" />,
    }),
    withScriptjs,
    withGoogleMap
  )((props) => {
    return (
      <>
        <GoogleMap
          defaultZoom={14}
          id="drawing-manager-example"
          mapContainerStyle={mapContainerStyle}
          zoom={14}
          center={center}
          defaultOptions={option}
        >
          {hasPermission(PAGE_ZONE_LIST, "create") && (
            <DrawingManager
              setMap={GoogleMap}
              overlaycomplete={props.onComplete}
              onLoad={onLoad}
              onPolygonComplete={onPolygonComplete}
              defaultOptions={{
                drawingControl: true,
                // drawingMode: google.maps.drawing.OverlayType.POLYGON,
                drawingControlOptions: {
                  style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                  position: window.google.maps.ControlPosition.RIGHT_CENTER,
                  drawingModes: [
                    window.google.maps.drawing.OverlayType.POLYGON,
                  ],
                },
                polygonOptions: {
                  fillColor: "#59a57d",
                  fillOpacity: 0.2,
                  strokeWeight: 2,
                  strokeColor: "#347a55",
                  clickable: true,
                  editable: true,
                  geodesic: false,
                  visible: true,
                  zIndex: 1,
                  paths: [
                    { lat: 51.509674, lng: -0.193036 },
                    { lat: 51.50947, lng: -0.194151 },
                    { lat: 51.509116, lng: -0.194034 },
                  ],
                },
              }}
            />
          )}
          {zones.length
            ? zones.map((zone) => {
                return getPolygon(zone.points, zone.active, zone.name);
              })
            : null}
        </GoogleMap>
      </>
    );
  });

  const currentZones = JSON.stringify(zones);
  const prevZone = usePrevious(zones);
  const isZoneStateChanged = currentZones === JSON.stringify(prevZone);

  let getAutoComplete = () => {
    return (
      <Autocomplete
        apiKey={GOOGLE_MAP_API_KEY}
        googleMapsScriptBaseUrl={
          "https://maps.googleapis.com/maps/api/js?key=AIzaSyDNgw8gwBZkqlYdvBxs00W2ROJFfmzT63s&libraries=geometry,drawing,places"
        }
        onPlaceSelected={(place) => {
          console.log();
          let placeSelected = JSON.parse(JSON.stringify(place));
          setCenter({
            lat: placeSelected.geometry.location.lat,
            lng: placeSelected.geometry.location.lng,
          });
          setZoneCenter([
            placeSelected.geometry.location.lat,
            placeSelected.geometry.location.lng,
          ]);
          setZoom(16);
        }}
        options={{
          types: ["geocode"],
        }}
        placeholder={"Search Google Maps"}
        language={"en"}
      />
    );
  };

  const [onLoadOfComponent, setOnLoadOfComponent] = useState(false);
  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container spacing={3}>
        <Grid
          item
          md={8}
          sm={8}
          xs={12}
          sx={{ display: { xs: "block", sm: "none" } }}
          className="mb-4"
        >
          {onLoadOfComponent ? (
            getAutoComplete()
          ) : (
            <Loading loading={!onLoadOfComponent} />
          )}
          {isMap ? (
            <>
              {!isModalOpen ? (
                <DrawingManagerWrapper center={zoneCenter} />
              ) : (
                returnStaticMap(zoneCenter)
              )}
            </>
          ) : null}
        </Grid>
        <Grid item md={4} sm={4} xs={12} className="">
          {
            <ZoneList
              zones={zones}
              setZoneName={setZoneName}
              setStatus={setStatus}
              openModal={openModal}
              closeModal={closeModal}
              getZoneList={getZoneList}
              setZoneCenter={setZoneCenter}
              setCenter={setCenter}
              setIsLoading={setIsLoading}
            />
          }
        </Grid>
        <Grid
          item
          md={8}
          sm={8}
          xs={12}
          sx={{ display: { xs: "none", sm: "block" } }}
        >
          {onLoadOfComponent ? (
            getAutoComplete()
          ) : (
            <Loading loading={!onLoadOfComponent} />
          )}
          {isMap ? (
            <>
              {!isModalOpen ? (
                <DrawingManagerWrapper center={zoneCenter} />
              ) : (
                returnStaticMap(zoneCenter)
              )}
            </>
          ) : null}
        </Grid>
      </Grid>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        className="custom-modal-css w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg sm:m-4 sm:max-w-xl custom-modal"
      >
        <ModalBody>
          <Input
            className="mt-1 border"
            type="text"
            value={zoneName}
            required
            placeholder="Zone Name"
            onChange={(e) => setZoneName(e.target.value)}
          />
          <br />
          <Grid className="mt-4 pl-2" container spacing={3}>
            {hasPermission(PAGE_ZONE_LIST, "update") && (
              <>
                <Grid
                  item
                  lg={3}
                  md={4}
                  className="text-dark dark:text-white ml-2"
                >
                  <h5>
                    <strong>{"Status :"}</strong>
                  </h5>
                </Grid>
                <Grid item md={4} className="">
                  <Switch
                    className="ml-1"
                    offColor="#f05252"
                    checkedIcon={false}
                    uncheckedIcon={false}
                    onChange={() => {
                      setStatus(!status);
                    }}
                    checked={status}
                  />
                </Grid>
              </>
            )}
            {hasPermission(PAGE_ZONE_LIST, "delete") && (
              <Grid item md={4} className="text-dark dark:text-white ml-2">
                {editFlg ? (
                  <FiTrash2
                    className="text-lg ml-4 text-red-700 cursor-pointer"
                    onClick={deleteZone}
                  />
                ) : null}
              </Grid>
            )}
          </Grid>
        </ModalBody>
        <ModalFooter>
          <Button
            className="w-full sm:w-auto"
            layout="outline"
            onClick={closeModal}
          >
            Cancel
          </Button>
          <Button className="w-full sm:w-auto" onClick={createZone}>
            Submit
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default Zone;
