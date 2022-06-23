import { Button, Input, Select } from "@windmill/react-ui";
import { ImFacebook, ImGoogle } from "react-icons/im";
import { Link, useHistory } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { auth, firebase, messaging } from "../utils/firebase";
import { notifyError, notifySuccess } from "../utils/toast";
import { setUserDetails, setVerifiedMobileNumber } from "../Redux/actions";

import { AdminContext } from "../context/AdminContext";
import AdminServices from "../services/AdminServices";
import Cookies from "js-cookie";
import CountryCode from "../components/login/CountryCode";
import Error from "../components/form/Error";
import ImageDark from "../assets/img/login-office-dark.jpeg";
import ImageLight from "../assets/img/login-office.jpeg";
import InputArea from "../components/form/InputArea";
import LabelArea from "../components/form/LabelArea";
import Loader from "react-spinners/ScaleLoader";
import { TextField } from "@material-ui/core";
import Timer from "../components/login/Timer";
import apiService from "../utils/apiService";
import axios from "axios";
import { connect } from "react-redux";
import { setUserInLocalStorage } from "../utils/setLocalStorage";
import { useForm } from "react-hook-form";

const Login = (props) => {
  const { setVerifiedMobileNumber, setUserDetails } = props;
  const [countryCode, setCountryCode] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [show, setShow] = useState(false);
  const [final, setFinal] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [resendOtp, setResendOtp] = useState(true);
  const [reCaptchaToken, setreCaptchaToken] = useState("");
  const history = useHistory();
  const USER_SERVICE = "user_service";
  const LOGIN = "/users/login";
  const EMAILSIGNIN = "/users/secondarysignin";

  useEffect(() => {
    if (props.user.userDetails.email?.length > 0) history.push("/");
  }, []);

  const signIn = () => {
    if (mobileNumber === "" || mobileNumber.length < 8) return;
    setLoading(true);
    let verify = new firebase.auth.RecaptchaVerifier("recaptcha-container", {
      size: "invisible",
    });
    setreCaptchaToken(verify);
    auth
      .signInWithPhoneNumber(`${countryCode}${mobileNumber}`, verify)
      .then((result) => {
        setFinal(result);
        setDisabled(true);
        setShow(true);
        setLoading(false);
      })
      .catch((err) => {
        notifyError(err.message);
        window.location.reload();
      });
  };
  const validateOtp = () => {
    if (otp === null || final === null) return;
    setLoading(true);
    final
      .confirm(otp)
      .then((result) => {
        let tkn = JSON.parse(JSON.stringify(result.user));
        let stsTokenManager = tkn.stsTokenManager;
        setVerifiedMobileNumber({ mobileNumber, countryCode });
        apiService.post(USER_SERVICE, LOGIN, { access_token: stsTokenManager.accessToken }).then((result) => {
          if (!result.data.is_verified) return history.push("/signup");
          else {
            setUserDetails(result.data);
            setUserInLocalStorage(result.data);
            history.push("/");
            setLoading(false);
          }
        });
      })
      .catch((err) => {
        notifyError(err.message);
        window.location.reload();
        setLoading(false);
      });
  };

  const handleResendOtp = () => {
    setLoading(true);
    firebase
      .auth()
      .signInWithPhoneNumber(`${countryCode}${mobileNumber}`, reCaptchaToken)
      .then((result) => setFinal(result))
      .then(() => setLoading(false))
      .catch((err) => {
        notifyError(err.message);
        window.location.reload();
      });
  };

  const secondarySignin = (e) => {
    e.preventDefault();
    setLoading2(true);
    apiService
      .post(USER_SERVICE, EMAILSIGNIN, { email, password })
      .then((data) => {
        setUserDetails(data.data);
        setUserInLocalStorage(data.data);
        history.push("/");
        setLoading2(false);
        window.location.reload();
      })
      .catch((err) => {
        notifyError(err.response.data.message);
        setLoading2(false);
      });
  };

  return (
    <>
      <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
          <div className="flex flex-col overflow-y-auto md:flex-row">
            <div className="h-32 md:h-auto md:w-1/2">
              <img
                aria-hidden="true"
                className="object-cover w-full h-full dark:hidden"
                src={ImageLight}
                alt="Office"
              />
              <img
                aria-hidden="true"
                className="hidden object-cover w-full h-full dark:block"
                src={ImageDark}
                alt="Office"
              />
            </div>
            <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
              <div className="w-full">
                <h1 className="mb-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                  Login / Sign Up
                </h1>
                <div className="mt-5">
                  <LabelArea label="Mobile Number" />
                  <Select
                    disabled={disabled}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                    name="brand"
                    value={countryCode}
                  >
                    <option defaultValue hidden>
                      Select Country
                    </option>
                    <CountryCode />
                  </Select>
                  <Input
                    disabled={disabled}
                    name="mobileNumber"
                    type="text"
                    value={mobileNumber}
                    className="mt-2 border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                    placeholder="Enter your mobile number with country code"
                    onChange={(e) => setMobileNumber(e.target.value.replace(/[^0-9]/gi, ""))}
                  />
                </div>
                {/* <Error errorName={errors.password} /> */}
                {show && (
                  <div className="mt-5">
                    <LabelArea label="OTP" />
                    <Input
                      name="otp"
                      type="text"
                      value={otp}
                      className="mt-2 border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                      placeholder="Enter OTP"
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                )}
                {!show ? (
                  !loading ? (
                    <Button type="submit" className="mt-4 h-12 w-full" onClick={signIn}>
                      Get OTP
                    </Button>
                  ) : (
                    <div className="text-lg text-center mt-5">
                      <Loader loading={loading} color="#34D399" width={3} radius={3} margin={4} />
                    </div>
                  )
                ) : !loading ? (
                  <>
                    <Button type="submit" className="mt-4 h-12 w-full" onClick={validateOtp}>
                      Verify OTP
                    </Button>
                    {resendOtp && (
                      <div onClick={handleResendOtp}>
                        <Timer initialMinutes={1} initialSeconds={0} />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-lg text-center mt-5">
                    <Loader loading={loading} color="#34D399" width={3} radius={3} margin={4} />
                  </div>
                )}
                <div id="recaptcha-container"></div>
                <hr className="my-10" />
                <form onSubmit={secondarySignin}>
                  <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                    Login With Email
                  </h1>
                  <p className="text-gray-700 dark:text-gray-400 text-xs">* For existing users</p>
                  <div className="mt-5">
                    <LabelArea label="Email" />
                    <Input
                      name="email"
                      type="email"
                      value={email}
                      className="mt-2 border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                      placeholder="Enter your email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="mt-5">
                    <LabelArea label="Password" />
                    <Input
                      name="password"
                      type="password"
                      value={password}
                      className="mt-2 border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                      placeholder="Enter password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {!loading2 ? (
                    <Button type="submit" className="mt-4 h-12 w-full">
                      Login
                    </Button>
                  ) : (
                    <div className="text-lg text-center mt-5">
                      <Loader loading={loading2} color="#34D399" width={3} radius={3} margin={4} />
                    </div>
                  )}
                  <p className="mt-4">
                    <Link
                      className="text-sm font-medium text-green-500 dark:text-green-400 hover:underline"
                      to="/forgot-password"
                    >
                      Forgot Password ?
                    </Link>
                  </p>
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};
const mapStateToProps = ({ user }) => {
  return {
    user,
  };
};

export default connect(mapStateToProps, { setVerifiedMobileNumber, setUserDetails })(Login);
