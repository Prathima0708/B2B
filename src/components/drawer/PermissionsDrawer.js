import { Input, Select } from "@windmill/react-ui";
import React, { useContext, useEffect, useState } from "react";
import { notifyError, notifySuccess } from "../../utils/toast";

import DrawerButton from "../form/DrawerButton";
import LabelArea from "../form/LabelArea";
import Scrollbars from "react-custom-scrollbars";
import { SidebarContext } from "../../context/SidebarContext";
import Title from "../form/Title";
import apiService from "../../utils/apiService";

const PermissionsDrawer = (props) => {
  const { toggleDrawer } = useContext(SidebarContext);
  const serviceTypes = [
    "core",
    "delivery",
    "payment",
    "notification",
    "asset",
    "gateway",
  ];
  const { permissionsData, id, onUpdate } = props;
  const [state, setState] = useState({
    name: "",
    serviceName: "gateway",
    endPoint: "",
    requestType: "GET",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const [permission] = permissionsData.filter((perm) => perm.id === id);
      setState({
        name: permission.name,
        serviceName: permission.service_name,
        endPoint: permission.end_point,
        requestType: permission.request_type,
        isActive: permission.is_active,
      });
    } else {
      setState({
        name: "",
        serviceName: "gateway",
        endPoint: "",
        requestType: "GET",
        isActive: true,
      });
    }
  }, [permissionsData]);

  const handleFormSubmitPermission = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (id) {
      apiService
        .patch("user_service", `/permissions/${id}`, {
          service_name: state.serviceName,
          name: state.name,
          end_point: state.endPoint,
          request_type: state.requestType,
          is_active: state.isActive,
        })
        .then(() => {
          notifySuccess("Permission updated successfully");
          props.onUpdate((prevData) => !prevData);
          setState({
            name: "",
            serviceName: "gateway",
            endPoint: "",
            requestType: "GET",
            isActive: true,
          });
        })
        .catch((err) => notifyError(err.response.data.message));
    } else {
      apiService
        .post("user_service", "/permissions", {
          service_name: state.serviceName,
          name: state.name,
          end_point: state.endPoint,
          request_type: state.requestType,
          is_active: true,
        })
        .then(() => {
          notifySuccess("Permission added successfully");
          props.onUpdate((prevData) => !prevData);
          setState({
            name: "",
            serviceName: "gateway",
            endPoint: "",
            requestType: "GET",
            isActive: true,
          });
        })
        .catch((err) => notifyError(err.response.data.message));
    }
    onUpdate((prevData) => !prevData);
    setLoading(false);
    toggleDrawer();
  };

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title
            title="Edit Permission"
            description="Edit Permission and necessary information from here"
          />
        ) : (
          <Title
            title="Add Permission"
            description="Add Permission and necessary information from here"
          />
        )}
      </div>
      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleFormSubmitPermission} className="block">
          <div className="px-6 pt-8 flex-grow w-full h-full max-h-full pb-40 md:pb-32 lg:pb-32 xl:pb-32">
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Name" />
              <div className="col-span-8 sm:col-span-4">
                <Input
                  required
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                  label=" Name"
                  name="name"
                  type="text"
                  placeholder="Enter Permission name"
                  value={state.name}
                  onChange={(e) => setState({ ...state, name: e.target.value })}
                />
              </div>
              <LabelArea label="Service Type" />
              <div className="col-span-8 sm:col-span-4">
                <Select
                  onChange={(e) =>
                    setState({ ...state, serviceName: e.target.value })
                  }
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                  name="serviceName"
                  value={state.serviceName}
                >
                  {serviceTypes.map((opt) => (
                    <option value={opt} key={opt}>
                      {opt}
                    </option>
                  ))}
                </Select>
              </div>
              <LabelArea label="End point" />
              <div className="col-span-8 sm:col-span-4">
                <Input
                  required
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                  label="End Point"
                  name="endPoint"
                  type="text"
                  placeholder="enter end point"
                  value={state.endPoint}
                  onChange={(e) =>
                    setState({ ...state, endPoint: e.target.value })
                  }
                />
              </div>
              <LabelArea label="Request Type" />
              <div className="col-span-8 sm:col-span-4">
                <Select
                  onChange={(e) =>
                    setState({ ...state, requestType: e.target.value })
                  }
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                  name="dataType"
                  value={state.requestType}
                >
                  <option key="GET" value="GET">
                    GET
                  </option>
                  <option key="POST" value="POST">
                    POST
                  </option>
                  <option key="PATCH" value="PATCH">
                    PATCH
                  </option>
                  <option key="PUT" value="PUT">
                    PUT
                  </option>
                  <option key="DELETE" value="DELETE">
                    DELETE
                  </option>
                </Select>
              </div>
            </div>
          </div>
          <DrawerButton id={id} title="Permission" loading={loading} />
        </form>
      </Scrollbars>
    </>
  );
};

export default PermissionsDrawer;
