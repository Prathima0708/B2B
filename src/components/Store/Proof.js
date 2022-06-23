/* eslint-disable react-hooks/exhaustive-deps */

import "./store.css";

import { Button, Input, Label } from "@windmill/react-ui";
import React, { useEffect, useState } from "react";
import hasPermission, { PAGE_STORE_UPDATE } from "../login/hasPermission";

import ExistingImageDisplay from "../image-uploader/ExistingImageDisplay";
import { FiTrash2 } from "react-icons/fi";
import Grid from "@mui/material/Grid";
import Uploader from "../image-uploader/Uploader";

function Proof(props) {
  const [customerRegistrationFormData, setCustomerRegistrationFormData] = useState({
    url: undefined,
    formData: undefined,
    previewUrl: undefined,
  });
  const [tradeLicenseNumberFormData, setTradeLicenseNumberFormData] = useState({
    url: undefined,
    formData: undefined,
    previewUrl: undefined,
  });
  // const [drugLicenseNumber, setDrugLicenseNumber] = useState("");
  // const [drugLicenseIssueDate, setDrugLicenseIssueDate] = useState("");
  // const [drugLicenseExpiryDate, setDrugLicenseExpiryDate] = useState("");
  // const [customerRegNumber, setCustomerRegNumber] = useState("");
  // const [customerRegExpiryDate, setCustomerRegExpiryDate] = useState("");
  // const [tradeLicenseNumber, setTradeLicenseNumber] = useState("");
  // const [tradeLicenseIssueDate, setTradeLicenseIssueDate] = useState("");
  // const [tradeLicenseExpiryDate, setTradeLicenseExpiryDate] = useState("");

  useEffect(() => {
    if (props.state !== null) {
      props.state.customerRegistrationFormData?.url &&
        setCustomerRegistrationFormData(props.state.customerRegistrationFormData);
      props.state.tradeLicenseNumberFormData?.url &&
        setTradeLicenseNumberFormData(props.state.tradeLicenseNumberFormData);
      // setDrugLicenseNumber(props.state.drugLicenseNumber);
      // setDrugLicenseIssueDate(props.state.drugLicenseIssueDate);
      // setDrugLicenseExpiryDate(props.state.drugLicenseExpiryDate);
      // setCustomerRegNumber(props.state.customerRegNumber);
      // setCustomerRegExpiryDate(props.state.customerRegExpiryDate);
      // setTradeLicenseNumber(props.state.tradeLicenseNumber);
      // setTradeLicenseIssueDate(props.state.tradeLicenseIssueDate);
      // setTradeLicenseExpiryDate(props.state.tradeLicenseExpiryDate);
    }
  }, [props.state]);

  return (
    <>
      <Grid container spacing={4}>
        <Grid item md={12} className="">
          <h2 className="text-gray-300 text-lg">{"Proof"}</h2>
        </Grid>
        {/* <Grid item lg={6} md={12} sm={12} xs={12} className="">
                    <Label>
                        <span>Drug license number(for pharmacy)</span>
                        <Input className="mt-1 border" type="text" 
                        //valid={drugLicenseNumber? true : false} 
                        value={drugLicenseNumber}
                        onChange={(e) => setDrugLicenseNumber(e.target.value)}/>
                    </Label>   
                </Grid>
                <Grid item lg={3} md={6} sm={12} xs={12} className="">
                    <Label>
                        <span>Issue date</span>
                        <Input className="mt-1 border" type="date"
                        //valid={drugLicenseIssueDate? true : false} 
                        value={drugLicenseIssueDate}
                        onChange={(e) => setDrugLicenseIssueDate(e.target.value)}/>
                    </Label>   
                </Grid>
                <Grid item lg={3} md={6} sm={12} xs={12} className="">
                    <Label>
                        <span>Expiry date</span>
                        <Input className="mt-1 border" type="date"
                        //valid={drugLicenseExpiryDate? true : false} 
                        value={drugLicenseExpiryDate}
                        onChange={(e) => setDrugLicenseExpiryDate(e.target.value)}/>
                    </Label>   
                </Grid> 
                <Grid item lg={6} md={12} sm={12} xs={12} className="">
                    <Label>
                        <span>&nbsp;</span>
                        <Button className="w-full rounded-md h-12 mt-1">
                            Attach File
                        </Button>
                    </Label>   
                </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Label>
            <span> &nbsp;</span>
            <p className="text-gray-500 mt-1">
              {`Lorem ipsum dolr sit amet, consteur 
                    elitr, sed diam noumy nonumy tempor invidunt`}
            </p>
          </Label>
        </Grid> */}
        {/* <Grid item lg={6} md={12} sm={12} xs={12} className=""> */}
        {/* <Label>
            <span>Customer registration number</span>
            <Input
              className="mt-1 border"
              type="text"
              //valid={customerRegNumber? true : false}
              value={customerRegNumber}
              onChange={(e) => setCustomerRegNumber(e.target.value)}
            />
          </Label> */}
        {/* </Grid> */}
        {/* <Grid item lg={3} md={6} sm={12} xs={12} className=""> */}
        {/* <Label>
            <span>Expiry date</span>
            <Input
              className="mt-1 border"
              type="date"
              //valid={customerRegExpiryDate? true : false}
              value={customerRegExpiryDate}
              onChange={(e) => setCustomerRegExpiryDate(e.target.value)}
            />
          </Label> */}
        {/* </Grid> */}
        {/* <Grid item lg={6} md={6} sm={12} xs={12} className="">
          <Label>
             <span>&nbsp;</span>
            <Button className="rounded-md h-12 mt-2" size="small">
              Verify GST
            </Button>
          </Label>
        </Grid> */}
        <Grid item lg={12} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Customer Registration Image</span>
          </Label>
          {customerRegistrationFormData.url ? (
            <ExistingImageDisplay
              setFormData={setCustomerRegistrationFormData}
              url={customerRegistrationFormData.url}
            />
          ) : (
            <Uploader setFormData={setCustomerRegistrationFormData} />
          )}
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          {/* <Label>
            <span> &nbsp;</span>
            <p className="text-gray-500 mt-1">
              {`Lorem ipsum dolr sit amet, consteur 
                    elitr, sed diam noumy nonumy tempor invidunt`}
            </p>
          </Label> */}
        </Grid>
        {/* <Grid item lg={6} md={12} sm={12} xs={12} className=""> */}
        {/* <Label>
            <span>Trade license number</span>
            <Input
              className="mt-1 border"
              type="text"
              //valid={tradeLicenseNumber? true : false}
              value={tradeLicenseNumber}
              onChange={(e) => setTradeLicenseNumber(e.target.value)}
            />
          </Label> */}
        {/* </Grid> */}
        {/* <Grid item lg={3} md={6} sm={12} xs={12} className=""> */}
        {/* <Label>
            <span>Issue date</span>
            <Input
              className="mt-1 border"
              type="date"
              //valid={tradeLicenseIssueDate? true : false}
              value={tradeLicenseIssueDate}
              onChange={(e) => setTradeLicenseIssueDate(e.target.value)}
            />
          </Label> */}
        {/* </Grid> */}
        {/* <Grid item lg={3} md={6} sm={12} xs={12} className=""> */}
        {/* <Label>
            <span>Expiry date</span>
            <Input
              className="mt-1 border"
              type="date"
              //valid={tradeLicenseExpiryDate? true : false}
              value={tradeLicenseExpiryDate}
              onChange={(e) => setTradeLicenseExpiryDate(e.target.value)}
            />
          </Label> */}
        {/* </Grid> */}
        <Grid item lg={12} md={12} sm={12} xs={12} className="">
          <Label>
            <span>Trade License Number Image</span>
          </Label>
          {tradeLicenseNumberFormData.url ? (
            <ExistingImageDisplay
              setFormData={setTradeLicenseNumberFormData}
              url={tradeLicenseNumberFormData.url}
            />
          ) : (
            <Uploader setFormData={setTradeLicenseNumberFormData} />
          )}
        </Grid>

        <Grid item lg={6} md={12} sm={12} xs={12} className="">
          <Button
            size="small"
            className="w-full rounded-md h-12 mt-1"
            layout="outline"
            onClick={() => {
              props.onClickEvent(1);
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
              props.onClickEvent(3);
              let proof = {
                customerRegistrationFormData,
                tradeLicenseNumberFormData,
              };
              let state = {
                customerRegistrationFormData,
                tradeLicenseNumberFormData,
                // drugLicenseNumber,
                // drugLicenseIssueDate,
                // drugLicenseExpiryDate,
                // customerRegNumber,
                // customerRegExpiryDate,
                // tradeLicenseNumber,
                // tradeLicenseIssueDate,
                // tradeLicenseExpiryDate,
              };
              props.onNextHandel(proof, state);
            }}
          >
            {`Preview${hasPermission(PAGE_STORE_UPDATE, "update") ? " & Submit" : ""}`}
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default Proof;
