import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Label, Input, Button } from "@windmill/react-ui";
import apiService from "../utils/apiService";
import { notifyError, notifySuccess } from "../utils/toast";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useHistory } from "react-router-dom";

import ImageLight from "../assets/img/forgot-password-office.jpeg";
import ImageDark from "../assets/img/forgot-password-office-dark.jpeg";
const FORGOT_PASSWORD = '/users/forgotPassword';
const RESET_PASSWORD = '/users/resetPassword';


const ForgotPassword = () => {
  const [resetWithOtpEmail, setResetWithOtpEmail] = useState(false);
  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");

  const [emailValidation, setEmailValidation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();

  useEffect( () => () => {
    reset();
  }, [] );

  const reset = () =>{
    setResetWithOtpEmail(false); setEmail(""); setOtp(""); setPassword("");setVerifyPassword("");setEmailValidation(false);
  }

  const forgotPassword = () => {
    if (emailValidation) {
      setIsLoading(true);
      let payload = {
        email
      }
      apiService
        .post("user_service", FORGOT_PASSWORD, payload)
        .then((response) => {
          if (response) {
            notifySuccess(response.data.message);
            setResetWithOtpEmail(true);
          } else {
            notifyError("User not found or Something went wrong !!")
          }
          setIsLoading(false)
        })
        .catch((e) => {
          notifyError("Something went wrong !!")
          setIsLoading(false)
        });
    } else {
      notifyError("Please input valid Email ID")
    }
  }

  const resetPassword = () =>{
    if(!(verifyPassword !== password)) {
      let payload = {
        "email": email,
        "otp": parseInt(otp),
        "password": password
      }
      apiService
        .post("user_service", RESET_PASSWORD, payload)
        .then((response) => {
          if (response) {
            notifySuccess(response.data.message);
            setTimeout(() => {
              history.push("/login");
            }, 1000);
          } else {
            notifyError("Incorrect OTP entered or Something went wrong !!")
          }
          setIsLoading(false)
        })
        .catch((e) => {
          notifyError("Something went wrong !!")
          setIsLoading(false)
        });
    } else{
      notifyError("Password miss match, pls check the password field.")
    }
  }

  const emailSubmition = () => {
    return <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
      <div className="w-full">
        <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
          Forgot password
        </h1>

        <Label>
          <span className="font-medium text-sm">Email</span>
          <Input
            value={email}
            valid={emailValidation}
            onChange={(e) => {
              var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
              setEmail(e.target.value)
              if (e.target.value.match(validRegex)) {
                setEmailValidation(true);
              } else {
                setEmailValidation(false);
              }
            }}
            className="mt-1 border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
            placeholder="email@xxxxx.com" />
        </Label>

        <Button block className="mt-4 h-12" onClick={() => {
          forgotPassword();
        }}>
          Submit
        </Button>
        <p className="mt-4">
          <Link
            className="text-sm font-medium text-green-500 dark:text-green-400 hover:underline"
            to="/login"
          >
            Already have an account? Login
        </Link>
        </p>
      </div>
    </main>
  }

  const EmailPwdOtp = () => {
    return <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
      <div className="w-full">
        <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
          Forgot password
    </h1>

        <Label>
          <span className="font-medium text-sm">OTP</span>
          <Input value={otp}
            onChange={(e) => {
              setOtp(e.target.value)
            }} className="mt-1 border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white" placeholder="OTP" />
        </Label>

        <Label>
          <span className="font-medium text-sm">New Password</span>
          <Input value={password}
            onChange={(e) => {
              setPassword(e.target.value)
            }} type="password" className="mt-1 border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white" placeholder="Password" />
        </Label>

        <Label>
          <span className="font-medium text-sm">Verify Password</span>
          <Input value={verifyPassword}
            valid={!(verifyPassword !== password)}
            onChange={(e) => {
              setVerifyPassword(e.target.value)
            }} type="password" className="mt-1 border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white" placeholder="Password" />
        </Label>

        <Button block className="mt-4 h-12" disabled={!(otp && password && verifyPassword)} onClick={()=>{
          resetPassword()
        }}>
          Submit
        </Button>
        <p className="mt-4">
          <Link
            className="text-sm font-medium text-green-500 dark:text-green-400 hover:underline"
            to="/login"
          >
            Already have an account? Login
          </Link>
        </p>
      </div>
    </main>
  }

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
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
            {resetWithOtpEmail ? EmailPwdOtp() : emailSubmition()}
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
