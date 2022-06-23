import React, { lazy, useEffect } from "react";
import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";
import { ToastContainer } from "./utils/toast";

import AccessibleNavigationAnnouncer from "./components/AccessibleNavigationAnnouncer";
import PrivateRoute from "./components/login/PrivateRoute";
import axios from "axios";
import { connect } from "react-redux";
import { deleteUserDetails } from "./Redux/actions";

const Layout = lazy(() => import("./layout/Layout.js"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const ForgetPassword = lazy(() => import("./pages/ForgotPassword.js"));

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const App = () => {
  useEffect(() => {
    document.title =
      process.env.REACT_APP_PRODUCT_ENV === "B2B" ? "BaddaMart" : "Baqaala";
  }, []);
  axios.interceptors.request.use((request) => {
    request.headers = {
      "X-Parse-Application-Id": "BQ",
      "X-Parse-REST-API-Key": "oZW03OlqZC",
      "x-store-id": Number(window.localStorage.getItem("x-store-id")),
      "x-timezone": timezone,
      "x-source":
        process.env.REACT_APP_PRODUCT_ENV === "B2B" ? "admin_b2b" : "admin_b2c",
    };

    let memberId = localStorage.getItem("x-member-id");
    if (memberId && memberId != null) request.headers["x-member-id"] = memberId;
    request.headers = { ...request.headers, ...request.params };
    if (request.params) {
      if (request.params["x-store-id"])
        request.headers["x-store-id"] = Number(request.params["x-store-id"]);
    }
    const userDetails = JSON.parse(localStorage.getItem("baqala-user"));
    if (userDetails?.access_token !== undefined) {
      request.headers.Authorization = `Bearer ${userDetails.access_token}`;
    }
    const firebaseToken = localStorage.getItem("firebase-token");
    if (firebaseToken) {
      request.headers["x-firebase-token"] = firebaseToken;
    }
    return request;
  });

  return (
    <>
      <ToastContainer />
      <Router>
        <AccessibleNavigationAnnouncer />
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={SignUp} />
          <Route path="/forgot-password" component={ForgetPassword} />
          <PrivateRoute>
            <Route path="/" component={Layout} />
          </PrivateRoute>
          <Redirect exact from="/" to="/login" />
        </Switch>
      </Router>
    </>
  );
};

export default connect(null, { deleteUserDetails })(App);
