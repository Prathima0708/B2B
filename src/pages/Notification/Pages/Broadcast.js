import { Button, Input, Label, Textarea } from "@windmill/react-ui";
import React, { useEffect, useState } from "react";

import { Grid } from "@material-ui/core";
import Loading from "../../../components/preloader/Loading";
import axios from "axios";
import { notificationServiceBaseUrl } from "../../../utils/backendUrls";

const Broadcast = () => {
  const [subject, setSubject] = useState("");
  const [email_body, setEmailBody] = useState("");
  const [submitLoader, setSubmitLoader] = useState(false);

  const onFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoader(true);
    await axios
      .post(`${notificationServiceBaseUrl}/broadcastEmail`, { subject, email_body })
      .catch((err) => console.log(err));
    setSubmitLoader(false);
  };
  return (
    <div>
      <form onSubmit={onFormSubmit}>
        <Grid container spacing={3}>
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

export default Broadcast;
