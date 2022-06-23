/* eslint-disable react-hooks/exhaustive-deps */

import "./store.css";

import { Button, Input, Label } from "@windmill/react-ui";
import React, { useEffect, useState } from "react";

import ExistingImageDisplay from "../image-uploader/ExistingImageDisplay";

import Grid from "@mui/material/Grid";
import Uploader from "../image-uploader/Uploader";

function ContactInfo(props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [authorizedPersonName, setAuthorizedPersonName] = useState("");
  const [authorizedPhoneNumber, setAuthorizedPhoneNumber] = useState("");
  const [authorizedEmail, setAuthorizedEmail] = useState("");
  const [authorizedPersonIdProofFormData, setAuthorizedPersonIdProofFormData] =
    useState({
      url: undefined,
      formData: undefined,
      previewUrl: undefined,
    });
  const [contactPersonName, setContactPersonName] = useState("");
  const [contactPersonPhoneNumber, setContactPersonPhoneNumber] = useState("");
  const [contactPersonEmail, setContactPersonEmail] = useState("");
  const [contactPersonIdProofFormData, setContactPersonIdProofFormData] =
    useState({
      url: undefined,
      formData: undefined,
      previewUrl: undefined,
    });
  // const [authorizedQatarId, setAuthorizedQatarId] = useState("");
  // const [contactPersonQatarId, setContactPersonQatarId] = useState("");
  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    setStepIndex(props.stepIndex);
  }, []);

  useEffect(() => {
    if (props.state !== null) {
      props.state.authorizedPersonName &&
        setAuthorizedPersonName(props.state.authorizedPersonName);
      props.state.authorizedPhoneNumber &&
        setAuthorizedPhoneNumber(props.state.authorizedPhoneNumber);
      props.state.authorizedEmail &&
        setAuthorizedEmail(props.state.authorizedEmail);
      props.state.authorizedPersonIdProofFormData?.url &&
        setAuthorizedPersonIdProofFormData(
          props.state.authorizedPersonIdProofFormData
        );
      props.state.contactPersonName &&
        setContactPersonName(props.state.contactPersonName);
      props.state.contactPersonPhoneNumber &&
        setContactPersonPhoneNumber(props.state.contactPersonPhoneNumber);
      props.state.contactPersonEmail &&
        setContactPersonEmail(props.state.contactPersonEmail);
      props.state.contactPersonIdProofFormData?.url &&
        setContactPersonIdProofFormData(
          props.state.contactPersonIdProofFormData
        );
    }
  }, [props.state]);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={12} className="">
          <h2 className="text-gray-300 text-lg">{"Contact Info"}</h2>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Authorized person name</span>
            <Input
              className="mt-1 border"
              type="text"
              //valid={authorizedPersonName? true : false}
              value={authorizedPersonName}
              onChange={(e) => setAuthorizedPersonName(e.target.value)}
            />
          </Label>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className=""></Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Phone number</span>
            <Input
              className="mt-1 border"
              type="text"
              //valid={authorizedPhoneNumber? true : false}
              value={authorizedPhoneNumber}
              onChange={(e) => setAuthorizedPhoneNumber(e.target.value)}
            />
          </Label>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Email</span>
            <Input
              className="mt-1 border"
              type="mail" //valid={authorizedEmail? true : false}
              value={authorizedEmail}
              onChange={(e) => setAuthorizedEmail(e.target.value)}
            />
          </Label>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          {/* <Label>
            <span>Qatar ID</span>
            <Input
              className="mt-1 border"
              type="text"
              //valid={authorizedQatarId? true : false}
              value={authorizedQatarId}
              onChange={(e) => setAuthorizedQatarId(e.target.value)}
            />
          </Label> */}
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className=""></Grid>
        <Grid item lg={12} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Authorized Person ID Proof Image</span>
          </Label>
          {authorizedPersonIdProofFormData.url ? (
            <ExistingImageDisplay
              setFormData={setAuthorizedPersonIdProofFormData}
              url={authorizedPersonIdProofFormData.url}
            />
          ) : (
            <Uploader setFormData={setAuthorizedPersonIdProofFormData} />
          )}
        </Grid>

        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Contact person name</span>
            <Input
              className="mt-1 border"
              type="text"
              //valid={contactPersonName? true : false}
              value={contactPersonName}
              onChange={(e) => setContactPersonName(e.target.value)}
            />
          </Label>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className=""></Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Phone number</span>
            <Input
              className="mt-1 border"
              type="text"
              //valid={contactPersonPhoneNumber? true : false}
              value={contactPersonPhoneNumber}
              onChange={(e) => setContactPersonPhoneNumber(e.target.value)}
            />
          </Label>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Email</span>
            <Input
              className="mt-1 border"
              type="email"
              //valid={contactPersonEmail? true : false}
              value={contactPersonEmail}
              onChange={(e) => setContactPersonEmail(e.target.value)}
            />
          </Label>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          {/* <Label>
            <span>Qatar ID</span>
            <Input
              className="mt-1 border"
              type="text"
              //valid={contactPersonQatarId? true : false}
              value={contactPersonQatarId}
              onChange={(e) => setContactPersonQatarId(e.target.value)}
            />
          </Label> */}
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Contact Person ID Proof Images</span>
          </Label>
          {contactPersonIdProofFormData.url ? (
            <ExistingImageDisplay
              setFormData={setContactPersonIdProofFormData}
              url={contactPersonIdProofFormData.url}
            />
          ) : (
            <Uploader setFormData={setContactPersonIdProofFormData} />
          )}
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className=""></Grid>
        <Grid item md={12} sm={12} xs={12} className=""></Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Button
            size="small"
            className="w-full rounded-md h-12 mt-1"
            layout="outline"
            onClick={() => {
              props.onClickEvent(0);
            }}
          >
            Back
          </Button>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Button
            size="small"
            className="w-full rounded-md h-12 mt-1"
            onClick={() => {
              props.onClickEvent(2);
              let contactInfo = {
                authorizedPerson: authorizedPersonName,
                authorizedPersonPhone: authorizedPhoneNumber,
                authorizedPersonEmail: authorizedEmail,
                contactPerson: contactPersonName,
                contactPersonPhone: contactPersonPhoneNumber,
                contactPersonEmail: contactPersonEmail,
                authorizedPersonIdProofFormData,
                contactPersonIdProofFormData,
                // authorizedPersonIdentificationUrl: authorizedQatarId,
                // contactPersonIdentificationUrl: contactPersonQatarId,
              };
              let state = {
                authorizedPersonName,
                authorizedPhoneNumber,
                authorizedEmail,
                authorizedPersonIdProofFormData,
                contactPersonName,
                contactPersonPhoneNumber,
                contactPersonEmail,
                contactPersonIdProofFormData,
                // authorizedQatarId,
                // contactPersonQatarId,
              };
              props.onNextHandel(contactInfo, state);
            }}
          >
            Next
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default ContactInfo;
