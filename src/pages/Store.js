/* eslint-disable jsx-a11y/alt-text */

import "react-step-progress-bar/styles.css";

import { Card, CardBody } from "@windmill/react-ui";
import { ProgressBar, Step } from "react-step-progress-bar";
import React, { useEffect, useState } from "react";
import {
  dayOptions,
  startTimeOption,
  stopTimeOption,
} from "../utils/dayAndTimeUtils";
import hasPermission, {
  PAGE_STORE_UPDATE,
} from "../components/login/hasPermission";

import BasicInfo from "../components/Store/BasicInfo";
import ContactInfo from "../components/Store/ContactInfo";
import Loading from "../components/preloader/Loading";
import MapStoreToZone from "../components/Store/MapStoreToZone";
import PageTitle from "../components/Typography/PageTitle";
import Preview from "../components/Store/Preview";
import Proof from "../components/Store/Proof";
import StoreStepperVertical from "../components/Store/storeStepperVertical";
import apiService from "../utils/apiService";
import { useParams } from "react-router-dom";

const Store = () => {
  const [stepIndex, setStepIndex] = useState(0); // 0,33,66,100
  const [tabIndex, setTabIndex] = useState(0); // 0,1,2 3-> preview
  const [businessInfo, setBusinessInfo] = useState(null);
  const [contactInfo, setContactInfo] = useState(null);
  const [proof, setProof] = useState(null);
  const [businessInfoState, setBusinessInfoState] = useState(null);
  const [contactInfoState, setContactInfoState] = useState(null);
  const [proofState, setProofState] = useState(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    if (id) {
      setLoading(true);
      await apiService
        .get("b2b", `/admin/by-id`, { "x-store-id": id })
        .then((data) => {
          const { result } = data.data;
          const {
            name,
            registrationNumber,
            email,
            phone,
            storeEnabled,
            storeType,
            address,
            latitude,
            longitude,
            authorizedPerson,
            authorizedPersonPhone,
            authorizedPersonEmail,
            authorizedPersonIdentificationUrl,
            contactPerson,
            contactPersonPhone,
            contactPersonEmail,
            contactPersonIdentificationUrl,
            storeShowTimeCutOff,
            resources,
            workingHours,
          } = result;
          const parsedAddress = JSON.parse(address);
          const workingHoursArr = [];
          dayOptions.forEach((day) => {
            const dayObj = {
              ...day,
              storeOpen: true,
              openTimeOption: startTimeOption,
              closeTimeOption: stopTimeOption,
              openTime: undefined,
              closeTime: undefined,
            };
            const existingDay = workingHours?.find(
              (eDay) => eDay.dayOfWeek === day.id
            );
            if (existingDay !== undefined) {
              dayObj.openTime = String(
                startTimeOption.find((opt) => opt.time === existingDay.openTime)
                  .id
              );
              dayObj.closeTimeOption = stopTimeOption.slice(
                startTimeOption.find((opt) => opt.time === existingDay.openTime)
                  .id
              );
              const openTimeArray = existingDay.openTime.split(":");
              const openTimeInMinutes =
                Number(openTimeArray[0]) * 60 + Number(openTimeArray[1]);
              const closeTimeInMinutes =
                openTimeInMinutes + existingDay.workingTimeInMins;
              const closeTimeHour = Math.floor(closeTimeInMinutes / 60);
              const closeTimeMins = closeTimeInMinutes % 60;
              const closeTime = `${
                String(closeTimeHour).length === 1
                  ? `0${closeTimeHour}`
                  : `${closeTimeHour}`
              }:${
                String(closeTimeMins).length === 1
                  ? `0${closeTimeMins}`
                  : `${closeTimeMins}`
              }`;
              dayObj.closeTime = String(
                stopTimeOption.find((opt) => opt.time === closeTime).id
              );
              dayObj.openTimeOption = startTimeOption.slice(
                0,
                stopTimeOption.find((opt) => opt.time === closeTime).id + 1
              );
            }
            workingHoursArr.push(dayObj);
          });

          setBusinessInfoState({
            shopName: name,
            registrationNumber,
            shopPhone: phone,
            shopEmail: email,
            shopLatLng: { lat: latitude, lng: longitude },
            shopBuildingName: parsedAddress.buildingName,
            shopStreet: parsedAddress.street,
            shopLocality: parsedAddress.locality,
            shopCity: parsedAddress.city,
            shopPin: parsedAddress.pin,
            storeShowTimeCutOff,
            storeEnabled: String(storeEnabled),
            storeType,
            workingHours: workingHoursArr,
            shopImageFormData: {
              url:
                resources?.find((res) => res.type === "STORE_IMAGE")?.value ||
                "",
              formData: false,
              previewUrl: "",
              deletedImageUrl: "",
            },
          });
          setContactInfoState({
            authorizedPersonName: authorizedPerson,
            authorizedPhoneNumber: authorizedPersonPhone,
            authorizedEmail: authorizedPersonEmail,
            contactPersonName: contactPerson,
            contactPersonPhoneNumber: contactPersonPhone,
            contactPersonEmail: contactPersonEmail,
            authorizedPersonIdProofFormData: {
              url: authorizedPersonIdentificationUrl || "",
              formData: false,
              previewUrl: "",
              deletedImageUrl: "",
            },
            contactPersonIdProofFormData: {
              url: contactPersonIdentificationUrl || "",
              formData: false,
              previewUrl: "",
              deletedImageUrl: "",
            },
          });
          setProofState({
            customerRegistrationFormData: {
              url:
                resources?.find(
                  (res) => res.name === "Customer registration number"
                )?.value || "",
              formData: false,
              previewUrl: "",
              deletedImageUrl: "",
            },
            tradeLicenseNumberFormData: {
              url:
                resources?.find((res) => res.name === "Trade license number")
                  ?.value || "",
              formData: false,
              previewUrl: "",
              deletedImageUrl: "",
            },
          });
        })
        .catch((err) => console.log(err));
      setLoading(false);
    }
  }, []);
  // Progress update
  let stepProgressComponent = (progress) => {
    return (
      <ProgressBar
        percent={progress}
        filledBackground="linear-gradient(to right, #0e9f6e, #0e9f6e)"
        height={3}
      >
        <Step>
          {({ accomplished }) => (
            <div
              className={`bg-green indexedStep ${
                accomplished ? "accomplished" : null
              }`}
            >
              &nbsp;
            </div>
          )}
        </Step>
        <Step>
          {({ accomplished }) => (
            <div
              className={`indexedStep ${accomplished ? "accomplished" : null}`}
            >
              &nbsp;
            </div>
          )}
        </Step>
        <Step>
          {({ accomplished }) => (
            <div
              className={`indexedStep ${accomplished ? "accomplished" : null}`}
            >
              &nbsp;
            </div>
          )}
        </Step>
        <Step>
          {({ accomplished }) => (
            <div
              className={`indexedStep ${accomplished ? "accomplished" : null}`}
            >
              &nbsp;
            </div>
          )}
        </Step>
      </ProgressBar>
    );
  };

  return (
    <>
      {loading ? (
        <Loading loading={loading} />
      ) : (
        <>
          <PageTitle>Store</PageTitle>
          {id && (
            <>
              {hasPermission(PAGE_STORE_UPDATE, "viewZone") && (
                <MapStoreToZone storeId={id} />
              )}
            </>
          )}
          <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
            <CardBody className="pl-4 pr-4">
              <p className="float-right text-white">
                {stepIndex < 100 ? "Progression" : "Completed"}
              </p>
              <br />
              {stepProgressComponent(stepIndex)}
            </CardBody>
            <p className="pl-4 pt-4 text-gray-400">
              {"Register Yourself As Store"}
            </p>
            <CardBody className=" mt-0">
              <div class="grid grid-cols-5 gap-4 mt-5">
                <div class="xl:col-span-1 lg:col-span-2 md:col-span-2 col-span-2 lg:block md:hidden hidden rounded-md dark:bg-gray-800 text-center font-extrabold antialiased">
                  {tabIndex !== 3 ? (
                    <StoreStepperVertical
                      tabIndex={tabIndex}
                      onClickEvent={() => {}}
                    />
                  ) : (
                    <div>
                      <p className="mt-2 text-green-400 text-2xl">
                        {"Preview"}
                      </p>
                    </div>
                  )}
                </div>
                <div class="xl:col-span-4 lg:col-span-3 md:col-span-5 col-span-5 rounded-md dark:bg-gray-700 p-3">
                  {tabIndex === 0 ? (
                    <BasicInfo
                      state={businessInfoState}
                      onClickEvent={(i) => {
                        setTabIndex(i);
                      }}
                      onNextHandel={(d, s) => {
                        setBusinessInfo(d);
                        setStepIndex(33);
                        setBusinessInfoState(s);
                      }}
                    />
                  ) : tabIndex === 1 ? (
                    <ContactInfo
                      state={contactInfoState}
                      onClickEvent={(i) => {
                        setTabIndex(i);
                      }}
                      onNextHandel={(d, s) => {
                        setContactInfo(d);
                        setStepIndex(66);
                        setContactInfoState(s);
                      }}
                    />
                  ) : tabIndex === 2 ? (
                    <Proof
                      state={proofState}
                      onClickEvent={(i) => {
                        setTabIndex(i);
                      }}
                      onNextHandel={(d, s) => {
                        setProof(d);
                        setStepIndex(100);
                        setProofState(s);
                      }}
                    />
                  ) : tabIndex === 3 ? (
                    <Preview
                      payload={{ businessInfo, contactInfo, proof }}
                      state={{
                        businessInfoState,
                        contactInfoState,
                        proofState,
                      }}
                      onClickEvent={(i) => {
                        setTabIndex(i);
                      }}
                    />
                  ) : null}
                </div>
              </div>
            </CardBody>
          </Card>
        </>
      )}
    </>
  );
};

export default Store;
