import { Button, Input } from "@windmill/react-ui";
import React, { useContext, useEffect, useState } from "react";
import { notifyError, notifySuccess } from "../../utils/toast";

import LabelArea from "../form/LabelArea";
import Scrollbars from "react-custom-scrollbars";
import { SidebarContext } from "../../context/SidebarContext";
import Title from "../form/Title";
import apiService from "../../utils/apiService";

const RolesDrawer = (props) => {
  const { rolesData, id, onUpdate } = props;
  const [roleKey, setRoleKey] = useState("");
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const { toggleDrawer } = useContext(SidebarContext);

  useEffect(() => {
    if (id) {
      const [role] = rolesData.filter((role) => role.id === id);
      const { role_key, name, description: desc } = role;
      setRoleKey(role_key);
      setRoleName(name);
      setDescription(desc);
    } else {
      setRoleKey("");
      setRoleName("");
      setDescription("");
    }
  }, [rolesData]);

  const handleFormSubmitRoles = async (e) => {
    e.preventDefault();
    if (id) {
      apiService
        .patch("user_service", `/roles/${id}`, {
          role_key: roleKey,
          name: roleName,
          description,
        })
        .then(() => {
          notifySuccess("Role updated successfully");
          onUpdate((prevData) => !prevData);
        })
        .catch((err) => {
          notifyError("Something went wrong");
        });
    } else {
      apiService
        .post("user_service", "/roles", {
          role_key: roleKey,
          name: roleName,
          description,
          is_active: true,
        })
        .then(() => {
          onUpdate((prevData) => !prevData);
          notifySuccess("Role added successfully");
        })
        .catch((err) => {
          notifyError("Something went wrong");
        });
    }
    toggleDrawer();
  };
  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title title="Edit Role" description="Edit Permission and necessary information from here" />
        ) : (
          <Title title="Add Role" description="Add Roles and necessary information from here" />
        )}
      </div>
      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleFormSubmitRoles} className="block">
          <div className="px-6 pt-8 flex-grow w-full h-full max-h-full pb-40 md:pb-32 lg:pb-32 xl:pb-32">
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Role Name" />
              <div className="col-span-8 sm:col-span-4">
                <Input
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                  label="Name"
                  name="roleName"
                  type="text"
                  placeholder="Role Name"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                />
                {/* <Error errorName={errors.title} /> */}
              </div>
              <LabelArea label="Role Key" />
              <div className="col-span-8 sm:col-span-4">
                <Input
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                  label="Key"
                  name="roleKey"
                  type="text"
                  placeholder="Role Key"
                  value={roleKey}
                  onChange={(e) => setRoleKey(e.target.value)}
                />
                {/* <Error errorName={errors.title} /> */}
              </div>
              <LabelArea label="Description" />
              <div className="col-span-8 sm:col-span-4">
                <Input
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                  label="Description"
                  name="description"
                  type="text"
                  placeholder="Describe"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                {/* <Error errorName={errors.title} /> */}
              </div>
            </div>
          </div>
          <div className="fixed bottom-0 w-full right-0 py-4 lg:py-8 px-6 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex bg-gray-50 border-t border-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <Button type="submit" className="w-full h-12">
                {id ? "Update Role" : "Add Role"}
              </Button>
            </div>
          </div>
        </form>
      </Scrollbars>
    </>
  );
};

export default RolesDrawer;
