import logo from "../../assets/logo.png";
import Input from "../../components/Input";
import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { loginUser } from "../../services/auth.services";
import { navigate } from "vike/client/router";
import TwoFactorDialog from "./TwoFactorDialog";
import { useState } from "react";
import { useAlert } from "../../hooks/useAlert";
import React from "react";

interface AuthValues {
  email: string;
  password: string;
}

const Page = () => {
  const { addAlert } = useAlert();
  const [twoFactor, setTwoFactor] = useState(false);
  const [user, setUser] = useState({});
  const initialValues = {
    email: "",
    password: "",
  };

  const handleLogin = async (
    values: AuthValues,
    { setSubmitting, resetForm }: FormikHelpers<AuthValues>
  ) => {
    try {
      setSubmitting(true);
      const { data } = await loginUser(values);

      if (data.data["2fa_required"]) {
        setTwoFactor(true);
        setUser(data.data);
      } else {
        await navigate("/dashboard");
        addAlert({
          message: "Login successful",
          severity: "success",
          timeout: 4,
        });
      }
      resetForm();
      setSubmitting(false);
    } catch (error: any) {
      console.log(error);
      addAlert({
        message: error.response.data.message,
        severity: "error",
        timeout: 4,
      });
    }
  };

  return (
    <>
      <TwoFactorDialog
        show={twoFactor}
        hide={() => setTwoFactor(false)}
        user={user}
      />
      <div className="h-full max-w-xs mx-auto text-center">
        <img src={logo} alt="logo" className="w-12 h-auto block mx-auto py-8" />
        <h1 className="block text-2xl mb-3 font-inter">Sign in to Inventary</h1>
        <Formik
          onSubmit={handleLogin}
          initialValues={initialValues}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email address")
              .required("Required"),
            password: Yup.string().required(),
          })}
        >
          {() => (
            <Form className="mt-4 border border-[#30363db3] bg-[#161b22] p-4 rounded-md">
              <Input
                label="Email"
                name="email"
                id="email"
                type="email"
                className="mb-3"
              />
              <Input
                label="Password"
                name="password"
                id="password"
                type="password"
              />
              <button
                type="submit"
                className="w-full text-sm font-inter-medium bg-[#238636] block mx-auto text-white text-center rounded-md py-[5px] px-3 hover:bg-[#28973e] transition duration-150"
              >
                Sign in
              </button>
            </Form>
          )}
        </Formik>
        <footer className="mt-[80px] text-xs text-[#8d96a0]">
          <p>© 2024 Inventary app. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default Page;
