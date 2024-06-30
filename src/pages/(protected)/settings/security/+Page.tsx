import {
  ChatBubbleLeftRightIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  KeyIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import Button from "../../../../components/Button";
import { classNames } from "../../../../../utils/classNames";
import Input from "../../../../components/Input";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import {
  changePassword,
  disable2fa,
  enable2fa,
} from "../../../../services/auth.services";
import { useAlert } from "../../../../../hooks/useAlert";
import { useState } from "react";
import Setup2faDialog from "./Setup2faDialog";
import { useAuth } from "../../../../../hooks/useAuth";
import Spinner from "../../../../components/Spinner";

const Page = () => {
  const { user, loading, fetchUser }: any = useAuth();
  const { addAlert } = useAlert();
  const [dialog2fa, setDialog2fa] = useState({
    dialog: false,
    qrcode: "",
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const { data } = await changePassword({ ...values, id: user?.id });
      addAlert({
        message: data.message,
        timeout: 10,
        severity: "success",
      });
      resetForm();
    } catch (error: any) {
      addAlert({
        message: error.response.data.message,
        timeout: 10,
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const enable2FA = async () => {
    try {
      const { data } = await enable2fa({ id: user?.id ?? "" });
      setDialog2fa({ dialog: true, qrcode: data.data.qrCodeUrl });
    } catch (error) {
      console.log(error);
    }
  };

  const handle2FA = async () => {
    if (!user?.two_factor) {
      enable2FA();
      return;
    }
    disable2FA();
  };

  const disable2FA = async () => {
    try {
      await disable2fa({
        id: user?.id ?? "",
        app_secret: null,
        two_factor: false,
      });
      await fetchUser();
    } catch (error) {
      console.log(error);
    }
  };

  const closeDialog2fa = () => {
    setDialog2fa((prev) => ({ ...prev, dialog: false }));
  };

  return (
    <section className="grid grid-cols-[1fr_.6fr] max-lg:grid-cols-1 gap-7 text-neutral-200 px-10 max-sm:px-4 max-w-[1500px] mx-auto">
      {loading ? (
        <div className="fixed inset-0 bg-[#00000038] grid place-items-center">
          <Spinner />
        </div>
      ) : (
        ""
      )}
      <Setup2faDialog dialog={dialog2fa} close={closeDialog2fa} user={user} />
      <div className="flex flex-col gap-10">
        <div>
          <h2 className="text-2xl mb-3 flex gap-3 items-center">
            Password
            <KeyIcon width={25} />
          </h2>
          <hr className="h-[1px] border-0 bg-[#30363db3]" />
          <p className="text-sm my-3">
            Strengthen your account by ensuring your password is strong.
          </p>
          <article className="rounded-lg border border-solid border-[#30363d] overflow-hidden">
            <div className="bg-[#161b22] p-4">
              <span className="text-sm block font-inter-medium">
                Change password
              </span>
            </div>
            <Formik
              initialValues={{
                current: "",
                new: "",
                confirm: "",
              }}
              onSubmit={handleSubmit}
              validationSchema={Yup.object({
                current: Yup.string().required(),
                new: Yup.string()
                  .min(8)
                  .matches(/\d/)
                  .matches(/[a-z]/)
                  .matches(/[A-Z]/)
                  .matches(/[!@#$%^&*(),.?":{}|<>]/)
                  .required(),
                confirm: Yup.string()
                  .oneOf([Yup.ref("new")])
                  .required(),
              })}
            >
              {({ isSubmitting, values }) => {
                const newMatch = (type: string) => {
                  if (type === "letters") {
                    return values.new.length >= 8;
                  }
                  if (type === "character") {
                    return values.new.match(/[!@#$%^&*(),.?":{}|<>]/);
                  }
                  if (type === "uppercase") {
                    return values.new.match(/[A-Z]/);
                  }
                  if (type === "digit") {
                    return values.new.match(/\d/);
                  }
                  return false;
                };
                return (
                  <Form className="p-4 flex flex-col gap-7 relative">
                    {isSubmitting ? (
                      <div className="absolute inset-0 bg-[#0000001a] grid place-items-center z-40 text-white">
                        Loading...
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="mt-3 max-w-[445px]">
                      <Input
                        floatLabel
                        label="Current password"
                        type="password"
                        by="password"
                        name="current"
                        id="current"
                        required
                      />
                    </div>
                    <div className="max-w-[445px]">
                      <Input
                        floatLabel
                        label="New password"
                        id="new"
                        type="password"
                        by="password"
                        name="new"
                        required
                      />
                    </div>
                    <div className="max-w-[445px]">
                      <Input
                        floatLabel
                        label="Confirm new password"
                        id="confirm"
                        type="password"
                        by="password"
                        name="confirm"
                        required
                      />
                    </div>
                    <div>
                      <small className="text-[#8d96a0]">
                        Make sure it has at{" "}
                        <span
                          className={classNames(
                            newMatch("letters")
                              ? "text-[#3fb950]"
                              : "text-red-500"
                          )}
                        >
                          least 8 characters
                        </span>
                        ,{" "}
                        <span
                          className={classNames(
                            newMatch("digit")
                              ? "text-[#3fb950]"
                              : "text-red-500"
                          )}
                        >
                          including a number
                        </span>
                        ,{" "}
                        <span
                          className={classNames(
                            newMatch("uppercase")
                              ? "text-[#3fb950]"
                              : "text-red-500"
                          )}
                        >
                          a uppercase letter
                        </span>
                        ,{" "}
                        <span
                          className={classNames(
                            newMatch("character")
                              ? "text-[#3fb950]"
                              : "text-red-500"
                          )}
                        >
                          and a special character
                        </span>
                        .
                      </small>
                      <Button
                        className="rounded-md !bg-[#21262d] py-[5px] text-sm mt-2 hover:!bg-[#16191d]"
                        submit
                      >
                        Update password
                      </Button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </article>
        </div>
        <div>
          <div className="mb-3 flex justify-between items-center">
            <h2 className="text-2xl flex items-center gap-3">
              Two-factor authentication
              <LockClosedIcon width={25} />
            </h2>
            <Button
              className={classNames(
                "text-sm bg-transparent py-1 rounded-lg",
                user?.two_factor
                  ? "border-red-500 border text-red-500"
                  : "border-[#3fb950] border !text-[#3fb950]"
              )}
              action={handle2FA}
              disabled={!user}
            >
              {user?.two_factor ? "Disable" : "Enable"}
            </Button>
          </div>
          <hr className="h-[1px] border-0 bg-[#30363db3]" />
          <p className="text-sm my-3">
            Two-factor authentication adds an additional layer of security to
            your account by requiring more than just a password to sign in.
          </p>
          <article className="rounded-lg border border-solid border-[#30363d] overflow-hidden">
            <div className="bg-[#161b22] p-4">
              <span className="text-sm block font-inter-medium">
                Two-factor methods
              </span>
            </div>
            <div className="p-4 flex items-center justify-between gap-x-2 border-t-[#30363d] border-t">
              <div className="flex items-center gap-x-2 ">
                <div className="min-w-6 min-h-6 max-w-6 max-h-6">
                  <DevicePhoneMobileIcon className="w-full" />
                </div>
                <div>
                  <span className="text-sm mb-1 block">
                    Authenticator app
                    <span
                      className={classNames(
                        "border border-solid rounded-3xl px-2 py-[2px] text-xs ml-2",
                        user?.two_factor && user.app_secret
                          ? "text-[#3fb950] border-[#3fb950]"
                          : "text-red-500 border-red-500"
                      )}
                    >
                      {user?.two_factor && user.app_secret
                        ? "Configured"
                        : "Unconfigured"}
                    </span>
                  </span>
                  <p className="text-xs text-[#8d96a0]">
                    Use an authentication app or browser extension to get
                    two-factor authentication codes when prompted.
                  </p>
                </div>
              </div>
              <Button
                disabled={!user?.two_factor && !user?.app_secret}
                className="border border-[#30363d] bg-[#21262d] rounded-md px-[10px] py-1 text-sm"
                action={enable2FA}
              >
                Edit
              </Button>
            </div>
            <div className="p-4 flex items-center justify-between gap-x-2 border-t-[#30363d] border-t">
              <div className="flex items-center gap-x-2 ">
                <div className="min-w-6 min-h-6 max-w-6 max-h-6">
                  <ChatBubbleLeftRightIcon className="w-full" />
                </div>
                <div>
                  <span className="text-sm mb-1 block">
                    SMS/Text message
                    <span
                      className={classNames(
                        "border border-solid rounded-3xl px-2 py-[2px] text-xs ml-2 !text-[#d5a639] !border-[#d5a639]"
                      )}
                    >
                      Unavailable
                    </span>
                  </span>
                  <p className="text-xs text-[#8d96a0]">
                    Get one-time codes sent to your phone via SMS to complete
                    authentication requests.
                  </p>
                </div>
              </div>
              <Button
                disabled
                className="border border-[#30363d] bg-[#21262d] rounded-md px-[10px] py-1 text-sm"
              >
                Edit
              </Button>
            </div>
          </article>
        </div>
      </div>
      <div>
        <div>
          <h2 className="text-2xl mb-3 flex items-center gap-3">
            Devices
            <ComputerDesktopIcon width={25} />
          </h2>
          <hr className="h-[1px] border-0 bg-[#30363db3]" />
          <p className="text-sm my-3">Connected devices in your account</p>
          <article className="rounded-lg border border-solid border-[#30363d] overflow-hidden">
            <div className="bg-[#161b22] p-4">
              <span className="text-sm block font-inter-medium">
                All devices
              </span>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default Page;
