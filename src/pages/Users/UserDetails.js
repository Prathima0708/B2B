import "react-datepicker/dist/react-datepicker.css";

import { Button, Input, Label, Select } from "@windmill/react-ui";
import { FormControlLabel, Grid, Radio, RadioGroup } from "@mui/material";
import React, { useEffect, useState } from "react";
import { deleteUtil, uploaderUtil } from "../../utils/uploaderUtil";
import hasPermission, {
  PAGE_ROLES_LIST,
  PAGE_USER_DETAILS,
} from "../../components/login/hasPermission";
import { notifyError, notifySuccess } from "../../utils/toast";

import ExistingImageDisplay from "../../components/image-uploader/ExistingImageDisplay";
import { GET_ROLES_URL } from "./constants";
import LabelArea from "../../components/form/LabelArea";
import Loading from "../../components/preloader/Loading";
import PageTitle from "../../components/Typography/PageTitle";
import Uploader from "../../components/image-uploader/Uploader";
import apiService from "../../utils/apiService";
import { useParams } from "react-router-dom";

const UserDetails = () => {
  const [roles, setRoles] = useState([]);
  const [userInfo, setUserInfo] = useState();
  const [gender, setGender] = useState("MALE");
  const [dob, setDob] = useState();
  const [update, setUpdate] = useState(false);
  const [roleId, setRoleId] = useState(null);
  const [profilePicFormData, setProfilePicFormData] = useState({
    url: "",
    formData: false,
    previewUrl: "",
    deletedImageUrl: "",
  });
  const [address, setAddress] = useState({ city: "", state: "" });
  const [driving_licence_number, setDrivingLicenseNumber] = useState();
  const [drivingLicenseFormData, setDrivingLicenseFormData] = useState({
    url: "",
    formData: false,
    previewUrl: "",
    deletedImageUrl: "",
  });
  const [id_proof_type, setIdProofType] = useState();
  const [idProofFormData, setIdProofFormData] = useState({
    url: "",
    formData: false,
    previewUrl: "",
    deletedImageUrl: "",
  });
  const [vehicle_number, setVehicleNumber] = useState();
  const [vehicleNumberFormData, setVehicleNumberFormData] = useState({
    url: "",
    formData: false,
    previewUrl: "",
    deletedImageUrl: "",
  });
  const [vehiclePaperFormData, setVehiclePaperFormData] = useState({
    url: "",
    formData: false,
    previewUrl: "",
    deletedImageUrl: "",
  });
  const [vehiclePicFormData, setVehiclePicFormData] = useState({
    url: "",
    formData: false,
    previewUrl: "",
    deletedImageUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [roleUpdateLoader, setRoleUpdateLoader] = useState(false);
  const { id } = useParams();

  const DisabledCondition = hasPermission(PAGE_USER_DETAILS, "updateRole")
    ? false
    : true;
  useEffect(async () => {
    await apiService
      .get("user_service", `/admin/users/${id}`)
      .then(({ data }) => {
        setUserInfo(data);
        setRoleId(data.role.id);
      })
      .catch((err) => console.log(err));
    if (hasPermission(PAGE_ROLES_LIST, "page"))
      await apiService
        .get("user_service", GET_ROLES_URL, null)
        .then((response) => {
          setRoles(response.data);
        })
        .catch((err) => console.log(err));
    if (hasPermission(PAGE_USER_DETAILS, "moreInfo"))
      await apiService
        .get("user_service", `/admin/users/${id}/user-details`)
        .then(({ data }) => {
          setDob(data.dob);
          setProfilePicFormData({
            url: data.profile_pic_url || undefined,
            formData: false,
            previewUrl: "",
            deletedImageUrl: "",
          });
          setAddress({
            city: data.address.city || "",
            state: data.address.state || "",
          });
          setDrivingLicenseNumber(data.driving_licence_number);
          setDrivingLicenseFormData({
            url: data.driving_licence_url || undefined,
            formData: false,
            previewUrl: "",
            deletedImageUrl: "",
          });
          setIdProofType(data.id_proof_type);
          setIdProofFormData({
            url: data.id_proof_url || undefined,
            formData: false,
            previewUrl: "",
            deletedImageUrl: "",
          });
          setVehicleNumber(data.vehicle_number);
          setVehicleNumberFormData({
            url: data.vehicle_no_plate_url || undefined,
            formData: false,
            previewUrl: "",
            deletedImageUrl: "",
          });
          setVehiclePaperFormData({
            url: data.vehicle_paper_url || undefined,
            formData: false,
            previewUrl: "",
            deletedImageUrl: "",
          });
          setVehiclePicFormData({
            url: data.vehicle_pic_url || undefined,
            formData: false,
            previewUrl: "",
            deletedImageUrl: "",
          });
        })
        .catch((err) => console.log(err));
    setLoading(false);
  }, [update]);

  const onFormSubmit = async (e) => {
    e.preventDefault();
    const payLoad = {};
    payLoad.address = address;
    if (dob) payLoad.dob = dob;
    if (driving_licence_number)
      payLoad.driving_licence_number = driving_licence_number;
    if (id_proof_type) payLoad.id_proof_type = id_proof_type;
    if (vehicle_number) payLoad.vehicle_number = vehicle_number;

    if (profilePicFormData.url)
      payLoad.profile_pic_url = profilePicFormData.url;
    if (drivingLicenseFormData.url)
      payLoad.driving_licence_url = drivingLicenseFormData.url;
    if (idProofFormData.url) payLoad.id_proof_url = idProofFormData.url;
    if (vehicleNumberFormData.url)
      payLoad.vehicle_no_plate_url = vehicleNumberFormData.url;
    if (vehiclePaperFormData.url)
      payLoad.vehicle_paper_url = vehiclePaperFormData.url;
    if (vehiclePicFormData.url)
      payLoad.vehicle_pic_url = vehiclePicFormData.url;

    if (profilePicFormData.deletedImageUrl) {
      await deleteUtil(profilePicFormData.deletedImageUrl);
      payLoad.profile_pic_url = "deleted";
    }
    if (drivingLicenseFormData.deletedImageUrl) {
      await deleteUtil(drivingLicenseFormData.deletedImageUrl);
      payLoad.driving_licence_url = "deleted";
    }
    if (idProofFormData.deletedImageUrl) {
      await deleteUtil(idProofFormData.deletedImageUrl);
      payLoad.id_proof_url = "deleted";
    }
    if (vehicleNumberFormData.deletedImageUrl) {
      await deleteUtil(vehicleNumberFormData.deletedImageUrl);
      payLoad.vehicle_no_plate_url = "deleted";
    }
    if (vehiclePaperFormData.deletedImageUrl) {
      await deleteUtil(vehiclePaperFormData.deletedImageUrl);
      payLoad.vehicle_paper_url = "deleted";
    }
    if (vehiclePicFormData.deletedImageUrl) {
      await deleteUtil(vehiclePicFormData.deletedImageUrl);
      payLoad.vehicle_pic_url = "deleted";
    }

    if (profilePicFormData.formData)
      payLoad.profile_pic_url = await uploaderUtil(profilePicFormData.formData);
    if (drivingLicenseFormData.formData)
      payLoad.driving_licence_url = await uploaderUtil(
        drivingLicenseFormData.formData
      );
    if (idProofFormData.formData)
      payLoad.id_proof_url = await uploaderUtil(idProofFormData.formData);
    if (vehicleNumberFormData.formData)
      payLoad.vehicle_no_plate_url = await uploaderUtil(
        vehicleNumberFormData.formData
      );
    if (vehiclePaperFormData.formData)
      payLoad.vehicle_paper_url = await uploaderUtil(
        vehiclePaperFormData.formData
      );
    if (vehiclePicFormData.formData)
      payLoad.vehicle_pic_url = await uploaderUtil(vehiclePicFormData.formData);
    await apiService
      .patch("user_service", `/admin/users/${id}/user-details`, payLoad)
      .then(() => {
        notifySuccess("User details updated successfully");
        setUpdate(!update);
      })
      .catch((err) => notifyError(err));
  };

  return (
    <div>
      {loading ? (
        <Loading loading={loading} />
      ) : (
        <>
          <PageTitle>User Details</PageTitle>
          <form onSubmit={onFormSubmit} className="mb-10">
            <Grid container spacing={3}>
              <Grid
                item
                lg={6}
                md={6}
                sm={6}
                xs={12}
                className="dark:text-gray-300 text-gray-900"
              >
                <Label>
                  <span>First Name</span>
                  <Input
                    className="mt-1 border"
                    disabled
                    value={userInfo.first_name || null}
                  />
                </Label>
              </Grid>
              <Grid
                item
                lg={6}
                md={6}
                sm={6}
                xs={12}
                className="dark:text-gray-300 text-gray-900"
              >
                <Label>
                  <span>Last Name</span>
                  <Input
                    className="mt-1 border"
                    disabled
                    value={userInfo.last_name || null}
                  />
                </Label>
              </Grid>
              <Grid
                item
                lg={6}
                md={6}
                sm={6}
                xs={12}
                className="dark:text-gray-300 text-gray-900"
              >
                <Label>
                  <span>Email</span>
                  <Input
                    className="mt-1 border"
                    disabled
                    value={userInfo.email || null}
                  />
                </Label>
              </Grid>
              <Grid
                item
                lg={6}
                md={6}
                sm={6}
                xs={12}
                className="dark:text-gray-300 text-gray-900"
              >
                <Label>
                  <span>Mobile Number</span>
                  <Input
                    className="mt-1 border"
                    disabled
                    value={
                      `+${userInfo.country_code} ${userInfo.mobile_number}` ||
                      null
                    }
                  />
                </Label>
              </Grid>
              {hasPermission(PAGE_USER_DETAILS, "moreInfo") && (
                <>
                  <Grid
                    item
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className=" dark:text-gray-300 text-gray-900"
                  >
                    <LabelArea label="Gender" />
                    <div className="col-span-8 sm:col-span-4">
                      <RadioGroup
                        name="gender"
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          flexWrap: "wrap",
                          justifyContent: "space-between",
                        }}
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <FormControlLabel
                          value="MALE"
                          control={<Radio />}
                          label="MALE"
                        />
                        <FormControlLabel
                          value="FEMALE"
                          control={<Radio />}
                          label="FEMALE"
                        />
                        <FormControlLabel
                          value="OTHER"
                          control={<Radio />}
                          label="OTHER"
                        />
                      </RadioGroup>
                    </div>
                  </Grid>
                  <Grid item lg={6} md={6} sm={6} xs={12} className="">
                    <Label>
                      <span>Date of birth</span>
                      <Input
                        className="mt-1 border"
                        type="string"
                        name="shopPin"
                        placeholder="DD-MM-YYYY"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                      />
                    </Label>
                  </Grid>
                  <Grid item lg={6} md={6} sm={6} xs={12} className="">
                    <Label>
                      <span>Profile Pic</span>
                    </Label>
                    {profilePicFormData.url ? (
                      <ExistingImageDisplay
                        nonDelete
                        setFormData={setProfilePicFormData}
                        url={profilePicFormData.url}
                      />
                    ) : (
                      <Uploader setFormData={setProfilePicFormData} />
                    )}
                  </Grid>
                </>
              )}
              <Grid item lg={6} md={6} sm={6} xs={12} className="">
                {hasPermission(PAGE_ROLES_LIST, "page") && (
                  <>
                    <Label>
                      <span>User Role</span>
                      <Select
                        className="mt-1 cursor-pointer"
                        value={roleId}
                        disabled={DisabledCondition}
                        onChange={(e) => {
                          setRoleId(e.target.value);
                        }}
                      >
                        {roles.map((rol, index) => {
                          return (
                            <option key={index} value={rol.id}>
                              {rol.name}
                            </option>
                          );
                        })}
                      </Select>
                    </Label>
                    {hasPermission(PAGE_USER_DETAILS, "updateRole") && (
                      <>
                        {roleUpdateLoader ? (
                          <Loading loading={roleUpdateLoader} />
                        ) : (
                          <Button
                            className="mt-4 rounded-md h-12"
                            onClick={async () => {
                              setRoleUpdateLoader(true);
                              await apiService
                                .patch(
                                  "user_service",
                                  `/admin/users/${id}/roles/${Number(roleId)}`
                                )
                                .then(() =>
                                  notifySuccess(
                                    "User role updated successfully"
                                  )
                                )
                                .catch(() =>
                                  notifyError(
                                    "Something went wrong. Unable to update user role"
                                  )
                                );
                              setRoleUpdateLoader(false);
                            }}
                          >
                            Update Role
                          </Button>
                        )}
                      </>
                    )}
                  </>
                )}
              </Grid>
              {hasPermission(PAGE_USER_DETAILS, "moreInfo") && (
                <>
                  <Grid item lg={6} md={6} sm={6} xs={12}>
                    <Label className=" mt-4">
                      <span>City</span>
                      <Input
                        className="mt-1 border"
                        type="string"
                        name="city"
                        placeholder="Enter your city"
                        value={address.city}
                        onChange={(e) =>
                          setAddress((prevData) => ({
                            ...prevData,
                            city: e.target.value,
                          }))
                        }
                      />
                    </Label>
                  </Grid>
                  <Grid item lg={6} md={6} sm={6} xs={12} className="">
                    <Label className=" mt-4">
                      <span>State</span>
                      <Input
                        className="mt-1 border"
                        type="string"
                        name="state"
                        placeholder="Enter your state"
                        value={address.state}
                        onChange={(e) =>
                          setAddress((prevData) => ({
                            ...prevData,
                            state: e.target.value,
                          }))
                        }
                      />
                    </Label>
                  </Grid>
                  <Grid item lg={6} md={6} sm={6} xs={12} className="">
                    <Label>
                      <span>Driving License Number</span>
                      <Input
                        className="mt-1 border"
                        type="string"
                        name="driving_licence_number"
                        placeholder="Enter your driving license number"
                        value={driving_licence_number}
                        onChange={(e) =>
                          setDrivingLicenseNumber(e.target.value)
                        }
                      />
                    </Label>
                  </Grid>
                  <Grid item lg={6} md={6} sm={6} xs={12} className="">
                    <Label>
                      <span>Driving License Proof</span>
                    </Label>
                    {drivingLicenseFormData.url ? (
                      <ExistingImageDisplay
                        nonDelete
                        setFormData={setDrivingLicenseFormData}
                        url={drivingLicenseFormData.url}
                      />
                    ) : (
                      <Uploader setFormData={setDrivingLicenseFormData} />
                    )}
                  </Grid>
                  <Grid item lg={6} md={6} sm={6} xs={12} className="">
                    <Label>
                      <span>ID proof type</span>
                      <Input
                        className="mt-1 border"
                        type="string"
                        name="id_proof_type"
                        placeholder="Enter ID proof type"
                        value={id_proof_type}
                        onChange={(e) => setIdProofType(e.target.value)}
                      />
                    </Label>
                  </Grid>
                  <Grid item lg={6} md={6} sm={6} xs={12} className="">
                    <Label>
                      <span>ID Proof</span>
                    </Label>
                    {idProofFormData.url ? (
                      <ExistingImageDisplay
                        nonDelete
                        setFormData={setIdProofFormData}
                        url={idProofFormData.url}
                      />
                    ) : (
                      <Uploader setFormData={setIdProofFormData} />
                    )}
                  </Grid>
                  <Grid item lg={6} md={6} sm={6} xs={12} className="">
                    <Label>
                      <span>Vehicle Number</span>
                      <Input
                        className="mt-1 border"
                        type="string"
                        name="vehicle_number"
                        placeholder="Enter vehicle number"
                        value={vehicle_number}
                        onChange={(e) => setVehicleNumber(e.target.value)}
                      />
                    </Label>
                  </Grid>
                  <Grid item lg={6} md={6} sm={6} xs={12} className="">
                    <Label>
                      <span>Vehicle Number Proof</span>
                    </Label>
                    {vehicleNumberFormData.url ? (
                      <ExistingImageDisplay
                        nonDelete
                        setFormData={setVehicleNumberFormData}
                        url={vehicleNumberFormData.url}
                      />
                    ) : (
                      <Uploader setFormData={setVehicleNumberFormData} />
                    )}
                  </Grid>
                  <Grid item lg={6} md={6} sm={6} xs={12} className="">
                    <Label>
                      <span>Vehicle Paper Proof</span>
                    </Label>
                    {vehiclePaperFormData.url ? (
                      <ExistingImageDisplay
                        nonDelete
                        setFormData={setVehiclePaperFormData}
                        url={vehiclePaperFormData.url}
                      />
                    ) : (
                      <Uploader setFormData={setVehiclePaperFormData} />
                    )}
                  </Grid>
                  <Grid item lg={6} md={6} sm={6} xs={12} className="">
                    <Label>
                      <span>Vehicle Pic</span>
                    </Label>
                    {vehiclePicFormData.url ? (
                      <ExistingImageDisplay
                        nonDelete
                        setFormData={setVehiclePicFormData}
                        url={vehiclePicFormData.url}
                      />
                    ) : (
                      <Uploader setFormData={setVehiclePicFormData} />
                    )}
                  </Grid>
                  {hasPermission(PAGE_USER_DETAILS, "update") && (
                    <Grid item lg={12} md={12} sm={12} xs={12} className="">
                      <div className="w-full ">
                        {!submitLoader ? (
                          <Button
                            type="submit"
                            className="w-full rounded-md h-12"
                          >
                            Submit
                          </Button>
                        ) : (
                          <Loading loading={submitLoader} />
                        )}
                      </div>
                    </Grid>
                  )}
                </>
              )}
            </Grid>
          </form>
        </>
      )}
    </div>
  );
};

export default UserDetails;
