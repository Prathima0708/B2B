import { Button, Input, Label, Textarea } from "@windmill/react-ui";
import React, { useEffect, useState } from "react";
import ReactSelect, { components } from "react-select";
import { notifyError, notifySuccess } from "../../../utils/toast";

import { Grid } from "@material-ui/core";
import Loading from "../../../components/preloader/Loading";
import Uploader from "../../../components/image-uploader/Uploader";
import apiService from "../../../utils/apiService";
import axios from "axios";
import { notificationServiceBaseUrl } from "../../../utils/backendUrls";
import { uploaderUtil } from "../../../utils/uploaderUtil";

const PushNotification = () => {
  const [users, setUsers] = useState([]);
  const [usersSelected, setUsersSelected] = useState([]);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [update, setUpdate] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [iconFormData, setIconFormData] = useState({
    url: "",
    formData: false,
    previewUrl: "",
    deletedImageUrl: "",
  });
  useEffect(async () => {
    await apiService
      .get("user_service", `/admin/users`, {
        page: 0,
        size: 15,
      })
      .then(({ data }) => setUsers(data.results.map(({ id, email }) => ({ value: id, label: email }))))
      .catch((err) => console.log(err));
  }, []);
  const handleUsersSelected = (selected) => {
    setUsersSelected(selected);
  };
  const Option = (props) => {
    return (
      <div>
        <components.Option {...props}>
          <input type="checkbox" checked={props.isSelected} onChange={() => null} />
          <label>{props.label}</label>
        </components.Option>
      </div>
    );
  };
  const onFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoader(true);
    if (usersSelected.length === 0) {
      notifyError("Please select at least one user to send the notification to");
      setSubmitLoader(false);
      return;
    }
    const payload = {
      message: {
        title,
        body,
      },
    };
    payload.user_ids = usersSelected.map((user) => user.value);
    if (iconFormData.formData) payload.message.icon = await uploaderUtil(iconFormData.formData);
    await axios
      .post(`${notificationServiceBaseUrl}/pushNotification`, payload)
      .then((data) => {
        notifySuccess("Notification Sent");
      })
      .catch((err) => {
        console.log(err);
      });
    setSubmitLoader(false);
    setBody("");
    setTitle("");
    setIconFormData(() => ({
      url: "",
      formData: false,
      previewUrl: "",
      deletedImageUrl: "",
    }));
  };
  return (
    <div>
      <form onSubmit={onFormSubmit}>
        <Grid container spacing={3}>
          <Grid item lg={12} md={12} sm={12} xs={12} className="">
            <Label className="min-w-64 my-2 flex-grow ">
              <span>Select Users</span>
              <ReactSelect
                options={users}
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                components={{
                  Option,
                }}
                onChange={handleUsersSelected}
                allowSelectAll={true}
                value={usersSelected}
              />
            </Label>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12} className="">
            <Label>
              <span>Title</span>
              <Input
                required
                className="mt-1 border"
                type="string"
                name="title"
                placeholder="Enter the notification title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Label>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12} className="">
            <Label>
              <span>Body</span>
              <Textarea
                required
                rows={3}
                className="mt-1 border"
                type="string"
                name="body"
                placeholder="Enter the notification message"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </Label>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12} className="">
            <Label>
              <span>Notification Icon</span>
            </Label>
            <Uploader setFormData={setIconFormData} />
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12} className="">
            <div className="w-full ">
              {!submitLoader ? (
                <Button type="submit" className="w-full rounded-md h-12">
                  Submit
                </Button>
              ) : (
                <Loading loading={submitLoader} />
              )}
            </div>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default PushNotification;
