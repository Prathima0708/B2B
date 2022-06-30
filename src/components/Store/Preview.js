/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import "./store.css";

import { Button, Input, Label } from "@windmill/react-ui";
import { GoogleMap, Marker, withGoogleMap } from "react-google-maps";
import React, { useEffect, useState } from "react";
import {
  assetServiceBaseUrl,
  coreServiceBaseUrl,
} from "../../utils/backendUrls";
import hasPermission, { PAGE_STORE_UPDATE } from "../login/hasPermission";
import { notifyError, notifySuccess } from "../../utils/toast";
import { useHistory, useParams } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Loading from "../preloader/Loading";
import apiService from "../../utils/apiService";
import axios from "axios";
import { dayOptions } from "../../utils/dayAndTimeUtils";
import { defaultImage } from "../../utils/constants";
import { uploaderUtil } from "../../utils/uploaderUtil";

const MapWithAMarker = withGoogleMap((props) => {
  const [center, setCenter] = useState({ lat: 25.286106, lng: 51.534817 });
  useEffect(() => {
    setCenter(props.center);
  }, [props.center]);
  return (
    <GoogleMap defaultZoom={14} center={center}>
      <Marker position={props.gLatLng} />
    </GoogleMap>
  );
});

function Preview(props) {
  const { id } = useParams();
  const { businessInfo, contactInfo, proof } = props.payload;
  const [loading, setLoading] = useState(false);
  const {
    name,
    registrationNumber,
    address,
    phone,
    email,
    storeEnabled,
    storeType,
    latitude,
    longitude,
    workingHours,
    shopImageFormData,
    storeShowTimeCutOff,
  } = businessInfo;
  const {
    authorizedPerson,
    authorizedPersonPhone,
    authorizedPersonEmail,
    contactPerson,
    contactPersonPhone,
    contactPersonEmail,
    authorizedPersonIdProofFormData,
    contactPersonIdProofFormData,
  } = contactInfo;

  const { customerRegistrationFormData, tradeLicenseNumberFormData } = proof;
  const history = useHistory();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [imageUrl, setImageUrl] = useState(defaultImage);

  const onsubmit = async () => {
    const errors = [];
    if (!name) errors.push("Store name not provided");
    if (!registrationNumber)
      errors.push("Store Registration Number not provided");
    if (!phone) errors.push("Store phone not provided");
    if (!email) errors.push("Store email not provided");
    if (errors.length > 0) {
      errors.forEach((err) => notifyError(err));
      return;
    }
    setLoading(true);
    let payload = {
      name,
      registrationNumber,
      phone,
      email,
      address,
      storeEnabled,
      storeType,
      latitude,
      longitude,
      workingHours,
      storeShowTimeCutOff,
      authorizedPerson,
      authorizedPersonPhone,
      authorizedPersonEmail,
      contactPerson,
      contactPersonEmail,
      contactPersonPhone,
      resources: [],
    };

    if (id) {
      if (shopImageFormData.deletedImageUrl) {
        await axios
          .delete(
            `${assetServiceBaseUrl}/delete/by-url?url=${shopImageFormData.deletedImageUrl}`
          )
          .catch((err) => console.log(err));
      }
      if (customerRegistrationFormData.deletedImageUrl) {
        await axios
          .delete(
            `${assetServiceBaseUrl}/delete/by-url?url=${customerRegistrationFormData.deletedImageUrl}`
          )
          .catch((err) => console.log(err));
      }
      if (tradeLicenseNumberFormData.deletedImageUrl) {
        await axios
          .delete(
            `${assetServiceBaseUrl}/delete/by-url?url=${tradeLicenseNumberFormData.deletedImageUrl}`
          )
          .catch((err) => console.log(err));
      }
      if (authorizedPersonIdProofFormData.deletedImageUrl) {
        await axios
          .delete(
            `${assetServiceBaseUrl}/delete/by-url?url=${authorizedPersonIdProofFormData.deletedImageUrl}`
          )
          .catch((err) => console.log(err));
      }
      if (contactPersonIdProofFormData.deletedImageUrl) {
        await axios
          .delete(
            `${assetServiceBaseUrl}/delete/by-url?url=${contactPersonIdProofFormData.deletedImageUrl}`
          )
          .catch((err) => console.log(err));
      }

      if (shopImageFormData.formData) {
        const shopImageUrl = await uploaderUtil(shopImageFormData.formData);
        payload.resources.push({
          name: "Shop Image",
          value: shopImageUrl,
          type: "STORE_IMAGE",
          sequence: 0,
        });
      }
      if (shopImageFormData.url) {
        payload.resources.push({
          name: "Shop Image",
          value: shopImageFormData.url,
          type: "STORE_IMAGE",
          sequence: 0,
        });
      }
      if (customerRegistrationFormData.formData) {
        const customerRegUrl = await uploaderUtil(
          customerRegistrationFormData.formData
        );
        payload.resources.push({
          name: "Customer registration number",
          value: customerRegUrl,
          type: "IDENTITY_PROOF",
          sequence: 2,
        });
      }
      if (customerRegistrationFormData.url) {
        payload.resources.push({
          name: "Customer registration number",
          value: customerRegistrationFormData.url,
          type: "IDENTITY_PROOF",
          sequence: 2,
        });
      }
      if (tradeLicenseNumberFormData.formData) {
        const tradeLicenseUrl = await uploaderUtil(
          tradeLicenseNumberFormData.formData
        );
        payload.resources.push({
          name: "Trade license number",
          value: tradeLicenseUrl,
          type: "IDENTITY_PROOF",
          sequence: 3,
        });
      }
      if (tradeLicenseNumberFormData.url) {
        payload.resources.push({
          name: "Trade license number",
          value: tradeLicenseNumberFormData.url,
          type: "IDENTITY_PROOF",
          sequence: 3,
        });
      }
      if (authorizedPersonIdProofFormData.formData) {
        payload.authorizedPersonIdentificationUrl = await uploaderUtil(
          authorizedPersonIdProofFormData.formData
        );
      }
      if (authorizedPersonIdProofFormData.url) {
        payload.authorizedPersonIdentificationUrl =
          authorizedPersonIdProofFormData.url;
      }
      if (contactPersonIdProofFormData.formData) {
        payload.contactPersonIdentificationUrl = await uploaderUtil(
          contactPersonIdProofFormData.formData
        );
      }
      if (contactPersonIdProofFormData.url) {
        payload.contactPersonIdentificationUrl =
          contactPersonIdProofFormData.url;
      }

      await axios
        .put(`${coreServiceBaseUrl}/admin/store/`, payload, {
          params: {
            "x-store-id": id,
          },
        })
        .then(() => {
          notifySuccess("Store details updated successfully");
          history.push("/store");
        })
        .catch((err) => {
          notifyError(err.response.data.message);
        });
      setLoading(false);
    } else {
      if (authorizedPersonIdProofFormData.formData) {
        payload.authorizedPersonIdentificationUrl = await uploaderUtil(
          authorizedPersonIdProofFormData.formData
        );
      }
      if (contactPersonIdProofFormData.formData) {
        payload.contactPersonIdentificationUrl = await uploaderUtil(
          contactPersonIdProofFormData.formData
        );
      }

      if (shopImageFormData.formData) {
        const shopImageUrl = await uploaderUtil(shopImageFormData.formData);
        payload.resources.push({
          name: "Shop Image",
          value: shopImageUrl,
          type: "STORE_IMAGE",
          sequence: 0,
        });
      }
      if (customerRegistrationFormData.formData) {
        const customerRegUrl = await uploaderUtil(
          customerRegistrationFormData.formData
        );
        payload.resources.push({
          name: "Customer registration number",
          value: customerRegUrl,
          type: "IDENTITY_PROOF",
          sequence: 2,
        });
      }
      if (tradeLicenseNumberFormData.formData) {
        const tradeLicenseUrl = await uploaderUtil(
          tradeLicenseNumberFormData.formData
        );
        payload.resources.push({
          name: "Trade license number",
          value: tradeLicenseUrl,
          type: "IDENTITY_PROOF",
          sequence: 3,
        });
      }

      await apiService
        .post("b2b", "/admin/store", payload)
        .then(() => {
          notifySuccess("Store details added successfully");
          history.push("/store");
        })
        .catch((err) => notifyError(err.response.status));
      setLoading(false);
    }
  };

  return (
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
              disabled
              value={businessInfo.name ? businessInfo.name : null}
            />
          </Label>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span> Registration Number</span>
            <Input
              className="mt-1 border"
              disabled
              value={
                businessInfo.registrationNumber
                  ? businessInfo.registrationNumber
                  : null
              }
            />
          </Label>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Phone</span>
            <Input
              className="mt-1 border"
              disabled
              value={businessInfo.phone ? businessInfo.phone : null}
            />
          </Label>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span> Email</span>
            <Input
              className="mt-1 border"
              disabled
              value={businessInfo.email ? businessInfo.email : null}
            />
          </Label>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Store Location</span>
            {/* <MapContainer
              center={{ lat: businessInfo.latitude, lng: businessInfo.longitude }}
              zoom={14}
              scrollWheelZoom={false}
              style={{ height: "30vh", width: "50wh" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={{ lat: businessInfo.latitude, lng: businessInfo.longitude }}></Marker>
            </MapContainer> */}
            <MapWithAMarker
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDNgw8gwBZkqlYdvBxs00W2ROJFfmzT63s&v=3.exp&libraries=geometry,drawing,places"
              containerElement={<div style={{ height: `300px` }} />}
              mapElement={<div style={{ height: `75%` }} />}
              center={{
                lat: businessInfo.latitude,
                lng: businessInfo.longitude,
              }}
              // setGLatLng={setGLatLng}
              gLatLng={{
                lat: businessInfo.latitude,
                lng: businessInfo.longitude,
              }}
            />
          </Label>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className=""></Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Building Name</span>
            <Input
              className="mt-1 border"
              disabled
              value={
                businessInfo.address.buildingName
                  ? businessInfo.address.buildingName
                  : null
              }
            />
          </Label>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Street</span>
            <Input
              className="mt-1 border"
              disabled
              value={
                businessInfo.address.street ? businessInfo.address.street : null
              }
            />
          </Label>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Locality</span>
            <Input
              className="mt-1 border"
              disabled
              value={
                businessInfo.address.locality
                  ? businessInfo.address.locality
                  : null
              }
            />
          </Label>
        </Grid>
        <Grid item lg={3} md={6} sm={12} xs={12} className="">
          <Label>
            <span>City</span>
            <Input
              className="mt-1 border"
              disabled
              value={
                businessInfo.address.city ? businessInfo.address.city : null
              }
            />
          </Label>
        </Grid>
        <Grid item lg={3} md={6} sm={12} xs={12} className="">
          <Label>
            <span>Nearest Land Mark</span>
            <Input
              className="mt-1 border"
              disabled
              value={
                businessInfo.address.landmark
                  ? businessInfo.address.landmark
                  : null
              }
            />
          </Label>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Shop images</span>
            <img
              className="mt-1 border"
              width="300"
              src={
                businessInfo.shopImageFormData?.url ||
                businessInfo.shopImageFormData?.previewUrl ||
                imageUrl
              }
              alt=""
            ></img>
          </Label>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className=""></Grid>
        {/* <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Credit Period Required (days)</span>
            <Input
              className="mt-1 border"
              disabled
              value={businessInfo != null ? businessInfo.creditPeriod : null}
            />
          </Label>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className=""></Grid> */}
        {/* <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Security Cheque / cash</span>
            <Input
              className="mt-1 border"
              disabled
              value={businessInfo != null ? businessInfo.security : null}
            />
          </Label>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Security Amount</span>
            <Input
              className="mt-1 border"
              disabled
              value={businessInfo != null ? businessInfo.securityAmt : null}
            />
          </Label>
        </Grid> */}
        {/* <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Security cheque image</span>
            <img
              className="mt-1 border"
              width="300"
              src={businessInfo.securityChequeFormData?.previewUrl || imageUrl}
              alt=""
            ></img>
          </Label>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className=""></Grid> */}
        {/* <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Average monthly purchase</span>
            <Input
              className="mt-1 border"
              disabled
              value={businessInfo != null ? businessInfo.avgMonthlyPurchase : null}
            />
          </Label>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className=""></Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Expiry policy</span>
            <Input
              className="mt-1 border"
              disabled
              value={businessInfo != null ? businessInfo.expPolicy : null}
            />
          </Label>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className=""></Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Number of Branches</span>
            <Input
              className="mt-1 border"
              disabled
              value={businessInfo != null ? businessInfo.numberOfBranch : null}
            />
          </Label>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className=""></Grid> */}
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Working Hours</span>
            {workingHours.length > 0 ? (
              workingHours.map((day) => (
                <div className="flex flex-row justify-between">
                  <div className="w-1/3 px-1">
                    <Input
                      className="mt-1 border "
                      disabled
                      value={dayOptions.find((d) => d.id === day.dayOfWeek).day}
                    />
                  </div>
                  <div className="w-1/3 px-1">
                    <Input
                      className="mt-1 border "
                      disabled
                      value={day.openTime}
                    />
                  </div>
                  <div className="w-1/3 px-1">
                    <Input
                      className="mt-1 border "
                      disabled
                      value={`${day.workingTimeInMins} Minutes`}
                    />
                  </div>
                </div>
              ))
            ) : (
              <Input
                className="mt-1 border"
                disabled
                value="Working hours not specified"
              />
            )}
          </Label>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Store Slot Shown</span>
            <Input
              className="mt-1 border"
              disabled
              value={`${storeShowTimeCutOff} Days`}
            />
          </Label>
        </Grid>
        <Grid item md={12} className="">
          <h2 className="text-gray-300 text-lg">{"Contact Info"}</h2>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Authorized person name</span>
            <Input
              className="mt-1 border"
              disabled
              value={
                contactInfo.authorizedPerson
                  ? contactInfo.authorizedPerson
                  : null
              }
            />
          </Label>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className=""></Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Phone number</span>
            <Input
              className="mt-1 border"
              disabled
              value={
                contactInfo.authorizedPersonPhone
                  ? contactInfo.authorizedPersonPhone
                  : null
              }
            />
          </Label>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Email</span>
            <Input
              className="mt-1 border"
              type="mail"
              disabled
              value={
                contactInfo.authorizedPersonEmail
                  ? contactInfo.authorizedPersonEmail
                  : null
              }
            />
          </Label>
        </Grid>
        {/* <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Qatar ID</span>
            <Input
              className="mt-1 border"
              disabled
              value={
                props.state.contactInfoState != null ? props.state.contactInfoState.authorizedQatarId : null
              }
            />
          </Label>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className=""></Grid> */}
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Authorized Person identification image</span>
            <img
              className="mt-1 border"
              width="300"
              src={
                contactInfo.authorizedPersonIdProofFormData?.url ||
                contactInfo.authorizedPersonIdProofFormData?.previewUrl ||
                imageUrl
              }
              alt=""
            ></img>
          </Label>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className=""></Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Contact person name</span>
            <Input
              className="mt-1 border"
              disabled
              value={
                contactInfo.contactPerson ? contactInfo.contactPerson : null
              }
            />
          </Label>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className=""></Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Phone number</span>
            <Input
              className="mt-1 border"
              disabled
              value={
                contactInfo.contactPersonPhone
                  ? contactInfo.contactPersonPhone
                  : null
              }
            />
          </Label>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Email</span>
            <Input
              className="mt-1 border"
              disabled
              value={
                contactInfo.contactPersonEmail
                  ? contactInfo.contactPersonEmail
                  : null
              }
            />
          </Label>
        </Grid>
        {/* <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Qatar ID</span>
            <Input
              className="mt-1 border"
              disabled
              value={
                props.state.contactInfoState != null
                  ? props.state.contactInfoState.contactPersonQatarId
                  : null
              }
            />
          </Label>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className=""></Grid> */}
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Contact person identification image</span>
            <img
              className="mt-1 border"
              width="300"
              src={
                contactInfo.contactPersonIdProofFormData?.url ||
                contactInfo.contactPersonIdProofFormData?.previewUrl ||
                imageUrl
              }
              alt=""
            ></img>
          </Label>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className=""></Grid>
        <Grid item md={12} className="">
          <h2 className="text-gray-300 text-lg">{"Proof"}</h2>
        </Grid>
        {/* <Grid item md={6} className="">
          <Label>
            <span>Drug license number(for pharmacy)</span>
            <Input
              className="mt-1 border"
              disabled
              value={props.state.proofState != null ? props.state.proofState.drugLicenseNumber : null}
            />
          </Label>
        </Grid> 
        <Grid item lg={3} md={6} sm={12} xs={12} className="">
          <Label>
            <span>Issue date</span>
            <Input
              className="mt-1 border"
              type="date"
              value={props.state.proofState != null ? props.state.proofState.drugLicenseIssueDate : null}
            />
          </Label>
        </Grid>
        <Grid item lg={3} md={6} sm={12} xs={12} className="">
          <Label>
            <span>Expiry date</span>
            <Input
              className="mt-1 border"
              type="date"
              value={props.state.proofState != null ? props.state.proofState.drugLicenseExpiryDate : null}
            />
          </Label> 
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Shop images</span>
            <img className="mt-1 border" width="75" src={imageUrl} alt=""></img>
          </Label>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className=""></Grid>*/}
        {/* <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Customer registration number</span>
            <Input
              className="mt-1 border"
              disabled
              value={props.state.proofState != null ? props.state.proofState.customerRegNumber : null}
            />
          </Label>
        </Grid>
        <Grid item lg={3} md={6} sm={12} xs={12} className="">
          <Label>
            <span>Expiry date</span>
            <Input
              className="mt-1 border"
              type="date"
              value={props.state.proofState != null ? props.state.proofState.customerRegExpiryDate : null}
            />
          </Label>
        </Grid>
        <Grid item lg={3} md={6} sm={12} xs={12} className="">
          <Label>
            <span>&nbsp;</span>
            <Button className="rounded-md h-12 mt-2" size="small">
              <FiCheckCircle className="text-lg ml-4 mr-4 text-white" />
            </Button>
          </Label>
        </Grid> */}
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Registration number image</span>
            <img
              className="mt-1 border"
              width="300"
              src={
                proof.customerRegistrationFormData?.url ||
                proof.customerRegistrationFormData?.previewUrl ||
                imageUrl
              }
              alt=""
            ></img>
          </Label>
        </Grid>
        {/*<Grid item lg={6} md={12} sm={12} xs={12} className=""></Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Trade license number</span>
            <Input
              className="mt-1 border"
              disabled
              value={props.state.proofState != null ? props.state.proofState.tradeLicenseNumber : null}
            />
          </Label>
        </Grid>
        <Grid item lg={3} md={6} sm={12} xs={12} className="">
          <Label>
            <span>Issue date</span>
            <Input
              className="mt-1 border"
              type="date"
              disabled
              value={props.state.proofState != null ? props.state.proofState.tradeLicenseIssueDate : null}
            />
          </Label>
        </Grid>
        <Grid item lg={3} md={6} sm={12} xs={12} className="">
          <Label>
            <span>Expiry date</span>
            <Input
              className="mt-1 border"
              type="date"
              disabled
              value={props.state.proofState != null ? props.state.proofState.tradeLicenseExpiryDate : null}
            />
          </Label>
        </Grid> */}
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Trade license number image</span>
            <img
              className="mt-1 border"
              width="300"
              src={
                proof.tradeLicenseNumberFormData?.url ||
                proof.tradeLicenseNumberFormData?.previewUrl ||
                imageUrl
              }
              alt=""
            ></img>
          </Label>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className=""></Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className=""></Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Button
            size="small"
            className="w-full rounded-md h-12 mt-1"
            layout="outline"
            onClick={() => {
              props.onClickEvent(2);
            }}
          >
            Back
          </Button>
        </Grid>
        {hasPermission(PAGE_STORE_UPDATE, "update") && (
          <Grid item lg={6} md={12} sm={12} xs={12} className="">
            {!loading ? (
              <Button
                size="small"
                className="w-full rounded-md h-12 mt-1"
                onClick={() => {
                  onsubmit();
                }}
              >
                Submit
              </Button>
            ) : (
              <Loading loading={loading} />
            )}
          </Grid>
        )}
      </Grid>
    </>
  );
}

export default Preview;
