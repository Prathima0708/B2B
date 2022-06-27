import { Button, Input, Label, Textarea } from "@windmill/react-ui";
import React, { useEffect, useState } from "react";
import ReactSelect, { components } from "react-select";
import { notifyError, notifySuccess } from "../../../utils/toast";

import { Grid } from "@material-ui/core";
import Loading from "../../../components/preloader/Loading";
import apiService from "../../../utils/apiService";
import axios from "axios";
import { notificationServiceBaseUrl } from "../../../utils/backendUrls";

const Email = () => {
  const [subject, setSubject] = useState("");
  const [email_body, setEmailBody] = useState("");
  const [submitLoader, setSubmitLoader] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersSelected, setUsersSelected] = useState([]);

  useEffect(async () => {
    await apiService
      .get("user_service", `/admin/users`, {
        page: 0,
        size: 15,
      })
      .then(({ data }) =>
        setUsers(
          data.results.map(({ email }) => ({ value: email, label: email }))
        )
      )
      .catch((err) => console.log(err));
  }, []);
  const handleUsersSelected = (selected) => {
    setUsersSelected(selected);
  };
  const Option = (props) => {
    return (
      <div>
        <components.Option {...props}>
          <input
            type="checkbox"
            checked={props.isSelected}
            onChange={() => null}
          />
          <label>{props.label}</label>
        </components.Option>
      </div>
    );
  };
  const onFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoader(true);
    if (usersSelected.length === 0) {
      notifyError(
        "Please select at least one user to send the notification to"
      );
      setSubmitLoader(false);
      return;
    }
    const payload = {
      user_identifier: {
        is_email: true,
        values: usersSelected.map((user) => user.value),
      },
      subject,
      email_body,
    };
    await axios
      .post(`${notificationServiceBaseUrl}/sendEmail`, payload)
      .then(() => {
        notifySuccess("Notification Sent");
      })
      .catch((err) => console.log(err));
    setSubmitLoader(false);
    setEmailBody("");
    setSubject("");
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
              <span>Subject</span>
              <Input
                required
                className="mt-1 border"
                type="string"
                name="subject"
                placeholder="Enter the mail subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </Label>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12} className="">
            <Label>
              <span>Body</span>
              <Textarea
                required
                rows={10}
                className="mt-1 border"
                type="string"
                name="email_body"
                placeholder="Enter the mail body"
                value={email_body}
                onChange={(e) => setEmailBody(e.target.value)}
              />
            </Label>
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

export default Email;
