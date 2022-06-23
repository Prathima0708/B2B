import { Input, Select } from "@windmill/react-ui";
import React, { useContext, useEffect, useState } from "react";
import { deleteUtil, uploaderUtil } from "../../utils/uploaderUtil";
import { notifyError, notifySuccess } from "../../utils/toast";

import DrawerButton from "../form/DrawerButton";
import ExistingImageDisplay from "../image-uploader/ExistingImageDisplay";
import LabelArea from "../form/LabelArea";
import ParentCategory from "../category/ParentCategory";
import { SERVER_HOST } from "./../../utils/constants";
import Scrollbars from "react-custom-scrollbars";
import { SidebarContext } from "../../context/SidebarContext";
import Title from "../form/Title";
import Uploader from "../image-uploader/Uploader";
import apiService from "../../utils/apiService";

const CategoryDrawer = ({ id, parentId }) => {
  const { toggleDrawer, isDrawerOpen, setIsUpdate } = useContext(SidebarContext);
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [rank, setRank] = useState(1);
  const [parentCategory, setParentCategory] = useState();
  const [iconFormData, setIconFormData] = useState({
    url: "",
    formData: false,
    previewUrl: "",
    deletedImageUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const resetValues = () => {
    setCategoryName("");
    setDescription("");
    setRank(1);
    setIconFormData({ url: "", formData: false, previewUrl: "", deletedImageUrl: "" });
    setParentCategory();
  };
  useEffect(async () => {
    if (id) {
      await apiService
        .get("b2b", `/categories/${id}`)
        .then((data) => data.data.result)
        .then((cate) => {
          setCategoryName(cate.name);
          setDescription(cate.description);
          setRank(cate.rank);
          setIconFormData({
            url: cate.imageUrl || "",
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
    e.preventDefault();
    setLoading(true);
    if (id) {
      if (iconFormData.deletedImageUrl.length > 0) {
        await deleteUtil(iconFormData.deletedImageUrl).catch(() => notifyError("Something went wrong"));
      }
      let payload = {};
      payload.name = categoryName;
      payload.description = description;
      payload.rank = parseInt(rank);
      if (id != parentId) payload.parent = parentId;
      if (iconFormData.formData) payload.imageUrl = await uploaderUtil(iconFormData.formData);
      if (iconFormData.url) payload.imageUrl = iconFormData.url;
      await apiService
        .put("b2b", `/categories/${id}`, payload)
        .then(() => {
          notifySuccess("Category details successfully updated");
          resetValues();
        })
        .catch((err) => {
          notifyError("Something went wrong");
          resetValues();
        });
    } else {
      let payload = {};
      payload.name = categoryName;
      payload.description = description;
      payload.rank = parseInt(rank);
      if (parentCategory != 0) payload.parent = parentCategory;
      if (iconFormData.formData) payload.imageUrl = await uploaderUtil(iconFormData.formData);
      await apiService
        .post("b2b", "/categories", payload)
        .then(() => {
          notifySuccess("New category successfully added");
          resetValues();
        })
        .catch((err) => {
          if (err.response.data.status === 400) {
            err.response.data.errors.forEach(({ field, message }) => notifyError(`${field} ${message}`));
          } else {
            notifyError(err.response.data.message || `Something went wrong`);
          }
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
            title={id != parentId ? "Update Sub Category" : "Update Category"}
            description="Updated your Product category and necessary information from here"
          />
        ) : (
          <Title
            title="Add Category"
            description=" Add your Product category and necessary information from here"
          />
        )}
      </div>
      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={onFormSubmit}>
          <div className="p-6 flex-grow scrollbar-hide w-full max-h-full pb-40">
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Category Icon" />
              <div className="col-span-8 sm:col-span-4">
                {iconFormData.url ? (
                  <ExistingImageDisplay setFormData={setIconFormData} url={iconFormData.url} />
                ) : (
                  <Uploader setFormData={setIconFormData} />
                )}
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Category Name" />
              <div className="col-span-8 sm:col-span-4">
                {/* <InputArea label="Category Name" name="categoryName" type="text" placeholder="Category Name" /> */}
                <Input
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                  label="Category Name"
                  name="categoryName"
                  type="text"
                  required
                  placeholder="Category Name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />
                {/* <Error errorName={errors.parent} /> */}
              </div>
            </div>
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Category Rank" />
              <div className="col-span-8 sm:col-span-4">
                {/* <InputArea label="Category Name" name="categoryName" type="text" placeholder="Category Name" /> */}
                <Input
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                  label="Category Rank"
                  name="categoryRank"
                  type="text"
                  required
                  placeholder="Category Name"
                  value={rank}
                  onChange={(e) => setRank(e.target.value.replace(/[^0-9]/gi, ""))}
                />
                {/* <Error errorName={errors.parent} /> */}
              </div>
            </div>
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Description" />
              <div className="col-span-8 sm:col-span-4">
                {/* <InputArea label="Category Name" name="categoryName" type="text" placeholder="Category Name" /> */}
                <Input
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                  label="Description"
                  name="description"
                  type="text"
                  required
                  placeholder="Add category description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                {/* <Error errorName={errors.parent} /> */}
              </div>
            </div>
            {!id && (
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Parent" />
                <div className="col-span-8 sm:col-span-4">
                  <Select
                    onChange={(e) => setParentCategory(e.target.value)}
                    className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                    name="parentCategory"
                    value={parentCategory}
                  >
                    <option defaultValue hidden>
                      Select Parent Category
                    </option>
                    <option value={0}>None</option>
                    <ParentCategory />
                  </Select>
                </div>
              </div>
            )}
          </div>

          <DrawerButton id={id} title="Category" loading={loading} />
        </form>
      </Scrollbars>
    </>
  );
};

export default CategoryDrawer;
