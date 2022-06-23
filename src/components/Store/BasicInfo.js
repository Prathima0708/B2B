/* eslint-disable react-hooks/exhaustive-deps */

import "./store.css";

import { Badge, Button, Input, Label, Select } from "@windmill/react-ui";
import { FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import React, { useEffect, useRef, useState } from "react";
import {
  dayOptions,
  startTimeOption,
  stopTimeOption,
} from "../../utils/dayAndTimeUtils";

import ExistingImageDisplay from "../image-uploader/ExistingImageDisplay";
import { GOOGLE_MAP_API_KEY } from "../../pages/Zones/constants";
import Grid from "@mui/material/Grid";
import LabelArea from "../form/LabelArea";
import Loading from "../preloader/Loading";
import ReactGoogleAutocomplete from "react-google-autocomplete";
import Uploader from "../image-uploader/Uploader";

const Map = ({ center, zoom, setShopLatLng, shopLatLng }) => {
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
  const [position, setPosition] = useState(center || shopLatLng);
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
    setShopLatLng(newPos);
    setPosition(newPos);
  }
  const fetchPlaceDetails = async () => {
    handleCenterChanged();
    fetchMarkerData(position.lat, position.lng);
  };

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
            onCloseClick={() => {
              setShowInfo(false);
            }}
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

function BasicInfo(props) {
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [shopName, setShopName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState();
  const [shopPhone, setShopPhone] = useState("");
  const [shopEmail, setShopEmail] = useState("");
  const [shopLatLng, setShopLatLng] = useState(
    props.state?.shopLatLng || { lat: 25.286106, lng: 51.534817 }
  );
  const [shopBuildingName, setShopBuildingName] = useState(undefined);
  const [shopStreet, setShopStreet] = useState(undefined);
  const [shopLocality, setShopLocality] = useState(undefined);
  const [shopCity, setShopCity] = useState(undefined);
  const [storeEnabled, setStoreEnabled] = useState("true");
  const [storeType, setStoreType] = useState("SUPPLIER");
  const [landmark, setLandmark] = useState(undefined);
  const [center, setCenter] = useState(
    props.state?.shopLatLng || { lat: 25.286106, lng: 51.534817 }
  );
  const [onLoadOfComponent, setOnLoadOfComponent] = useState(true);
  const storeShowTimeCutOffOptions = [0, 1, 2, 3, 4, 5, 6, 7];
  const [storeShowTimeCutOff, setStoreShowTimeCutOff] = useState(
    storeShowTimeCutOffOptions[0]
  );
  const [shopImageFormData, setShopImageFormData] = useState({
    url: undefined,
    formData: undefined,
    previewUrl: undefined,
  });
  const [workingHours, setWorkingHours] = useState(
    dayOptions.map((day) => {
      return {
        ...day,
        storeOpen: true,
        openTimeOption: startTimeOption,
        closeTimeOption: stopTimeOption,
        openTime: undefined,
        closeTime: undefined,
      };
    })
  );
  const [gLatLng, setGLatLng] = useState({ lat: null, lng: null });

  useEffect(() => {
    setStepIndex(props.stepIndex);
  }, [workingHours]);

  useEffect(() => {
    if (props.state !== null) {
      setCenter(props.state.shopLatLng);
      setShopLatLng(props.state.shopLatLng);
      setLoading(true);
      setShopName(props.state.shopName);
      setRegistrationNumber(props.state.registrationNumber);
      setShopPhone(props.state.shopPhone);
      setShopEmail(props.state.shopEmail);
      setGLatLng(props.state.shopLatLng);
      props.state.shopBuildingName &&
        setShopBuildingName(props.state.shopBuildingName);
      props.state.shopStreet && setShopStreet(props.state.shopStreet);
      props.state.shopLocality && setShopLocality(props.state.shopLocality);
      props.state.shopCity && setShopCity(props.state.shopCity);
      props.state.landmark && setLandmark(props.state.landmark);
      props.state.workingHours &&
        props.state.workingHours.length > 0 &&
        setWorkingHours(props.state.workingHours);
      props.state.storeShowTimeCutOff &&
        setStoreShowTimeCutOff(props.state.storeShowTimeCutOff);
      props.state.shopImageFormData?.url &&
        setShopImageFormData(props.state.shopImageFormData);
      props.state.storeEnabled && setStoreEnabled(props.state.storeEnabled);
      setStoreType(props.state.storeType);
      setCenter(props.state.shopLatLng);

      setLoading(false);
    }
  }, [props.state]);

  const returnWorkingHoursArray = () => {
    const openDays = workingHours.filter((day) => day.storeOpen);
    const definedTimes = openDays.filter(
      (day) => day.openTime && day.closeTime
    );
    if (definedTimes.length === 0) return [];
    const workingHoursArray = [];
    definedTimes.forEach((day) => {
      const open = startTimeOption[day.openTime];
      const close = stopTimeOption[day.closeTime];
      if (close.time === "00:00") close.time = "24:00";
      const openTimeArray = open.time.split(":");
      const openTimeInMinutes =
        Number(openTimeArray[0]) * 60 + Number(openTimeArray[1]);
      const closeTimeArray = close.time.split(":");
      const closeTimeInMinutes =
        Number(closeTimeArray[0]) * 60 + Number(closeTimeArray[1]);
      const workingTimeInMins = closeTimeInMinutes - openTimeInMinutes;
      workingHoursArray.push({
        dayOfWeek: day.id,
        openTime: open?.time,
        workingTimeInMins,
      });
    });
    return workingHoursArray;
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

  const renderDayWorkingHourInput = () => {
    return workingHours.map(
      ({
        id,
        day,
        storeOpen,
        openTimeOption,
        closeTimeOption,
        openTime,
        closeTime,
      }) => (
        <div
          key={id}
          className="flex flex-col md:flex-row place-content-between "
        >
          <div className="w-full md:w-1/3 p-2 self-center">
            <LabelArea label={day} />
          </div>
          {/* <div className="w-2/3"> */}
          {storeOpen ? (
            <>
              <div className="w-full md:w-1/3 p-2">
                <div className="col-span-8 sm:col-span-4">
                  <Select
                    required
                    onChange={(e) =>
                      setWorkingHours((prevData) => {
                        prevData[id].openTime = e.target.value;
                        prevData[id].closeTimeOption = stopTimeOption.slice(
                          Number(e.target.value)
                        );
                        return [...prevData];
                      })
                    }
                    className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                    name="slotStartTime"
                    value={openTime}
                  >
                    <option value="" hidden>
                      Select store open time
                    </option>
                    {openTimeOption.map((time) => (
                      <option key={time.id} value={time.id}>
                        {time.time}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="w-full md:w-1/3 p-2">
                <div className="col-span-8 sm:col-span-4">
                  <Select
                    required
                    onChange={(e) =>
                      setWorkingHours((prevData) => {
                        prevData[id].closeTime = e.target.value;
                        prevData[id].openTimeOption = startTimeOption.slice(
                          0,
                          Number(e.target.value) + 1
                        );
                        return [...prevData];
                      })
                    }
                    className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                    name="slotEndTime"
                    value={closeTime}
                  >
                    <option value="" hidden>
                      Select store close time
                    </option>
                    {closeTimeOption.map((time) => (
                      <option key={time.id} value={time.id}>
                        {time.time}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              <span className="p-2 text-xl self-center ">
                <Badge
                  className="cursor-pointer"
                  type="danger"
                  onClick={() => {
                    setWorkingHours((prevData) => {
                      prevData[id].storeOpen = false;
                      return [...prevData];
                    });
                  }}
                >
                  X
                </Badge>
              </span>
            </>
          ) : (
            <div className="dark:text-gray-300 text-gray-900">
              <RadioGroup
                name="storeOpen"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
                value={storeOpen}
                onChange={(e) =>
                  setWorkingHours((prevData) => {
                    prevData[id].storeOpen = Boolean(e.target.value);
                    return [...prevData];
                  })
                }
              >
                <FormControlLabel
                  value={true}
                  control={<Radio />}
                  label="Open"
                />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label="Close"
                />
              </RadioGroup>
            </div>
          )}
          {/* </div> */}
        </div>
      )
    );
  };
  return (
    <>
      {loading ? (
        <Loading loading={loading} />
      ) : (
        <>
          <Grid container spacing={3}>
            <Grid item md={12} className="">
              <h2 className="text-gray-300 text-lg">{"Business Info"}</h2>
            </Grid>
            <Grid item lg={6} md={12} sm={12} xs={12} className="">
              <Label>
                <span>Business / shop name</span>
                <Input
                  className="mt-1 border"
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                />
              </Label>
            </Grid>
            <Grid item lg={6} md={12} sm={12} xs={12} className="">
              <Label>
                <span>Registration Number</span>
                <Input
                  className="mt-1 border"
                  type="text"
                  value={registrationNumber}
                  name="registrationNumber"
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                />
              </Label>
            </Grid>
            <Grid item lg={6} md={12} sm={12} xs={12} className="">
              <Label>
                <span>Phone</span>
                <Input
                  className="mt-1 border"
                  type="text"
                  value={shopPhone}
                  name="shopPhone"
                  onChange={(e) => setShopPhone(e.target.value)}
                />
              </Label>
            </Grid>
            <Grid item lg={6} md={12} sm={12} xs={12} className="">
              <Label>
                <span>Email</span>
                <Input
                  className="mt-1 border"
                  type="text"
                  value={shopEmail}
                  name="shopEmail"
                  onChange={(e) => setShopEmail(e.target.value)}
                />
              </Label>
            </Grid>
            <Grid item lg={6} md={12} sm={12} xs={12} className="">
              <Label>
                <span>Location</span>
                {onLoadOfComponent ? (
                  <>{getAutoComplete()}</>
                ) : (
                  <div className="mb-2">
                    <Loading loading={!onLoadOfComponent} />
                  </div>
                )}

                <Map
                  zoom={14}
                  center={center}
                  shopLatLng={shopLatLng}
                  setShopLatLng={setShopLatLng}
                ></Map>
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
                  value={shopBuildingName}
                  onChange={(e) => setShopBuildingName(e.target.value)}
                />
              </Label>
            </Grid>

            <Grid item lg={6} md={12} sm={12} xs={12} className="">
              <Label>
                <span>Street</span>
                <Input
                  className="mt-1 border"
                  type="text"
                  value={shopStreet}
                  name="shopStreet"
                  onChange={(e) => setShopStreet(e.target.value)}
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
                  value={shopLocality}
                  onChange={(e) => setShopLocality(e.target.value)}
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
                  value={shopCity}
                  onChange={(e) => setShopCity(e.target.value)}
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
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                />
              </Label>
            </Grid>
            <Grid
              item
              lg={6}
              md={6}
              sm={12}
              xs={12}
              className=" dark:text-gray-300 text-gray-900"
            >
              <LabelArea label="Store Enabled" />
              <div className="col-span-8 sm:col-span-4">
                <RadioGroup
                  name="storeEnabled"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                  }}
                  value={storeEnabled}
                  onChange={(e) => setStoreEnabled(e.target.value)}
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>
              </div>
            </Grid>
            <Grid
              item
              lg={6}
              md={6}
              sm={12}
              xs={12}
              className=" dark:text-gray-300 text-gray-900"
            >
              {process.env.REACT_APP_PRODUCT_ENV === "B2B" && (
                <>
                  <LabelArea label="Store Type" />
                  <div className="col-span-8 sm:col-span-4">
                    <RadioGroup
                      name="storeType"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                      }}
                      value={storeType}
                      onChange={(e) => setStoreType(e.target.value)}
                    >
                      <FormControlLabel
                        value="SUPPLIER"
                        control={<Radio />}
                        label="Supplier"
                      />
                      <FormControlLabel
                        value="SELLER"
                        control={<Radio />}
                        label="Seller"
                      />
                    </RadioGroup>
                  </div>
                </>
              )}
            </Grid>
            <Grid item lg={6} md={12} sm={12} xs={12} className="">
              <Label>
                <span>Shop image</span>
              </Label>
              {shopImageFormData.url ? (
                <ExistingImageDisplay
                  setFormData={setShopImageFormData}
                  url={shopImageFormData.url}
                />
              ) : (
                <Uploader setFormData={setShopImageFormData} />
              )}
            </Grid>
            <Grid item lg={6} md={12} sm={12} xs={12} className=""></Grid>
            {/* <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Credit Period Required (days)</span>
            <Input
              className="mt-1 border"
              type="text"
              //valid={creditPeriod? true : null}
              value={creditPeriod}
              onChange={(e) => setCreditPeriod(e.target.value)}
            />
          </Label>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className=""></Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Security Cheque / cash</span>
            <Input
              className="mt-1 border"
              type="text"
              //valid={security? true : null}
              value={security}
              onChange={(e) => setSecurity(e.target.value)}
            />
          </Label>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Security Amount</span>
            <Input
              className="mt-1 border"
              type="number"
              //valid={securityAmt? true : null}
              value={securityAmt}
              onChange={(e) => setSecurityAmt(e.target.value)}
            />
          </Label>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Security Check Image</span>
          </Label>
          <Uploader setFormData={setSecurityChequeFormData} />
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span> &nbsp;</span>
            <p className="text-gray-500 mt-1">
              {`Lorem ipsum dolr sit amet, consteur 
                    elitr, sed diam noumy nonumy tempor invidunt`}
            </p>
          </Label>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Average monthly purchase</span>
            <Input
              className="mt-1 border"
              type="text"
              //valid={avgMonthlyPurchase? true : false}
              value={avgMonthlyPurchase}
              onChange={(e) => setAvgMonthlyPurchase(e.target.value)}
            />
          </Label>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className=""></Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Expiry policy</span>
            <Input
              className="mt-1 border"
              type="text"
              //valid={expPolicy? true : false}
              value={expPolicy}
              onChange={(e) => setExpPolicy(e.target.value)}
            />
          </Label>
        </Grid> */}
            {/* <Grid item lg={6} md={12} sm={12} xs={12} className=""></Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Number of Branches</span>
            <Input
              className="mt-1 border"
              type="number"
              //valid={numberOfBranch? true : false}
              value={numberOfBranch}
              onChange={(e) => setNumberOfBranch(e.target.value)}
            />
          </Label>
        </Grid> */}
            <Grid item lg={6} md={12} className=""></Grid>
            <Grid item lg={12} md={12} sm={12} xs={12} className="">
              <Label className="mb-1">
                <span>Working Hours</span>
              </Label>
              <div className="border p-4 border-gray-500 rounded-xl">
                {workingHours.length > 0 && renderDayWorkingHourInput()}
              </div>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12} className="">
              <Label className="mb-1">
                <span>Select number of days to show store slot</span>
              </Label>
              <Select
                onChange={(e) => setStoreShowTimeCutOff(e.target.value)}
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                name="Select number of days to show store slot"
                required
                value={storeShowTimeCutOff}
              >
                {storeShowTimeCutOffOptions.map((day, i) => (
                  <option key={i} value={day}>
                    {`${day} days`}
                  </option>
                ))}
              </Select>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12} className="">
              <Button
                size="small"
                className="w-full rounded-md h-12 mt-1"
                onClick={() => {
                  props.onClickEvent(1);
                  let businessInfo = {
                    name: shopName,
                    registrationNumber,
                    phone: shopPhone,
                    email: shopEmail,
                    address: {
                      buildingName: shopBuildingName,
                      street: shopStreet,
                      locality: shopLocality,
                      city: shopCity,
                      landmark,
                    },
                    storeEnabled: Boolean(storeEnabled),
                    storeType:
                      process.env.REACT_APP_PRODUCT_ENV === "B2B"
                        ? storeType
                        : "SELLER",
                    latitude: shopLatLng?.lat ? shopLatLng.lat : 25.286106,
                    longitude: shopLatLng?.lng ? shopLatLng.lng : 51.534817,
                    // latitude: gLatLng?.lat ? gLatLng.lat : 25.286106,
                    // longitude: gLatLng?.lng ? gLatLng.lng : 51.534817,

                    workingHours: returnWorkingHoursArray(),
                    shopImageFormData,
                    storeShowTimeCutOff: Number(storeShowTimeCutOff),
                  };
                  let state = {
                    shopName,
                    registrationNumber,
                    shopPhone,
                    shopEmail,
                    shopLatLng: shopLatLng
                      ? shopLatLng
                      : { lat: 25.286106, lng: 51.534817 },
                    // shopLatLng: gLatLng ? gLatLng : { lat: 25.286106, lng: 51.534817 },
                    shopBuildingName,
                    shopStreet,
                    shopLocality,
                    shopCity,
                    landmark,
                    workingHours,
                    shopImageFormData,
                    storeShowTimeCutOff,
                    storeEnabled,
                    storeType,
                    // shopLandMark,
                    // creditPeriod,
                    // security,
                    // securityAmt,
                    // avgMonthlyPurchase,
                    // expPolicy,
                    // numberOfBranch,
                    // securityChequeFormData,
                  };
                  props.onNextHandel(businessInfo, state);
                }}
              >
                Next
              </Button>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
}

export default BasicInfo;
