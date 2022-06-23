import { FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import { Input, Select } from "@windmill/react-ui";
import React, { useContext, useEffect, useState } from "react";

import AttributeDataTypes from "../Attribute/AttributeDataTypes";
import DrawerButton from "../form/DrawerButton";
import LabelArea from "../form/LabelArea";
import Scrollbars from "react-custom-scrollbars";
import { SidebarContext } from "../../context/SidebarContext";
import Title from "../form/Title";
import apiService from "../../utils/apiService";
import { notifySuccess } from "../../utils/toast";

const AttributeDrawer = ({ id }) => {
  const { toggleDrawer, isDrawerOpen, setIsUpdate } = useContext(SidebarContext);
  const [titleName, setTitleName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [hidden, setHidden] = useState("false");
  const [mandatory, setMandatory] = useState("false");
  const [unitValue, setUnitValue] = useState("");
  const [requiredUnits, setRequiredUnits] = useState("false");
  const [dataType, setDataType] = useState("STRING");
  const [isVariant, setIsVariant] = useState("false");

  useEffect(async () => {
    if (id) {
      await apiService
        .get("b2b", `/schema/`)
        .then((data) => data.data.result)
        .then((attribute) => attribute.find((attr) => attr.id === id))
        .then((attr) => {
          setTitleName(attr.titleName);
          setDisplayName(attr.displayName);
          setDescription(attr.description);
          setHidden(String(attr.hidden));
          setMandatory(String(attr.mandatory));
          setUnitValue(attr.unitValue);
          setRequiredUnits(String(attr.requiredUnits));
          setDataType(attr.dataType);
          setIsVariant(String(attr.isVariant));
        })
        .catch((err) => console.log(err));
    } else {
      setTitleName("");
      setDisplayName("");
      setDescription("");
      setHidden("false");
      setMandatory("false");
      setUnitValue("");
      setRequiredUnits("false");
      setDataType("STRING");
      setIsVariant("false");
    }
  }, [isDrawerOpen]);

  const onFormSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      await apiService
        .put("b2b", `/schema/${id}`, {
          titleName,
          displayName,
          description,
          hidden: hidden === "true" ? true : false,
          mandatory: mandatory === "true" ? true : false,
          unitValue,
          dataType,
          requiredUnits: requiredUnits === "true" ? true : false,
        })
        .then(() => notifySuccess("Attribute details successfully updated"))
        .catch((err) => console.log(err));
    } else {
      await apiService
        .post("b2b", `/schema`, {
          titleName,
          displayName,
          description,
          hidden: hidden === "true" ? true : false,
          mandatory: mandatory === "true" ? true : false,
          unitValue,
          requiredUnits: requiredUnits === "true" ? true : false,
          dataType,
          isVariant: isVariant === "true" ? true : false,
        })
        .then(() => notifySuccess("New attribute successfully added"))
        .catch((err) => console.log(err));
    }
    setTitleName("");
    setDisplayName("");
    setDescription("");
    setHidden("false");
    setMandatory("false");
    setUnitValue("");
    setRequiredUnits("false");
    setDataType("STRING");
    setIsVariant("false");
    setIsUpdate((prevData) => !prevData);
    toggleDrawer();
  };

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title
            title="Update Attribute"
            description="Updated attribute and necessary information from here"
          />
        ) : (
          <Title title="Add Attribute" description=" Add attribute and necessary information from here" />
        )}
      </div>
      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={onFormSubmit}>
          <div className="p-6 flex-grow scrollbar-hide w-full max-h-full pb-40">
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Attribute Name" />
              <div className="col-span-8 sm:col-span-4">
                <Input
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                  label="Attribute Name"
                  name="titleName"
                  type="text"
                  placeholder="Enter attribute name"
                  value={titleName}
                  onChange={(e) => setTitleName(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Display Name" />
              <div className="col-span-8 sm:col-span-4">
                <Input
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                  label="Display Name"
                  name="displayName"
                  type="text"
                  placeholder="Enter display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Description" />
              <div className="col-span-8 sm:col-span-4">
                <Input
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                  label="Description"
                  name="description"
                  type="text"
                  placeholder="Enter attribute description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            {!id && (
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Data Type" />
                <div className="col-span-8 sm:col-span-4">
                  <Select
                    onChange={(e) => setDataType(e.target.value)}
                    className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                    name="dataType"
                    value={dataType}
                  >
                    <AttributeDataTypes />
                  </Select>
                </div>
              </div>
            )}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Hidden" />
              <div className="col-span-8 sm:col-span-4">
                <RadioGroup
                  name="hidden"
                  style={{
                    display: "flex",
                    flexDirection: "row",

                    flexWrap: "wrap",
                  }}
                  value={hidden}
                  onChange={(e) => setHidden(e.target.value)}
                >
                  <FormControlLabel value="true" control={<Radio color="default" />} label="Yes" />
                  <FormControlLabel value="false" control={<Radio color="default" />} label="No" />
                </RadioGroup>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Mandatory" />
              <div className="col-span-8 sm:col-span-4">
                <RadioGroup
                  name="mandatory"
                  style={{
                    display: "flex",
                    flexDirection: "row",

                    flexWrap: "wrap",
                  }}
                  value={mandatory}
                  onChange={(e) => setMandatory(e.target.value)}
                >
                  <FormControlLabel value="true" control={<Radio color="default" />} label="Yes" />
                  <FormControlLabel value="false" control={<Radio color="default" />} label="No" />
                </RadioGroup>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Unit Required" />
              <div className="col-span-8 sm:col-span-4">
                <RadioGroup
                  name="requiredUnits"
                  style={{
                    display: "flex",
                    flexDirection: "row",

                    flexWrap: "wrap",
                  }}
                  value={requiredUnits}
                  onChange={(e) => setRequiredUnits(e.target.value)}
                >
                  <FormControlLabel value="true" control={<Radio color="default" />} label="Yes" />
                  <FormControlLabel value="false" control={<Radio color="default" />} label="No" />
                </RadioGroup>
              </div>
            </div>
            {requiredUnits === "true" && (
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Unit Value" />
                <div className="col-span-8 sm:col-span-4">
                  <Input
                    className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                    label="Unit"
                    name="unitValue"
                    type="text"
                    placeholder="Add attribute unit"
                    value={unitValue}
                    onChange={(e) => setUnitValue(e.target.value)}
                  />
                </div>
              </div>
            )}
            {!id && (
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Is a Variant" />
                <div className="col-span-8 sm:col-span-4">
                  <RadioGroup
                    name="isVariant"
                    style={{
                      display: "flex",
                      flexDirection: "row",

                      flexWrap: "wrap",
                    }}
                    value={isVariant}
                    onChange={(e) => setIsVariant(e.target.value)}
                  >
                    <FormControlLabel value="true" control={<Radio color="default" />} label="Yes" />
                    <FormControlLabel value="false" control={<Radio color="default" />} label="No" />
                  </RadioGroup>
                </div>
              </div>
            )}
          </div>
          <DrawerButton id={id} title="Attribute" />
        </form>
      </Scrollbars>
    </>
  );
};

export default AttributeDrawer;
