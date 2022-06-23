import * as yup from "yup";

import { Button, Input, Label } from "@windmill/react-ui";
import React, { useEffect, useState } from "react";

import ImageDark from "../assets/img/create-account-office-dark.jpeg";
import ImageLight from "../assets/img/create-account-office.jpeg";
import Loader from "react-spinners/ScaleLoader";
import apiService from "../utils/apiService";
import { connect } from "react-redux";
import { notifyError } from "../utils/toast";
import { setUserDetails } from "../Redux/actions";
import { setUserInLocalStorage } from "../utils/setLocalStorage";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";

const userSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup.string().email().required("Email is required"),
  password: yup.string().min(4).required(),
  confirmPassword: yup.string().oneOf([yup.ref("password"), null]),
});

const SignUp = (props) => {
  const { user, setUserDetails } = props;
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const USER_SERVICE = "user_service";
  const SIGN_UP = "/users/signup";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchema),
  });
  useEffect(() => {
    if (props.user.verifiedMobileNumber === "") history.push("/login");
    if (props.user.userDetails.email?.length > 0) history.push("/");
  }, []);

  const onSubmit = (data) => {
    setLoading(true);
    const { firstName, lastName, email, password } = data;
    const country_code = parseInt(user.countryCode.slice(1));
    apiService
      .post(USER_SERVICE, SIGN_UP, {
        mobile_number: user.verifiedMobileNumber,
        country_code: Number(user.countryCode),
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      })
      .then((data) => {
        setUserDetails(data.data);
        setUserInLocalStorage(data.data);
        history.push("/");
        setLoading(false);
      })
      .catch((err) => {
        notifyError(err.response.data.message);
        setLoading(false);
      });
  };
  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
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
          <form
            className="flex items-center justify-center p-6 sm:p-12 md:w-1/2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="w-full">
              <h1 className="mb-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Create account</h1>
              <Label>
                <span className="font-medium text-sm">First Name</span>
                <Input
                  type="text"
                  className="mt-1 border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                  name="firstName"
                  placeholder="Enter your first name"
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="text-gray-700 dark:text-gray-400 text-xs mt-1">{errors.firstName.message}</p>
                )}
              </Label>
              <Label className="mt-4">
                <span className="font-medium text-sm">Last Name</span>
                <Input
                  type="text"
                  className="mt-1 border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                  name="lastName"
                  placeholder="Enter your last name"
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="text-gray-700 dark:text-gray-400 text-xs mt-1">{errors.lastName.message}</p>
                )}
              </Label>
              <Label className="mt-4">
                <span className="font-medium text-sm">Email</span>
                <Input
                  className="mt-1 border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  {...register("email")}
                />

                {errors.email && (
                  <p className="text-gray-700 dark:text-gray-400 text-xs mt-1">{errors.email.message}</p>
                )}
              </Label>
              <Label className="mt-4">
                <span className="font-medium text-sm">Password</span>
                <Input
                  className="mt-1 border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                  placeholder="***************"
                  type="password"
                  {...register("password")}
                  name="password"
                />
                {errors.password && (
                  <p className="text-gray-700 dark:text-gray-400 text-xs mt-1">{errors.password.message}</p>
                )}
              </Label>
              <Label className="mt-4">
                <span className="font-medium text-sm">Confirm password</span>
                <Input
                  className="mt-1 border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                  placeholder="***************"
                  type="password"
                  name="confirmPassword"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-gray-700 dark:text-gray-400 text-xs mt-1">Passwords do not match</p>
                )}
              </Label>

              {/* <Label className="mt-6" check>
                <Input type="checkbox" />
                <span className="ml-2">
                  I agree to the <span className="underline">privacy policy</span>
                </span>
              </Label> */}

              {!loading ? (
                <Button type="submit" className="mt-4 h-12 w-full">
                  Create Account
                </Button>
              ) : (
                <div className="text-lg text-center mt-5">
                  <Loader loading={loading} color="#34D399" width={3} radius={3} margin={4} />
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = ({ user }) => {
  return {
    user,
  };
};

export default connect(mapStateToProps, { setUserDetails })(SignUp);
