import React from "react";
import { useSelector } from "react-redux";
import {
  ForgotPassword2,
  Location,
  Login,
  OtpVerification,
  OuterScreen,
  OuterScreen2,
  OuterScreen4,
  ResetPassword,
  Signup,
  VerifyAccount,
  WebLinks,
} from "../Screens";
import ForgotPassword from "../Screens/ForgotPassword/ForgotPassword";

import navigationStrings from "./navigationStrings";

export default function (Stack, appStyle) {
  console.log(Stack,appStyle,'appStyle')
  return (
    <>
      <Stack.Screen
        name={navigationStrings.OUTER_SCREEN}
        component={appStyle?.homePageLayout === 2 ? OuterScreen2 : OuterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.SIGN_UP}
        component={Signup}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.LOGIN}
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.OTP_VERIFICATION}
        component={OtpVerification}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationStrings.VERIFY_ACCOUNT}
        component={VerifyAccount}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.FORGOT_PASSWORD}
        component={
          appStyle?.homePageLayout === 2 ? ForgotPassword2 : ForgotPassword
        }
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.LOCATION}
        component={Location}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationStrings.RESET_PASSWORD}
        component={ResetPassword}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationStrings.WEBLINKS}
        component={WebLinks}
        options={{ headerShown: false }}
      />
    </>
  );
}
