import React, { useContext, useEffect, useState } from "react";
import { deleteUtil, uploaderUtil } from "../../utils/uploaderUtil";
import { notifyError, notifySuccess } from "../../utils/toast";

import DrawerButton from "../form/DrawerButton";
import ExistingImageDisplay from "../image-uploader/ExistingImageDisplay";
import { Input } from "@windmill/react-ui";
import LabelArea from "../form/LabelArea";
import Scrollbars from "react-custom-scrollbars";
import { SidebarContext } from "../../context/SidebarContext";
import Title from "../form/Title";
import Uploader from "../image-uploader/Uploader";
import apiService from "../../utils/apiService";

const BrandDrawer = ({ id }) => {
  const { isDrawerOpen, setIsUpdate, toggleDrawer } = useContext(SidebarContext);
  const [brandName, setBrandName] = useState("");
  const [description, setDescription] = useState("");
  const [iconFormData, setIconFormData] = useState({
    url: "",
    formData: false,
    previewUrl: "",
    deletedImageUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const resetValues = () => {
    setBrandName("");
    setDescription("");
    setIconFormData({ url: "", formData: false, previewUrl: "", deletedImageUrl: "" });
  };

  useEffect(async () => {
    if (id) {
      await apiService
        .get("b2b", `/brands/${id}`)
        .then((data) => data.data.result)
        .then((brand) => {
          setBrandName(brand.name);
          setDescription(brand.description);
          setIconFormData({
            url: brand.imageUrl || "",
            formData: false,
            previewUrl: "",
            deletedImageUrl: "",
          });
        })
        .catch((err) => console.log(err));
    } else {
      resetValues();
    }
  }, [isDrawerOpen]);

  const onFormSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (id) {
      if (iconFormData.deletedImageUrl.length > 0) {
        await deleteUtil(iconFormData.deletedImageUrl).catch(() => notifyError("Something went wrong"));
      }
      let payload = {
        name: brandName,
        description,
      };
      if (iconFormData.formData) payload.imageUrl = await uploaderUtil(iconFormData.formData);
      if (iconFormData.url) payload.imageUrl = iconFormData.url;
      await apiService
        .put("b2b", `/brands/${id}`, payload)
        .then(() => {
          notifySuccess("Brand details successfully updated");
          resetValues();
        })
        .catch((err) => {
          notifyError("Something went wrong");
          resetValues();
        });
    } else {
      let payload = {
        name: brandName,
        description,
      };
      if (iconFormData.formData) payload.imageUrl = await uploaderUtil(iconFormData.formData);
      await apiService
        .post("b2b", "/brands", payload)
        .then(() => notifySuccess("New brand successfully added"))
        .catch((err) => {
          notifyError("Something went wrong");
          resetValues();
        });
    }
    setIsUpdate((prevData) => !prevData);
    setLoading(false);
    toggleDrawer();
  };

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title
            title="Update Brand"
            description="Updated your Product brand and necessary information from here"
          />
        ) : (
          <Title
            title="Add Brand"
            description=" Add your Product brand and necessary information from here"
          />
        )}
      </div>
      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={onFormSubmit}>
          <div className="p-6 flex-grow scrollbar-hide w-full max-h-full pb-40">
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Brand Icon" />
              <div className="col-span-8 sm:col-span-4">
                {iconFormData.url ? (
                  <ExistingImageDisplay setFormData={setIconFormData} url={iconFormData.url} />
                ) : (
                  <Uploader setFormData={setIconFormData} />
                )}
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Brand Name" />
              <div className="col-span-8 sm:col-span-4">
                <Input
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                  label="Brand Name"
                  name="brandName"
                  type="text"
                  placeholder="Brand Name"
                  required
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
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
                  placeholder="Add Brand description"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DrawerButton id={id} title="Brand" loading={loading} />
        </form>
      </Scrollbars>
    </>
  );
};

export default BrandDrawer;
